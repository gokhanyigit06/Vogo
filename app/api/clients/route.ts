import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore'

// GET - Tüm müşterileri getir
export async function GET() {
    try {
        const q = query(collection(db, "clients"), orderBy("createdAt", "desc"))
        const querySnapshot = await getDocs(q)

        const clients = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))

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

        const newClient = {
            name: body.name || null,
            company: body.company || null,
            email: body.email || null,
            phone: body.phone || null,
            address: body.address || null,
            website: body.website || null,
            status: body.status || 'active',
            tags: body.tags || [],
            notes: body.notes || null,
            totalRevenue: 0,
            totalPaid: 0,
            balance: 0,
            order: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        const docRef = await addDoc(collection(db, "clients"), newClient)

        return NextResponse.json({ id: docRef.id, ...newClient })
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

        if (!id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
        }

        // Boş stringleri null'a çevir
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === '') {
                updateData[key] = null
            }
        })

        updateData.updatedAt = new Date().toISOString()

        const clientRef = doc(db, "clients", id)
        await updateDoc(clientRef, updateData)

        return NextResponse.json({ id, ...updateData })
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

        await deleteDoc(doc(db, "clients", id))

        return NextResponse.json({ success: true })
    } catch (error: unknown) {
        console.error('Clients DELETE error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
