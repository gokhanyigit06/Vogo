import { NextRequest, NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const resolvedParams = await params;
        // Join the path segments to get the file path
        const filePath = path.join(process.cwd(), 'uploads', ...resolvedParams.path);

        // Security check: Ensure the path is within the uploads directory
        const uploadsDir = path.join(process.cwd(), 'uploads');
        if (!filePath.startsWith(uploadsDir)) {
            return new NextResponse('Forbidden', { status: 403 });
        }

        if (!existsSync(filePath)) {
            // Return a placeholder SVG instead of 404 to prevent broken UI
            const placeholderSvg = `
                <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="#f1f5f9"/>
                    <rect x="0" y="0" width="100%" height="100%" fill="none" stroke="#e2e8f0" stroke-width="4"/>
                    <text x="50%" y="45%" font-family="system-ui, -apple-system, sans-serif" font-size="24" fill="#94a3b8" text-anchor="middle" font-weight="bold">Görsel Bulunamadı</text>
                    <text x="50%" y="55%" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#cbd5e1" text-anchor="middle">${path.basename(filePath)}</text>
                </svg>
            `.trim();

            return new NextResponse(placeholderSvg, {
                status: 200, // Return 200 so the browser accepts it as a valid image
                headers: {
                    'Content-Type': 'image/svg+xml',
                    'Cache-Control': 'no-store, must-revalidate' // Don't cache placeholder forever
                }
            });
        }

        const fileStat = await stat(filePath);
        if (!fileStat.isFile()) {
            return new NextResponse('Not a file', { status: 400 });
        }

        const fileBuffer = await readFile(filePath);

        // Determine content type
        const ext = path.extname(filePath).toLowerCase();
        let contentType = 'application/octet-stream';
        if (ext === '.jpg' || ext === '.jpeg' || ext === '.jfif') contentType = 'image/jpeg';
        else if (ext === '.png') contentType = 'image/png';
        else if (ext === '.webp') contentType = 'image/webp';
        else if (ext === '.svg') contentType = 'image/svg+xml';
        else if (ext === '.gif') contentType = 'image/gif';
        else if (ext === '.avif') contentType = 'image/avif'; // Added AVIF support

        const headers = new Headers();
        headers.set('Content-Type', contentType);
        headers.set('Content-Length', fileStat.size.toString());
        headers.set('Cache-Control', 'public, max-age=31536000, immutable');

        return new NextResponse(fileBuffer, { headers });
    } catch (error) {
        console.error('Error serving file:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
