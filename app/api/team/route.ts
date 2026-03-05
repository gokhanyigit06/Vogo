import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore'

export const dynamic = 'force-dynamic'

// GET - Tüm kullanıcıları (admin/manager/member) getir
export async function GET() {
    try {
        const q = query(collection(db, "team"), orderBy("createdAt", "desc"))
        const snapshot = await getDocs(q)

        const formattedUsers = snapshot.docs.map(doc => {
            const user = doc.data()
            return {
                id: doc.id,
                name: user.name,
                email: user.email,
                role: user.role || 'USER',
                avatar_url: user.image || user.image_url,
                active: true
            }
        })

        return NextResponse.json(formattedUsers)
    } catch (error: unknown) {
        console.error('Team GET error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// POST - Yeni kullanıcı ekle
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, email, role, avatar_url } = body

        if (!email || !name) {
            return NextResponse.json({ error: 'İsim ve E-posta zorunludur' }, { status: 400 })
        }

        const emailQuery = query(collection(db, "team"), where("email", "==", email))
        const emailCheck = await getDocs(emailQuery)

        if (!emailCheck.empty) {
            return NextResponse.json({ error: 'Bu e-posta adresi zaten kullanımda' }, { status: 400 })
        }

        const newUser = {
            name,
            email,
            role: role || 'USER',
            image_url: avatar_url || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        const docRef = await addDoc(collection(db, "team"), newUser)

        return NextResponse.json({
            id: docRef.id,
            ...newUser
        })

    } catch (error: unknown) {
        console.error('Team POST error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// PUT - Kullanıcı güncelle
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, name, email, role, avatar_url } = body

        if (!id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
        }

        const updateData: any = {
            name,
            email,
            role,
            image_url: avatar_url || null,
            updatedAt: new Date().toISOString()
        }

        const docRef = doc(db, "team", id)
        await updateDoc(docRef, updateData)

        return NextResponse.json({ id, ...updateData, avatar_url: updateData.image_url })

    } catch (error: unknown) {
        console.error('Team PUT error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// DELETE - Kullanıcı sil
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
        }

        await deleteDoc(doc(db, "team", id))

        return NextResponse.json({ success: true })
    } catch (error: unknown) {
        console.error('Team DELETE error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
