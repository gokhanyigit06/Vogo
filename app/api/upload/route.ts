import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'Dosya gerekli' }, { status: 400 })
        }

        // Check if file is an image
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'Sadece görsel dosyaları yüklenebilir' }, { status: 400 })
        }

        // Get file extension
        const fileExt = file.name.split('.').pop() || 'jpg'
        const timestamp = Date.now()
        const randomStr = Math.random().toString(36).substring(7)
        const filename = `${timestamp}_${randomStr}.${fileExt}`

        // Upload directory (root level, not in public/)
        const uploadDir = path.join(process.cwd(), 'uploads', 'images')
        await mkdir(uploadDir, { recursive: true })

        // Save file
        const filePath = path.join(uploadDir, filename)
        const bytes = await file.arrayBuffer()
        await writeFile(filePath, Buffer.from(bytes))

        // Return URL
        const url = `/uploads/images/${filename}`

        return NextResponse.json({
            url,
            success: true,
            metadata: {
                originalSize: file.size,
                format: fileExt
            }
        })

    } catch (error: unknown) {
        console.error('Upload error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
