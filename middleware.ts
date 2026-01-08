import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // Build time veya Env eksikliği kontrolü
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
        // Build sırasında env yoksa middleware'i pas geç
        console.warn('Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY) are missing. Skipping Supabase middleware logic.')
        return response
    }

    try {
        // 1. Supabase Client oluştur
        const supabase = createServerClient(
            supabaseUrl,
            supabaseKey,
            {
                cookies: {
                    get(name: string) {
                        return request.cookies.get(name)?.value
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        request.cookies.set({
                            name,
                            value,
                            ...options,
                        })
                        response = NextResponse.next({
                            request: {
                                headers: request.headers,
                            },
                        })
                        response.cookies.set({
                            name,
                            value,
                            ...options,
                        })
                    },
                    remove(name: string, options: CookieOptions) {
                        request.cookies.set({
                            name,
                            value: '',
                            ...options,
                        })
                        response = NextResponse.next({
                            request: {
                                headers: request.headers,
                            },
                        })
                        response.cookies.set({
                            name,
                            value: '',
                            ...options,
                        })
                    },
                },
            }
        )

        // 2. Kullanıcı Oturumunu Kontrol Et
        const { data: { user } } = await supabase.auth.getUser()

        // 3. Admin Rotası Kontrolü (Login sayfası hariç)
        if (request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin/login') {
            if (!user) {
                return NextResponse.redirect(new URL('/admin/login', request.url))
            }
        }

        // 4. Zaten giriş yapmışsa ve Login sayfasına gitmeye çalışıyorsa
        if (request.nextUrl.pathname === '/admin/login' && user) {
            return NextResponse.redirect(new URL('/admin', request.url))
        }

    } catch (e) {
        // Hata durumunda (Supabase hatası vs.) akışı bozma, sadece logla
        console.error('Middleware Error:', e)
    }

    return response
}

export const config = {
    matcher: [
        '/admin/:path*',
    ],
}
