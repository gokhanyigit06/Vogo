import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

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

    return NextResponse.next();
})

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
