"use client"

import { motion } from "framer-motion"
import { Twitter, Linkedin, Instagram, ArrowUp, Facebook, Youtube } from "lucide-react"
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

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const currentYear = new Date().getFullYear()

    const socialLinks = [
        { icon: Twitter, href: settings?.twitter, key: "twitter" },
        { icon: Linkedin, href: settings?.linkedin, key: "linkedin" },
        { icon: Instagram, href: settings?.instagram, key: "instagram" },
        { icon: Facebook, href: settings?.facebook, key: "facebook" },
        { icon: Youtube, href: settings?.youtube, key: "youtube" },
    ].filter(social => social.href && social.href !== "" && social.href !== "#")

    return (
        <footer className="relative bg-card border-t border-border transition-colors duration-300">
            <div className="container mx-auto px-4 md:px-8 max-w-7xl py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="text-2xl font-bold">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
                                {settings?.siteTitle ? settings.siteTitle : 'Vogo Lab'}
                            </span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            {settings?.siteDescription || 'Dijital dünyada fark yaratan, sonuç odaklı çözümler üreten yaratıcı ajans.'}
                        </p>
                        {socialLinks.length > 0 && (
                            <div className="flex gap-3">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.key}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center hover:bg-gradient-to-br hover:from-emerald-500 hover:to-teal-500 hover:border-transparent transition-all duration-300 group shadow-sm"
                                    >
                                        <social.icon className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
                                    </a>
                                ))}
                            </div>
                        )}

                        {/* Address & Contact (Extra Info if desired) */}
                        {settings?.address && (
                            <p className="text-xs text-muted-foreground mt-4 opacity-80 max-w-[200px]">
                                {settings.address}
                            </p>
                        )}
                    </div>

                    {/* Hizmetler */}
                    <div>
                        <h3 className="text-foreground font-semibold mb-6 text-lg">Hizmetler</h3>
                        <ul className="space-y-3">
                            {[
                                { name: "Web Tasarım", url: "/services/web-tasarim" },
                                { name: "SEO", url: "/services/seo" },
                                { name: "Reklam Yönetimi", url: "/services/reklam-yonetimi" },
                                { name: "QR Menü", url: "/services/qr-menu" },
                                { name: "Özel Yazılım", url: "/services/ozel-yazilim" }
                            ].map((link, i) => (
                                <li key={i}>
                                    <Link href={link.url} className="text-muted-foreground hover:text-emerald-500 transition-colors inline-flex items-center gap-2 group">
                                        <span className="w-1 h-1 rounded-full bg-muted-foreground group-hover:bg-emerald-500 transition-colors" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Kurumsal */}
                    <div>
                        <h3 className="text-foreground font-semibold mb-6 text-lg">Kurumsal</h3>
                        <ul className="space-y-3">
                            {[
                                { name: "Hakkımızda", url: "/about" },
                                { name: "Referanslar", url: "/#references" },
                                { name: "Blog", url: "/blog" },
                                { name: "İletişim", url: "/contact" }
                            ].map((link, i) => (
                                <li key={i}>
                                    <Link href={link.url} className="text-muted-foreground hover:text-emerald-500 transition-colors inline-flex items-center gap-2 group">
                                        <span className="w-1 h-1 rounded-full bg-muted-foreground group-hover:bg-emerald-500 transition-colors" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-foreground font-semibold mb-6 text-lg">Bülten</h3>
                        <p className="text-muted-foreground text-sm mb-4">
                            Dijital dünyadan haberler ve ipuçları için abone olun.
                        </p>
                        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="E-posta adresiniz"
                                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                            />
                            <button
                                type="submit"
                                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-md shadow-emerald-500/20"
                            >
                                Abone Ol
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-muted-foreground text-sm text-center md:text-left">
                        &copy; {currentYear} {settings?.siteTitle || 'Vogo Lab'}. Tüm hakları saklıdır.
                    </p>
                    <div className="flex items-center gap-6 text-sm">
                        <Link href="/privacy" className="text-muted-foreground hover:text-emerald-500 transition-colors">
                            Gizlilik Politikası
                        </Link>
                        <Link href="/terms" className="text-muted-foreground hover:text-emerald-500 transition-colors">
                            Kullanım Koşulları
                        </Link>
                    </div>
                </div>
            </div>

            {/* Scroll to Top Button */}
            <motion.button
                onClick={scrollToTop}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1 }}
                className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/50 hover:shadow-emerald-500/70 transition-all duration-300 z-50 text-white"
            >
                <ArrowUp className="w-5 h-5" />
            </motion.button>
        </footer>
    )
}
