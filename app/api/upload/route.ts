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

        const timestamp = Date.now()
        const randomStr = Math.random().toString(36).substring(7)

        // Upload directory (root level)
        const uploadDir = path.join(process.cwd(), 'uploads', 'images')
        await mkdir(uploadDir, { recursive: true })

        // Convert File to Buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        let finalBuffer = buffer
        let filename = file.name
        let fileExt = file.name.split('.').pop() || 'jpg'
        let metadata = {
            originalSize: buffer.length,
            optimizedSize: buffer.length,
            format: fileExt,
            savings: '0%'
        }

        // Try Sharp processing (WebP conversion)
        try {
            // Lazy import sharp to avoid hard crashes if missing
            const { processImage } = await import('@/lib/imageProcessor')

            const processed = await processImage(buffer, {
                width: 1600, // Max width
                quality: 85,
                format: 'webp'
            })

            finalBuffer = Buffer.from(processed.buffer)
            fileExt = 'webp'
            filename = `${timestamp}_${randomStr}.webp`

            metadata = {
                originalSize: buffer.length,
                optimizedSize: processed.buffer.length,
                format: 'webp',
                savings: ((1 - processed.buffer.length / buffer.length) * 100).toFixed(1) + '%'
            }

        } catch (sharpError) {
            console.warn('Sharp processing failed, falling back to original file:', sharpError)
            // Fallback: Use original filename and buffer
            filename = `${timestamp}_${randomStr}.${fileExt}`
        }

        // Save the file (optimized or original)
        const filePath = path.join(uploadDir, filename)
        await writeFile(filePath, finalBuffer)

        // Return URL
        const url = `/uploads/images/${filename}`

        return NextResponse.json({
            url,
            success: true,
            metadata
        })

    } catch (error: unknown) {
        console.error('Upload error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
