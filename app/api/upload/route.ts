import { NextRequest, NextResponse } from 'next/server'
import { processImage, saveImage, getImageDimensions } from '@/lib/imageProcessor'

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

        // Convert File to Buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Get original dimensions
        const originalDimensions = await getImageDimensions(buffer)

        // Process image - auto convert to WebP and optimize
        const { buffer: processedBuffer, metadata } = await processImage(buffer, {
            width: 1600,  // Max width for high quality
            quality: 85,
            format: 'webp'
        })

        // Generate unique filename with .webp extension
        const timestamp = Date.now()
        const randomStr = Math.random().toString(36).substring(7)
        const filename = `${timestamp}_${randomStr}.webp`

        // Save processed image
        const url = await saveImage(processedBuffer, filename)

        return NextResponse.json({
            success: true,
            url,
            metadata: {
                originalWidth: originalDimensions.width,
                originalHeight: originalDimensions.height,
                width: metadata.width,
                height: metadata.height,
                format: metadata.format,
                originalSize: buffer.length,
                optimizedSize: processedBuffer.length,
                savings: ((1 - processedBuffer.length / buffer.length) * 100).toFixed(1) + '%'
            }
        })

    } catch (error: unknown) {
        console.error('Upload error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
