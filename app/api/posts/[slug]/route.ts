import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params

        // Önce slug ile dene
        let post = await prisma.post.findUnique({
            where: { slug }
        })

        // Slug bulunamazsa ID ile dene (backward compatibility)
        if (!post && !isNaN(Number(slug))) {
            post = await prisma.post.findUnique({
                where: { id: Number(slug) }
            })
        }

        if (post) {
            return NextResponse.json(post)
        }

        return NextResponse.json(
            { error: 'Post bulunamadı' },
            { status: 404 }
        )

    } catch (error) {
        console.error('Error fetching post:', error)
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500 }
        )
    }
}
