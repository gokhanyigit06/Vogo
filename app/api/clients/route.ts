import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Tüm müşterileri getir
export async function GET() {
    try {
        const clients = await prisma.client.findMany({
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(clients)
    } catch (error: unknown) {
        console.error('Clients GET error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// POST - Yeni müşteri ekle
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const client = await prisma.client.create({
            data: {
                name: body.name,
                company: body.company,
                email: body.email,
                phone: body.phone,
                address: body.address,
                website: body.website,
                status: body.status || 'active',
                tags: body.tags || [],
                notes: body.notes,
            }
        })

        return NextResponse.json(client)
    } catch (error: unknown) {
        console.error('Clients POST error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// PUT - Müşteri güncelle
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, ...updateData } = body

        // Boş stringleri null'a çevir
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === '') {
                updateData[key] = null
            }
        })

        const client = await prisma.client.update({
            where: { id: parseInt(id) },
            data: updateData
        })

        return NextResponse.json(client)
    } catch (error: unknown) {
        console.error('Clients PUT error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// DELETE - Müşteri sil
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
        }

        await prisma.client.delete({
            where: { id: parseInt(id) }
        })

        return NextResponse.json({ success: true })
    } catch (error: unknown) {
        console.error('Clients DELETE error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
