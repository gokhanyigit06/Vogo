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
        .from('task_attachments') // View veya Table adı
        .select('*')
        .eq('task_id', taskId)

    return NextResponse.json(data || [])
}

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        // Admin yetkisi gerekiyor mu? Evet, çünkü client-side RLS ile uğraşmayalım.
        // Ama ssr client normalde kullanıcının yetkisiyle çalışır.
        // Service Role Key varsa kullanalım, yoksa normal devam.

        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        const supabase = serviceKey
            ? createServerClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                serviceKey,
                { cookies: { getAll() { return [] }, setAll() { } } } // Service Client cookie istemez
            )
            : createServerClient(
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

        const formData = await request.formData()
        const file = formData.get('file') as File
        const taskId = formData.get('task_id') as string

        if (!file || !taskId) {
            return NextResponse.json({ error: 'File and Task ID required' }, { status: 400 })
        }

        const fileExt = file.name.split('.').pop()
        const fileName = `${taskId}/${Math.random().toString(36).substring(7)}.${fileExt}`

        // 1. Upload to Storage
        const { error: uploadError } = await supabase.storage
            .from('task-attachments')
            .upload(fileName, file, {
                upsert: true,
                contentType: file.type
            })

        if (uploadError) {
            console.error('Storage Upload Error:', uploadError)
            return NextResponse.json({ error: uploadError.message }, { status: 500 })
        }

        // 2. Get Public URL
        const { data: urlData } = supabase.storage
            .from('task-attachments')
            .getPublicUrl(fileName)

        // 3. Insert into DB
        const { data, error: dbError } = await supabase
            .from('task_attachments')
            .insert([{
                task_id: parseInt(taskId),
                file_name: file.name,
                file_url: urlData.publicUrl,
                file_type: fileExt
            }])
            .select()

        if (dbError) throw dbError

        return NextResponse.json(data)

    } catch (error: any) {
        console.error('Attachment save error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
