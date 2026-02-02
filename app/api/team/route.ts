import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET - Tüm takım üyelerini getir
export async function GET() {
    try {
        const members = await prisma.teamMember.findMany({
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(members)
    } catch (error: unknown) {
        console.error('Team GET error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// POST - Yeni üye ekle
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const member = await prisma.teamMember.create({
            data: {
                name: body.name,
                email: body.email,
                role: body.role || 'member',
                avatarUrl: body.avatar_url || body.avatarUrl,
            }
        })

        return NextResponse.json(member)
    } catch (error: unknown) {
        console.error('Team POST error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// PUT - Üye güncelle
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, avatar_url, ...rest } = body

        if (!id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
        }

        const member = await prisma.teamMember.update({
            where: { id: parseInt(id) },
            data: {
                ...rest,
                avatarUrl: avatar_url,
            }
        })

        return NextResponse.json(member)
    } catch (error: unknown) {
        console.error('Team PUT error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// DELETE - Üye sil
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
        }

        await prisma.teamMember.delete({
            where: { id: parseInt(id) }
        })

        return NextResponse.json({ success: true })
    } catch (error: unknown) {
        console.error('Team DELETE error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
