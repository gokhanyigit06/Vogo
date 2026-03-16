import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File
        const folder = (formData.get('folder') as string) || 'uploads'

        if (!file) {
            return NextResponse.json({ error: 'Dosya gerekli' }, { status: 400 })
        }

        const isImage = file.type.startsWith('image/')
        const isVideo = file.type.startsWith('video/')

        if (!isImage && !isVideo) {
            return NextResponse.json({ error: 'Sadece görsel veya video dosyaları yüklenebilir' }, { status: 400 })
        }

        // 200MB video limit
        const maxSize = isVideo ? 200 * 1024 * 1024 : 10 * 1024 * 1024
        if (file.size > maxSize) {
            return NextResponse.json({ error: `Dosya boyutu çok büyük (max ${isVideo ? '200MB' : '10MB'})` }, { status: 400 })
        }

        const timestamp = Date.now()
        const randomStr = Math.random().toString(36).substring(7)
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // --- Video upload: no processing, direct upload ---
        if (isVideo) {
            const fileExt = (file.name.split('.').pop() || 'mp4').toLowerCase()
            const filename = `${timestamp}_${randomStr}.${fileExt}`
            const storageRef = ref(storage, `${folder}/${filename}`)

            await uploadBytes(storageRef, buffer, {
                contentType: file.type
            })

            const downloadUrl = await getDownloadURL(storageRef)

            return NextResponse.json({
                url: downloadUrl,
                success: true,
                type: 'video',
                metadata: {
                    originalSize: buffer.length,
                    format: fileExt,
                }
            })
        }

        // --- Image upload with optional Sharp processing ---
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

        try {
            const { processImage } = await import('@/lib/imageProcessor')

            const processed = await processImage(buffer, {
                width: 1600,
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

        const storageRef = ref(storage, `${folder}/${filename}`)

        await uploadBytes(storageRef, finalBuffer, {
            contentType: `image/${fileExt}`
        })

        const downloadUrl = await getDownloadURL(storageRef)

        return NextResponse.json({
            url: downloadUrl,
            success: true,
            type: 'image',
            metadata
        })

    } catch (error: unknown) {
        console.error('Upload error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
