"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { ArrowUpRight, Menu, X } from "lucide-react"

const navLinks = [
    { label: "Overview", href: "/admin/web" },
    { label: "Hero", href: "/admin/web/hero" },
    { label: "Work", href: "/admin/web/work" },
    { label: "Header", href: "/admin/web/header" },
    { label: "Footer", href: "/admin/web/footer" },
]

export default function WebPanelNav() {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    const isActive = (href: string) => {
        if (href === "/admin/web") return pathname.endsWith("/admin/web")
        return pathname.includes(href.replace("/admin/web/", ""))
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#F4F4F4]/90 backdrop-blur-md border-b border-black/10">
            <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-[68px] flex items-center justify-between">
                {/* Logo */}
                <Link href="/admin/web" className="flex items-center gap-2.5 group">
                    <img
                        src="/logo.png"
                        alt="Vogo"
                        className="h-8 w-auto shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="flex items-baseline gap-0">
                        <span className="font-black text-[#1a2744] text-[22px] tracking-tighter uppercase leading-none">VOGOLAB</span>
                        <span className="font-black text-[#1a2744] text-[22px] leading-none">.</span>
                        <span className="ml-2.5 text-[#1a2744]/40 text-[10px] font-bold tracking-[0.2em] uppercase self-center">WEB PANEL</span>
                    </div>
                </Link>


                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                isActive(link.href)
                                    ? "bg-black text-white"
                                    : "text-black/60 hover:text-black hover:bg-black/5"
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Right side */}
                <div className="hidden md:flex items-center gap-3">
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-1.5 text-sm text-black/50 hover:text-black transition-colors font-medium"
                    >
                        Siteyi Gör
                        <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                        href="/admin"
                        className="px-4 py-2 bg-black text-white text-sm font-bold rounded-full hover:bg-black/80 transition-colors"
                    >
                        Admin Panel
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 rounded-xl hover:bg-black/5 transition-colors"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {open && (
                <div className="md:hidden bg-[#F4F4F4] border-t border-black/10 px-6 py-4 flex flex-col gap-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                isActive(link.href)
                                    ? "bg-black text-white"
                                    : "text-black/60 hover:text-black hover:bg-black/5"
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="pt-2 flex flex-col gap-2 border-t border-black/10 mt-2">
                        <Link href="/" target="_blank" className="px-4 py-3 text-sm text-black/50 font-medium">Siteyi Gör ↗</Link>
                        <Link href="/admin" className="px-4 py-3 bg-black text-white text-sm font-bold rounded-xl text-center">Admin Panel</Link>
                    </div>
                </div>
            )}
        </header>
    )
}
