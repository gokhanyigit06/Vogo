import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Tüm projeleri getir
// GET - Tüm projeleri veya tek projeyi getir (ID varsa)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (id) {
            // Tekil proje detayı (Görevler ile birlikte)
            const { data, error } = await supabase
                .from('projects')
                .select(`
                    *,
                    clients (id, name, company),
                    tasks (*)
                `)
                .eq('id', id)
                .single()

            if (error) throw error
            return NextResponse.json(data)
        }

        // Liste
        const { data, error } = await supabase
            .from('projects')
            .select(`
                *,
                clients (
                  id,
                  name,
                  company
                )
            `)
            .order('created_at', { ascending: false })

        if (error) throw error

        return NextResponse.json(data || [])
    } catch (error: any) {
        console.error('Projects GET error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// POST - Yeni proje ekle
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const { data, error } = await supabase
            .from('projects')
            .insert([body])
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(data)
    } catch (error: any) {
        console.error('Projects POST error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// PUT - Proje güncelle
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, ...updateData } = body

        const { data, error } = await supabase
            .from('projects')
            .update(updateData)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(data)
    } catch (error: any) {
        console.error('Projects PUT error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
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

        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Projects DELETE error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
