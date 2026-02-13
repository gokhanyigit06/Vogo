"use client"

import { motion } from "framer-motion"
import { Twitter, Linkedin, Instagram, Facebook, Youtube, Mail, ArrowUpRight } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

interface Settings {
    siteTitle?: string
    siteDescription?: string
    twitter?: string
    linkedin?: string
    instagram?: string
    facebook?: string
    youtube?: string
    address?: string
}

export default function ModernFooter() {
    const [settings, setSettings] = useState<Settings | null>(null)

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings')
                if (res.ok) {
                    const data = await res.json()
                    setSettings(data)
                }
            } catch (e) {
                console.error('Failed to fetch settings:', e)
            }
        }
        fetchSettings()
    }, [])

    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-black text-white selection:bg-white selection:text-black">
            {/* 1. Top CTA Section */}
            <section className="py-10 md:py-12 border-b border-white/10">
                <div className="w-full px-4 md:px-8 text-center">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-5 md:mb-6 tracking-tight">
                        Have an <span className="inline-block bg-[#FFD600] text-black px-3 py-1 rounded-lg transform -rotate-2">idea?</span>
                        <br />
                        Let's work together!
                    </h2>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                        <Link
                            href="/contact"
                            className="w-full sm:w-auto bg-white text-black px-6 py-2.5 rounded-full text-base font-semibold hover:scale-105 transition-transform duration-300 text-center"
                        >
                            View pricing
                        </Link>
                        <a
                            href="mailto:contact@vogolab.com"
                            className="text-sm sm:text-base font-medium flex items-center gap-2 hover:opacity-70 transition-opacity"
                        >
                            contact@vogolab.com
                            <div className="w-8 h-8 border border-white/30 rounded-full flex items-center justify-center">
                                <ArrowUpRight className="w-4 h-4" />
                            </div>
                        </a>
                    </div>
                </div>
            </section>

            {/* 2. Main Footer Content */}
            <section className="py-10 md:py-12">
                <div className="w-full px-4 md:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

                        {/* Links Columns */}
                        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6">
                            {/* Main Pages */}
                            <div>
                                <h4 className="font-bold mb-3 uppercase tracking-widest text-white/50 text-xs">Main pages</h4>
                                <ul className="space-y-2">
                                    <li><Link href="/" className="text-sm hover:text-[#FFD600] transition-colors">Home</Link></li>
                                    <li><Link href="/portfolio" className="text-sm hover:text-[#FFD600] transition-colors">Work</Link></li>
                                    <li><Link href="/services" className="text-sm hover:text-[#FFD600] transition-colors">Services</Link></li>
                                    <li><Link href="/about" className="text-sm hover:text-[#FFD600] transition-colors">About</Link></li>
                                    <li><Link href="/blog" className="text-sm hover:text-[#FFD600] transition-colors">Blog</Link></li>
                                </ul>
                            </div>

                            {/* Utility Pages */}
                            <div>
                                <h4 className="font-bold mb-3 uppercase tracking-widest text-white/50 text-xs">Utility pages</h4>
                                <ul className="space-y-2">
                                    <li><Link href="/404" className="text-sm hover:text-[#FFD600] transition-colors">404 not found</Link></li>
                                    <li><Link href="/privacy" className="text-sm hover:text-[#FFD600] transition-colors">Privacy Policy</Link></li>
                                    <li><Link href="/terms" className="text-sm hover:text-[#FFD600] transition-colors">Terms of Use</Link></li>
                                </ul>
                            </div>

                            {/* Extra */}
                            <div className="col-span-2 sm:col-span-1 sm:pt-6">
                                <ul className="space-y-2">
                                    <li><Link href="/contact" className="text-sm hover:text-[#FFD600] transition-colors">Contact</Link></li>
                                    <li><Link href="/lab" className="text-sm hover:text-[#FFD600] transition-colors">Lab</Link></li>
                                    <li className="text-white/30 text-sm italic">Coming soon</li>
                                </ul>
                            </div>
                        </div>

                        {/* Newsletter Card */}
                        <div className="lg:col-span-5">
                            <div className="relative border border-white/20 rounded-2xl p-5 sm:p-6 overflow-visible">
                                {/* Floating Email Icon */}
                                <div className="absolute -top-5 -right-2 sm:-top-6 sm:-right-3 w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center border-4 border-black shadow-2xl">
                                    <div className="relative">
                                        <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                                        <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#FFD600] rounded-full" />
                                    </div>
                                </div>

                                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 pr-10">Subscribe to our newsletter</h3>
                                <p className="text-white/60 text-xs mb-3 sm:mb-4 leading-relaxed">
                                    Stay updated with design tips, industry news, and exclusive offers from our team.
                                </p>

                                {/* Mobile: stacked layout, Desktop: inline pill */}
                                <form className="hidden sm:flex gap-2 p-1.5 bg-white rounded-full" onSubmit={(e) => e.preventDefault()}>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="flex-1 bg-transparent px-4 py-2 text-black focus:outline-none placeholder:text-black/40 text-sm"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-black text-white px-5 py-2 rounded-full font-semibold hover:scale-[1.02] transition-transform text-sm"
                                    >
                                        Subscribe
                                    </button>
                                </form>

                                {/* Mobile only: clean stacked form */}
                                <form className="flex sm:hidden flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full bg-white/10 border border-white/20 px-4 py-3 text-white rounded-xl focus:outline-none focus:border-white/40 placeholder:text-white/40 text-sm"
                                    />
                                    <button
                                        type="submit"
                                        className="w-full bg-white text-black px-5 py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors text-sm"
                                    >
                                        Subscribe
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Bottom Bar */}
            <section className="py-5 md:py-6 border-t border-white/10">
                <div className="w-full px-4 md:px-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
                        {/* Logo */}
                        <div className="text-lg sm:text-2xl font-bold tracking-tighter">
                            VOGOLAB.
                        </div>

                        {/* Copyright */}
                        <div className="text-white/40 text-[10px] sm:text-sm md:text-base font-medium text-center leading-tight">
                            © {currentYear} VOGOLAB. | Powered by Vogo
                        </div>
                    </div>
                </div>
            </section>
        </footer>
    )
}
