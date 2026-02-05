"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Code, Zap, Layers, MousePointer2 } from "lucide-react"
import { useRef } from "react"
import Link from "next/link"

function FloatingBadge({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
    return (
        <motion.div
            initial={{ y: 0 }}
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
            className={`absolute backdrop-blur-md bg-white/5 dark:bg-white/5 bg-secondary/30 border border-border rounded-2xl p-4 shadow-2xl ${className}`}
        >
            {children}
        </motion.div>
    )
}

function Spotlight({ className = "" }: { className?: string }) {
    return (
        <div className={`relative w-full h-full overflow-hidden ${className}`}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 rounded-[100%] blur-[100px] opacity-50 animate-pulse" />
            <div className="absolute top-0 left-1/3 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/20 rounded-[100%] blur-[80px] opacity-40 mix-blend-screen" />
        </div>
    )
}

export default function HeroModern() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollY } = useScroll()
    const y1 = useTransform(scrollY, [0, 500], [0, 200])
    const y2 = useTransform(scrollY, [0, 500], [0, -150])

    const handleScrollToServices = () => {
        const servicesSection = document.getElementById('services')
        if (servicesSection) {
            servicesSection.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <section ref={containerRef} className="relative min-h-[110vh] bg-background flex flex-col items-center pt-32 overflow-hidden transition-colors duration-300">
            {/* Background Grid - Daha subtle */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--muted-foreground)_1px,transparent_1px),linear-gradient(to_bottom,var(--muted-foreground)_1px,transparent_1px)] bg-[size:24px_24px] opacity-5 pointer-events-none" />

            {/* Spotlight Effect */}
            <div className="absolute inset-0 pointer-events-none">
                <Spotlight />
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 relative z-10 text-center">

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border backdrop-blur-sm mb-8 hover:bg-secondary/70 transition-colors cursor-default"
                >
                    <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-sm text-muted-foreground font-medium">Vogo Lab 2.0 Yayında</span>
                </motion.div>

                {/* Hero Title - Massive & Impactful */}
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-foreground mb-8 relative"
                >
                    <span className="block">Digital</span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-purple-400 pb-4">
                        Revolution
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
                >
                    Markanızı sıradanlıktan çıkarıp <span className="text-foreground font-semibold">dijital geleceğe</span> taşıyoruz.
                    Tasarım, Teknoloji ve Stratejinin mükemmel uyumu.
                </motion.p>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-6"
                >
                    <button
                        onClick={handleScrollToServices}
                        className="group relative px-8 py-4 bg-foreground text-background rounded-full font-bold text-lg hover:bg-primary hover:text-white transition-all duration-300 flex items-center gap-2"
                    >
                        Projelerimizi Keşfet
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        <div className="absolute inset-0 rounded-full bg-white/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
                    </button>

                    <Link href="/contact">
                        <button className="px-8 py-4 rounded-full border border-border text-foreground font-medium hover:bg-secondary/20 transition-colors">
                            Bizimle Tanışın
                        </button>
                    </Link>
                </motion.div>
            </div>

            {/* Floating Elements - Visual Interest */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Left Side Elements */}
                <motion.div style={{ y: y1 }} className="absolute top-1/4 left-[10%] hidden lg:block">
                    <FloatingBadge delay={0} className="rotate-[-6deg]">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-500/20 p-2 rounded-lg">
                                <Code className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <div className="h-2 w-20 bg-muted-foreground/20 rounded-full mb-1.5" />
                                <div className="h-2 w-12 bg-muted-foreground/10 rounded-full" />
                            </div>
                        </div>
                    </FloatingBadge>
                </motion.div>

                <motion.div style={{ y: y2 }} className="absolute bottom-1/4 left-[15%] hidden lg:block">
                    <FloatingBadge delay={1.5} className="rotate-[12deg]">
                        <div className="flex items-center gap-3">
                            <div className="bg-purple-500/20 p-2 rounded-lg">
                                <Layers className="w-6 h-6 text-purple-400" />
                            </div>
                            <span className="text-foreground/80 font-mono text-sm">Design_System.fig</span>
                        </div>
                    </FloatingBadge>
                </motion.div>

                {/* Right Side Elements */}
                <motion.div style={{ y: y2 }} className="absolute top-1/3 right-[10%] hidden lg:block">
                    <FloatingBadge delay={0.5} className="rotate-[6deg]">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-500/20 p-2 rounded-lg">
                                <Zap className="w-6 h-6 text-orange-400" />
                            </div>
                            <div className="text-left">
                                <div className="text-xs text-muted-foreground">Performance</div>
                                <div className="text-lg font-bold text-foreground">99/100</div>
                            </div>
                        </div>
                    </FloatingBadge>
                </motion.div>

                <motion.div style={{ y: y1 }} className="absolute bottom-1/3 right-[15%] hidden lg:block">
                    <FloatingBadge delay={2} className="rotate-[-12deg]">
                        <div className="flex items-center gap-3">
                            <div className="bg-emerald-500/20 p-2 rounded-lg">
                                <MousePointer2 className="w-6 h-6 text-emerald-400" />
                            </div>
                            <span className="text-foreground/80 font-medium text-sm">Conversion Rate</span>
                        </div>
                    </FloatingBadge>
                </motion.div>
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-20 pointer-events-none" />
        </section>
    )
}
