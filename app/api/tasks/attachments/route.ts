import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'

// GET - Task attachments getir
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('task_id')

    if (!taskId) return NextResponse.json([])

    try {
        const attachments = await prisma.taskAttachment.findMany({
            where: { taskId: parseInt(taskId) }
        })

        return NextResponse.json(attachments)
    } catch (error: unknown) {
        console.error('Attachments GET error:', error)
        return NextResponse.json([])
    }
}

// POST - Yeni attachment yükle
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
        const fileName = `${taskId}_${Math.random().toString(36).substring(7)}.${fileExt}`

        // Upload dizini oluştur
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'tasks')
        await mkdir(uploadDir, { recursive: true })

        // Dosyayı kaydet
        const filePath = path.join(uploadDir, fileName)
        const bytes = await file.arrayBuffer()
        await writeFile(filePath, Buffer.from(bytes))

        // URL oluştur
        const fileUrl = `/uploads/tasks/${fileName}`

        // DB'ye kaydet
        const attachment = await prisma.taskAttachment.create({
            data: {
                taskId: parseInt(taskId),
                name: file.name,
                url: fileUrl,
                type: fileExt,
                size: file.size
            }
        })

        return NextResponse.json(attachment)

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

        if (!id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
        }

        await prisma.taskAttachment.delete({
            where: { id: parseInt(id) }
        })

        return NextResponse.json({ success: true })
    } catch (error: unknown) {
        console.error('Attachment DELETE error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
