import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore'

export const dynamic = 'force-dynamic'

// GET - Borçları getir
export async function GET() {
    try {
        const q = query(collection(db, "payables"), orderBy("dueDate", "asc"))
        const querySnapshot = await getDocs(q)

        const payables = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))

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

        const newPayable = {
            vendorName: body.vendor_name || body.vendorName || null,
            amount: parseFloat(body.amount),
            dueDate: body.due_date ? new Date(body.due_date).toISOString() : null,
            status: body.status || 'pending',
            category: body.category || null,
            description: body.description || null,
            paidDate: body.paid_date ? new Date(body.paid_date).toISOString() : null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        const docRef = await addDoc(collection(db, "payables"), newPayable)
        return NextResponse.json({ id: docRef.id, ...newPayable })
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

        const updateData: any = { ...rest, updatedAt: new Date().toISOString() }

        if (vendor_name !== undefined) updateData.vendorName = vendor_name
        if (rest.amount) updateData.amount = parseFloat(rest.amount)
        if (due_date !== undefined) updateData.dueDate = due_date ? new Date(due_date).toISOString() : null
        if (paid_date !== undefined) updateData.paidDate = paid_date ? new Date(paid_date).toISOString() : null

        const payableRef = doc(db, "payables", id)
        await updateDoc(payableRef, updateData)

        return NextResponse.json({ id, ...updateData })
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

        await deleteDoc(doc(db, "payables", id))

        return NextResponse.json({ success: true })
    } catch (error: unknown) {
        console.error('Payables DELETE error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
