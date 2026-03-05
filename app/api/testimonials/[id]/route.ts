import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, updateDoc, deleteDoc } from 'firebase/firestore'

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()

        const updateData: any = { updatedAt: new Date().toISOString() }

        if (body.author !== undefined) updateData.author = body.author
        if (body.role !== undefined) updateData.role = body.role
        if (body.company !== undefined) updateData.company = body.company
        if (body.content !== undefined) updateData.content = body.content
        if (body.avatarUrl !== undefined) updateData.avatarUrl = body.avatarUrl
        if (body.rating !== undefined) updateData.rating = body.rating
        if (body.isActive !== undefined) updateData.isActive = body.isActive

        const docRef = doc(db, "testimonials", id)
        await updateDoc(docRef, updateData)

        return NextResponse.json({ id, ...updateData })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        await deleteDoc(doc(db, "testimonials", id))
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 })
    }
}
