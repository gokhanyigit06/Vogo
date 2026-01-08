import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // 1. Supabase Client oluştur (Cookie yönetimi için)
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
            // Oturum yoksa Login'e at
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    // 4. Zaten giriş yapmışsa ve Login sayfasına gitmeye çalışıyorsa Admin'e at
    if (request.nextUrl.pathname === '/admin/login' && user) {
        return NextResponse.redirect(new URL('/admin', request.url))
    }

    return response
}

export const config = {
    matcher: [
        '/admin/:path*',
    ],
}
