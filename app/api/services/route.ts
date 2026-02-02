import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Tüm hizmetleri getir
export async function GET() {
    try {
        const services = await prisma.service.findMany({
            orderBy: { id: 'asc' }
        })

        return NextResponse.json(services)
    } catch (error: unknown) {
        console.error('Services GET error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// POST - Yeni hizmet ekle
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

        const service = await prisma.service.create({
            data: {
                title: body.title,
                slug,
                description: body.desc || body.description,
                icon: body.icon || 'Layers',
                status: body.status || 'Pasif',
                views: 0,
                projectsCount: 0
            }
        })

        return NextResponse.json(service)
    } catch (error: unknown) {
        console.error('Services POST error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// PUT - Hizmet güncelle
export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const { id, desc, ...updates } = body

        if (!id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
        }

        // Map 'desc' to 'description' for Prisma
        if (desc !== undefined) {
            updates.description = desc
        }

        const service = await prisma.service.update({
            where: { id: parseInt(id) },
            data: updates
        })

        return NextResponse.json(service)
    } catch (error: unknown) {
        console.error('Services PUT error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// DELETE - Hizmet sil
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
        }

        await prisma.service.delete({
            where: { id: parseInt(id) }
        })

        return NextResponse.json({ success: true })
    } catch (error: unknown) {
        console.error('Services DELETE error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
