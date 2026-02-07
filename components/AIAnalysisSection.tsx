"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, ArrowRight, Sparkles, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import MagneticButton from "@/components/ui/MagneticButton"

export default function AIAnalysisSection() {
    const [url, setUrl] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleAnalyze = () => {
        if (!url) return
        setIsLoading(true)
        // Redirect to the full analysis page with the URL
        // We'll update the Wizard to read this param
        router.push(`/laboratuvar/analiz?url=${encodeURIComponent(url)}&auto=true`)
    }

    return (
        <section className="py-24 bg-background transition-colors duration-300 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 dark:bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center space-y-8">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 font-bold text-sm mb-6 border border-emerald-200 dark:border-emerald-500/20">
                            <Sparkles className="w-4 h-4" />
                            <span>Yapay Zeka Destekli</span>
                        </div>

                        <h2 className="text-4xl md:text-6xl font-black text-foreground mb-6 tracking-tight leading-tight">
                            Web Sitenizi <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">Ücretsiz Analiz Edin</span>
                        </h2>

                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Google Gemini ve Vision teknolojisi ile sitenizin tasarım, UX ve SEO performansını saniyeler içinde ölçümleyin. Eksikleri bulun, rakiplerin önüne geçin.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="relative group max-w-xl mx-auto">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                            <div className="relative flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-2 shadow-2xl transition-colors duration-300">
                                <Search className="w-6 h-6 text-muted-foreground ml-4" />
                                <input
                                    type="url"
                                    placeholder="https://sirketiniz.com"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="flex-1 bg-transparent border-none text-foreground px-4 py-4 focus:ring-0 focus:outline-none placeholder:text-muted-foreground text-lg"
                                    onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                                />
                                <MagneticButton>
                                    <button
                                        onClick={() => handleAnalyze()}
                                        disabled={!url || isLoading}
                                        className="bg-emerald-500 hover:bg-emerald-400 text-white dark:text-black font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                Analiz Et
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </MagneticButton>
                            </div>
                        </div>

                        <p className="mt-6 text-sm text-muted-foreground/80">
                            *E-ticaret siteleri (Trendyol, Etsy vb.) için özel analiz modu mevcuttur.
                        </p>
                    </motion.div>

                </div>
            </div>
        </section>
    )
}
