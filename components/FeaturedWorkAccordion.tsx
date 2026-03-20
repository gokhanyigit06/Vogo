"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

interface Project {
    id: string
    publicTitle?: string
    title?: string
    name?: string
    thumbnail?: string
    thumbnailType?: "image" | "video"
    accordionImage?: string
    accordionImageType?: "image" | "video"
    image?: string
    category?: string
    categories?: string[]
    tags?: string[]
    description?: string
    year?: string
    liveUrl?: string
    websiteUrl?: string
    slug?: string
    status?: string
    showOnHomepage?: boolean
    // Rich fields (optional from editor)
    industry?: string
    stack?: string[]
    scope?: string[]
}


export default function FeaturedWorkAccordion() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [activeId, setActiveId] = useState<string>("")

    useEffect(() => {
        fetch("/api/projects?type=work")
            .then(r => r.json())
            .then((data: Project[]) => {
                if (Array.isArray(data) && data.length > 0) {
                    const published = data.filter(p => p.status !== "draft")
                    const homepage = published.filter(p => p.showOnHomepage === true)
                    const list = (homepage.length > 0 ? homepage : published).slice(0, 6)
                    setProjects(list)
                    setActiveId(list[0]?.id || "")
                }
            })
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    const displayTitle = (p: Project) => p.publicTitle || p.title || p.name || "—"
    const displayImage = (p: Project) => p.accordionImage || p.thumbnail || p.image || ""
    const isVideoUrl = (url: string) => {
        if (!url) return false
        return /\.(mp4|mov|webm|ogg|m4v|avi)($|\?)/i.test(url) || url.includes('video') || url.includes('mp4') || url.includes('webm')
    }
    const displayThumbnailType = (p: Project): "image" | "video" => {
        if (p.accordionImage) return p.accordionImageType === "video" || isVideoUrl(p.accordionImage) ? "video" : "image"
        if (p.thumbnailType === "video") return "video"
        const url = p.thumbnail || p.image || ""
        if (url && isVideoUrl(url)) return "video"
        return "image"
    }
    const displayCategory = (p: Project) => p.category || p.categories?.[0] || p.tags?.[0] || "Work"
    const displayIndustry = (p: Project) => p.industry || p.category || p.categories?.[0] || "—"
    const displayStack = (p: Project) => p.stack || p.tags || []
    const displayScope = (p: Project) => p.scope || []
    // Always link to internal project detail page: /projeler/[slug] or /projeler/[id]
    const projectHref = (p: Project) => `/projeler/${p.slug || p.id}`

    // Empty state
    if (!loading && projects.length === 0) {
        return (
            <section className="bg-black py-20 lg:py-32 text-white">
                <div className="container mx-auto px-4 md:px-8 max-w-[1500px]">
                    <h2 className="text-[4rem] md:text-[6rem] lg:text-[8rem] leading-[0.9] tracking-[-0.04em] font-medium mb-20">
                        İmza attığımız Projeler
                    </h2>
                    <div className="border-t border-white/10 py-20 text-center">
                        <p className="text-white/30 text-lg font-medium">Mükemmel bir proje yolda. Çok yakında burada!</p>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="bg-black py-20 lg:py-32 text-white">
            <div className="container mx-auto px-4 md:px-8 max-w-[1500px]">

                {/* Header */}
                <div className="mb-12 lg:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <h2 className="text-[4rem] md:text-[6rem] lg:text-[8rem] leading-[0.9] tracking-[-0.04em] font-medium">
                        İmza attığımız Projeler
                    </h2>
                    <Link
                        href="/work"
                        className="group flex items-center gap-2 text-sm font-bold text-white/40 hover:text-white transition-colors mb-3"
                    >
                        Tüm Projeleri Keşfet
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                </div>

                {/* Accordion List */}
                <div className="border-t border-white/20">
                    {projects.map((project) => {
                        const isActive = activeId === project.id

                        return (
                            <div
                                key={project.id}
                                className="border-b border-white/20 group"
                            >
                                <div
                                    onClick={() => setActiveId(project.id)}
                                    className={`cursor-pointer flex flex-col w-full transition-all duration-500 ease-[0.16,1,0.3,1] ${isActive ? "py-6 lg:py-8" : "py-3 lg:py-4"}`}
                                >
                                    {/* Top Row */}
                                    <div className={`grid grid-cols-1 md:grid-cols-12 md:items-center gap-4 lg:gap-8 xl:gap-10 transition-all duration-500 ease-[0.16,1,0.3,1] ${isActive ? "min-h-[4rem] lg:min-h-[5rem]" : "min-h-[2.5rem] lg:min-h-[3rem]"}`}>

                                        {/* Title only */}
                                        <div className="md:col-span-5 lg:col-span-4 xl:col-span-3 min-w-0 pr-2 lg:pr-4 flex items-center">
                                            <h3 className={`font-medium tracking-[-0.03em] origin-left transition-all duration-500 ease-[0.16,1,0.3,1] ${isActive ? "text-4xl md:text-5xl lg:text-7xl opacity-100" : "text-3xl md:text-4xl lg:text-[2.75rem] opacity-30 group-hover:opacity-60"}`}>
                                                {displayTitle(project)}
                                            </h3>
                                        </div>

                                        {/* Right: View Case (active) OR Banner (inactive) */}
                                        <div className={`hidden md:block md:col-span-7 lg:col-span-8 xl:col-span-9 relative w-full transition-all duration-500 ease-[0.16,1,0.3,1] ${isActive ? "h-12 lg:h-16" : "h-10 lg:h-[3.25rem]"}`}>
                                            <AnimatePresence>
                                                {isActive ? (
                                                    <motion.div
                                                        key="viewcase"
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -10 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="absolute inset-y-0 left-0 flex items-center"
                                                    >
                                                        <motion.a
                                                            href={projectHref(project)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={e => e.stopPropagation()}
                                                            className="flex items-center gap-2 text-sm lg:text-base font-bold tracking-tight whitespace-nowrap hover:text-white/70 transition-colors"
                                                        >
                                                            Projeyi İncele <ArrowUpRight className="w-4 h-4 text-green-500" />
                                                        </motion.a>
                                                    </motion.div>
                                                ) : (
                                                    <motion.div
                                                        key="banner"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="absolute inset-0 flex items-center w-full h-full"
                                                    >
                                                        <div className="h-full flex-1 rounded-[100px] overflow-hidden relative border border-white/10 flex items-center bg-[#111]">
                                                            <div className="absolute left-1.5 lg:left-2 z-10 px-3 py-1 bg-white/10 lg:bg-[#222]/90 backdrop-blur-md rounded-[100px] border border-white/5 text-[9px] lg:text-[11px] font-semibold tracking-wide whitespace-nowrap shadow-sm text-white/90 group-hover:text-white group-hover:bg-[#333] transition-colors">
                                                                {displayCategory(project)}
                                                            </div>
                                                            {displayImage(project) && (
                                                                displayThumbnailType(project) === "video" ? (
                                                                    <video
                                                                        src={displayImage(project)}
                                                                        autoPlay muted loop playsInline
                                                                        className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-lighten"
                                                                    />
                                                                ) : (
                                                                    <img
                                                                        src={displayImage(project)}
                                                                        alt={displayTitle(project)}
                                                                        className="absolute inset-0 w-full h-[250%] object-cover object-center translate-y-[10%] opacity-90 group-hover:scale-105 transition-transform duration-700 mix-blend-lighten"
                                                                    />
                                                                )
                                                            )}
                                                            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent group-hover:opacity-0 transition-opacity duration-500" />
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    {/* Expanded Content */}
                                    <AnimatePresence initial={false}>
                                        {isActive && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1, transition: { height: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.4, delay: 0.2 } } }}
                                                exit={{ height: 0, opacity: 0, transition: { height: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.2 } } }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pb-12 grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-8 xl:gap-10">
                                                    {/* Meta Left */}
                                                    <div className="md:col-span-5 lg:col-span-4 xl:col-span-3 flex flex-col gap-6 lg:gap-8">
                                                        {displayIndustry(project) && displayIndustry(project) !== "—" && (
                                                            <div className="flex flex-col gap-1">
                                                                <p className="text-[11px] md:text-xs font-semibold tracking-wide text-white/40 uppercase">Sektör</p>
                                                                <p className="text-base md:text-lg font-bold tracking-tight text-white">{displayIndustry(project)}</p>
                                                            </div>
                                                        )}
                                                        {displayStack(project).length > 0 && (
                                                            <div className="flex flex-col gap-1">
                                                                <p className="text-[11px] md:text-xs font-semibold tracking-wide text-white/40 uppercase">Teknolojiler</p>
                                                                <ul className="flex flex-col gap-0.5">
                                                                    {displayStack(project).map((s, i) => (
                                                                        <li key={i} className="text-base md:text-lg font-bold tracking-tight text-white">{s}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                        {displayScope(project).length > 0 && (
                                                            <div className="flex flex-col gap-1">
                                                                <p className="text-[11px] md:text-xs font-semibold tracking-wide text-white/40 uppercase">Çözümler</p>
                                                                <ul className="flex flex-col gap-0.5">
                                                                    {displayScope(project).map((s, i) => (
                                                                        <li key={i} className="text-base md:text-lg font-bold tracking-tight text-white">{s}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Big Image Right */}
                                                    <div className="md:col-span-7 lg:col-span-8 xl:col-span-9 relative">
                                                        <Link
                                                            href={projectHref(project)}
                                                            className="block w-full aspect-[4/3] md:aspect-video lg:aspect-[16/7] xl:aspect-[21/9] rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden bg-white/5 flex items-center justify-center relative group"
                                                        >
                                                            {/* Floating Badges */}
                                                            <div className="absolute inset-0 z-10 flex flex-col justify-between p-4 md:p-6 pointer-events-none">
                                                                <div className="px-4 py-2 lg:px-5 lg:py-2.5 w-fit bg-black/40 backdrop-blur-md rounded-full text-white text-xs lg:text-sm font-semibold border border-white/10">
                                                                    {displayCategory(project)}
                                                                </div>
                                                                <div className="px-4 py-2 lg:px-5 lg:py-2.5 w-fit bg-white/20 lg:group-hover:bg-white text-white lg:group-hover:text-black backdrop-blur-md rounded-full text-xs lg:text-sm font-semibold border border-white/20 flex items-center gap-2 transition-all">
                                                                    Projeyi İncele <ArrowUpRight className="w-3 h-3 lg:w-4 lg:h-4" />
                                                                </div>
                                                            </div>

                                                            {/* Image/Video */}
                                                            <div className="absolute inset-0 w-full h-full">
                                                                {displayImage(project) ? (
                                                                    displayThumbnailType(project) === "video" ? (
                                                                        <video
                                                                            src={displayImage(project)}
                                                                            autoPlay muted loop playsInline
                                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-[0.16,1,0.3,1] opacity-90 group-hover:opacity-100"
                                                                        />
                                                                    ) : (
                                                                        <img
                                                                            src={displayImage(project)}
                                                                            alt={displayTitle(project)}
                                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-[0.16,1,0.3,1] opacity-90 group-hover:opacity-100"
                                                                        />
                                                                    )
                                                                ) : (
                                                                    <div className="text-white/10 text-6xl font-black tracking-tighter w-full h-full flex items-center justify-center">
                                                                        {displayTitle(project).charAt(0)}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
