import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Tüm müşterileri getir
export async function GET(request: NextRequest) {
    try {
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error

        return NextResponse.json(data || [])
    } catch (error: any) {
        console.error('Clients GET error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// POST - Yeni müşteri ekle
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const { data, error } = await supabase
            .from('clients')
            .insert([body])
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(data)
    } catch (error: any) {
        console.error('Clients POST error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// PUT - Müşteri güncelle
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, ...updateData } = body

        const { data, error } = await supabase
            .from('clients')
            .update(updateData)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(data)
    } catch (error: any) {
        console.error('Clients PUT error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// DELETE - Müşteri sil
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
        }

        const { error } = await supabase
            .from('clients')
            .delete()
            .eq('id', id)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Clients DELETE error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
