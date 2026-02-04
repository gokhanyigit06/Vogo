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

        // Dosya bilgilerini al
        const fileExt = file.name.split('.').pop() || 'bin'
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`

        // Upload dizini oluştur (Proje kökünde 'uploads/images' klasörü)
        // Public klasörü Next.js build sonrası read-only olabilir veya statik dosya olarak hemen görülmeyebilir.
        const uploadDir = path.join(process.cwd(), 'uploads', 'images')
        await mkdir(uploadDir, { recursive: true })

        // Dosyayı kaydet
        const filePath = path.join(uploadDir, fileName)
        const bytes = await file.arrayBuffer()
        await writeFile(filePath, Buffer.from(bytes))

        // URL oluştur - Dynamic Route: /uploads/[...path]
        // app/uploads/images/[dosya].jpg şeklinde erişilecek
        const fileUrl = `/uploads/images/${fileName}`

        return NextResponse.json({ url: fileUrl })

    } catch (error: unknown) {
        console.error('Upload error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
