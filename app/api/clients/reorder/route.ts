import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const { items } = await request.json()

        if (!Array.isArray(items)) {
            return NextResponse.json({ error: 'Invalid data format' }, { status: 400 })
        }

        // Transaction ile güvenli toplu güncelleme
        await prisma.$transaction(
            items.map((item: any) =>
                prisma.client.update({
                    where: { id: parseInt(item.id) },
                    data: { order: parseInt(item.order) }
                })
            )
        )

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error reordering clients:', error)
        return NextResponse.json({ error: 'Failed to reorder clients' }, { status: 500 })
    }
}
