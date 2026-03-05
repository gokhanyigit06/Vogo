import { NextRequest, NextResponse } from 'next/server'
import { db, storage } from '@/lib/firebase'
import { collection, doc, getDocs, addDoc, deleteDoc, query, where } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

export const dynamic = 'force-dynamic'

// GET - Task attachments getir
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('task_id')

    if (!taskId) return NextResponse.json([])

    try {
        const q = query(collection(db, "taskAttachments"), where("taskId", "==", taskId))
        const snapshot = await getDocs(q)

        const attachments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

        return NextResponse.json(attachments)
    } catch (error: unknown) {
        console.error('Attachments GET error:', error)
        return NextResponse.json([])
    }
}

// POST - Yeni attachment yükle (Firebase Storage)
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File
        const taskId = formData.get('task_id') as string

        if (!file || !taskId) {
            return NextResponse.json({ error: 'File and Task ID required' }, { status: 400 })
        }

        // Dosya bilgilerini al
        const fileExt = file.name.split('.').pop() || 'bin'
        const timestamp = Date.now()
        const randomStr = Math.random().toString(36).substring(7)
        const fileName = `${taskId}/${timestamp}_${randomStr}_${file.name}`

        // Uint8Array'e dönüştür (Server side Node.js context)
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // --- Firebase Storage Upload ---
        const storageRef = ref(storage, `tasks/attachments/${fileName}`)

        await uploadBytes(storageRef, buffer, {
            contentType: file.type || 'application/octet-stream'
        })

        // Get public URL
        const downloadUrl = await getDownloadURL(storageRef)

        // Firestore'a kaydet
        const newAttachment = {
            taskId: taskId,
            name: file.name,
            url: downloadUrl,
            storagePath: `tasks/attachments/${fileName}`, // Silmek için yolu saklayalım
            type: fileExt,
            size: file.size,
            createdAt: new Date().toISOString()
        }

        const docRef = await addDoc(collection(db, "taskAttachments"), newAttachment)

        return NextResponse.json({ id: docRef.id, ...newAttachment })

    } catch (error: unknown) {
        console.error('Attachment save error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// DELETE - Attachment sil
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        const deleteFile = searchParams.get('deleteFile') === 'true'
        const storagePath = searchParams.get('storagePath') // İsteğe bağlı olarak folder yolu or url

        if (!id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
        }

        // Eğer storage üzerinden de silmek istiyorsak
        if (deleteFile && storagePath) {
            try {
                const fileRef = ref(storage, storagePath)
                await deleteObject(fileRef)
            } catch (e) {
                console.warn('File deletion failed in Storage, may not exist:', e)
            }
        }

        await deleteDoc(doc(db, "taskAttachments", id))

        return NextResponse.json({ success: true })
    } catch (error: unknown) {
        console.error('Attachment DELETE error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
