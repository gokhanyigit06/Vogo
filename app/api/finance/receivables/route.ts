import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    try {
        // 1. Projeleri ve Müşterileri getir
        const { data: projects, error: projectsError } = await supabase
            .from('projects')
            .select(`
                id,
                name,
                budget,
                status,
                clients (
                    id,
                    name,
                    company,
                    phone,
                    email
                )
            `)
            .neq('status', 'done') // Tamamlanmış projeleri hariç tutabiliriz, veya tutmayabiliriz. Şimdilik tutmayalım, borç bitene kadar takip edelim.
        // Aslında status farketmeksizin parası ödenmeyen her şeyi getirmeliyiz.

        if (projectsError) throw projectsError

        // 2. Gelirleri getir
        const { data: income, error: incomeError } = await supabase
            .from('income')
            .select('project_id, amount')

        if (incomeError) throw incomeError

        // 3. Hesaplama yap
        const receivables = projects.map((project: any) => {
            const projectIncome = income
                .filter((inc: any) => inc.project_id === project.id)
                .reduce((sum, inc: any) => sum + parseFloat(inc.amount), 0)

            const budget = parseFloat(project.budget || 0)
            const remaining = budget - projectIncome

            return {
                projectId: project.id,
                projectName: project.name,
                clientName: project.clients?.name,
                companyName: project.clients?.company,
                clientPhone: project.clients?.phone,
                clientEmail: project.clients?.email,
                budget: budget,
                paid: projectIncome,
                remaining: remaining
            }
        }).filter(item => item.remaining > 0) // Sadece alacak olanları filtrele

        // Toplam alacak sırasına göre diz
        receivables.sort((a, b) => b.remaining - a.remaining)

        return NextResponse.json(receivables)
    } catch (error: any) {
        console.error('Receivables API error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
