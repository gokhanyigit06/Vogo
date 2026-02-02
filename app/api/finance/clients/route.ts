import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET - Müşterileri ve cari bakiyelerini getir
export async function GET() {
    try {
        const clients = await prisma.client.findMany({
            orderBy: { name: 'asc' }
        })

        return NextResponse.json(clients)
    } catch (error: unknown) {
        console.error('Clients API Error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// PUT - Müşteri bilgilerini güncelle (Cari verisi dahil olabilir)
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, ...updates } = body

        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 })
        }

        const client = await prisma.client.update({
            where: { id: parseInt(id) },
            data: updates
        })

        return NextResponse.json(client)
    } catch (error: unknown) {
        console.error('Clients PUT error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
