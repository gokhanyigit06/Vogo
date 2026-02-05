"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Home, ArrowLeft, Ghost, Zap } from "lucide-react"

export default function NotFoundContent() {
    return (
        <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center relative overflow-hidden">

            {/* Arkaplan Efektleri */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--muted-foreground)_1px,transparent_1px),linear-gradient(to_bottom,var(--muted-foreground)_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.03] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />

            <div className="relative z-10 text-center px-4">
                {/* Glitch Effect 404 */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                >
                    <h1 className="text-[150px] md:text-[200px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/20 select-none">
                        404
                    </h1>

                    {/* Floating Elements on 404 */}
                    <motion.div
                        animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-4 -right-4 md:right-12 bg-emerald-500 text-white p-3 rounded-2xl shadow-lg border border-emerald-400/50 rotate-12"
                    >
                        <Ghost className="w-8 h-8 md:w-10 md:h-10" />
                    </motion.div>

                    <motion.div
                        animate={{ y: [10, -10, 10], rotate: [5, -5, 5] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-4 -left-4 md:left-12 bg-blue-500 text-white p-3 rounded-2xl shadow-lg border border-blue-400/50 -rotate-12"
                    >
                        <Zap className="w-8 h-8 md:w-10 md:h-10" />
                    </motion.div>
                </motion.div>

                {/* Text Content */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="space-y-6 max-w-lg mx-auto"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                        Oops! Kayıp Sinyal.
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Aradığınız sayfa dijital boşlukta kaybolmuş gibi görünüyor. Belki taşınmıştır, belki de hiç var olmamıştır.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link href="/">
                            <button className="px-8 py-4 bg-foreground text-background rounded-xl font-bold hover:bg-emerald-500 hover:text-white transition-all duration-300 flex items-center gap-2 group">
                                <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                Ana Sayfaya Dön
                            </button>
                        </Link>

                        <button
                            onClick={() => history.back()}
                            className="px-8 py-4 bg-card border border-border text-foreground rounded-xl font-bold hover:bg-muted transition-all duration-300 flex items-center gap-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Geri Git
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Footer Text */}
            <div className="absolute bottom-8 text-xs text-muted-foreground opacity-50">
                Error Code: 404_PAGE_NOT_FOUND // Vogo Lab System
            </div>
        </div>
    )
}
