import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { supabase } from '@/lib/supabase'

const localDataPath = path.resolve('./data/projects.json')

async function getLocalProjects() {
    try {
        const fileContents = await fs.readFile(localDataPath, 'utf8')
        return JSON.parse(fileContents.replace(/^\uFEFF/, ''))
    } catch { return [] }
}

export async function GET() {
    // 1. Supabase
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false })

            if (!error && data) return NextResponse.json(data)
        } catch (err) { console.error(err) }
    }

    // 2. Local Fallback
    const localData = await getLocalProjects()
    return NextResponse.json(localData)
}

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Supabase Insert
        if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
            const { data, error } = await supabase
                .from('projects')
                .insert([
                    {
                        title: body.title,
                        client: body.client,
                        category: body.category,
                        description: body.desc || body.description,
                        image: body.image
                    }
                ])
                .select()

            if (!error) return NextResponse.json(data[0])
        }

        // Local Fallback
        const localData = await getLocalProjects()
        const newProject = { id: Date.now(), ...body }
        localData.unshift(newProject)
        await fs.writeFile(localDataPath, JSON.stringify(localData, null, 2), 'utf8')

        return NextResponse.json(newProject)

    } catch (error) {
        return NextResponse.json({ error: 'Hata' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const { id, ...updates } = body

        if (!id) return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })

        // 1. Supabase
        if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
            const { data, error } = await supabase
                .from('projects')
                .update(updates)
                .eq('id', id)
                .select()

            if (!error) return NextResponse.json(data[0])
        }

        // 2. Local Fallback
        const localData = await getLocalProjects()
        const index = localData.findIndex((item: any) => item.id == id)

        if (index === -1) return NextResponse.json({ error: 'Kayıt bulunamadı' }, { status: 404 })

        localData[index] = { ...localData[index], ...updates }
        await fs.writeFile(localDataPath, JSON.stringify(localData, null, 2), 'utf8')

        return NextResponse.json(localData[index])

    } catch (error) {
        return NextResponse.json({ error: 'Güncelleme başarısız' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })

        // 1. Supabase
        if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', id)

            if (!error) return NextResponse.json({ success: true })
        }

        // 2. Local Fallback
        let localData = await getLocalProjects()
        const initialLength = localData.length
        localData = localData.filter((item: any) => item.id != id)

        if (localData.length === initialLength) {
            return NextResponse.json({ error: 'Kayıt bulunamadı' }, { status: 404 })
        }

        await fs.writeFile(localDataPath, JSON.stringify(localData, null, 2), 'utf8')
        return NextResponse.json({ success: true })

    } catch (error) {
        return NextResponse.json({ error: 'Silme başarısız' }, { status: 500 })
    }
}
