import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Tüm takım üyelerini getir
export async function GET(request: NextRequest) {
    try {
        const { data, error } = await supabase
            .from('team_members')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error

        return NextResponse.json(data || [])
    } catch (error: any) {
        console.error('Team GET error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// POST - Yeni üye ekle
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const { data, error } = await supabase
            .from('team_members')
            .insert([body])
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(data)
    } catch (error: any) {
        console.error('Team POST error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// DELETE - Üye sil
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
        }

        const { error } = await supabase
            .from('team_members')
            .delete()
            .eq('id', id)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Team DELETE error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
