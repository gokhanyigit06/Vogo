import sharp from 'sharp'
import path from 'path'
import fs from 'fs/promises'

export interface ImageProcessOptions {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'jpeg' | 'png'
    fit?: 'cover' | 'contain' | 'fill'
}

export async function processImage(
    inputBuffer: Buffer,
    options: ImageProcessOptions = {}
): Promise<{ buffer: Buffer; metadata: sharp.Metadata }> {
    const {
        width,
        height,
        quality = 85,
        format = 'webp',
        fit = 'cover'
    } = options

    let pipeline = sharp(inputBuffer)

    // Resize if dimensions provided
    if (width || height) {
        pipeline = pipeline.resize(width, height, { fit })
    }

    // Convert to format and optimize
    if (format === 'webp') {
        pipeline = pipeline.webp({ quality, effort: 6 })
    } else if (format === 'jpeg') {
        pipeline = pipeline.jpeg({ quality, progressive: true })
    } else if (format === 'png') {
        pipeline = pipeline.png({ compressionLevel: 9 })
    }

    const buffer = await pipeline.toBuffer()
    const metadata = await sharp(buffer).metadata()

    return { buffer, metadata }
}

export async function generateThumbnail(
    inputBuffer: Buffer,
    size: number = 300
): Promise<Buffer> {
    return sharp(inputBuffer)
        .resize(size, size, { fit: 'cover' })
        .webp({ quality: 80 })
        .toBuffer()
}

export async function saveImage(
    buffer: Buffer,
    filename: string,
    directory: string = 'uploads/images'
): Promise<string> {
    const uploadDir = path.join(process.cwd(), 'public', directory)
    await fs.mkdir(uploadDir, { recursive: true })

    const filepath = path.join(uploadDir, filename)
    await fs.writeFile(filepath, buffer)

    return `/${directory}/${filename}`
}

export async function getImageDimensions(buffer: Buffer): Promise<{ width: number; height: number }> {
    const metadata = await sharp(buffer).metadata()
    return {
        width: metadata.width || 0,
        height: metadata.height || 0
    }
}

export function validateAspectRatio(
    width: number,
    height: number,
    targetRatio: number,
    tolerance: number = 0.1
): boolean {
    const actualRatio = width / height
    return Math.abs(actualRatio - targetRatio) <= tolerance
}
