import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params

        // Müşteri bilgilerini projeler ve gelirlerle birlikte çek
        const client = await prisma.client.findUnique({
            where: { id: parseInt(id) },
            include: {
                projects: {
                    orderBy: { createdAt: 'desc' }
                },
                income: {
                    orderBy: { date: 'desc' }
                }
            }
        })

        if (!client) {
            return NextResponse.json({ error: 'Müşteri bulunamadı' }, { status: 404 })
        }

        return NextResponse.json(client)

    } catch (error: unknown) {
        console.error('Client Detail Error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
