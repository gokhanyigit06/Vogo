"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Header from "@/components/Header"
import ModernFooter from "@/components/ModernFooter"
import ModernCTA from "@/components/ModernCTA"
import { ArrowUpRight, FlaskConical, Beaker, Sparkles, Loader2 } from "lucide-react"
import ParallaxImage from "@/components/ui/ParallaxImage"
import MagneticButton from "@/components/ui/MagneticButton"

export default function LabPage() {
    const [projects, setProjects] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Fetch projects on mount
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // Fetch projects with type=lab
                const res = await fetch('/api/projects?type=lab')
                const data = await res.json()
                if (Array.isArray(data)) {
                    setProjects(data)
                }
            } catch (error) {
                console.error("Lab fetch error:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProjects()
    }, [])

    return (
        <>
            <Header />
            <main className="bg-background min-h-screen pt-24 pb-20 overflow-hidden transition-colors duration-300">

                {/* Hero Section */}
                <section className="container mx-auto px-4 md:px-8 max-w-7xl mb-16 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-full font-bold text-sm mb-6 border border-emerald-500/20">
                            <FlaskConical className="w-4 h-4" />
                            <span>Vogo Labs</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6 tracking-tight">
                            Deneysel Çalışmalar
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Ekibimizin tutkuyla geliştirdiği yan projeler, açık kaynak kütüphaneler ve SaaS ürünleri.
                        </p>
                    </motion.div>
                </section>

                {/* Featured Tool: AI Insights */}
                <section className="container mx-auto px-4 md:px-8 max-w-7xl mb-24 relative z-10">
                    <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-zinc-900 to-black border border-white/10 p-8 md:p-12">
                        {/* Background Effects */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                            <div className="flex-1 space-y-6 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/20">
                                    <Sparkles className="w-3 h-3" />
                                    Yeni Araç
                                </div>
                                <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
                                    Web Sitenizi <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Yapay Zeka ile Analiz Edin</span>
                                </h1>
                                <p className="text-lg text-zinc-400 max-w-xl">
                                    Google Gemini ve Vision teknolojisi ile sitenizin tasarım, UX ve SEO performansını saniyeler içinde ölçümleyin. E-ticaret siteleri için özel analiz modu.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
                                    <Link href="/laboratuvar/analiz">
                                        <div className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 px-8 rounded-xl transition-all flex items-center gap-3 text-lg cursor-pointer">
                                            Ücretsiz Analiz Et
                                            <ArrowUpRight className="w-5 h-5" />
                                        </div>
                                    </Link>
                                </div>
                            </div>

                            {/* Visual Representation */}
                            <div className="flex-1 w-full max-w-md relative hidden md:block">
                                <div className="aspect-square relative flex items-center justify-center">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 rounded-full animate-pulse" />
                                    <div className="relative bg-zinc-950 border border-white/10 rounded-2xl p-6 w-full shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                                        <div className="h-4 w-3/4 bg-zinc-800 rounded mb-4" />
                                        <div className="h-80 bg-zinc-900 border border-white/5 rounded-lg mb-4 flex flex-col items-center justify-center relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 z-10" />
                                            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
                                            <span className="text-emerald-500 text-sm font-mono animate-pulse">Analyzing UX...</span>

                                            {/* Floating Elements */}
                                            <div className="absolute top-4 left-4 bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded border border-red-500/30">
                                                SEO Error Detected
                                            </div>
                                            <div className="absolute bottom-4 right-4 bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded border border-emerald-500/30">
                                                Mobile Friendly
                                            </div>
                                        </div>

                                        {/* Floating Score Card */}
                                        <div className="absolute -top-6 -right-6 bg-zinc-900 border border-emerald-500/30 p-4 rounded-xl shadow-xl flex flex-col items-center z-20">
                                            <span className="text-xs text-muted-foreground uppercase font-bold text-[10px]">Tasarım Skoru</span>
                                            <span className="text-4xl font-black text-emerald-500">92</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Projects Grid */}
                <section className="container mx-auto px-4 md:px-8 max-w-7xl mb-32 relative z-10">
                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="aspect-[4/3] rounded-[2rem] bg-muted animate-pulse border border-border" />
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: "-10%" }}
                            variants={{
                                hidden: { opacity: 0 },
                                show: { opacity: 1, transition: { staggerChildren: 0.15 } }
                            }}
                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {projects.map((project, index) => (
                                <motion.div
                                    key={project.id}
                                    variants={{
                                        hidden: { opacity: 0, y: 40 },
                                        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] as any } }
                                    }}
                                >
                                    <div className="group relative rounded-[2rem] overflow-hidden bg-card border border-border hover:border-emerald-500/50 transition-all cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 aspect-[4/3]">
                                        <Link href={`/laboratuvar/${project.slug}`} className="block h-full relative">
                                            {/* Image */}
                                            <div className="absolute inset-0 bg-zinc-900 overflow-hidden">
                                                {project.thumbnail || project.heroImage ? (
                                                    <ParallaxImage
                                                        src={project.thumbnail || project.heroImage}
                                                        alt={project.publicTitle || ''}
                                                        className="w-full h-full"
                                                        offset={20}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-zinc-700 bg-muted">
                                                        <Beaker className="w-12 h-12 opacity-20" />
                                                    </div>
                                                )}
                                                {/* Gradient Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity z-10" />
                                            </div>

                                            {/* Content Overlay */}
                                            <div className="absolute inset-0 p-8 flex flex-col justify-end z-20">
                                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <span className="text-emerald-400 text-xs font-bold tracking-wider uppercase bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                                            {project.tags?.[0] || 'Lab Project'}
                                                        </span>
                                                        <MagneticButton>
                                                            <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                                <ArrowUpRight className="w-5 h-5" />
                                                            </div>
                                                        </MagneticButton>
                                                    </div>

                                                    <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                                                        {project.publicTitle}
                                                    </h3>

                                                    {project.year && (
                                                        <p className="text-slate-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                                                            {project.year}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {!loading && projects.length === 0 && (
                        <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl opacity-50">
                            <FlaskConical className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-muted-foreground font-medium">Henüz laboratuvar projesi eklenmemiş.</p>
                        </div>
                    )}
                </section>

                <ModernCTA />
            </main>
            <ModernFooter />
        </>
    )
}
