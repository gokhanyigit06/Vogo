import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        // Tüm projeleri müşterileriyle birlikte getir
        const projects = await prisma.project.findMany({
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                        company: true,
                        phone: true,
                        email: true
                    }
                },
                income: {
                    select: { amount: true }
                }
            }
        })

        // Hesaplama yap
        const receivables = projects.map((project) => {
            const projectIncome = project.income.reduce(
                (sum, inc) => sum + Number(inc.amount),
                0
            )

            const budget = Number(project.budget || 0)
            const remaining = budget - projectIncome

            return {
                projectId: project.id,
                projectName: project.name || project.title,
                clientName: project.client?.name,
                companyName: project.client?.company,
                clientPhone: project.client?.phone,
                clientEmail: project.client?.email,
                budget: budget,
                paid: projectIncome,
                remaining: remaining
            }
        }).filter(item => item.remaining > 0) // Sadece alacak olanları filtrele

        // Toplam alacak sırasına göre diz
        receivables.sort((a, b) => b.remaining - a.remaining)

        return NextResponse.json(receivables)
    } catch (error: unknown) {
        console.error('Receivables API error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
