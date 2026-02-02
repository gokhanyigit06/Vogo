import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET - Tek müşteri detayı ve işlem geçmişi
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const clientId = parseInt(id)

        // Müşteri bilgisi, projeler ve gelirlerle birlikte
        const client = await prisma.client.findUnique({
            where: { id: clientId },
            include: {
                projects: {
                    orderBy: { createdAt: 'desc' }
                },
                income: {
                    orderBy: { date: 'desc' }
                },
                transactions: {
                    orderBy: { transactionDate: 'desc' }
                }
            }
        })

        if (!client) {
            return NextResponse.json({ error: 'Müşteri bulunamadı' }, { status: 404 })
        }

        // Prepare response data
        let totalRevenue = Number(client.totalRevenue)
        let totalPaid = Number(client.totalPaid)
        let balance = Number(client.balance)

        // Self-healing: Bakiyeyi hesapla ve gerekirse güncelle
        if (client.income.length > 0) {
            type IncomeItem = typeof client.income[0]
            const calculatedRevenue = client.income.reduce(
                (sum: number, item: IncomeItem) => sum + Number(item.amount),
                0
            )
            const calculatedPaid = client.income
                .filter((i: IncomeItem) => i.status === 'paid' || i.isPaid === true)
                .reduce((sum: number, i: IncomeItem) => sum + Number(i.amount), 0)

            const calculatedBalance = calculatedRevenue - calculatedPaid

            // Toleranslı karşılaştırma
            const diffRev = Math.abs(totalRevenue - calculatedRevenue)
            const diffPaid = Math.abs(totalPaid - calculatedPaid)
            const diffBal = Math.abs(balance - calculatedBalance)

            if (diffRev > 0.1 || diffPaid > 0.1 || diffBal > 0.1) {
                console.log(`[Finance Self-Healing] Client ${id} balance mismatch. Fixing...`)

                // Veritabanını güncelle
                await prisma.client.update({
                    where: { id: clientId },
                    data: {
                        totalRevenue: calculatedRevenue,
                        totalPaid: calculatedPaid,
                        balance: calculatedBalance,
                        lastTransactionDate: new Date()
                    }
                })

                // Response için güncel değerleri set et
                totalRevenue = calculatedRevenue
                totalPaid = calculatedPaid
                balance = calculatedBalance
            }
        }

        return NextResponse.json({
            client: {
                id: client.id,
                name: client.name,
                company: client.company,
                email: client.email,
                phone: client.phone,
                address: client.address,
                website: client.website,
                status: client.status,
                tags: client.tags,
                notes: client.notes,
                totalRevenue,
                totalPaid,
                balance,
                lastTransactionDate: client.lastTransactionDate,
                createdAt: client.createdAt,
                updatedAt: client.updatedAt,
            },
            transactions: client.transactions,
            projects: client.projects,
            incomes: client.income
        })

    } catch (error: unknown) {
        console.error('Client Detail API Error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
