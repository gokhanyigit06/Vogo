import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore'

// GET - Tüm blog yazılarını getir
export async function GET() {
    try {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"))
        const querySnapshot = await getDocs(q)

        const posts = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))

        return NextResponse.json(posts)
    } catch (error: unknown) {
        console.error('Posts GET error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// POST - Yeni blog yazısı ekle
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

        const newPost = {
            title: body.title,
            slug,
            content: body.content || null,
            excerpt: body.excerpt || null,
            category: body.category || null,
            image: body.image || null,
            status: body.status || 'published',
            readTime: body.readTime || '5 dk',
            views: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        const docRef = await addDoc(collection(db, "posts"), newPost)

        return NextResponse.json({ id: docRef.id, ...newPost })
    } catch (error: unknown) {
        console.error('Posts POST error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// PUT - Blog yazısı güncelle
export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const { id, ...updates } = body

        if (!id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
        }

        updates.updatedAt = new Date().toISOString()

        const postRef = doc(db, "posts", id)
        await updateDoc(postRef, updates)

        return NextResponse.json({ id, ...updates })
    } catch (error: unknown) {
        console.error('Posts PUT error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// DELETE - Blog yazısı sil
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
        }

        await deleteDoc(doc(db, "posts", id))

        return NextResponse.json({ success: true })
    } catch (error: unknown) {
        console.error('Posts DELETE error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
