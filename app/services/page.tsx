"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Header from "@/components/Header"
import ModernFooter from "@/components/ModernFooter"
import ModernCTA from "@/components/ModernCTA"
import Link from "next/link"
import { Globe, Megaphone, Share2, Search, QrCode, Code, ArrowRight, Monitor, Instagram, Layers } from "lucide-react"

// Icon Mapping
const iconMap: any = {
    Globe: Globe,
    Monitor: Monitor,
    Megaphone: Megaphone,
    Instagram: Instagram,
    Share2: Share2,
    Search: Search,
    QrCode: QrCode,
    Code: Code,
    Layers: Layers
}

export default function ServicesIndexPage() {
    // Statik Hizmet Listesi
    const services = [
        {
            id: 1,
            title: "Web Tasarım & Geliştirme",
            slug: "web-tasarim",
            icon: "Monitor",
            desc: "Modern, hızlı ve SEO uyumlu web siteleri tasarlıyoruz. Kurumsal kimliğinizi dijital dünyaya en iyi şekilde yansıtın.",
            link: "/services/web-tasarim"
        },
        {
            id: 2,
            title: "E-Ticaret Çözümleri",
            slug: "e-ticaret",
            icon: "Globe",
            desc: "Satışlarınızı artıracak kullanıcı dostu e-ticaret siteleri. Güvenli ödeme altyapısı ve kolay yönetim paneli.",
            link: "/services/e-ticaret"
        },
        {
            id: 3,
            title: "SEO & Performans",
            slug: "seo",
            icon: "Search",
            desc: "Google'da üst sıralara çıkın. Teknik SEO, içerik optimizasyonu ve hız iyileştirmeleri ile organik trafiğinizi artırın.",
            link: "/services/seo"
        },
        {
            id: 4,
            title: "Sosyal Medya Yönetimi",
            slug: "sosyal-medya",
            icon: "Share2",
            desc: "Markanızın sosyal medyadaki sesi oluyoruz. İçerik üretimi, topluluk yönetimi ve etkileşim artırıcı stratejiler.",
            link: "/services/sosyal-medya"
        },
        {
            id: 5,
            title: "Dijital Reklam (Ads)",
            slug: "reklam-yonetimi",
            icon: "Megaphone",
            desc: "Google Ads, Meta (Facebook/Instagram) reklamları ile hedef kitlenize nokta atışı ulaşın. ROI odaklı kampanyalar.",
            link: "/services/reklam-yonetimi"
        },
        {
            id: 6,
            title: "QR Menü Sistemleri",
            slug: "qr-menu",
            icon: "QrCode",
            desc: "Restoran ve kafeler için temassız, hızlı ve yönetilebilir dijital menü çözümleri.",
            link: "/services/qr-menu"
        },
        {
            id: 7,
            title: "Özel Yazılım Çözümleri",
            slug: "ozel-yazilim",
            icon: "Code",
            desc: "İş süreçlerinizi optimize edecek, size özel web tabanlı yazılımlar, CRM ve ERP entegrasyonları.",
            link: "/services/ozel-yazilim"
        }
    ]

    return (
        <>
            <Header />
            <main className="bg-background min-h-screen pt-24 pb-20 overflow-hidden">

                {/* Hero */}
                <section className="container mx-auto px-4 md:px-8 max-w-7xl mb-16 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black text-foreground mb-6">
                        Tüm <span className="text-emerald-500">Çözümlerimiz</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted-foreground max-w-2xl mx-auto"
                    >
                        360 derece dijital ajans hizmetleriyle markanızı büyütüyoruz.
                    </motion.p>
                </section>

                {/* Services Grid */}
                <section className="container mx-auto px-4 md:px-8 max-w-7xl mb-24">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, idx) => {
                            const IconComponent = iconMap[service.icon] || Layers

                            // Light mode için el yazısı notlar
                            const handwrittenNotes = [
                                "Dönüşüm Odaklı!", "Hızlı Başla!", "Profesyonel!", "Güvenilir!",
                                "Harika Sonuç!", "Modern!", "SEO Dostu!", "Optimize!", "Etkili!"
                            ]

                            return (
                                <motion.div
                                    key={service.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Link href={service.link} className="block h-full">
                                        <div className="bg-card border border-border p-8 rounded-notebook card-light-shadow h-full hover:border-emerald-500/50 hover:bg-card/80 dark:hover:bg-slate-800/50 transition-all duration-300 group relative overflow-hidden">
                                            <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-emerald-500">
                                                <IconComponent className="w-7 h-7" />
                                            </div>

                                            <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-emerald-500 transition-colors">
                                                {service.title}
                                            </h3>
                                            <p className="text-muted-foreground mb-12 leading-relaxed">
                                                {service.desc}
                                            </p>

                                            {/* El yazısı not */}
                                            <span className="hidden dark:hidden absolute top-4 right-4 font-hand text-emerald-600 text-sm rotate-[-5deg] opacity-70">
                                                {handwrittenNotes[idx % handwrittenNotes.length]}
                                            </span>

                                            <div className="flex items-center gap-2 text-foreground font-semibold text-sm mt-auto absolute bottom-8 left-8">
                                                İncele <ArrowRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            )
                        })}
                    </div>
                </section>

                <ModernCTA />
            </main>
            <ModernFooter />
        </>
    )
}
