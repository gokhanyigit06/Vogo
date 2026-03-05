import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore'

// GET - Tüm projeleri veya tek projeyi getir (ID varsa)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (id) {
            // Tekil proje detayı (Görevler ile birlikte)
            const projectDoc = await getDoc(doc(db, "projects", id))
            const projectData = projectDoc.data()
            const project: any = { id: projectDoc.id, ...projectData }

            // Client bilgisi
            if (projectData && projectData.clientId) {
                const clientDoc = await getDoc(doc(db, "clients", projectData.clientId))
                if (clientDoc.exists()) {
                    const clientData = clientDoc.data()
                    project.client = { id: clientDoc.id, name: clientData.name, company: clientData.company }
                }
            }

            // Görevler (Tasks)
            const tasksQuery = query(collection(db, "tasks"), where("projectId", "==", id))
            const tasksSnapshot = await getDocs(tasksQuery)
            project.tasks = tasksSnapshot.docs.map(t => ({ id: t.id, ...t.data() }))

            return NextResponse.json(project)
        }

        const slug = searchParams.get('slug')
        if (slug) {
            const slugQuery = query(collection(db, "projects"), where("slug", "==", slug))
            const slugSnapshot = await getDocs(slugQuery)
            if (slugSnapshot.empty) {
                return NextResponse.json({ error: 'Proje bulunamadı' }, { status: 404 })
            }
            const projectDoc = slugSnapshot.docs[0]
            const projectData = projectDoc.data()
            const project: any = { id: projectDoc.id, ...projectData }

            if (projectData && projectData.clientId) {
                const clientDoc = await getDoc(doc(db, "clients", projectData.clientId))
                if (clientDoc.exists()) {
                    project.client = { id: clientDoc.id, ...clientDoc.data() }
                }
            }
            return NextResponse.json(project)
        }

        const type = searchParams.get('type')

        // Liste
        const projectsRef = collection(db, "projects")
        let q = query(projectsRef)

        const projectsSnapshot = await getDocs(q)
        let projects = projectsSnapshot.docs.map(p => ({ id: p.id, ...p.data() }))

        // Filtreleme (Bellekte yapıyoruz çünkü Firestore'da eksik alanlar sorguyu bozabiliyor)
        if (type === 'lab') {
            projects = projects.filter((p: any) => p.isLabProject === true)
        } else if (type === 'work') {
            projects = projects.filter((p: any) => p.isLabProject !== true)
        }

        // Order mapping (Order ASC, then createdAt DESC in memory due to Firestore limits on missing indexes)
        projects.sort((a: any, b: any) => {
            if ((a.order || 0) === (b.order || 0)) {
                return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
            }
            return (a.order || 0) - (b.order || 0)
        })

        // Client bilgisi getirme (Her proje için ID bazlı fetch)
        const clientIds = [...new Set(projects.map((p: any) => p.clientId).filter(Boolean))]
        const clientMap: any = {}
        for (const cId of clientIds) {
            const cDoc = await getDoc(doc(db, "clients", cId))
            if (cDoc.exists()) {
                const cData = cDoc.data()
                clientMap[cId] = { id: cId, name: cData.name, company: cData.company }
            }
        }

        projects = projects.map((p: any) => ({
            ...p,
            client: p.clientId ? clientMap[p.clientId] : null
        }))

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

        const title = body.title || body.name
        const name = body.name || body.title
        const baseSlug = body.slug || (body.publicTitle || body.name || '').toLowerCase()
            .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
            .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
            .replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '')

        let slug = baseSlug
        let counter = 1
        while (true) {
            const sq = query(collection(db, "projects"), where("slug", "==", slug))
            const sSnapshot = await getDocs(sq)
            if (sSnapshot.empty) break
            slug = `${baseSlug}-${counter}`
            counter++
        }

        const newProject = {
            internalName: body.internalName || body.name || null,
            publicTitle: body.publicTitle || body.title || body.name || null,
            slug: slug,
            content: body.content || null,
            order: body.order || 0,
            isLabProject: body.isLabProject || false,
            thumbnail: body.thumbnail || null,
            liveUrl: body.liveUrl || null,
            tags: body.tags || [],
            heroImage: body.heroImage || null,
            heroVideo: body.heroVideo || null,
            year: body.year || null,
            services: body.services || [],
            contentBlocks: body.contentBlocks || [],
            market: body.market || null,
            clientType: body.clientType || null,
            websiteUrl: body.websiteUrl || null,
            gallery: body.gallery || [],
            title: title || null,
            name: name || null,
            description: body.description || null,
            status: body.status || 'in_progress',
            category: body.category || null,
            categories: body.categories || [],
            budget: body.budget ? parseFloat(body.budget) : null,
            startDate: body.startDate ? new Date(body.startDate).toISOString() : null,
            endDate: body.endDate ? new Date(body.endDate).toISOString() : null,
            priority: body.priority || 'medium',
            progress: body.progress || 0,
            image: body.image || null,
            clientId: body.clientId ? String(body.clientId) : null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        const docRef = await addDoc(collection(db, "projects"), newProject)
        return NextResponse.json({ id: docRef.id, ...newProject })
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

        if (!id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
        }

        const sanitizedData: any = {
            internalName: updateData.internalName || updateData.name,
            publicTitle: updateData.publicTitle || updateData.title || updateData.internalName || updateData.name,
            name: updateData.name || updateData.internalName,
            title: updateData.title || updateData.publicTitle || updateData.name,
            description: updateData.description,
            content: updateData.content,
            status: updateData.status,
            category: updateData.category,
            categories: updateData.categories,
            order: updateData.order,
            budget: updateData.budget ? parseFloat(updateData.budget) : undefined,
            startDate: updateData.startDate ? new Date(updateData.startDate).toISOString() : (updateData.start_date ? new Date(updateData.start_date).toISOString() : undefined),
            endDate: updateData.endDate ? new Date(updateData.endDate).toISOString() : (updateData.end_date ? new Date(updateData.end_date).toISOString() : undefined),
            priority: updateData.priority,
            heroImage: updateData.heroImage,
            year: updateData.year,
            services: updateData.services,
            market: updateData.market,
            clientType: updateData.clientType,
            websiteUrl: updateData.websiteUrl,
            gallery: updateData.gallery,
            image: updateData.image,
            isLabProject: updateData.isLabProject,
            thumbnail: updateData.thumbnail,
            liveUrl: updateData.liveUrl,
            tags: updateData.tags,
            contentBlocks: updateData.contentBlocks,
            updatedAt: new Date().toISOString()
        }

        Object.keys(sanitizedData).forEach(key => {
            if (sanitizedData[key] === undefined) {
                delete sanitizedData[key]
            }
        })

        if (updateData.client_id !== undefined || updateData.clientId !== undefined) {
            const cid = updateData.client_id || updateData.clientId
            sanitizedData.clientId = cid ? String(cid) : null
        }

        const projectRef = doc(db, "projects", id)
        await updateDoc(projectRef, sanitizedData)

        return NextResponse.json({ id, ...sanitizedData })
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

        await deleteDoc(doc(db, "projects", id))
        return NextResponse.json({ success: true })
    } catch (error: unknown) {
        console.error('Projects DELETE error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
