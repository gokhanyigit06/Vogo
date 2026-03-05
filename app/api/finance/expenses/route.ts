import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore'

// GET - Tüm giderleri getir
export async function GET() {
    try {
        const q = query(collection(db, "expenses"), orderBy("date", "desc"))
        const querySnapshot = await getDocs(q)

        const expenses = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))

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

        const newExpense = {
            amount: parseFloat(body.amount),
            date: new Date(body.date).toISOString(),
            category: body.category || 'other',
            description: body.description || null,
            invoiceNumber: body.invoice_number || body.invoiceNumber || null,
            vendor: body.vendor || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        const docRef = await addDoc(collection(db, "expenses"), newExpense)

        return NextResponse.json({ id: docRef.id, ...newExpense })
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

        if (!id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
        }

        const updateData: any = {
            ...rest,
            updatedAt: new Date().toISOString()
        }

        if (rest.amount) updateData.amount = parseFloat(rest.amount)
        if (rest.date) updateData.date = new Date(rest.date).toISOString()
        if (invoice_number !== undefined) updateData.invoiceNumber = invoice_number

        const expenseRef = doc(db, "expenses", id)
        await updateDoc(expenseRef, updateData)

        return NextResponse.json({ id, ...updateData })
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

        await deleteDoc(doc(db, "expenses", id))

        return NextResponse.json({ success: true })
    } catch (error: unknown) {
        console.error('Expenses DELETE error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
