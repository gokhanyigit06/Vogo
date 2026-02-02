import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Tüm projeleri veya tek projeyi getir (ID varsa)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (id) {
            // Tekil proje detayı (Görevler ile birlikte)
            const project = await prisma.project.findUnique({
                where: { id: parseInt(id) },
                include: {
                    client: {
                        select: { id: true, name: true, company: true }
                    },
                    tasks: true
                }
            })

            if (!project) {
                return NextResponse.json({ error: 'Proje bulunamadı' }, { status: 404 })
            }

            return NextResponse.json(project)
        }

        // Liste
        const projects = await prisma.project.findMany({
            include: {
                client: {
                    select: { id: true, name: true, company: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(projects)
    } catch (error: unknown) {
        console.error('Projects GET error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// POST - Yeni proje ekle
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // title/name senkronizasyonu
        const title = body.title || body.name
        const name = body.name || body.title

        const project = await prisma.project.create({
            data: {
                title,
                name,
                description: body.description,
                status: body.status || 'in_progress',
                category: body.category,
                budget: body.budget ? parseFloat(body.budget) : null,
                startDate: body.startDate ? new Date(body.startDate) : null,
                endDate: body.endDate ? new Date(body.endDate) : null,
                priority: body.priority || 'medium',
                progress: body.progress || 0,
                image: body.image,
                clientId: body.clientId ? parseInt(body.clientId) : null,
            }
        })

        return NextResponse.json(project)
    } catch (error: unknown) {
        console.error('Projects POST error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// PUT - Proje güncelle
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, ...updateData } = body

        // Boş string'leri null'a çevir
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === '') {
                updateData[key] = null
            }
        })

        // title/name senkronizasyonu
        if (updateData.name && !updateData.title) {
            updateData.title = updateData.name
        }

        // Date conversions
        if (updateData.startDate) updateData.startDate = new Date(updateData.startDate)
        if (updateData.endDate) updateData.endDate = new Date(updateData.endDate)
        if (updateData.budget) updateData.budget = parseFloat(updateData.budget)
        if (updateData.clientId) updateData.clientId = parseInt(updateData.clientId)

        const project = await prisma.project.update({
            where: { id: parseInt(id) },
            data: updateData
        })

        return NextResponse.json(project)
    } catch (error: unknown) {
        console.error('Projects PUT error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// DELETE - Proje sil
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
        }

        await prisma.project.delete({
            where: { id: parseInt(id) }
        })

        return NextResponse.json({ success: true })
    } catch (error: unknown) {
        console.error('Projects DELETE error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
