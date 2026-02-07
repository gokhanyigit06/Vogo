import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET - Tüm görevleri getir
export async function GET() {
    try {
        const tasks = await prisma.task.findMany({
            orderBy: { id: 'desc' },
            include: {
                project: {
                    select: { id: true, title: true, name: true }
                },
                teamMember: {
                    select: { id: true, name: true }
                }
            }
        })

        return NextResponse.json(tasks)
    } catch (error: unknown) {
        console.error('Error fetching tasks:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// POST - Yeni görev ekle
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        if (!body.title) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 })
        }

        console.log('Creating task with body:', body); // Debug log

        const task = await prisma.task.create({
            data: {
                title: body.title,
                description: body.description,
                status: body.status || 'todo',
                priority: body.priority || 'medium',
                assignedTo: body.assigned_to ? parseInt(String(body.assigned_to)) : null,
                projectId: body.project_id ? parseInt(String(body.project_id)) : null,
                dueDate: body.due_date ? new Date(body.due_date) : null,
            }
        })

        return NextResponse.json(task)
    } catch (error: unknown) {
        console.error('Error creating task:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// PUT - Görev güncelle
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()

        if (!body.id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 })
        }

        console.log('Updating task with body:', body); // Debug log

        const task = await prisma.task.update({
            where: { id: parseInt(String(body.id)) },
            data: {
                title: body.title,
                description: body.description,
                status: body.status,
                priority: body.priority,
                assignedTo: body.assigned_to ? parseInt(String(body.assigned_to)) : null,
                projectId: body.project_id ? parseInt(String(body.project_id)) : null,
                dueDate: body.due_date ? new Date(body.due_date) : null,
                completedAt: body.status === 'done' ? new Date() : null,
            }
        })

        return NextResponse.json(task)
    } catch (error: unknown) {
        console.error('Error updating task:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// DELETE - Görev sil
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 })
        }

        await prisma.task.delete({
            where: { id: parseInt(id) }
        })

        return NextResponse.json({ success: true })
    } catch (error: unknown) {
        console.error('Error deleting task:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
