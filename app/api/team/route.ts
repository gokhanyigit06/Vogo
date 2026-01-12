import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

// Helper to create authenticated client
async function createClient() {
    const cookieStore = await cookies()

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // Ignored
                    }
                },
            },
        }
    )
}

// GET - Tüm takım üyelerini getir
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()

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
        const supabase = await createClient()
        const body = await request.json()
        const { name, email, role, avatar_url } = body

        const { data, error } = await supabase
            .from('team_members')
            .insert([{ name, email, role, avatar_url }])
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

        const supabase = await createClient()

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
