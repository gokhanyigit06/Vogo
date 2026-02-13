"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { Code, Search, Megaphone, QrCode, Settings, Instagram, Sparkles, ArrowRight, Check } from "lucide-react"
import Link from "next/link"

const services = [
    {
        id: 1,
        title: "Web Çözümleri",
        slug: "web-cozumleri",
        icon: Code,
        gradient: "from-blue-500 via-cyan-500 to-teal-500",
        bgColor: "bg-blue-500/20",
        description: "Modern, hızlı ve responsive web siteleri. Next.js, React ve en güncel teknolojilerle geliştiriyoruz.",
        highlights: [
            "Lightning-fast performance",
            "Mobile-first responsive design",
            "SEO optimized architecture",
            "Modern UI/UX principles"
        ],
        image: "/services/web-development.png",
        stats: { value: "50+", label: "Web Projects" }
    },
    {
        id: 2,
        title: "SEO Optimizasyonu",
        slug: "seo-optimizasyonu",
        icon: Search,
        gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
        bgColor: "bg-violet-500/20",
        description: "Arama motorlarında üst sıralara çıkmanızı sağlayacak kapsamlı SEO stratejileri.",
        highlights: [
            "Keyword research & analysis",
            "Technical SEO optimization",
            "Content strategy & creation",
            "Link building campaigns"
        ],
        image: "/services/seo.png",
        stats: { value: "#1", label: "Top Rankings" }
    },
    {
        id: 3,
        title: "Dijital Reklam",
        slug: "dijital-reklam",
        icon: Megaphone,
        gradient: "from-orange-500 via-red-500 to-pink-500",
        bgColor: "bg-orange-500/20",
        description: "Google Ads ve Meta reklamlarıyla hedef kitlenize etkili bir şekilde ulaşın.",
        highlights: [
            "Google Ads management",
            "Meta advertising campaigns",
            "ROI-focused optimization",
            "Performance tracking & analytics"
        ],
        image: "/services/digital-marketing.png",
        stats: { value: "3x", label: "ROI Increase" }
    },
    {
        id: 4,
        title: "Sosyal Medya Yönetimi",
        slug: "sosyal-medya-yonetimi",
        icon: Instagram,
        gradient: "from-pink-500 via-rose-500 to-red-500",
        bgColor: "bg-pink-500/20",
        description: "Sosyal medya hesaplarınızı profesyonelce yönetir, içerik üretir ve topluluk oluştururuz.",
        highlights: [
            "Content creation & curation",
            "Community engagement",
            "Analytics & insights",
            "Growth strategy planning"
        ],
        image: "/services/mobile-app.png",
        stats: { value: "10x", label: "Engagement Boost" }
    },
    {
        id: 5,
        title: "QR Menü Sistemleri",
        slug: "qr-menu-sistemleri",
        icon: QrCode,
        gradient: "from-emerald-500 via-green-500 to-teal-500",
        bgColor: "bg-emerald-500/20",
        description: "Restoranlar için AI destekli, temassız ve kullanıcı dostu QR menü çözümleri.",
        highlights: [
            "Contactless menu experience",
            "Multi-language support",
            "Real-time menu updates",
            "AI-powered recommendations"
        ],
        image: "/services/branding.png",
        stats: { value: "100+", label: "Restaurants" }
    },
    {
        id: 6,
        title: "Özel Yazılım",
        slug: "ozel-yazilim",
        icon: Settings,
        gradient: "from-yellow-500 via-amber-500 to-orange-500",
        bgColor: "bg-yellow-500/20",
        description: "İşletmenizin özel ihtiyaçlarına yönelik butik yazılım çözümleri geliştiriyoruz.",
        highlights: [
            "Custom software development",
            "API integration & automation",
            "Mobile app development",
            "Enterprise solutions"
        ],
        image: "/services/software-development.png",
        stats: { value: "∞", label: "Custom Solutions" }
    },
]

