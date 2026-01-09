import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
    try {
        // 1. Toplam gelir
        const { data: incomeData, error: incomeError } = await supabase
            .from('income')
            .select('amount')

        const totalIncome = incomeData?.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0) || 0

        // 2. Toplam gider
        const { data: expenseData, error: expenseError } = await supabase
            .from('expenses')
            .select('amount')

        const totalExpenses = expenseData?.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0) || 0

        // 3. Aktif proje sayısı
        const { count: activeProjects } = await supabase
            .from('projects')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'in_progress')

        // 4. Toplam müşteri sayısı
        const { count: totalClients } = await supabase
            .from('clients')
            .select('*', { count: 'exact', head: true })

        // 5. Bu ayki gelir (son 30 gün)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const { data: recentIncome } = await supabase
            .from('income')
            .select('amount')
            .gte('date', thirtyDaysAgo.toISOString().split('T')[0])

        const monthlyIncome = recentIncome?.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0) || 0

        // 6. Yaklaşan deadline'lar (gelecek 7 gün)
        const today = new Date().toISOString().split('T')[0]
        const sevenDaysLater = new Date()
        sevenDaysLater.setDate(sevenDaysLater.getDate() + 7)

        const { data: upcomingDeadlines } = await supabase
            .from('projects')
            .select('id, name, end_date, client_id')
            .gte('end_date', today)
            .lte('end_date', sevenDaysLater.toISOString().split('T')[0])
            .order('end_date', { ascending: true })
            .limit(5)

        // 7. Son gelir/gider hareketleri
        const { data: recentTransactions } = await supabase
            .from('income')
            .select('id, amount, date, description, client_id')
            .order('date', { ascending: false })
            .limit(5)

        return NextResponse.json({
            totalIncome,
            totalExpenses,
            profit: totalIncome - totalExpenses,
            activeProjects: activeProjects || 0,
            totalClients: totalClients || 0,
            monthlyIncome,
            upcomingDeadlines: upcomingDeadlines || [],
            recentTransactions: recentTransactions || [],
        })
    } catch (error: any) {
        console.error('Dashboard stats error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
