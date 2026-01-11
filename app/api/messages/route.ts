import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const cookieStore = await cookies()

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        cookieStore.set(name, value, options)
                    },
                    remove(name: string, options: CookieOptions) {
                        cookieStore.set(name, '', options)
                    }
                }
            }
        )

        // Fetch messages from database, ordered by created_at descending (newest first)
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('❌ Error fetching messages:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        console.log(`✅ Fetched ${data?.length || 0} messages`)
        return NextResponse.json(data || [])

    } catch (error) {
        console.error('💥 API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// Mark message as read
export async function PATCH(request: Request) {
    try {
        const { id, is_read } = await request.json()

        const cookieStore = await cookies()

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        cookieStore.set(name, value, options)
                    },
                    remove(name: string, options: CookieOptions) {
                        cookieStore.set(name, '', options)
                    }
                }
            }
        )

        const { error } = await supabase
            .from('messages')
            .update({ is_read })
            .eq('id', id)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('💥 API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// Delete message
export async function DELETE(request: Request) {
    try {
        const { id } = await request.json()

        const cookieStore = await cookies()

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        cookieStore.set(name, value, options)
                    },
                    remove(name: string, options: CookieOptions) {
                        cookieStore.set(name, '', options)
                    }
                }
            }
        )

        const { error } = await supabase
            .from('messages')
            .delete()
            .eq('id', id)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('💥 API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
