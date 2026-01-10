"use client"

import { useState, useEffect } from "react"
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
    const [services, setServices] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/services')
            .then(res => res.json())
            .then(data => {
                setServices(data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    if (loading) {
        return (
            <div className="bg-background min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

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
                            const IconComponent = iconMap[service.icon] || Layers // Fallback icon

                            // Light mode için el yazısı notlar
                            const handwrittenNotes = [
                                "Dönüşüm Odaklı!",
                                "Hızlı Başla!",
                                "Profesyonel!",
                                "Güvenilir!",
                                "Harika Sonuç!",
                                "Modern!",
                                "SEO Dostu!",
                                "Optimize!",
                                "Etkili!"
                            ]

                            return (
                                <motion.div
                                    key={service.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Link href={`/services/${service.slug || service.id}`} className="block h-full">
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

                                            {/* El yazısı not (sadece light mode'da görünür) */}
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
