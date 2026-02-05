import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET - Tüm mesajları getir
export async function GET() {
    try {
        const messages = await prisma.message.findMany({
            orderBy: { createdAt: 'desc' }
        })

        console.log(`✅ Fetched ${messages.length} messages`)
        return NextResponse.json(messages)

    } catch (error) {
        console.error('💥 API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST - Yeni mesaj ekle (Contact form)
export async function POST(request: Request) {
    try {
        const body = await request.json()

        const message = await prisma.message.create({
            data: {
                name: body.name,
                email: body.email,
                subject: body.subject,
                message: body.message,
            }
        })

        return NextResponse.json(message)

    } catch (error) {
        console.error('💥 API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// PATCH - Mesajı okundu olarak işaretle
export async function PATCH(request: Request) {
    try {
        const { id, is_read } = await request.json()

        const message = await prisma.message.update({
            where: { id: parseInt(id) },
            data: { isRead: is_read }
        })

        return NextResponse.json({ success: true, message })

    } catch (error) {
        console.error('💥 API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// DELETE - Mesaj sil
export async function DELETE(request: Request) {
    try {
        const { id } = await request.json()

        await prisma.message.delete({
            where: { id: parseInt(id) }
        })

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('💥 API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
