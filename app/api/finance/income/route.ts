import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Tüm gelirleri getir
export async function GET() {
    try {
        const income = await prisma.income.findMany({
            include: {
                client: {
                    select: { id: true, name: true, company: true }
                },
                project: {
                    select: { id: true, title: true, name: true }
                }
            },
            orderBy: { date: 'desc' }
        })

        return NextResponse.json(income)
    } catch (error: unknown) {
        console.error('Income GET error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// POST - Yeni gelir ekle
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const income = await prisma.income.create({
            data: {
                amount: parseFloat(body.amount),
                date: new Date(body.date),
                category: body.category || 'payment',
                paymentMethod: body.payment_method || body.paymentMethod,
                invoiceNumber: body.invoice_number || body.invoiceNumber,
                description: body.description,
                status: body.status || 'paid',
                isPaid: body.is_paid !== false,
                clientId: body.client_id ? parseInt(body.client_id) : null,
                projectId: body.project_id ? parseInt(body.project_id) : null,
            }
        })

        // Müşteri bakiyesini güncelle
        if (body.client_id) {
            await updateClientBalance(parseInt(body.client_id))
        }

        return NextResponse.json(income)
    } catch (error: unknown) {
        console.error('Income POST error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// PUT - Gelir güncelle
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, client_id, project_id, payment_method, invoice_number, is_paid, ...rest } = body

        const income = await prisma.income.update({
            where: { id: parseInt(id) },
            data: {
                ...rest,
                amount: rest.amount ? parseFloat(rest.amount) : undefined,
                date: rest.date ? new Date(rest.date) : undefined,
                paymentMethod: payment_method,
                invoiceNumber: invoice_number,
                isPaid: is_paid,
                clientId: client_id ? parseInt(client_id) : undefined,
                projectId: project_id ? parseInt(project_id) : undefined,
            }
        })

        // Müşteri bakiyesini güncelle
        if (client_id) {
            await updateClientBalance(parseInt(client_id))
        }

        return NextResponse.json(income)
    } catch (error: unknown) {
        console.error('Income PUT error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// DELETE - Gelir sil
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
        }

        // Önce geliri al (client_id için)
        const income = await prisma.income.findUnique({
            where: { id: parseInt(id) }
        })

        await prisma.income.delete({
            where: { id: parseInt(id) }
        })

        // Müşteri bakiyesini güncelle
        if (income?.clientId) {
            await updateClientBalance(income.clientId)
        }

        return NextResponse.json({ success: true })
    } catch (error: unknown) {
        console.error('Income DELETE error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// Helper: Müşteri bakiyesini güncelle
async function updateClientBalance(clientId: number) {
    const incomes = await prisma.income.findMany({
        where: { clientId }
    })

    const totalRevenue = incomes.reduce((sum, i) => sum + Number(i.amount), 0)
    const totalPaid = incomes
        .filter(i => i.status === 'paid' || i.isPaid)
        .reduce((sum, i) => sum + Number(i.amount), 0)

    await prisma.client.update({
        where: { id: clientId },
        data: {
            totalRevenue,
            totalPaid,
            balance: totalRevenue - totalPaid,
            lastTransactionDate: new Date()
        }
    })
}
