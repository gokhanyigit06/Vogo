"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function ScrollToTop() {
    const pathname = usePathname()

    useEffect(() => {
        // Native scroll reset
        window.scrollTo(0, 0)

        // If Lenis or any smooth scroll library attaches to window, 
        // sometimes a small delay helps ensure the reset happens after rendering
        // but generally native scrollTo works if called immediately.

        // Note: Since we use Lenis in SmoothScroll component, 
        // Lenis might handle its own scroll state. 
        // However, standard Next.js navigation should trigger native scroll restoration.
        // This component forces top on pathname change.

    }, [pathname])

    return null
}
