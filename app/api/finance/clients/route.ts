import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, doc, getDocs, updateDoc, query, orderBy } from 'firebase/firestore'

export const dynamic = 'force-dynamic'

// GET - Müşterileri ve cari bakiyelerini getir
export async function GET() {
    try {
        const q = query(collection(db, "clients"), orderBy("name", "asc"))
        const snapshot = await getDocs(q)

        const clients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

        return NextResponse.json(clients)
    } catch (error: unknown) {
        console.error('Clients API Error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// PUT - Müşteri bilgilerini güncelle
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, ...updates } = body

        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 })
        }

        const docRef = doc(db, "clients", id)
        await updateDoc(docRef, updates)

        return NextResponse.json({ id, ...updates })
    } catch (error: unknown) {
        console.error('Clients PUT error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
