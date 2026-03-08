"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import dynamic from "next/dynamic"
import Header from "@/components/Header"
import { FolderOpen, Loader2 } from "lucide-react"

import { Project } from "@/types/firebase"

const TechnologiesTabs = dynamic(() => import("@/components/TechnologiesTabs"), { ssr: true })
const OurClientsSay = dynamic(() => import("@/components/OurClientsSay"), { ssr: true })
const ModernFooter = dynamic(() => import("@/components/ModernFooter"), { ssr: true })

const STATIC_TABS = ["All Projects", "Headless CMS", "Headless eCommerce", "Next.JS", "AI Integrations", "Next.JS Audit"]

export default function PortfolioPage() {
    const t = useTranslations("PortfolioPage")
    const [selectedCategory, setSelectedCategory] = useState("All Projects")
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)

    // Dummy projects to use as a fallback if Firebase is empty, to mimic the screenshots
    const dummyProjects = [
        {
            id: "easypark",
            slug: "easypark",
            title: "EasyPark",
            publicTitle: "EasyPark",
            desc: "We built a massive multi-site platform on Storyblok and Next.js—35 domains, 18 languages—empowering a 3-person marketing team to manage global content efficiently with speed, scalability, and SEO in mind.",
            image: "https://images.unsplash.com/photo-1549421263-606ec5135111?q=80&w=1200&auto=format&fit=crop",
            categories: ["Headless CMS", "Next.JS"],
            industry: "Parking & Mobility"
        },
        {
            id: "caleffi",
            slug: "caleffi",
            title: "Caleffi",
            publicTitle: "Caleffi",
            desc: "Discover how we helped Caleffi migrate 24k+ SKUs from Magento to Shopify Plus, integrated IBM AS/400 ERP, and built a scalable content platform using Sanity. Full localization, B2B support, and custom Shopify apps included.",
            image: "https://images.unsplash.com/photo-1574635925348-115fbc752fd3?q=80&w=1200&auto=format&fit=crop",
            categories: ["Headless eCommerce", "Headless CMS"],
            industry: "Textile Manufacturing"
        },
        {
            id: "not-so-ape",
            slug: "not-so-ape",
            title: "Not So Ape",
            publicTitle: "Not So Ape",
            desc: "We built a Next.js app using Crystallize for headless eCommerce, with SSG and GraphQL for fast, dynamic UX.",
            image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200&auto=format&fit=crop",
            categories: ["Headless eCommerce", "Next.JS"],
            industry: "Apparel & Fashion"
        },
        {
            id: "arrive",
            slug: "arrive",
            title: "Arrive",
            publicTitle: "Arrive",
            desc: "Headless eCommerce migration combining Shopify Plus, Sanity CMS, and Next.js for a lighting-fast online platform.",
            image: "https://images.unsplash.com/photo-1628126235206-5260b9ea6441?q=80&w=1200&auto=format&fit=crop",
            categories: ["Next.JS", "Headless CMS"],
            industry: "Parking & Mobility" // Using the screenshot tag as dummy
        }
    ]

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('/api/projects?type=work')
                if (!res.ok) throw new Error('Projeler çekilemedi')
                const data = await res.json()

                // If API returns empty, fill with dummy data to match the new design showcase
                setProjects(data.length > 0 ? data : dummyProjects)
            } catch (error) {
                console.error("Projeler yüklenirken hata:", error)
                // Fallback to dummy data
                setProjects(dummyProjects as any)
            } finally {
                setLoading(false)
            }
        }
        fetchProjects()
    }, [])

    const filteredProjects = projects.filter(project => {
        if (selectedCategory === "All Projects") return true

        const projCats = project.categories || (project.category ? [project.category] : [])
        // Simple inclusive match 
        return projCats.some(c => c.toLowerCase().includes(selectedCategory.toLowerCase()))
    })

    return (
        <>
            <Header />
            <main className="bg-white min-h-screen pt-24 pb-0 overflow-hidden text-black transition-colors duration-300">

                {/* Hero Section */}
                <section className="w-full pt-16 md:pt-24 lg:pt-32 pb-16 lg:pb-24">
                    <div className="container mx-auto px-4 md:px-8 max-w-[1500px]">
                        <motion.h1
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="text-[4rem] sm:text-[6.5rem] md:text-[8rem] lg:text-[11rem] xl:text-[13rem] font-bold leading-[0.8] tracking-tighter uppercase text-black"
                        >
                            CLIENT<br />
                            PROJECTS
                        </motion.h1>
                    </div>
                </section>

                {/* Tabs Row */}
                <section className="w-full border-y border-black/10 flex overflow-x-auto no-scrollbar mb-16 lg:mb-32 select-none">
                    {STATIC_TABS.map((tab) => {
                        const isActive = selectedCategory === tab;
                        return (
                            <div
                                key={tab}
                                onClick={() => setSelectedCategory(tab)}
                                className="flex-1 min-w-[180px] lg:min-w-0 border-r border-black/10 last:border-r-0 flex items-center justify-center py-6 px-4 cursor-pointer hover:bg-black/5 transition-colors"
                            >
                                <span className={`text-xs sm:text-sm font-bold tracking-widest uppercase transition-all duration-300 ${isActive
                                        ? 'bg-black text-white px-6 py-2.5 rounded-full'
                                        : 'text-black/50'
                                    }`}>
                                    {tab}
                                </span>
                            </div>
                        )
                    })}
                </section>

                {/* Projects Grid */}
                <section className="w-full mb-32 lg:mb-48">
                    <div className="container mx-auto px-4 md:px-8 max-w-[1500px]">
                        {loading ? (
                            <div className="flex justify-center items-center py-32">
                                <Loader2 className="w-8 h-8 animate-spin text-black/40" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                                <AnimatePresence mode="popLayout">
                                    {filteredProjects.map((project, index) => {
                                        const displayImage = project.heroImage || project.image || project.thumbnail;
                                        const displayDesc = project.description || project.desc;
                                        const displayTitle = project.publicTitle || project.title;
                                        // Some projects might have an industry field, or fallback
                                        const industry = (project as any).industry || "Digital Experience";
                                        const projCats = project.categories || (project.category ? [project.category] : []);

                                        return (
                                            <motion.div
                                                key={project.id || index}
                                                layout
                                                initial={{ opacity: 0, y: 50 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 50 }}
                                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                                // Staggered look on desktop: even indexed items (2nd column) shift down
                                                className={`group ${index % 2 !== 0 ? 'md:mt-32' : ''}`}
                                            >
                                                <Link href={`/projeler/${project.slug || project.id}`} className="block">
                                                    {/* Image Container */}
                                                    <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden mb-6 lg:mb-8 bg-[#FAFAFA] border border-black/5">
                                                        {displayImage ? (
                                                            <img
                                                                src={displayImage}
                                                                alt={displayTitle}
                                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <FolderOpen className="w-16 h-16 text-black/10" />
                                                            </div>
                                                        )}

                                                        {/* Floating Top Left Pill */}
                                                        <div className="absolute top-6 left-6 bg-black/30 backdrop-blur-md text-white border border-white/20 px-5 py-2 rounded-full text-[11px] font-bold tracking-wider uppercase">
                                                            {industry}
                                                        </div>
                                                    </div>

                                                    {/* Info Section */}
                                                    <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                                                        {/* Title and Desc */}
                                                        <div className="flex-1 max-w-lg">
                                                            <h3 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 text-black group-hover:opacity-70 transition-opacity">
                                                                {displayTitle}
                                                            </h3>
                                                            {displayDesc && (
                                                                <p className="text-sm md:text-base font-medium text-black/60 leading-relaxed">
                                                                    {displayDesc}
                                                                </p>
                                                            )}
                                                        </div>

                                                        {/* Tech Pills Bottom Right */}
                                                        {projCats.length > 0 && (
                                                            <div className="flex flex-wrap gap-2 shrink-0">
                                                                {projCats.slice(0, 2).map((cat: string, i: number) => (
                                                                    <span key={i} className="px-5 py-2 rounded-full border border-black/10 text-[10px] md:text-xs font-bold uppercase tracking-widest text-black/60">
                                                                        {cat}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>

                                {filteredProjects.length === 0 && !loading && (
                                    <div className="col-span-full text-center py-32">
                                        <p className="text-black/40 font-medium text-lg">No projects found for this category.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {/* Additional Sections added sequentially */}

                {/* 1. Technologies Tab Container (already has a dark theme style natively maybe, wait, our created TechnologiesTabs is white/offwhite) */}
                <TechnologiesTabs />

                {/* 2. Client Quotes */}
                <OurClientsSay />

            </main>
            <ModernFooter />
        </>
    )
}
