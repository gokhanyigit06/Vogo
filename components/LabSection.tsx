"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowUpRight, FlaskConical, Beaker } from "lucide-react"

export default function LabSection() {
    const [projects, setProjects] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // Fetch latest 3 lab projects
                const res = await fetch('/api/projects?type=lab')
                const data = await res.json()
                if (Array.isArray(data)) {
                    setProjects(data.slice(0, 3))
                }
            } catch (error) {
                console.error("Lab fetch error:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProjects()
    }, [])

    if (!loading && projects.length === 0) return null

    return (
        <section className="py-24 bg-background relative overflow-hidden border-t border-border/50">
            <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full font-bold text-xs mb-4 border border-emerald-500/20">
                            <FlaskConical className="w-3 h-3" />
                            <span>Vogo Labs</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4 leading-tight">
                            Deneysel Çalışmalar
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Sınırları zorladığımız, yeni teknolojileri denediğimiz yan projelerimiz.
                        </p>
                    </div>
                    <Link href="/laboratuvar" className="group flex items-center gap-2 font-bold text-emerald-500 hover:text-emerald-400 transition-colors">
                        Tümünü İncele <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative rounded-3xl overflow-hidden bg-card border border-border hover:border-emerald-500/50 transition-all cursor-pointer aspect-[4/3] md:aspect-[3/4] lg:aspect-[4/3]"
                        >
                            <Link href={`/laboratuvar/${project.slug}`} className="block h-full relative">
                                <div className="absolute inset-0 bg-zinc-900">
                                    {project.thumbnail || project.heroImage ? (
                                        <img
                                            src={project.thumbnail || project.heroImage}
                                            alt={project.publicTitle || ''}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                                            <Beaker className="w-8 h-8 opacity-20" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                                </div>

                                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{project.publicTitle}</h3>
                                        <p className="text-sm text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity delay-75">{project.year || 'Experimental'}</p>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    )
}
