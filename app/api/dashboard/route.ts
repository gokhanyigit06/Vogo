import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        // 1. Toplam gelir
        const incomeData = await prisma.income.findMany({
            select: { amount: true }
        })
        const totalIncome = incomeData.reduce((sum, item) => sum + Number(item.amount), 0)

        // 2. Toplam gider
        const expenseData = await prisma.expense.findMany({
            select: { amount: true }
        })
        const totalExpenses = expenseData.reduce((sum, item) => sum + Number(item.amount), 0)

        // 3. Aktif proje sayısı
        const activeProjects = await prisma.project.count({
            where: { status: 'in_progress' }
        })

        // 4. Toplam müşteri sayısı
        const totalClients = await prisma.client.count()

        // 5. Bu ayki gelir (son 30 gün)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const recentIncomeData = await prisma.income.findMany({
            where: {
                date: { gte: thirtyDaysAgo }
            },
            select: { amount: true }
        })
        const monthlyIncome = recentIncomeData.reduce((sum, item) => sum + Number(item.amount), 0)

        // 6. Yaklaşan deadline'lar (gelecek 7 gün)
        const today = new Date()
        const sevenDaysLater = new Date()
        sevenDaysLater.setDate(sevenDaysLater.getDate() + 7)

        const upcomingDeadlines = await prisma.project.findMany({
            where: {
                endDate: {
                    gte: today,
                    lte: sevenDaysLater
                }
            },
            select: {
                id: true,
                name: true,
                title: true,
                endDate: true,
                clientId: true
            },
            orderBy: { endDate: 'asc' },
            take: 5
        })

        // 7. Son gelir hareketleri
        const recentTransactions = await prisma.income.findMany({
            select: {
                id: true,
                amount: true,
                date: true,
                description: true,
                clientId: true
            },
            orderBy: { date: 'desc' },
            take: 5
        })

        return NextResponse.json({
            totalIncome,
            totalExpenses,
            profit: totalIncome - totalExpenses,
            activeProjects,
            totalClients,
            monthlyIncome,
            upcomingDeadlines: upcomingDeadlines.map(d => ({
                id: d.id,
                name: d.name || d.title,
                end_date: d.endDate,
                client_id: d.clientId
            })),
            recentTransactions: recentTransactions.map(t => ({
                id: t.id,
                amount: t.amount,
                date: t.date,
                description: t.description,
                client_id: t.clientId
            })),
        })
    } catch (error: unknown) {
        console.error('Dashboard stats error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
