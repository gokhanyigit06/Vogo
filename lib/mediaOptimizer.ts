/**
 * Client-side media optimizer
 * - Images: Canvas API ile WebP'ye dönüştürür, resize + compress eder
 * - Videos: Boyut kontrolü + kullanıcıya bilgi verir
 *
 * Server-side Sharp zaten çalışıyor ama bu client-side pre-processing
 * büyük dosyaların upload süresini ciddi oranda kısaltır.
 */

export interface OptimizeResult {
    file: File
    originalSize: number
    optimizedSize: number
    savings: number      // percentage 0-100
    width?: number
    height?: number
    wasOptimized: boolean
}

export interface ImageOptimizeOptions {
    maxWidth?: number     // default: 1920
    maxHeight?: number    // default: 1080
    quality?: number      // 0-1, default: 0.85
    format?: "webp" | "jpeg"
}

/**
 * Compress + resize an image file in the browser using Canvas API.
 * Falls back to original if anything fails.
 */
export async function optimizeImage(
    file: File,
    options: ImageOptimizeOptions = {}
): Promise<OptimizeResult> {
    const {
        maxWidth = 1920,
        maxHeight = 1920,
        quality = 0.85,
        format = "webp",
    } = options

    const originalSize = file.size

    try {
        // Validate it's an image
        if (!file.type.startsWith("image/")) {
            return { file, originalSize, optimizedSize: originalSize, savings: 0, wasOptimized: false }
        }

        // Skip SVG (they're already small & lossless)
        if (file.type === "image/svg+xml") {
            return { file, originalSize, optimizedSize: originalSize, savings: 0, wasOptimized: false }
        }

        const bitmap = await createImageBitmap(file)
        const { naturalWidth, naturalHeight } = scaleDown(bitmap.width, bitmap.height, maxWidth, maxHeight)

        const canvas = document.createElement("canvas")
        canvas.width = naturalWidth
        canvas.height = naturalHeight

        const ctx = canvas.getContext("2d")!
        ctx.drawImage(bitmap, 0, 0, naturalWidth, naturalHeight)
        bitmap.close()

        const mimeType = format === "webp" ? "image/webp" : "image/jpeg"

        const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(
                (b) => b ? resolve(b) : reject(new Error("Canvas toBlob failed")),
                mimeType,
                quality
            )
        })

        const ext = format === "webp" ? "webp" : "jpg"
        const basename = file.name.replace(/\.[^.]+$/, "")
        const optimizedFile = new File([blob], `${basename}.${ext}`, { type: mimeType })

        const savings = originalSize > 0
            ? Math.round((1 - optimizedFile.size / originalSize) * 100)
            : 0

        return {
            file: optimizedFile,
            originalSize,
            optimizedSize: optimizedFile.size,
            savings: Math.max(0, savings),
            width: naturalWidth,
            height: naturalHeight,
            wasOptimized: true,
        }
    } catch (err) {
        console.warn("[optimizer] Image optimization failed, using original:", err)
        return { file, originalSize, optimizedSize: originalSize, savings: 0, wasOptimized: false }
    }
}

/**
 * Check video size & return info. We don't transcode in browser (too slow),
 * but we can warn and suggest compression.
 */
export function analyzeVideo(file: File): {
    size: number
    sizeMB: number
    isLarge: boolean      // > 50MB
    isVeryLarge: boolean  // > 150MB
    warning: string | null
} {
    const sizeMB = file.size / (1024 * 1024)
    const isLarge = sizeMB > 50
    const isVeryLarge = sizeMB > 150

    let warning: string | null = null
    if (isVeryLarge) {
        warning = `Video ${sizeMB.toFixed(0)}MB — yükleme yavaş olabilir. Mümkünse 50MB altında bir dosya kullanın.`
    } else if (isLarge) {
        warning = `Video ${sizeMB.toFixed(0)}MB — yükleme biraz sürebilir.`
    }

    return { size: file.size, sizeMB, isLarge, isVeryLarge, warning }
}

/** Format bytes to human readable string */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

/* ── helpers ── */

function scaleDown(w: number, h: number, maxW: number, maxH: number): { naturalWidth: number; naturalHeight: number } {
    if (w <= maxW && h <= maxH) return { naturalWidth: w, naturalHeight: h }
    const ratio = Math.min(maxW / w, maxH / h)
    return { naturalWidth: Math.round(w * ratio), naturalHeight: Math.round(h * ratio) }
}
