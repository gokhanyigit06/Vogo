import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        const testimonials = await prisma.testimonial.findMany({
            orderBy: { order: 'asc' }
        })
        return NextResponse.json(testimonials)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Validation basitleştirildi
        if (!body.author || !body.content) {
            return NextResponse.json({ error: 'Author and content required' }, { status: 400 })
        }

        const testimonial = await prisma.testimonial.create({
            data: {
                author: body.author,
                role: body.role,
                company: body.company,
                content: body.content,
                avatarUrl: body.avatarUrl,
                rating: body.rating || 5,
                isActive: body.isActive ?? true,
                order: body.order || 0
            }
        })

        return NextResponse.json(testimonial)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 })
    }
}
