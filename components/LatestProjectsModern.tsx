"use client"

import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface Project {
    id: string
    publicTitle?: string
    title?: string
    name?: string
    thumbnail?: string
    image?: string
    category?: string
    year?: string
    slug?: string
    showOnHomepage?: boolean
    status?: string
}

// Bento slot backgrounds
const BENTO_COLORS = [
    "bg-[#0A0D14]",
    "bg-[#4D45FF]",
    "bg-[#FF7324]",
    "bg-[#001B3D]",
    "bg-[#714DFF]",
]


export default function LatestProjectsModern() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("/api/projects?type=work")
            .then(r => r.json())
            .then((data: Project[]) => {
                if (Array.isArray(data) && data.length > 0) {
                    const published = data.filter(p =>
                        p.status !== "draft" && p.showOnHomepage === true
                    )
                    setProjects(
                        (published.length > 0 ? published : data.filter(p => p.status !== "draft"))
                            .slice(0, 6)
                    )
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [])

    const displayTitle = (p: Project) => p.publicTitle || p.title || p.name || "—"
    const displayImage = (p: Project) => p.thumbnail || p.image || ""

    // Use real projects
    const displayProjects = projects
    const [p0, p1, p2, p3, p4, p5] = displayProjects

    // Empty state
    if (!loading && projects.length === 0) {
        return (
            <section className="py-16 sm:py-20 md:py-24 bg-white overflow-hidden">
                <div className="container mx-auto px-4 md:px-8 max-w-[95%] w-full">
                    <div className="text-center space-y-4 mb-10">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif font-medium text-black leading-tight"
                        >
                            Seçilmiş <span className="relative inline-block mx-1 sm:mx-2">
                                <span className="absolute -inset-1 sm:-inset-2 bg-[#4D45FF] rounded-xl sm:rounded-2xl transform -rotate-2 shadow-lg" />
                                <span className="relative text-white px-1 sm:px-2">Son İşler</span>
                            </span>
                        </motion.h2>
                    </div>
                    <div className="py-16 text-center border border-dashed border-black/10 rounded-3xl">
                        <p className="text-black/30 text-lg font-medium">Henüz proje eklenmemiş.</p>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-16 sm:py-20 md:py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-8 max-w-[95%] w-full">

                {/* Header Section */}
                <div className="text-center space-y-4 md:space-y-6 mb-10 md:mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif font-medium text-black leading-tight"
                    >
                        Seçilmiş <span className="relative inline-block mx-1 sm:mx-2">
                            <span className="absolute -inset-1 sm:-inset-2 bg-[#4D45FF] rounded-xl sm:rounded-2xl transform -rotate-2 shadow-lg" />
                            <span className="relative text-white px-1 sm:px-2">Son İşler</span>
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-base sm:text-lg md:text-xl text-black/60 max-w-2xl mx-auto leading-relaxed font-medium px-2"
                    >
                        Yenilikçi stratejilerimiz ve kullanıcı odaklı tasarım yaklaşımımızla dijital dünyada fark yaratan son işlerimiz.
                    </motion.p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 auto-rows-[140px] sm:auto-rows-[200px] md:auto-rows-[300px] mb-10 md:mb-16">

                    {/* Card 0 — Big (2×2) */}
                    {p0 && (
                        <BentoCard
                            project={p0}
                            displayTitle={displayTitle(p0)}
                            displayImage={displayImage(p0)}
                            className="col-span-2 row-span-2"
                            bgColor="bg-[#0A0D14]"
                            textColor="text-white"
                            imgClass="absolute top-[20%] sm:top-[25%] left-4 sm:left-10 right-0 bottom-0"
                            big
                        />
                    )}

                    {/* Card 1 — Horizontal (2×1) */}
                    {p1 && (
                        <BentoCard
                            project={p1}
                            displayTitle={displayTitle(p1)}
                            displayImage={displayImage(p1)}
                            className="col-span-2"
                            bgColor="bg-white border border-black/10"
                            textColor="text-black"
                            imgClass="absolute top-[15%] sm:top-[20%] right-[-10%] bottom-0 w-[80%]"
                        />
                    )}

                    {/* Accent/Icon Cards (1×1 each) */}
                    {[p2, p3, p4].map((p, i) =>
                        p ? (
                            <BentoCard
                                key={p.id}
                                project={p}
                                displayTitle={displayTitle(p)}
                                displayImage={displayImage(p)}
                                className=""
                                bgColor={BENTO_COLORS[i + 1]}
                                textColor="text-white"
                                imgClass="absolute inset-0"
                                compact
                            />
                        ) : (
                            // Decorative placeholder card
                            <motion.div
                                key={`deco-${i}`}
                                whileHover={{ y: -5 }}
                                className={`rounded-2xl sm:rounded-[2.5rem] ${BENTO_COLORS[i + 1]} flex items-center justify-center overflow-hidden`}
                            >
                                <div className="w-10 h-10 sm:w-16 sm:h-16 bg-white/20 rounded-xl" />
                            </motion.div>
                        )
                    )}

                    {/* Card 5 — Bottom Horizontal (2×1) */}
                    {p5 && (
                        <BentoCard
                            project={p5}
                            displayTitle={displayTitle(p5)}
                            displayImage={displayImage(p5)}
                            className="col-span-2"
                            bgColor="bg-white border border-black/10"
                            textColor="text-black"
                            imgClass="absolute top-[25%] sm:top-[30%] left-[30%] right-[-10%] bottom-0"
                        />
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                    <Link
                        href="/contact"
                        className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-black text-white rounded-xl sm:rounded-2xl text-base sm:text-xl font-bold hover:scale-[1.05] transition-all shadow-xl active:scale-95 text-center"
                    >
                        Birlikte Çalışalım
                    </Link>

                    <Link
                        href="/work"
                        className="group flex items-center justify-center gap-3 text-base sm:text-xl font-bold text-black hover:opacity-70 transition-all font-sans"
                    >
                        Tümünü Gör
                        <div className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-black rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                            <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    )
}

/* ── BentoCard ── */
function BentoCard({
    project,
    displayTitle,
    displayImage,
    className,
    bgColor,
    textColor,
    imgClass,
    big,
    compact,
}: {
    project: Project
    displayTitle: string
    displayImage: string
    className: string
    bgColor: string
    textColor: string
    imgClass: string
    big?: boolean
    compact?: boolean
}) {
    const href = project.slug ? `/work/${project.slug}` : `/work#${project.id}`

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`${className} rounded-2xl sm:rounded-[2.5rem] ${bgColor} p-4 sm:p-${big ? "8" : "6"} md:p-${big ? "10" : "8"} flex flex-col justify-between overflow-hidden relative group cursor-pointer`}
            onClick={() => window.location.href = href}
        >
            {/* Title */}
            {!compact && (
                <div className={`relative z-10 flex items-center gap-2 sm:gap-4`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${textColor === "text-white" ? "bg-white/50" : "bg-black/40"}`} />
                    <h3 className={`${big ? "text-lg sm:text-2xl md:text-3xl" : "text-base sm:text-xl md:text-2xl"} font-bold ${textColor} uppercase tracking-tighter truncate max-w-[80%]`}>
                        {displayTitle}
                    </h3>
                </div>
            )}

            {/* Image */}
            {displayImage && (
                <div className={`${imgClass} pointer-events-none group-hover:scale-105 transition-transform duration-500`}>
                    <img
                        src={displayImage}
                        alt={displayTitle}
                        className="w-full h-full object-contain object-right-top shadow-xl"
                    />
                </div>
            )}

            {/* Compact title overlay */}
            {compact && (
                <div className="absolute bottom-3 left-3 right-3 z-10">
                    <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider truncate">{displayTitle}</p>
                </div>
            )}
        </motion.div>
    )
}
