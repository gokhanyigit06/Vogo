"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { Sparkles } from "lucide-react"

export default function HeroNew() {
    const rotatingTexts = [
        "İzinizi Bırakın",
        "Markanızı Büyütün",
        "Fark Yaratın",
        "Öne Çıkın"
    ]

    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % rotatingTexts.length)
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Video Background Placeholder - Gerçek videoda src eklenecek */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 opacity-90" />
                {/* Video yerine gradient arka plan - Gerçek projede video eklenecek */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920')] bg-cover bg-center opacity-20" />
            </div>

            {/* Floating Elements */}
            <div className="absolute inset-0 z-[1] pointer-events-none">
                {[...Array(20)].map((_, i) => {
                    const randomX = Math.random() * 100
                    const randomY = Math.random() * 100
                    const randomTargetX = Math.random() * 100
                    const randomTargetY = Math.random() * 100

                    return (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-emerald-400/30 rounded-full"
                            style={{
                                left: `${randomX}%`,
                                top: `${randomY}%`
                            }}
                            animate={{
                                left: [`${randomX}%`, `${randomTargetX}%`],
                                top: [`${randomY}%`, `${randomTargetY}%`],
                                scale: [1, 1.5, 1],
                                opacity: [0.3, 0.8, 0.3]
                            }}
                            transition={{
                                duration: Math.random() * 10 + 10,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        />
                    )
                })}
            </div>

            <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10 py-20">
                <div className="max-w-5xl mx-auto text-center space-y-10 min-h-[calc(100vh-10rem)] flex flex-col justify-center">
                    {/* Ana Başlık */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 1,
                            ease: [0.22, 1, 0.36, 1]
                        }}
                        className="space-y-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full"
                        >
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm text-emerald-400 font-medium">Dijital Dünyada</span>
                        </motion.div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                            <span className="block text-white mb-2">Dijital Dünyada</span>
                            <div className="relative h-[1.2em] overflow-hidden">
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={currentIndex}
                                        initial={{ y: 50, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -50, opacity: 0 }}
                                        transition={{
                                            duration: 0.5,
                                            ease: [0.22, 1, 0.36, 1]
                                        }}
                                        className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400"
                                    >
                                        {rotatingTexts[currentIndex]}
                                    </motion.span>
                                </AnimatePresence>
                            </div>
                        </h1>
                    </motion.div>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto"
                    >
                        Web tasarım, SEO ve dijital pazarlama ile markanızı geleceğe taşıyoruz
                    </motion.p>

                    {/* CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="flex items-center justify-center"
                    >
                        <button className="group relative px-10 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-lg font-semibold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/50">
                            <span className="relative z-10 flex items-center gap-2">
                                Teklif Al
                                <motion.span
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    →
                                </motion.span>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </motion.div>

                    {/* Scroll Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1.2 }}
                        className="pt-16"
                    >
                        <motion.div
                            className="w-px h-20 bg-gradient-to-b from-emerald-500/0 via-emerald-500 to-emerald-500/0 mx-auto"
                            animate={{
                                scaleY: [1, 1.2, 1],
                                opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
