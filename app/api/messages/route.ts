import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore'

export const dynamic = 'force-dynamic'

// GET - Tüm mesajları getir
export async function GET() {
    try {
        const q = query(collection(db, "messages"), orderBy("createdAt", "desc"))
        const snapshot = await getDocs(q)

        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))

        console.log(`✅ Fetched ${messages.length} messages`)
        return NextResponse.json(messages)

    } catch (error) {
        console.error('💥 API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST - Yeni mesaj ekle (Contact form)
export async function POST(request: Request) {
    try {
        const body = await request.json()

        const newMessage = {
            name: body.name || null,
            email: body.email || null,
            subject: body.subject || null,
            message: body.message || null,
            isRead: false,
            createdAt: new Date().toISOString()
        }

        const docRef = await addDoc(collection(db, "messages"), newMessage)

        return NextResponse.json({ id: docRef.id, ...newMessage })

    } catch (error) {
        console.error('💥 API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// PATCH - Mesajı okundu olarak işaretle
export async function PATCH(request: Request) {
    try {
        const { id, is_read } = await request.json()

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 })
        }

        const msgRef = doc(db, "messages", id)
        await updateDoc(msgRef, {
            isRead: is_read,
            updatedAt: new Date().toISOString()
        })

        return NextResponse.json({ success: true, id, isRead: is_read })

    } catch (error) {
        console.error('💥 API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// DELETE - Mesaj sil
export async function DELETE(request: Request) {
    try {
        const { id } = await request.json()

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 })
        }

        await deleteDoc(doc(db, "messages", id))

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('💥 API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
