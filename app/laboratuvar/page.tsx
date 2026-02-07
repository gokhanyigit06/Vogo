"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Header from "@/components/Header"
import ModernFooter from "@/components/ModernFooter"
import ModernCTA from "@/components/ModernCTA"
import { ArrowUpRight, FolderOpen, FlaskConical, Beaker } from "lucide-react"

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
                        className="text-center max-w-3xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-full font-bold text-sm mb-6 border border-emerald-500/20">
                            <FlaskConical className="w-4 h-4" />
                            <span>Vogo Labs</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6">
                            Deneysel Çalışmalar
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Ekibimizin tutkuyla geliştirdiği yan projeler, açık kaynak kütüphaneler ve SaaS ürünleri.
                        </p>
                    </motion.div>
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
                            layout
                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {projects.map((project, index) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="group relative rounded-[2rem] overflow-hidden bg-card border border-border hover:border-emerald-500/50 transition-all cursor-pointer shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 aspect-[4/3]"
                                >
                                    <Link href={`/laboratuvar/${project.slug}`} className="block h-full relative">
                                        {/* Image */}
                                        <div className="absolute inset-0 bg-zinc-900">
                                            {project.thumbnail || project.heroImage ? (
                                                <img
                                                    src={project.thumbnail || project.heroImage}
                                                    alt={project.publicTitle || ''}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-zinc-700 bg-muted">
                                                    <Beaker className="w-12 h-12 opacity-20" />
                                                </div>
                                            )}
                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                                        </div>

                                        {/* Content Overlay */}
                                        <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-emerald-400 text-xs font-bold tracking-wider uppercase bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                                        {project.tags?.[0] || 'Lab Project'}
                                                    </span>
                                                    <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                                                        <ArrowUpRight className="w-5 h-5" />
                                                    </div>
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
