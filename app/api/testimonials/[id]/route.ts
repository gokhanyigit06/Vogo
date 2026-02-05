import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id)
        const body = await request.json()

        const testimonial = await prisma.testimonial.update({
            where: { id },
            data: {
                author: body.author,
                role: body.role,
                company: body.company,
                content: body.content,
                avatarUrl: body.avatarUrl,
                rating: body.rating,
                isActive: body.isActive
            }
        })

        return NextResponse.json(testimonial)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id)
        await prisma.testimonial.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 })
    }
}
