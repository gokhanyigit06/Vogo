import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { supabase } from '@/lib/supabase'

const localDataPath = path.resolve('./data/posts.json')

async function getLocalPosts() {
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
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false })

            if (!error && data) return NextResponse.json(data)
        } catch (err) { console.error(err) }
    }

    // 2. Local Fallback
    const localData = await getLocalPosts()
    return NextResponse.json(localData)
}

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Supabase
        if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
            const { data, error } = await supabase
                .from('posts')
                .insert([
                    {
                        title: body.title,
                        slug: body.slug || body.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                        content: body.content,
                        excerpt: body.excerpt,
                        category: body.category,
                        image: body.image,
                        status: 'published',
                        read_time: body.readTime || '5 dk',
                        date: new Date().toLocaleDateString('tr-TR')
                    }
                ])
                .select()

            if (!error) return NextResponse.json(data[0])
        }

        // Local Fallback
        const localData = await getLocalPosts()
        const newPost = {
            id: Date.now(),
            ...body,
            date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
        }
        localData.unshift(newPost)
        await fs.writeFile(localDataPath, JSON.stringify(localData, null, 2), 'utf8')

        return NextResponse.json(newPost)

    } catch (error) {
        return NextResponse.json({ error: 'İşlem başarısız' }, { status: 500 })
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
                .from('posts')
                .update(updates)
                .eq('id', id)
                .select()

            if (!error) return NextResponse.json(data[0])
        }

        // 2. Local Fallback
        const localData = await getLocalPosts()
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
                .from('posts')
                .delete()
                .eq('id', id)

            if (!error) return NextResponse.json({ success: true })
        }

        // 2. Local Fallback
        let localData = await getLocalPosts()
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
