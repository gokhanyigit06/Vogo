import { auth } from "@/lib/auth"
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from "next/server"

const intlMiddleware = createMiddleware(routing);

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const { pathname } = req.nextUrl

    // Admin sayfalarına erişim kontrolü
    if (pathname.includes("/admin")) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL("/login", req.url))
        }
    }

    // Zaten giriş yapmışsa login sayfasından admin'e yönlendir
    // Login sayfasının her dildeki versiyonunu kontrol et
    if (pathname.includes("/login") && isLoggedIn) {
        return NextResponse.redirect(new URL("/admin", req.url))
    }

    return intlMiddleware(req);
})

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
