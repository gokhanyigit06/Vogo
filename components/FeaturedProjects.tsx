"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, FolderOpen } from "lucide-react"

type Project = {
    id: number | string
    title: string
    category?: string
    categories?: string[]
    image?: string
    heroImage?: string
    description?: string
    slug?: string
}

export default function FeaturedProjects() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // Fetch all projects (or limit via API query if supported)
                const res = await fetch('/api/projects')
                if (!res.ok) throw new Error('Fetch error')
                const data = await res.json()

                // Take only the first 4 projects for the homepage
                if (Array.isArray(data)) {
                    setProjects(data.slice(0, 4))
                }
            } catch (error) {
                console.error("Error loading projects:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchProjects()
    }, [])

    return (
        <section className="py-24 md:py-32 bg-background relative overflow-hidden transition-colors duration-300">
            <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="max-w-2xl"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="text-foreground">Öne Çıkan </span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                                İşlerimiz
                            </span>
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Dijital dünyada iz bırakan, markalara değer katan en yeni projelerimizden seçkiler.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Link
                            href="/portfolio"
                            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-card border border-border hover:border-foreground/20 hover:bg-muted/50 transition-all font-bold text-sm"
                        >
                            Tüm Projeleri İncele
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>

                {/* Projects Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    {loading ? (
                        // Loading Skeletons
                        [...Array(2)].map((_, i) => (
                            <div key={i} className="aspect-[16/10] rounded-[2rem] bg-muted/50 animate-pulse border border-border" />
                        ))
                    ) : (
                        projects.map((project, index) => {
                            // Determine display category: prefer first item of categories, fallback to legacy category
                            const displayCategory = (project.categories && project.categories.length > 0)
                                ? project.categories[0]
                                : (project.category || '-');

                            // Determine display image: prefer image (card), fallback to heroImage
                            const displayImage = project.image || project.heroImage;

                            return (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group relative rounded-[2rem] overflow-hidden bg-card border border-border hover:border-purple-500/30 transition-all cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-purple-500/10"
                                >
                                    <Link href={`/projeler/${project.slug || project.id}`} className="block h-full">
                                        {/* Link to project detail page */}
                                        <div className="aspect-[16/10] overflow-hidden relative">
                                            {displayImage ? (
                                                <img
                                                    src={displayImage}
                                                    alt={project.title}
                                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-muted flex items-center justify-center">
                                                    <FolderOpen className="w-16 h-16 text-muted-foreground/30" />
                                                </div>
                                            )}

                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                                            {/* Content Overlay */}
                                            <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end">
                                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="text-purple-300 text-xs font-bold tracking-wider uppercase bg-purple-900/50 backdrop-blur-md px-3 py-1 rounded-full border border-purple-500/30">
                                                            {displayCategory}
                                                        </span>
                                                        <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                                                            <ArrowUpRight className="w-6 h-6" />
                                                        </div>
                                                    </div>

                                                    <h3 className="text-3xl font-bold text-white mb-2 leading-tight">
                                                        {project.title}
                                                    </h3>

                                                    {project.description && (
                                                        <p className="text-slate-300 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                                            {project.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            )
                        })
                    )}

                    {!loading && projects.length === 0 && (
                        <div className="col-span-full py-20 bg-muted/30 rounded-[2rem] border border-dashed border-border text-center">
                            <p className="text-muted-foreground font-medium">Henüz vitrine eklenecek proje bulunmuyor.</p>
                            <Link href="/admin/portfolio" className="text-emerald-500 text-sm mt-2 inline-block hover:underline">
                                Admin panelinden proje ekle
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