export default function ServicesAccordion() {
    const [activeService, setActiveService] = useState(0)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    // Auto-rotate services
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveService((prev) => (prev + 1) % services.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setMousePosition({
            x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
            y: ((e.clientY - rect.top) / rect.height - 0.5) * 20
        })
    }

    const currentService = services[activeService]

    return (
        <section id="services" className="py-16 sm:py-24 md:py-32 lg:py-40 bg-background relative overflow-hidden transition-colors duration-300">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-background via-background to-background" />
                <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${currentService.gradient} opacity-5`}
                    key={activeService}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.05 }}
                    transition={{ duration: 1 }}
                />
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.05]">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(var(--muted-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--muted-foreground) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }} />
            </div>

            <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 md:mb-20 px-2"
                >
                    <motion.div
                        initial={{ scale: 0.9 }}
                        whileInView={{ scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6"
                    >
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-purple-400 font-medium">Premium Hizmetler</span>
                    </motion.div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6">
                        <span className="text-foreground">Dijital </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400">
                            Çözümlerimiz
                        </span>
                    </h2>

                    <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
                        İşletmenizi dijital dünyada büyütmek için
                        <span className="text-primary font-semibold"> tam entegre çözümler</span>
                    </p>
                </motion.div>

                {/* Split View Layout */}
                <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] lg:grid-cols-[380px_1fr] gap-6 md:gap-8 lg:gap-12 items-start">
                    {/* Left: Service Navigation */}
                    <div className="space-y-3">
                        {services.map((service, index) => (
                            <motion.button
                                key={service.id}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => setActiveService(index)}
                                onMouseEnter={() => setActiveService(index)}
                                className={`w-full text-left group relative overflow-hidden rounded-2xl transition-all duration-500 ${activeService === index
                                    ? 'bg-card border-2 border-primary/50'
                                    : 'bg-card/50 border-2 border-border hover:border-primary/30'
                                    }`}
                            >
                                {/* Active Indicator */}
                                <AnimatePresence>
                                    {activeService === index && (
                                        <motion.div
                                            layoutId="activeService"
                                            className={`absolute inset-0 bg-gradient-to-r ${service.gradient} opacity-10`}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 0.1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    )}
                                </AnimatePresence>

                                <div className="relative p-4 sm:p-5 md:p-6 flex items-center gap-3 sm:gap-4">
                                    {/* Icon */}
                                    <motion.div
                                        animate={{
                                            scale: activeService === index ? 1.1 : 1,
                                            rotate: activeService === index ? 360 : 0
                                        }}
                                        transition={{ duration: 0.5 }}
                                        className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${service.gradient} p-0.5 shrink-0`}
                                    >
                                        <div className="w-full h-full bg-card rounded-xl flex items-center justify-center">
                                            <service.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-foreground" />
                                        </div>
                                    </motion.div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className={`text-base sm:text-lg font-bold mb-1 transition-all duration-300 ${activeService === index
                                            ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400'
                                            : 'text-foreground group-hover:text-primary'
                                            }`}>
                                            {service.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground truncate">
                                            {service.stats.value} {service.stats.label}
                                        </p>
                                    </div>

                                    {/* Arrow */}
                                    <motion.div
                                        animate={{
                                            x: activeService === index ? 0 : -10,
                                            opacity: activeService === index ? 1 : 0
                                        }}
                                        className="shrink-0"
                                    >
                                        <ArrowRight className="w-5 h-5 text-primary" />
                                    </motion.div>
                                </div>

                                {/* Progress Bar */}
                                {activeService === index && (
                                    <motion.div
                                        className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${service.gradient}`}
                                        initial={{ width: '0%' }}
                                        animate={{ width: '100%' }}
                                        transition={{ duration: 5, ease: 'linear' }}
                                    />
                                )}
                            </motion.button>
                        ))}
                    </div>

                    {/* Right: Active Service Showcase */}
                    <div className="md:sticky md:top-24 space-y-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeService}
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="space-y-6"
                            >
                                {/* Main Image Showcase with 3D Tilt */}
                                <motion.div
                                    onMouseMove={handleMouseMove}
                                    onMouseLeave={() => setMousePosition({ x: 0, y: 0 })}
                                    className="relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[16/10] bg-card"
                                    style={{
                                        transform: `perspective(1000px) rotateY(${mousePosition.x}deg) rotateX(${-mousePosition.y}deg)`,
                                        transition: 'transform 0.1s ease-out'
                                    }}
                                >
                                    {/* Image */}
                                    <img
                                        src={currentService.image}
                                        alt={currentService.title}
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Gradient Overlays */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${currentService.gradient} opacity-30`} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

                                    {/* Floating Stats Badge */}
                                    <motion.div
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ delay: 0.3, type: "spring" }}
                                        className="absolute top-3 right-3 sm:top-6 sm:right-6"
                                    >
                                        <div className={`px-4 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-br ${currentService.gradient} backdrop-blur-sm shadow-2xl`}>
                                            <div className="text-xl sm:text-3xl font-bold text-white mb-1">
                                                {currentService.stats.value}
                                            </div>
                                            <div className="text-xs text-white/80">
                                                {currentService.stats.label}
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Bottom Content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 sm:mb-3">
                                                {currentService.title}
                                            </h3>
                                            <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
                                                {currentService.description}
                                            </p>
                                        </motion.div>
                                    </div>
                                </motion.div>

                                {/* Highlights Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    {currentService.highlights.map((highlight, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 + index * 0.1 }}
                                            className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-card/50 border border-border hover:border-primary/30 transition-colors group"
                                        >
                                            <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${currentService.gradient} flex items-center justify-center shrink-0 mt-0.5`}>
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                            <p className="text-muted-foreground text-sm group-hover:text-foreground transition-colors">
                                                {highlight}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* CTA Button */}
                                <Link href={`/services/${currentService.slug}`} className="block w-full">
                                    <motion.button
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`w-full py-4 sm:py-5 rounded-xl sm:rounded-2xl bg-gradient-to-r ${currentService.gradient} text-white font-semibold text-base sm:text-lg flex items-center justify-center gap-2 hover:shadow-2xl hover:shadow-primary/30 transition-shadow`}
                                    >
                                        <span>Detaylı Bilgi Al</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </motion.button>
                                </Link>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    )
}
