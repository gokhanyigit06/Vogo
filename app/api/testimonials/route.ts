import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore'

export async function GET() {
    try {
        const q = query(collection(db, "testimonials"), orderBy("order", "asc"))
        const snapshot = await getDocs(q)

        const testimonials = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))

        return NextResponse.json(testimonials)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()

        if (!body.author || !body.content) {
            return NextResponse.json({ error: 'Author and content required' }, { status: 400 })
        }

        const newTestimonial = {
            author: body.author,
            role: body.role || null,
            company: body.company || null,
            content: body.content,
            avatarUrl: body.avatarUrl || null,
            rating: body.rating || 5,
            isActive: body.isActive ?? true,
            order: body.order || 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        const docRef = await addDoc(collection(db, "testimonials"), newTestimonial)

        return NextResponse.json({ id: docRef.id, ...newTestimonial })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 })
    }
}
