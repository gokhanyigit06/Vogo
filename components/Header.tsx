"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [settings, setSettings] = useState<any>(null)

    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => setSettings(data))
            .catch(err => console.error('Settings fetch error:', err))
    }, [])

    const navItems = [
        { name: "HOME", href: "/" },
        { name: "ABOUT US", href: "/about" },
        { name: "SERVICES", href: "/services" },
        { name: "PORTFOLIOS", href: "/portfolio" },
        { name: "BLOG", href: "/blog" },
        { name: "CONTACT US", href: "/contact" },
    ]

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-lg">
                <nav className="container mx-auto px-4 md:px-8 max-w-7xl h-20 flex items-center justify-between">
                    {/* Left: Hamburger Menu Button */}
                    <button
                        onClick={() => setMenuOpen(true)}
                        className="group flex items-center gap-2 text-white hover:text-emerald-400 transition-colors"
                        aria-label="Open menu"
                    >
                        <Menu className="w-6 h-6" />
                        <span className="text-sm font-medium hidden sm:inline">MENU</span>
                    </button>

                    {/* Center: Logo */}
                    <Link href="/" className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                            {settings?.site_title?.split(' ')[0] || 'Vogo'}
                        </span>
                        <span className="text-white"> {settings?.site_title?.split(' ').slice(1).join(' ') || 'Agency'}</span>
                    </Link>

                    {/* Right: Empty space for balance */}
                    <div className="w-6 h-6" />
                </nav>
            </header>

            {/* Fullscreen Menu Overlay */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[100] bg-slate-950"
                    >
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)]" />

                        {/* Close Button */}
                        <button
                            onClick={() => setMenuOpen(false)}
                            className="fixed top-8 right-8 text-white hover:text-emerald-400 transition-colors z-[110]"
                            aria-label="Close menu"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        {/* Menu Items */}
                        <div className="relative z-[105] h-full flex items-center justify-center">
                            <nav className="flex flex-col items-center gap-6">
                                {navItems.map((item, index) => (
                                    <motion.div
                                        key={item.name}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className="relative"
                                    >
                                        <Link
                                            href={item.href}
                                            onClick={() => setMenuOpen(false)}
                                            className="group relative text-5xl md:text-7xl lg:text-8xl font-bold text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-emerald-400 hover:to-teal-400 transition-all duration-300 block"
                                        >
                                            {item.name}

                                            {/* Hover underline effect */}
                                            <span className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 group-hover:w-full transition-all duration-300" />
                                        </Link>
                                    </motion.div>
                                ))}
                            </nav>
                        </div>

                        {/* Bottom Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="absolute bottom-8 left-0 right-0 z-[105]"
                        >
                            <div className="container mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm">
                                <p>info@vogoagency.com</p>
                                <p>+90 507 734 75 21</p>
                                <div className="flex gap-4">
                                    <a href="#" className="hover:text-emerald-400 transition-colors">Instagram</a>
                                    <a href="#" className="hover:text-emerald-400 transition-colors">LinkedIn</a>
                                    <a href="#" className="hover:text-emerald-400 transition-colors">Twitter</a>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
