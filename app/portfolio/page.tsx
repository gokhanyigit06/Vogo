"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Header from "@/components/Header"
import ModernFooter from "@/components/ModernFooter"
import ModernCTA from "@/components/ModernCTA"
import { ArrowUpRight } from "lucide-react"

// Types
type Project = {
    id: number | string
    title: string
    category: string
    desc?: string
    description?: string // API ve mock data uyumluluğu için
    image: string
    client?: string
}

const categories = ["Hepsi", "Web Tasarım", "Reklam Yönetimi", "E-Ticaret", "AI Çözümleri", "Marka", "Yazılım"]

export default function PortfolioPage() {
    const [selectedCategory, setSelectedCategory] = useState("Hepsi")
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)

    // API'den projeleri çek
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('/api/projects')
                if (!res.ok) throw new Error('Projeler çekilemedi')
                const data = await res.json()
                setProjects(data)
            } catch (error) {
                console.error("Projeler yüklenirken hata:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProjects()
    }, [])

    const filteredProjects = selectedCategory === "Hepsi"
        ? projects
        : projects.filter(project => project.category === selectedCategory ||
            (selectedCategory === "Web Tasarım" && project.category === "Web Tasarım") // Esnek filtreleme gerekirse
        )

    if (loading) {
        return (
            <div className="bg-slate-950 min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <>
            <Header />
            <main className="bg-slate-950 min-h-screen pt-24 pb-20 overflow-hidden">

                {/* Hero */}
                <section className="container mx-auto px-4 md:px-8 max-w-7xl mb-16 relative z-10">
                    <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            Başarı Hikayelerimiz
                        </h1>
                        <p className="text-xl text-slate-400">
                            Farklı sektörlerden seçkin markalar için geliştirdiğimiz dijital çözümler.
                        </p>
                    </motion.div>
                </section>

                {/* Filter Tabs */}
                <section className="container mx-auto px-4 md:px-8 max-w-7xl mb-16 relative z-10">
                    <div className="flex flex-wrap justify-center gap-4">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className="relative px-6 py-3 rounded-full text-sm font-medium transition-colors focus:outline-none"
                            >
                                {selectedCategory === category && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-emerald-500 rounded-full"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className={`relative z-10 ${selectedCategory === category ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                                    {category}
                                </span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Projects Grid */}
                <section className="container mx-auto px-4 md:px-8 max-w-7xl mb-32 relative z-10">
                    <motion.div
                        layout
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredProjects.map((project, index) => (
                                <motion.div
                                    layout
                                    key={project.id || index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-colors cursor-pointer"
                                >
                                    {/* Image */}
                                    <div className="aspect-[4/3] overflow-hidden">
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>

                                    {/* Overlay & Content */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent opacity-90 transition-opacity" />

                                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-emerald-400 text-sm font-medium tracking-wider uppercase">
                                                    {project.category}
                                                </span>
                                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <ArrowUpRight className="w-4 h-4 text-white" />
                                                </div>
                                            </div>

                                            <h3 className="text-2xl font-bold text-white mb-2">
                                                {project.title}
                                            </h3>

                                            <p className="text-slate-400 text-sm line-clamp-2 group-hover:text-slate-300 transition-colors">
                                                {project.desc || project.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Hover Glow Effect */}
                                    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ring-1 ring-inset ring-emerald-500/30" />
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {filteredProjects.length === 0 && !loading && (
                            <div className="col-span-full text-center py-20 text-slate-500">
                                Bu kategoride henüz proje eklenmemiş.
                            </div>
                        )}
                    </motion.div>
                </section>

                <ModernCTA />
            </main>
            <ModernFooter />
        </>
    )
}
