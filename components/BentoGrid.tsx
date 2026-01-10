"use client"

import { motion } from "framer-motion"
import { Sparkles, Rocket, Target, Zap, Shield, TrendingUp, ArrowRight } from "lucide-react"

const bentoItems = [
    {
        title: "Yenilikçi Tasarım",
        description: "Modern ve kullanıcı dostu arayüzler ile markanızı öne çıkarıyoruz",
        icon: Sparkles,
        gradient: "from-emerald-400 via-teal-400 to-cyan-400",
        bgGradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
        stat: "100+",
        statLabel: "Başarılı Proje",
        size: "large"
    },
    {
        title: "Hızlı Teslimat",
        description: "48 saat içinde projenize başlıyoruz",
        icon: Rocket,
        gradient: "from-blue-400 via-cyan-400 to-teal-400",
        bgGradient: "from-blue-500/10 via-cyan-500/5 to-transparent",
        stat: "48h",
        statLabel: "Hızlı Start",
        size: "small"
    },
    {
        title: "SEO Uyumlu",
        description: "Arama motorlarında 1. sayfada yerinizi alın",
        icon: TrendingUp,
        gradient: "from-violet-400 via-purple-400 to-fuchsia-400",
        bgGradient: "from-violet-500/10 via-purple-500/5 to-transparent",
        stat: "#1",
        statLabel: "Google Sıralaması",
        size: "small"
    },
    {
        title: "Yüksek Performans",
        description: "Lightning-fast yükleme süreleri",
        icon: Zap,
        gradient: "from-yellow-400 via-orange-400 to-red-400",
        bgGradient: "from-yellow-500/10 via-orange-500/5 to-transparent",
        stat: "99.9%",
        statLabel: "Uptime Garantisi",
        size: "medium"
    },
    {
        title: "Güvenli Altyapı",
        description: "Enterprise-level güvenlik standartları",
        icon: Shield,
        gradient: "from-rose-400 via-pink-400 to-fuchsia-400",
        bgGradient: "from-rose-500/10 via-pink-500/5 to-transparent",
        stat: "256-bit",
        statLabel: "SSL Şifreleme",
        size: "medium"
    },
    {
        title: "Hedef Odaklı",
        description: "Sonuç odaklı stratejiler ile ROI maksimizasyonu",
        icon: Target,
        gradient: "from-emerald-400 via-green-400 to-teal-400",
        bgGradient: "from-emerald-500/10 via-green-500/5 to-transparent",
        stat: "95%",
        statLabel: "Müşteri Memnuniyeti",
        size: "large"
    },
]

export default function BentoGrid() {
    return (
        <section className="py-32 md:py-40 bg-background relative overflow-hidden transition-colors duration-300">
            {/* Animated Grid Background */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(var(--muted-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--muted-foreground) 1px, transparent 1px)',
                    backgroundSize: '50px 50px',
                    opacity: 0.1
                }} />
            </div>

            {/* Gradient Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50"
                    animate={{
                        x: [0, 100, 0],
                        y: [0, 50, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-1/4 -right-48 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-50"
                    animate={{
                        x: [0, -100, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.3, 1],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
                {/* Centered Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-3xl mx-auto mb-20"
                >
                    <motion.div
                        initial={{ scale: 0.9 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6"
                    >
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm text-primary font-medium">Neden Bizi Seçmelisiniz?</span>
                    </motion.div>

                    <h2 className="text-5xl md:text-7xl font-bold mb-6">
                        <span className="text-foreground">Neden </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-teal-400 to-cyan-400">
                            Vogo?
                        </span>
                    </h2>

                    <p className="text-xl text-muted-foreground leading-relaxed">
                        Dijital dünyada başarılı olmanız için gereken tüm araçlar ve uzmanlık,
                        <span className="text-primary font-semibold"> tek bir çatı altında</span>
                    </p>
                </motion.div>

                {/* Asymmetric Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[280px]">
                    {bentoItems.map((item, index) => {
                        const colSpan = item.size === 'large' ? 'lg:col-span-2' :
                            item.size === 'medium' ? 'md:col-span-1' :
                                'md:col-span-1'
                        const rowSpan = item.size === 'large' ? 'row-span-1' : 'row-span-1'

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                    type: "spring",
                                    stiffness: 100
                                }}
                                whileHover={{
                                    scale: 1.02,
                                    y: -8,
                                    transition: { duration: 0.2 }
                                }}
                                className={`${colSpan} ${rowSpan} group relative rounded-3xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 overflow-hidden cursor-pointer shadow-sm`}
                            >
                                {/* Gradient Background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                {/* Animated Mesh Gradient */}
                                <motion.div
                                    className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} opacity-50`}
                                    animate={{
                                        backgroundPosition: ["0% 0%", "100% 100%"],
                                    }}
                                    transition={{
                                        duration: 8,
                                        repeat: Infinity,
                                        repeatType: "reverse"
                                    }}
                                    style={{ backgroundSize: "200% 200%" }}
                                />

                                {/* Content */}
                                <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                                    <div className="space-y-4">
                                        {/* Icon */}
                                        <motion.div
                                            whileHover={{ rotate: 360, scale: 1.1 }}
                                            transition={{ duration: 0.6 }}
                                            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} p-0.5`}
                                        >
                                            <div className="w-full h-full bg-card rounded-2xl flex items-center justify-center">
                                                <item.icon className="w-7 h-7 text-foreground" />
                                            </div>
                                        </motion.div>

                                        {/* Title & Description */}
                                        <div>
                                            <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-teal-400 transition-all">
                                                {item.title}
                                            </h3>
                                            <p className="text-muted-foreground text-sm leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Stats & CTA */}
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <div className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${item.gradient}`}>
                                                {item.stat}
                                            </div>
                                            <div className="text-xs text-muted-foreground font-medium">
                                                {item.statLabel}
                                            </div>
                                        </div>

                                        <motion.div
                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                            whileHover={{ x: 5 }}
                                        >
                                            <ArrowRight className="w-6 h-6 text-primary" />
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Shine Effect */}
                                <motion.div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100"
                                    initial={false}
                                    whileHover={{
                                        background: [
                                            "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
                                        ],
                                        backgroundPosition: ["200% 0", "-200% 0"],
                                    }}
                                    transition={{ duration: 1.5 }}
                                    style={{ backgroundSize: "200% 100%" }}
                                />
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
