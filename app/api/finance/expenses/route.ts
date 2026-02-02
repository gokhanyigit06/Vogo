import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Tüm giderleri getir
export async function GET() {
    try {
        const expenses = await prisma.expense.findMany({
            orderBy: { date: 'desc' }
        })

        return NextResponse.json(expenses)
    } catch (error: unknown) {
        console.error('Expenses GET error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// POST - Yeni gider ekle
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const expense = await prisma.expense.create({
            data: {
                amount: parseFloat(body.amount),
                date: new Date(body.date),
                category: body.category,
                description: body.description,
                invoiceNumber: body.invoice_number || body.invoiceNumber,
                vendor: body.vendor,
            }
        })

        return NextResponse.json(expense)
    } catch (error: unknown) {
        console.error('Expenses POST error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// PUT - Gider güncelle
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, invoice_number, ...rest } = body

        const expense = await prisma.expense.update({
            where: { id: parseInt(id) },
            data: {
                ...rest,
                amount: rest.amount ? parseFloat(rest.amount) : undefined,
                date: rest.date ? new Date(rest.date) : undefined,
                invoiceNumber: invoice_number,
            }
        })

        return NextResponse.json(expense)
    } catch (error: unknown) {
        console.error('Expenses PUT error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// DELETE - Gider sil
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
        }

        await prisma.expense.delete({
            where: { id: parseInt(id) }
        })

        return NextResponse.json({ success: true })
    } catch (error: unknown) {
        console.error('Expenses DELETE error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
