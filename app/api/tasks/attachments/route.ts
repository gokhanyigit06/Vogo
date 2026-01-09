import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: { getAll() { return cookieStore.getAll() } }
        }
    )

    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('task_id')

    if (!taskId) return NextResponse.json([])

    const { data } = await supabase
        .from('task_attachments')
        .select('*')
        .eq('task_id', taskId)

    return NextResponse.json(data || [])
}

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() { return cookieStore.getAll() },
                    setAll(cookiesToSet) {
                        try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch { }
                    },
                },
            }
        )

        const body = await request.json()
        const { task_id, file_name, file_url } = body

        if (!task_id || !file_url) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('task_attachments')
            .insert([{
                task_id,
                file_name,
                file_url,
                file_type: file_name.split('.').pop()
            }])
            .select()

        if (error) throw error

        return NextResponse.json(data)
    } catch (error: any) {
        console.error('Attachment save error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
