import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

async function createClient() {
    const cookieStore = await cookies()
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll() },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch { }
                },
            },
        }
    )
}

// GET - Tek müşteri detayı ve işlem geçmişi
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const supabase = await createClient()

        // Müşteri bilgisi
        const { data: client, error: clientError } = await supabase
            .from('clients')
            .select('*')
            .eq('id', id)
            .single()

        if (clientError) throw clientError

        // İşlem geçmişi (transactions)
        let transactions = []
        try {
            const { data: trx, error: trxError } = await supabase
                .from('client_transactions')
                .select('*')
                .eq('client_id', id)
                .order('transaction_date', { ascending: false })

            if (!trxError) transactions = trx
        } catch (e) {
            console.log('Transactions table likely missing or empty')
        }

        // Projeler
        const { data: projects } = await supabase
            .from('projects')
            .select('*')
            .eq('client_id', id)
            .order('created_at', { ascending: false })

        // Gelirler (Faturalar/Ödemeler)
        const { data: incomes } = await supabase
            .from('income')
            .select('*')
            .eq('client_id', id)
            .order('date', { ascending: false })

        // ------------------------------------------------------------------
        // SELF-HEALING: Eğer veritabanındaki bakiye (trigger sorunu yüzünden) hatalıysa,
        // anlık olarak hesapla ve düzelt.
        // ------------------------------------------------------------------
        if (incomes && incomes.length > 0) {
            const calculatedRevenue = incomes.reduce((sum, item) => sum + parseFloat(item.amount), 0)
            const calculatedPaid = incomes
                .filter((i: any) => i.status === 'paid' || i.is_paid === true)
                .reduce((sum, i) => sum + parseFloat(i.amount), 0)

            const calculatedBalance = calculatedRevenue - calculatedPaid

            // Toleranslı karşılaştırma (Float hassasiyeti)
            const diffRev = Math.abs((client.total_revenue || 0) - calculatedRevenue)
            const diffPaid = Math.abs((client.total_paid || 0) - calculatedPaid)
            const diffBal = Math.abs((client.balance || 0) - calculatedBalance)

            if (diffRev > 0.1 || diffPaid > 0.1 || diffBal > 0.1) {
                console.log(`[Finance Self-Healing] Client ${id} balance mismatch detected. Fixing...`)
                console.log(`DB Balance: ${client.balance}, Calculated: ${calculatedBalance}`)

                // Veritabanını güncelle (Arka planda)
                await supabase.from('clients').update({
                    total_revenue: calculatedRevenue,
                    total_paid: calculatedPaid,
                    balance: calculatedBalance,
                    last_transaction_date: new Date().toISOString()
                }).eq('id', id)

                // API yanıtını güncelle (UI anında doğru görsün)
                client.total_revenue = calculatedRevenue
                client.total_paid = calculatedPaid
                client.balance = calculatedBalance
            }
        }
        // ------------------------------------------------------------------

        return NextResponse.json({
            client,
            transactions,
            projects: projects || [],
            incomes: incomes || []
        })

    } catch (error: any) {
        console.error('Client Detail API Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
