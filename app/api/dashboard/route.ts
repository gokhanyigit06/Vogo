import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const now = new Date()
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        // 1. Toplam gelir (Hala tümünü çekiyoruz ama idealde bir 'stats' dokümanı olmalı)
        // Eğer koleksiyon çok büyükse bu maliyetli olur.
        const incomeSnapshot = await getDocs(collection(db, "income"))
        const incomeData = incomeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }))
        const totalIncome = incomeData.reduce((sum, item) => sum + Number(item.amount || 0), 0)

        // 2. Toplam gider
        const expenseSnapshot = await getDocs(collection(db, "expenses"))
        const totalExpenses = expenseSnapshot.docs.reduce((sum, doc) => sum + Number(doc.data().amount || 0), 0)

        // 3. Aktif proje sayısı
        const activeProjectsQ = query(collection(db, "projects"), where("status", "==", "in_progress"))
        const activeProjectsSnapshot = await getDocs(activeProjectsQ)
        const activeProjects = activeProjectsSnapshot.size

        // 4. Toplam müşteri sayısı
        const clientsSnapshot = await getDocs(collection(db, "clients"))
        const totalClients = clientsSnapshot.size

        // 5. Bu ayki gelir (Sunucuda filtreleme)
        const monthlyIncomeQ = query(
            collection(db, "income"),
            where("date", ">=", thirtyDaysAgo.toISOString())
        )
        const monthlyIncomeSnapshot = await getDocs(monthlyIncomeQ)
        const monthlyIncome = monthlyIncomeSnapshot.docs.reduce((sum, doc) => sum + Number(doc.data().amount || 0), 0)

        // 6. Yaklaşan deadline'lar (Gelecek 7 gün)
        const sevenDaysLater = new Date()
        sevenDaysLater.setDate(sevenDaysLater.getDate() + 7)

        const deadlineQ = query(
            collection(db, "projects"),
            where("endDate", ">=", now.toISOString()),
            where("endDate", "<=", sevenDaysLater.toISOString()),
            limit(5)
        )
        const deadlineSnapshot = await getDocs(deadlineQ)
        const upcomingDeadlines = deadlineSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as any
        }))

        // 7. Son gelir hareketleri (Query ile sıralı çekim)
        const recentTxQ = query(
            collection(db, "income"),
            orderBy("date", "desc"),
            limit(5)
        )
        const recentTxSnapshot = await getDocs(recentTxQ)
        const recentTransactions = recentTxSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as any
        }))

        return NextResponse.json({
            totalIncome,
            totalExpenses,
            profit: totalIncome - totalExpenses,
            activeProjects,
            totalClients,
            monthlyIncome,
            upcomingDeadlines: upcomingDeadlines.map(d => ({
                id: d.id,
                name: d.name || d.title || d.publicTitle || d.internalName,
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
