import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// GET - Tüm görevleri getir
export async function GET(request: NextRequest) {
    try {
        const { data, error } = await supabase
            .from('tasks')
            .select(`
                *,
                team_members (
                    id,
                    name
                ),
                projects (
                    id,
                    name
                )
            `)
            .order('created_at', { ascending: false })

        if (error) throw error

        return NextResponse.json(data)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// POST - Yeni görev ekle
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Boş tarihleri null yap
        if (body.due_date === '') body.due_date = null
        if (body.assigned_to === '') body.assigned_to = null
        if (body.project_id === '') body.project_id = null

        const { data, error } = await supabase
            .from('tasks')
            .insert([body])
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(data)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// PUT - Görev güncelle (Draging sırasında status değişimi için)
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, ...updates } = body

        // Boş tarihleri null yap
        if (updates.due_date === '') updates.due_date = null
        if (updates.assigned_to === '') updates.assigned_to = null
        if (updates.project_id === '') updates.project_id = null

        // Eğer status 'done' yapıldıysa completed_at ekle
        if (updates.status === 'done') {
            updates.completed_at = new Date().toISOString()
        } else if (updates.status && updates.status !== 'done') {
            updates.completed_at = null
        }

        const { data, error } = await supabase
            .from('tasks')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(data)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// DELETE - Görev sil
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })

        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
