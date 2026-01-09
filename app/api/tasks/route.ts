import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
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
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )
}

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Basit sorgu (İlişkisiz) - Güvenli mod
        // Eğer ilişkili veri istenirse (User/Project) JOIN'leri açabiliriz
        const { data, error } = await supabase
            .from('tasks')
            .select('*, team_members(id, name), projects(id, name), task_attachments(*)')
            .order('created_at', { ascending: false })

        if (error) throw error

        return NextResponse.json(data)
    } catch (error: any) {
        console.error('Error fetching tasks:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const body = await request.json()

        // Veri doğrulama
        if (!body.title) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('tasks')
            .insert([{
                title: body.title,
                description: body.description,
                status: body.status || 'todo',
                priority: body.priority || 'medium',
                assigned_to: body.assigned_to,
                project_id: body.project_id,
                due_date: body.due_date,
            }])
            .select()

        if (error) throw error

        return NextResponse.json(data)
    } catch (error: any) {
        console.error('Error creating task:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        const supabase = await createClient()
        const body = await request.json()

        if (!body.id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('tasks')
            .update({
                title: body.title,
                description: body.description,
                status: body.status,
                priority: body.priority,
                assigned_to: body.assigned_to,
                project_id: body.project_id,
                due_date: body.due_date,
                updated_at: new Date().toISOString()
            })
            .eq('id', body.id)
            .select()

        if (error) throw error

        return NextResponse.json(data)
    } catch (error: any) {
        console.error('Error updating task:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 })
        }

        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Error deleting task:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
