import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Tüm blog yazılarını getir
export async function GET() {
    try {
        const posts = await prisma.post.findMany({
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(posts)
    } catch (error: unknown) {
        console.error('Posts GET error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// POST - Yeni blog yazısı ekle
export async function POST(request: Request) {
    try {
        const body = await request.json()

        const slug = body.slug || body.title.toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ı/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')

        const post = await prisma.post.create({
            data: {
                title: body.title,
                slug,
                content: body.content,
                excerpt: body.excerpt,
                category: body.category,
                image: body.image,
                status: body.status || 'published',
                readTime: body.readTime || '5 dk'
            }
        })

        return NextResponse.json(post)
    } catch (error: unknown) {
        console.error('Posts POST error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// PUT - Blog yazısı güncelle
export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const { id, ...updates } = body

        if (!id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
        }

        const post = await prisma.post.update({
            where: { id: parseInt(id) },
            data: updates
        })

        return NextResponse.json(post)
    } catch (error: unknown) {
        console.error('Posts PUT error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// DELETE - Blog yazısı sil
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
        }

        await prisma.post.delete({
            where: { id: parseInt(id) }
        })

        return NextResponse.json({ success: true })
    } catch (error: unknown) {
        console.error('Posts DELETE error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
