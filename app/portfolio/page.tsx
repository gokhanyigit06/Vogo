"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Header from "@/components/Header"
import ModernFooter from "@/components/ModernFooter"
import ModernCTA from "@/components/ModernCTA"
import { ArrowUpRight, FolderOpen, Loader2 } from "lucide-react"

// Types
type Project = {
    id: number | string
    title: string
    category?: string
    categories?: string[]
    desc?: string
    description?: string
    image?: string
    heroImage?: string
    client?: string
    slug?: string
}

// ... types ...
const categories = ["Hepsi"] // Base categories, will be extended

export default function PortfolioPage() {
    const [selectedCategory, setSelectedCategory] = useState("Hepsi")
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [dynamicCategories, setDynamicCategories] = useState<string[]>([])

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('/api/projects')
                if (!res.ok) throw new Error('Projeler çekilemedi')
                const data = await res.json()
                setProjects(data)

                // Extract unique categories
                const allCats = new Set<string>()
                data.forEach((p: Project) => {
                    if (p.categories && Array.isArray(p.categories)) {
                        p.categories.forEach(c => allCats.add(c))
                    } else if (p.category) {
                        allCats.add(p.category)
                    }
                })
                setDynamicCategories(Array.from(allCats))
            } catch (error) {
                console.error("Projeler yüklenirken hata:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProjects()
    }, [])

    const filteredProjects = projects.filter(project => {
        if (selectedCategory === "Hepsi") {
            // Show all EXCEPT those explicitly marked as 'Yakında' (if we had a flag)
            // For now, show all completed projects usually. 
            // Assuming 'status' field exists on project type, filter could be refined.
            // But based on current data structure, 'Hepsi' shows everything.
            return true
        }

        if (selectedCategory === "Yakında!") {
            // Filter logic for 'Yakında!' - e.g. status is NOT completed
            // If project type has status, use it. Otherwise placeholder logic.
            // As per current type definition in file, adding status check.
            return (project as any).status === 'in_progress' || (project as any).status === 'quote'
        }

        // Check if categories array includes the selected category
        if (project.categories && Array.isArray(project.categories)) {
            return project.categories.includes(selectedCategory)
        }
        // Fallback for legacy data
        return project.category === selectedCategory
    })

    const allTabs = ["Yakında!", "Hepsi", ...dynamicCategories]

    return (
        <>
            <Header />
            <main className="bg-background min-h-screen pt-24 pb-20 overflow-hidden transition-colors duration-300">

                {/* Hero */}
                <section className="container mx-auto px-4 md:px-8 max-w-7xl mb-16 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6">
                            Başarı Hikayelerimiz
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Farklı sektörlerden seçkin markalar için geliştirdiğimiz dijital çözümler.
                        </p>
                    </motion.div>
                </section>

                {/* Filter Tabs */}
                <section className="container mx-auto px-4 md:px-8 max-w-7xl mb-16 relative z-10">
                    <div className="flex flex-wrap justify-center gap-3">
                        {allTabs.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`relative px-5 py-2.5 rounded-full text-sm font-bold transition-all focus:outline-none group ${category === "Yakında!" ? "ml-2 mr-4" : ""
                                    }`}
                            >
                                {selectedCategory === category && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className={`absolute inset-0 rounded-full shadow-lg ${category === "Yakında!"
                                                ? "bg-gradient-to-r from-amber-400 to-orange-500 shadow-orange-500/30"
                                                : "bg-emerald-500 shadow-emerald-500/30"
                                            }`}
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className={`relative z-10 flex items-center gap-2 ${selectedCategory === category
                                        ? 'text-white'
                                        : category === "Yakında!"
                                            ? 'text-amber-600 hover:text-amber-700'
                                            : 'text-muted-foreground group-hover:text-foreground'
                                    }`}>
                                    {category}
                                    {category === "Yakında!" && (
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                        </span>
                                    )}
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
                            {filteredProjects.map((project, index) => {
                                const displayCategory = (project.categories && project.categories.length > 0)
                                    ? project.categories[0]
                                    : (project.category || '-');
                                const displayImage = project.image || project.heroImage;

                                return (
                                    <motion.div
                                        layout
                                        key={project.id || index}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                        className="group relative rounded-[2rem] overflow-hidden bg-card border border-border hover:border-emerald-500/50 transition-all cursor-pointer shadow-sm hover:shadow-xl hover:shadow-emerald-500/10"
                                    >
                                        <Link href={`/projeler/${project.slug || project.id}`} className="block h-full">
                                            {/* Image */}
                                            <div className="aspect-[4/3] overflow-hidden relative">
                                                {/* Placeholder/Fallback if image fails or empty */}
                                                <div className="absolute inset-0 bg-muted flex items-center justify-center text-muted-foreground">
                                                    <FolderOpen className="w-12 h-12 opacity-20" />
                                                </div>
                                                {displayImage && (
                                                    <img
                                                        src={displayImage}
                                                        alt={project.title}
                                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                )}

                                                {/* Gradient Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                                            </div>

                                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-emerald-400 text-xs font-bold tracking-wider uppercase bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                                            {displayCategory}
                                                        </span>
                                                        <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                                                            <ArrowUpRight className="w-5 h-5" />
                                                        </div>
                                                    </div>

                                                    <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                                                        {project.title}
                                                    </h3>

                                                    <p className="text-slate-300 text-sm line-clamp-2 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100 duration-500">
                                                        {project.desc || project.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>

                        {filteredProjects.length === 0 && !loading && (
                            <div className="col-span-full text-center py-20">
                                <div className="inline-block p-4 rounded-full bg-muted mb-4">
                                    <FolderOpen className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <p className="text-muted-foreground font-medium">Bu kategoride henüz proje eklenmemiş.</p>
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
