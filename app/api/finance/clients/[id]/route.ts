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

        // İşlem geçmişi (transactions) - Eğer tablo varsa
        // Yoksa boş array dönüp hata vermesin
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
