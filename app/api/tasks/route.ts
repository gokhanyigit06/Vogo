import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore'

export const dynamic = 'force-dynamic'

// GET - Tüm görevleri getir
export async function GET() {
    try {
        const q = query(collection(db, "tasks"), orderBy("createdAt", "desc"))
        const querySnapshot = await getDocs(q)

        const tasksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }))

        if (tasksData.length === 0) return NextResponse.json([])

        // Unique IDs to fetch
        const projectIds = Array.from(new Set(tasksData.map(t => t.projectId).filter(Boolean)))
        const userIds = Array.from(new Set(tasksData.map(t => t.userId).filter(Boolean)))

        const projectCache: Record<string, any> = {}
        const userCache: Record<string, any> = {}

        // Fetch projects in parallel (up to 10 at a time if using 'in', but let's use caching for simplicity or simple parallel gets)
        await Promise.all([
            ...projectIds.map(async (pid) => {
                const pDoc = await getDoc(doc(db, "projects", pid as string))
                if (pDoc.exists()) {
                    const data = pDoc.data()
                    projectCache[pid as string] = {
                        id: pid,
                        title: data.title || data.publicTitle,
                        name: data.name || data.internalName
                    }
                }
            }),
            ...userIds.map(async (uid) => {
                const uDoc = await getDoc(doc(db, "team", uid as string))
                if (uDoc.exists()) {
                    const data = uDoc.data()
                    userCache[uid as string] = {
                        id: uid,
                        name: data.name,
                        image: data.image || data.image_url,
                        email: data.email
                    }
                }
            })
        ])

        // Merge data
        const enrichedTasks = tasksData.map(task => ({
            ...task,
            project: task.projectId ? projectCache[task.projectId] : null,
            user: task.userId ? userCache[task.userId] : null
        }))

        return NextResponse.json(enrichedTasks)
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

        const newTask = {
            title: body.title,
            description: body.description || null,
            status: body.status || 'todo',
            priority: body.priority || 'medium',
            userId: body.assigned_to ? String(body.assigned_to) : null,
            projectId: body.project_id ? String(body.project_id) : null,
            dueDate: body.due_date ? new Date(body.due_date).toISOString() : null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        const docRef = await addDoc(collection(db, "tasks"), newTask)

        return NextResponse.json({ id: docRef.id, ...newTask })
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
        const { id, assigned_to, project_id, due_date, ...rest } = body

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 })
        }

        const updateData: any = {
            title: body.title,
            description: body.description || null,
            status: body.status,
            priority: body.priority,
            updatedAt: new Date().toISOString()
        }

        if (assigned_to !== undefined) updateData.userId = assigned_to ? String(assigned_to) : null
        if (project_id !== undefined) updateData.projectId = project_id ? String(project_id) : null
        if (due_date !== undefined) updateData.dueDate = due_date ? new Date(due_date).toISOString() : null
        if (body.status === 'done') {
            updateData.completedAt = new Date().toISOString()
        }

        const taskRef = doc(db, "tasks", id)
        await updateDoc(taskRef, updateData)

        return NextResponse.json({ id, ...updateData })
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

        await deleteDoc(doc(db, "tasks", id))

        return NextResponse.json({ success: true })
    } catch (error: unknown) {
        console.error('Error deleting task:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
