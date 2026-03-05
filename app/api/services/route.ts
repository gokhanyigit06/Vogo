import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore'

// GET - Tüm hizmetleri getir
export async function GET() {
    try {
        const q = query(collection(db, "services"), orderBy("createdAt", "asc"))
        const querySnapshot = await getDocs(q)

        const services = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))

        return NextResponse.json(services)
    } catch (error: unknown) {
        console.error('Services GET error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// POST - Yeni hizmet ekle
export async function POST(request: Request) {
    try {
        const body = await request.json()

        const slug = body.slug || body.title.toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ı/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')

        const docRef = await addDoc(collection(db, "services"), {
            title: body.title,
            slug,
            description: body.desc || body.description,
            icon: body.icon || 'Layers',
            status: body.status || 'Pasif',
            views: 0,
            projectsCount: 0,
            createdAt: new Date().toISOString()
        })

        return NextResponse.json({ id: docRef.id, ...body, slug })
    } catch (error: unknown) {
        console.error('Services POST error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// PUT - Hizmet güncelle
export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const { id, desc, ...updates } = body

        if (!id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
        }

        // Map 'desc' to 'description' for Firebase consistent mapping if needed
        if (desc !== undefined) {
            updates.description = desc
        }

        updates.updatedAt = new Date().toISOString()

        const serviceRef = doc(db, "services", id)
        await updateDoc(serviceRef, updates)

        return NextResponse.json({ id, ...updates })
    } catch (error: unknown) {
        console.error('Services PUT error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// DELETE - Hizmet sil
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
        }

        await deleteDoc(doc(db, "services", id))

        return NextResponse.json({ success: true })
    } catch (error: unknown) {
        console.error('Services DELETE error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
