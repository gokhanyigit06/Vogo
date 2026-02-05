import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const { items } = await request.json()

        if (!Array.isArray(items)) {
            return NextResponse.json({ error: 'Invalid data format' }, { status: 400 })
        }

        await prisma.$transaction(
            items.map((item: any) =>
                prisma.testimonial.update({
                    where: { id: parseInt(item.id) },
                    data: { order: parseInt(item.order) }
                })
            )
        )

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to reorder testimonials' }, { status: 500 })
    }
}
