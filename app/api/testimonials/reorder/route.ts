import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, writeBatch } from 'firebase/firestore'

export async function POST(request: Request) {
    try {
        const { items } = await request.json()

        if (!Array.isArray(items)) {
            return NextResponse.json({ error: 'Invalid data format' }, { status: 400 })
        }

        const batch = writeBatch(db)

        items.forEach((item: any) => {
            if (item.id) {
                const docRef = doc(db, "testimonials", item.id)
                batch.update(docRef, { order: parseInt(item.order) })
            }
        })

        await batch.commit()

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to reorder testimonials' }, { status: 500 })
    }
}
