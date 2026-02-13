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
                const res = await fetch('/api/projects?type=work')
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

                {/* Hero Section */}
                <section className="w-full px-4 md:px-8 mb-10 md:mb-16">
                    {/* Large "work" title */}
                    <div className="mb-4 sm:mb-6 md:mb-8">
                        <h1 className="text-[60px] sm:text-[90px] md:text-[140px] lg:text-[180px] xl:text-[220px] font-black leading-none tracking-tight text-gray-200 opacity-40">
                            work
                        </h1>
                    </div>

                    {/* Main heading */}
                    <div className="mb-6 sm:mb-8 md:mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight">
                            we offer the diversity of skills
                        </h2>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex flex-nowrap sm:flex-wrap items-center gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
                        {/* Category Buttons */}
                        {allTabs.map((category, index) => {
                            // Colorful pastel backgrounds for each button
                            const colors = [
                                'bg-pink-100 hover:bg-pink-200',      // Yakında!
                                'bg-purple-100 hover:bg-purple-200',  // Hepsi
                                'bg-blue-100 hover:bg-blue-200',      // Category 1
                                'bg-green-100 hover:bg-green-200',    // Category 2
                                'bg-yellow-100 hover:bg-yellow-200',  // Category 3
                                'bg-orange-100 hover:bg-orange-200',  // Category 4
                                'bg-teal-100 hover:bg-teal-200',      // Category 5
                                'bg-indigo-100 hover:bg-indigo-200',  // Category 6
                                'bg-rose-100 hover:bg-rose-200',      // Category 7
                                'bg-cyan-100 hover:bg-cyan-200',      // Category 8
                            ];
                            const colorClass = colors[index % colors.length];

                            return (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 ${selectedCategory === category
                                        ? 'bg-foreground text-background'
                                        : `${colorClass} text-foreground`
                                        }`}
                                >
                                    {category}
                                </button>
                            );
                        })}

                        {/* Industry Dropdown - positioned on the right */}
                        <div className="sm:ml-auto shrink-0">
                            <button className="px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium bg-amber-100 hover:bg-amber-200 text-foreground transition-all flex items-center gap-2">
                                Industry
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Projects Grid */}
                <section className="w-full px-4 md:px-8 mb-16 md:mb-32">
                    {loading ? (
                        <div className="flex justify-center items-center py-12 sm:py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                            <AnimatePresence mode="popLayout">
                                {filteredProjects.map((project, index) => {
                                    const displayImage = project.image || project.heroImage;
                                    const displayDesc = project.desc || project.description;

                                    return (
                                        <motion.div
                                            key={project.id || index}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 20 }}
                                            transition={{ duration: 0.4, delay: index * 0.1 }}
                                            className="group"
                                        >
                                            <Link href={`/projeler/${project.slug || project.id}`} className="block">
                                                {/* Image Container */}
                                                <div className="relative aspect-[16/10] rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden mb-3 sm:mb-4 md:mb-6 bg-muted">
                                                    {displayImage ? (
                                                        <img
                                                            src={displayImage}
                                                            alt={project.title}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <FolderOpen className="w-16 h-16 text-muted-foreground opacity-20" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Project Info */}
                                                <div className="space-y-1 sm:space-y-2">
                                                    <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground group-hover:opacity-70 transition-opacity">
                                                        {project.title}
                                                    </h3>
                                                    {displayDesc && (
                                                        <p className="text-base text-muted-foreground">
                                                            {displayDesc}
                                                        </p>
                                                    )}
                                                </div>
                                            </Link>
                                        </motion.div>
                                    );
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
                        </div>
                    )}
                </section>

                <ModernCTA />
            </main>
            <ModernFooter />
        </>
    )
}
