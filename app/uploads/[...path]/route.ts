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
            return new NextResponse('File not found', { status: 404 });
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
