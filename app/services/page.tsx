"use client"

import { motion } from "framer-motion"
import Header from "@/components/Header"
import ModernFooter from "@/components/ModernFooter"
import ModernCTA from "@/components/ModernCTA"
import Link from "next/link"
import { Globe, Megaphone, Share2, Search, QrCode, Code, ArrowUpRight, Monitor, Layers } from "lucide-react"

// Color & Icon Mapping for the new design
const serviceMeta: any = {
    "web-tasarim": { color: "bg-[#FFBC11]", icon: Monitor },
    "e-ticaret": { color: "bg-[#4F46E5]", icon: Globe },
    "seo": { color: "bg-[#FF6B35]", icon: Search },
    "sosyal-medya": { color: "bg-[#4F46E5]", icon: Share2 },
    "reklam-yonetimi": { color: "bg-[#FF6B35]", icon: Megaphone },
    "qr-menu": { color: "bg-[#FFBC11]", icon: QrCode },
    "ozel-yazilim": { color: "bg-[#4F46E5]", icon: Code },
}

export default function ServicesIndexPage() {
    const services = [
        {
            id: 1,
            title: "Web Tasarım & Geliştirme",
            slug: "web-tasarim",
            desc: "Modern, hızlı ve SEO uyumlu web siteleri tasarlıyoruz. Kurumsal kimliğinizi dijital dünyaya en iyi şekilde yansıtın.",
            link: "/services/web-tasarim"
        },
        {
            id: 2,
            title: "E-Ticaret Çözümleri",
            slug: "e-ticaret",
            desc: "Satışlarınızı artıracak kullanıcı dostu e-ticaret siteleri. Güvenli ödeme altyapısı ve kolay yönetim paneli.",
            link: "/services/e-ticaret"
        },
        {
            id: 3,
            title: "SEO & Performans",
            slug: "seo",
            desc: "Google'da üst sıralara çıkın. Teknik SEO, içerik optimizasyonu ve hız iyileştirmeleri ile organik trafiğinizi artırın.",
            link: "/services/seo"
        },
        {
            id: 4,
            title: "Sosyal Medya Yönetimi",
            slug: "sosyal-medya",
            desc: "Markanızın sosyal medyadaki sesi oluyoruz. İçerik üretimi, topluluk yönetimi ve etkileşim artırıcı stratejiler.",
            link: "/services/sosyal-medya"
        },
        {
            id: 5,
            title: "Dijital Reklam (Ads)",
            slug: "reklam-yonetimi",
            desc: "Google Ads, Meta reklamları ile hedef kitlenize nokta atışı ulaşın. ROI odaklı kampanyalar.",
            link: "/services/reklam-yonetimi"
        },
        {
            id: 6,
            title: "QR Menü Sistemleri",
            slug: "qr-menu",
            desc: "Restoran ve kafeler için temassız, hızlı ve yönetilebilir dijital menü çözümleri.",
            link: "/services/qr-menu"
        },
        {
            id: 7,
            title: "Özel Yazılım Çözümleri",
            slug: "ozel-yazilim",
            desc: "İş süreçlerinizi optimize edecek, size özel web tabanlı yazılımlar, CRM ve ERP entegrasyonları.",
            link: "/services/ozel-yazilim"
        }
    ]

    return (
        <>
            <Header />
            <main className="bg-[#F9F9F9] min-h-screen pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 text-black font-sans">

                {/* Hero Section */}
                <section className="container mx-auto px-4 md:px-6 mb-12 sm:mb-16 md:mb-24">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8">
                        <div className="max-w-3xl">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
                                We offer a wide range <br className="hidden sm:block" /> of
                                <span className="relative inline-block mx-2 sm:mx-4">
                                    <span className="relative z-10 text-white px-3 sm:px-6">design</span>
                                    <div className="absolute inset-0 bg-[#FFD600] -rotate-2 rounded-lg sm:rounded-xl z-0 scale-110"></div>
                                </span>
                                services
                            </h1>
                        </div>
                        <div className="max-w-sm">
                            <p className="text-gray-600 text-base sm:text-lg md:text-xl font-medium leading-relaxed">
                                From branding and web design to mobile apps and marketing materials, discover our comprehensive suite of creative solutions tailored for you.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Services List */}
                <section className="container mx-auto px-4 md:px-6">
                    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 md:space-y-12">
                        {services.map((service, idx) => {
                            const meta = serviceMeta[service.slug] || { color: "bg-gray-200", icon: Layers }
                            const Icon = meta.icon
                            const number = (idx + 1).toString().padStart(2, '0')

                            return (
                                <div key={service.id} className="group">
                                    <Link href={service.link}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 py-6 sm:py-8 md:py-12 group-hover:bg-white/50 rounded-xl sm:rounded-2xl md:rounded-3xl transition-all duration-500 px-3 sm:px-0"
                                        >
                                            {/* Number */}
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-lg shrink-0">
                                                {number}
                                            </div>

                                            {/* Illustration Box */}
                                            <div className={`${meta.color} w-full sm:w-[280px] md:w-[350px] lg:w-[400px] h-[160px] sm:h-[180px] md:h-[220px] rounded-2xl sm:rounded-[2.5rem] flex items-center justify-center relative overflow-hidden shrink-0 shadow-lg group-hover:scale-[1.02] transition-transform duration-500`}>
                                                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_20%,_rgba(255,255,255,0.8)_0%,_transparent_50%)]"></div>
                                                <div className="relative z-10 p-4 sm:p-6 md:p-8 transform group-hover:scale-110 transition-transform duration-500 text-white drop-shadow-2xl">
                                                    <Icon size={60} strokeWidth={1.5} className="sm:w-20 sm:h-20 md:w-[100px] md:h-[100px] lg:w-[120px] lg:h-[120px]" />
                                                </div>
                                            </div>

                                            {/* Text Content */}
                                            <div className="flex-1 space-y-2 sm:space-y-3 md:space-y-4 text-center sm:text-left">
                                                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight group-hover:text-[#4F46E5] transition-colors">
                                                    {service.title}
                                                </h3>
                                                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 leading-relaxed max-w-2xl font-medium">
                                                    {service.desc}
                                                </p>
                                            </div>

                                            {/* Arrow Action */}
                                            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-2 border-gray-200 flex items-center justify-center group-hover:bg-black group-hover:border-black group-hover:text-white transition-all duration-300 shrink-0">
                                                <ArrowUpRight size={20} className="sm:w-6 sm:h-6 md:w-7 md:h-7" />
                                            </div>
                                        </motion.div>
                                    </Link>
                                    {/* Separator */}
                                    {idx !== services.length - 1 && (
                                        <div className="h-[2px] bg-gray-200 w-full"></div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </section>

                <div className="mt-16 sm:mt-24 md:mt-32">
                    <ModernCTA />
                </div>
            </main>
            <ModernFooter />
        </>
    )
}
