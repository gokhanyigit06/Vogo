import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

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

        // Convert File to Buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        let finalBuffer = buffer
        let fileExt = (file.name.split('.').pop() || 'jpg').toLowerCase()
        if (fileExt === 'jfif') fileExt = 'jpg'

        let metadata = {
            originalSize: buffer.length,
            optimizedSize: buffer.length,
            format: fileExt,
            savings: '0%'
        }

        let filename = `${timestamp}_${randomStr}.${fileExt}`

        // Try Sharp processing (WebP conversion)
        try {
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
            console.warn('Sharp processing failed, falling back to original file.', sharpError)
        }

        // --- Firebase Storage Upload ---
        const storageRef = ref(storage, `images/${filename}`)

        // uploadBytes handles Uint8Array or Buffer in some environments, usually Uint8Array is safer in Edge/Node
        // finalBuffer is a Buffer (which is a Uint8Array)
        await uploadBytes(storageRef, finalBuffer, {
            contentType: `image/${fileExt}`
        })

        // Get public URL
        const downloadUrl = await getDownloadURL(storageRef)

        return NextResponse.json({
            url: downloadUrl,
            success: true,
            metadata
        })

    } catch (error: unknown) {
        console.error('Upload error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
