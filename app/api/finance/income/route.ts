import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Tüm gelirleri getir
export async function GET(request: NextRequest) {
    try {
        const { data, error } = await supabase
            .from('income')
            .select(`
        *,
        clients (
          id,
          name,
          company
        )
      `)
            .order('date', { ascending: false })

        if (error) throw error

        return NextResponse.json(data || [])
    } catch (error: any) {
        console.error('Income GET error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// POST - Yeni gelir ekle
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const { data, error } = await supabase
            .from('income')
            .insert([body])
            .select()
            .single()

        if (error) throw error

        // Not: Müşteri bakiyesi güncellemesi artık Veritabanı Trigger'ı ile otomatik yapılıyor.
        // Manuel RPC çağrısına gerek kalmadı.

        return NextResponse.json(data)
    } catch (error: any) {
        console.error('Income POST error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// PUT - Gelir güncelle
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, ...updateData } = body

        const { data, error } = await supabase
            .from('income')
            .update(updateData)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(data)
    } catch (error: any) {
        console.error('Income PUT error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// DELETE - Gelir sil
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
        }

        const { error } = await supabase
            .from('income')
            .delete()
            .eq('id', id)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Income DELETE error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
