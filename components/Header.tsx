"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/ThemeToggle"

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [settings, setSettings] = useState<any>(null)

    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => setSettings(data))
            .catch(err => console.error('Settings fetch error:', err))
    }, [])

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [menuOpen])

    const navItems = [
        { name: "work", href: "/portfolio" },
        { name: "services", href: "/services" },
        { name: "about", href: "/about" },
        { name: "blog", href: "/blog" },
        { name: "lab", href: "/laboratuvar" },
    ]

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg transition-colors duration-300">
                <nav className="container mx-auto px-4 md:px-8 max-w-[95%] w-full h-16 sm:h-20 md:h-24 flex items-center justify-between">
                    {/* Left: Logo */}
                    <Link href="/" className="flex items-center gap-2 sm:gap-3">
                        <img src="/logo.png" alt="Logo" className="h-8 sm:h-10 md:h-11 w-auto object-contain dark:invert" />
                        <span className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tighter hover:scale-105 transition-transform">
                            VOGOLAB.
                        </span>
                    </Link>

                    {/* Center: Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6 lg:gap-10">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-lg lg:text-2xl font-medium text-black hover:text-primary transition-colors hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-primary hover:to-teal-400"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* Desktop Contact Button */}
                        <div className="hidden md:flex items-center gap-4 lg:gap-6">
                            <span className="text-lg lg:text-2xl font-medium border border-black/20 px-3 lg:px-4 py-1 rounded-full uppercase text-black">
                                TR
                            </span>
                            <Link
                                href="/contact"
                                className="text-lg lg:text-2xl font-medium text-black hover:text-primary transition-colors"
                            >
                                contact us
                            </Link>
                        </div>

                        {/* Mobile Hamburger Button */}
                        <button
                            onClick={() => setMenuOpen(true)}
                            className="md:hidden group flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                            aria-label="Open menu"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </nav>
            </header>

            {/* Fullscreen Menu Overlay (Mobile Only) */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[100] bg-background text-foreground md:hidden"
                    >
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--sidebar-primary),transparent_70%)] opacity-10" />

                        {/* Close Button */}
                        <button
                            onClick={() => setMenuOpen(false)}
                            className="fixed top-5 right-5 sm:top-8 sm:right-8 text-foreground hover:text-primary transition-colors z-[110]"
                            aria-label="Close menu"
                        >
                            <X className="w-7 h-7 sm:w-8 sm:h-8" />
                        </button>

                        {/* Menu Items */}
                        <div className="relative z-[105] h-full flex items-center justify-center">
                            <nav className="flex flex-col items-center gap-5 sm:gap-6">
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
                                            className="group relative text-4xl sm:text-5xl font-bold text-foreground hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-primary hover:to-teal-400 transition-all duration-300 block capitalize"
                                        >
                                            {item.name}
                                            <span className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-primary to-teal-400 group-hover:w-full transition-all duration-300" />
                                        </Link>
                                    </motion.div>
                                ))}
                                {/* Mobile Contact Link */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: navItems.length * 0.1 }}
                                >
                                    <Link
                                        href="/contact"
                                        onClick={() => setMenuOpen(false)}
                                        className="text-2xl sm:text-3xl font-bold text-primary hover:text-teal-400 transition-colors mt-6 sm:mt-8 block"
                                    >
                                        contact us
                                    </Link>
                                </motion.div>
                            </nav>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
