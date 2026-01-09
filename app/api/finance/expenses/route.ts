import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Tüm giderleri getir
export async function GET(request: NextRequest) {
    try {
        const { data, error } = await supabase
            .from('expenses')
            .select(`
                *,
                team_members (
                    id,
                    name
                )
            `)
            .order('date', { ascending: false })

        if (error) throw error

        return NextResponse.json(data || [])
    } catch (error: any) {
        console.error('Expenses GET error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// POST - Yeni gider ekle
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const { data, error } = await supabase
            .from('expenses')
            .insert([body])
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(data)
    } catch (error: any) {
        console.error('Expenses POST error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// PUT - Gider güncelle
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, ...updateData } = body

        const { data, error } = await supabase
            .from('expenses')
            .update(updateData)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(data)
    } catch (error: any) {
        console.error('Expenses PUT error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// DELETE - Gider sil
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
        }

        const { error } = await supabase
            .from('expenses')
            .delete()
            .eq('id', id)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Expenses DELETE error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
