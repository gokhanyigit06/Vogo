"use client"

import Link from "next/link"
import { ArrowUpRight, Globe, Layout, Type, Image, ExternalLink, Layers, Code, ListChecks, Briefcase, MessageSquare, FileText, Users, MapPin } from "lucide-react"
import { motion } from "framer-motion"

const sections = [
    {
        title: "Hero",
        description: "Ana sayfa hero bölümü: başlık metinleri ve sağdaki görsel / video.",
        href: "/admin/web/hero",
        icon: Layers,
        color: "bg-[#111]",
        textColor: "text-white",
    },
    {
        title: "Work",
        description: "Portfolio projelerini yönet, ekle, düzenle, sırala.",
        href: "/admin/web/work",
        icon: Image,
        color: "bg-black",
        textColor: "text-white",
    },
    {
        title: "Header",
        description: "Logo, navigasyon linkleri ve CTA butonunu düzenle.",
        href: "/admin/web/header",
        icon: Layout,
        color: "bg-[#4D45FF]",
        textColor: "text-white",
    },
    {
        title: "Footer",
        description: "Alt bilgi, sosyal medya linkleri ve tagline.",
        href: "/admin/web/footer",
        icon: Type,
        color: "bg-[#FF7324]",
        textColor: "text-white",
    },
    {
        title: "Technologies",
        description: "Teknolojiler bölümündeki sekmeleri ve markaları düzenle.",
        href: "/admin/web/technologies",
        icon: Code,
        color: "bg-[#00C48C]",
        textColor: "text-white",
    },
    {
        title: "Services",
        description: "Anasayfadaki hizmetler akordeonunu ve içeriklerini düzenle.",
        href: "/admin/web/services",
        icon: ListChecks,
        color: "bg-[#FF3366]",
        textColor: "text-white",
    },
    {
        title: "How We Work",
        description: "Anasayfadaki çalışma adımları (3'lü kart) içeriklerini düzenle.",
        href: "/admin/web/how-we-work",
        icon: Briefcase,
        color: "bg-[#7B2CBF]",
        textColor: "text-white",
    },
    {
        title: "Testimonials",
        description: "Müşteri yorumlarını (Our Clients Say) ve görsellerini düzenle.",
        href: "/admin/web/testimonials",
        icon: MessageSquare,
        color: "bg-[#F4A261]",
        textColor: "text-white",
    },
    {
        title: "Services Page",
        description: "'Our Expertise' detay sayfasındaki tam hizmet listelerini ve kutuları yönet.",
        href: "/admin/web/services-page",
        icon: FileText,
        color: "bg-[#2A9D8F]",
        textColor: "text-white",
    },
    {
        title: "About Page",
        description: "Hakkımızda sayfasındaki başlıkları, hizmet adımlarını ve bilgi kutularını yönet.",
        href: "/admin/web/about-page",
        icon: Users,
        color: "bg-[#E76F51]",
        textColor: "text-white",
    },
    {
        title: "Contact Page",
        description: "İletişim sayfasındaki adres, sosyal medya linkleri ve SSS bölümünü yönet.",
        href: "/admin/web/contact-page",
        icon: MapPin,
        color: "bg-[#F4A261]",
        textColor: "text-white",
    },
]

export default function WebPanelPage() {
    return (
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 md:py-24">

            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="mb-16 md:mb-24"
            >
                <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-black/40 mb-6">
                    WEB PANEL
                </p>
                <h1 className="text-[3rem] sm:text-[4rem] md:text-[6rem] lg:text-[7rem] leading-[0.88] tracking-[-0.04em] font-medium text-black mb-8">
                    Web Sitesi<br />Yönetimi
                </h1>
                <p className="text-black/50 text-lg md:text-xl max-w-xl leading-relaxed">
                    Sitenin görünen yüzünü buradan düzenle. Projeler, header, footer ve daha fazlası.
                </p>
            </motion.div>

            {/* Quick Link - View site */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-12"
            >
                <Link
                    href="/"
                    target="_blank"
                    className="inline-flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-black/40 hover:text-black transition-colors group"
                >
                    <Globe className="w-4 h-4" />
                    Siteyi Görüntüle
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
            </motion.div>

            {/* Section Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
                {sections.map((section, i) => (
                    <motion.div
                        key={section.href}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Link
                            href={section.href}
                            className={`group block rounded-3xl p-8 md:p-10 ${section.color} ${section.textColor} hover:scale-[1.02] transition-transform duration-300 h-full relative overflow-hidden`}
                        >
                            <div className="flex justify-between items-start mb-12">
                                <div className="p-3 bg-white/15 rounded-2xl">
                                    <section.icon className="w-6 h-6" />
                                </div>
                                <ArrowUpRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">{section.title}</h2>
                            <p className="opacity-60 text-sm leading-relaxed">{section.description}</p>

                            {/* Decorative circle */}
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Bottom divider */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="border-t border-black/10 pt-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
            >
                <p className="text-black/40 text-sm">Bu panel sadece sitenin dış görünümünü yönetir.</p>
                <Link href="/admin" className="text-sm font-bold text-black/60 hover:text-black transition-colors flex items-center gap-1.5">
                    Operasyon Paneline Geç
                    <ArrowUpRight className="w-4 h-4" />
                </Link>
            </motion.div>
        </div>
    )
}
