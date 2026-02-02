import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET - Borçları getir
export async function GET() {
    try {
        const payables = await prisma.payable.findMany({
            orderBy: { dueDate: 'asc' }
        })

        return NextResponse.json(payables)
    } catch (error: unknown) {
        console.error('Payables API Error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// POST - Yeni borç ekle
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const payable = await prisma.payable.create({
            data: {
                vendorName: body.vendor_name || body.vendorName,
                amount: parseFloat(body.amount),
                dueDate: body.due_date ? new Date(body.due_date) : null,
                status: body.status || 'pending',
                category: body.category,
                description: body.description,
                paidDate: body.paid_date ? new Date(body.paid_date) : null,
            }
        })

        return NextResponse.json(payable)
    } catch (error: unknown) {
        console.error('Payables POST error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// PUT - Borç güncelle
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, vendor_name, due_date, paid_date, ...rest } = body

        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 })
        }

        const payable = await prisma.payable.update({
            where: { id: parseInt(id) },
            data: {
                ...rest,
                vendorName: vendor_name,
                amount: rest.amount ? parseFloat(rest.amount) : undefined,
                dueDate: due_date ? new Date(due_date) : undefined,
                paidDate: paid_date ? new Date(paid_date) : undefined,
            }
        })

        return NextResponse.json(payable)
    } catch (error: unknown) {
        console.error('Payables PUT error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// DELETE - Borç sil
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 })
        }

        await prisma.payable.delete({
            where: { id: parseInt(id) }
        })

        return NextResponse.json({ success: true })
    } catch (error: unknown) {
        console.error('Payables DELETE error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
