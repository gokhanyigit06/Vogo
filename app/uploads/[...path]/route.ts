import { NextRequest, NextResponse } from "next/server"
import path from "path"
import fs from "fs"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    // Await params as per Next.js 15+ changes
    const resolvedParams = await params
    const filePath = resolvedParams.path.join("/")

    // Güvenlik: Sadece uploads klasöründen okumaya izin ver
    // Directory Traversal saldırılarını önlemek için basit kontrol
    if (filePath.includes("..")) {
        return new NextResponse("Invalid path", { status: 400 })
    }

    // Dosyanın tam yolu: Proje kök dizini / uploads / istenen yol
    // Örnek: c:\project\uploads\images\resim.jpg
    const fullPath = path.join(process.cwd(), "uploads", filePath)

    // Dosya var mı kontrol et
    if (!fs.existsSync(fullPath)) {
        return new NextResponse("File not found", { status: 404 })
    }

    try {
        // Dosyayı oku
        const fileBuffer = fs.readFileSync(fullPath)

        // Mime type belirle (basitçe uzantıdan)
        const ext = path.extname(fullPath).toLowerCase()
        let contentType = "application/octet-stream"

        if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg"
        else if (ext === ".png") contentType = "image/png"
        else if (ext === ".webp") contentType = "image/webp"
        else if (ext === ".svg") contentType = "image/svg+xml"

        // Response döndür
        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable"
            }
        })
    } catch (error) {
        console.error("File serve error:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
