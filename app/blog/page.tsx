"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Header from "@/components/Header"
import ModernFooter from "@/components/ModernFooter"
import ModernCTA from "@/components/ModernCTA"
import Link from "next/link"
import { Calendar, Clock, ArrowRight, ArrowUpRight } from "lucide-react"

// Types
type BlogPost = {
    id: number | string
    title: string
    excerpt: string
    category: string
    date: string
    readTime: string
    image: string
    featured?: boolean
    content?: string
}

const categories = ["all topics", "web development", "animation", "branding", "business", "case study", "illustration", "expert insights"]

export default function BlogPage() {
    const [selectedCategory, setSelectedCategory] = useState("all topics")
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
    const [loading, setLoading] = useState(true)

    // Dummy Data
    const dummyPosts: BlogPost[] = [
        {
            id: 'featured-1',
            title: "Case Study: Orakle. Modern Web Design for Medical Education",
            excerpt: "A case study on designing a modern, credible website for Orakle—a medical education platform for clinicians. Subtle 3D, modular layouts, and motion built for trust, clarity, and scale.",
            category: "UI/UX, Illustration",
            date: "Oct 24, 2024",
            readTime: "6 min read",
            image: "https://cdn.dribbble.com/userupload/13004313/file/original-b1846b083395646d51025064eb9856cc.png?resize=1504x1128",
            featured: true
        },
        {
            id: 'sidebar-1',
            title: "Case Study: ABUK—Designing Ukraine’s Leading Audiobook Platform",
            excerpt: "Designing a comprehensive audiobook platform that connects authors and listeners.",
            category: "Case Study, UI/UX",
            date: "Oct 20, 2024",
            readTime: "4 min read",
            image: "https://tubikstudio.com/wp-content/uploads/2021/05/abuk-audiobook-app-design-tubik-0.png"
        },
        {
            id: 'sidebar-2',
            title: "EternaCloud Case Study: Calm Design for Complex Systems",
            excerpt: "How we simplified complex data visualization for a cloud management platform.",
            category: "Case Study, UI/UX, Web",
            date: "Oct 18, 2024",
            readTime: "5 min read",
            image: "https://tubikstudio.com/wp-content/uploads/2023/11/eternacloud-website-design-tubik-0.jpg"
        },
        {
            id: 'sidebar-3',
            title: "Netti Case Study: Measuring the Invisible",
            excerpt: "Brand identity and web design for an innovative analytics tool.",
            category: "Case Study, UI/UX",
            date: "Oct 15, 2024",
            readTime: "3 min read",
            image: "https://tubikstudio.com/wp-content/uploads/2023/06/netti-identity-design-tubik-0.jpg"
        },
        {
            id: 'sidebar-4',
            title: "SPYLT Case Study: Delicious by Design",
            excerpt: "Creating a vibrant and energetic brand for a new energy drink.",
            category: "Case Study, Branding",
            date: "Oct 10, 2024",
            readTime: "7 min read",
            image: "https://tubikstudio.com/wp-content/uploads/2023/08/spylt-energy-drink-branding-packaging-tubik-0.jpg"
        }
    ]

    // API'den verileri çek
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/posts')
                if (!res.ok) throw new Error('Veri çekilemedi')
                const data = await res.json()

                if (data.length > 0) {
                    setBlogPosts(data)
                } else {
                    // Veri yoksa dummy data kullan
                    setBlogPosts(dummyPosts)
                }
            } catch (error) {
                console.error("Blog yüklenirken hata:", error)
                // Hata durumunda da dummy data kullan
                setBlogPosts(dummyPosts)
            } finally {
                setLoading(false)
            }
        }

        fetchPosts()
    }, [])

    const filteredPosts = selectedCategory === "all topics"
        ? blogPosts
        : blogPosts.filter(post => post.category?.toLowerCase() === selectedCategory.toLowerCase())

    const featuredPost = filteredPosts[0]
    const sidebarPosts = filteredPosts.slice(1, 5)
    const remainingPosts = filteredPosts.slice(5)

    if (loading) {
        return (
            <div className="bg-background min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <>
            <Header />
            <main className="bg-background min-h-screen pt-32 pb-20">

                {/* 1. Top Navigation & Header */}
                <section className="container mx-auto px-4 md:px-8 max-w-[95%] w-full mb-12">
                    {/* Categories */}
                    <div className="flex flex-wrap gap-x-8 gap-y-4 mb-16 text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`transition-colors hover:text-black ${selectedCategory === cat ? "text-black font-bold" : ""
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Blog Title */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 border-b border-black/10 pb-8">
                        <h1 className="text-6xl md:text-8xl font-serif font-medium tracking-tight text-black">
                            vogo blog
                        </h1>
                        <div className="hidden md:block mb-4">
                            <span className="text-lg font-medium text-black cursor-pointer hover:underline underline-offset-4">view latest</span>
                        </div>
                    </div>
                </section>

                {/* 2. Hero Grid (Featured + Sidebar) */}
                {featuredPost && (
                    <section className="container mx-auto px-4 md:px-8 max-w-[95%] w-full mb-24">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                            {/* Featured Post (Big Card) */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="group relative bg-[#F4A8FF] dark:bg-purple-900 rounded-[2.5rem] p-8 md:p-12 flex flex-col justify-between overflow-hidden min-h-[600px] transition-transform hover:scale-[1.01] duration-500"
                            >
                                <Link href={`/blog/${featuredPost.id}`} className="absolute inset-0 z-20" />

                                {/* Content Top */}
                                <div className="relative z-10 max-w-2xl">
                                    <div className="flex flex-wrap gap-3 mb-6">
                                        <span className="text-xs font-bold tracking-widest uppercase text-black/70">
                                            {featuredPost.category || 'CASE STUDY'}
                                        </span>
                                        <span className="text-xs font-bold tracking-widest uppercase text-black/70">
                                            • {featuredPost.readTime}
                                        </span>
                                    </div>
                                    <h2 className="text-4xl md:text-6xl font-medium text-black leading-[1.1] mb-6 group-hover:underline decoration-2 underline-offset-8">
                                        {featuredPost.title}
                                    </h2>
                                    <p className="text-black/80 text-lg md:text-xl font-medium leading-relaxed line-clamp-3">
                                        {featuredPost.excerpt}
                                    </p>
                                </div>

                                {/* Image Bottom */}
                                <div className="relative mt-auto pt-12 self-center w-full max-w-[80%] mx-auto transform group-hover:scale-105 transition-transform duration-700 ease-out">
                                    <img
                                        src={featuredPost.image}
                                        alt={featuredPost.title}
                                        className="relative z-10 w-full h-auto object-contain drop-shadow-2xl rounded-xl skew-y-1 rotate-1"
                                    />
                                </div>
                            </motion.div>

                            {/* Sidebar Layout posts (Grid 2x2) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 h-full">
                                {sidebarPosts.map((post, index) => {
                                    // Cycle through colors specific to the design
                                    const colors = ["bg-[#9D7BCE]", "bg-[#FCDDEC]", "bg-[#FF7324]", "bg-[#65DCA6]"]
                                    const colorClass = colors[index % colors.length]

                                    return (
                                        <motion.div
                                            key={post.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            className={`group ${colorClass} rounded-[2.5rem] p-6 flex flex-col justify-between relative overflow-hidden h-[350px] lg:h-auto hover:shadow-lg transition-transform hover:-translate-y-1 duration-300`}
                                        >
                                            <Link href={`/blog/${post.id}`} className="absolute inset-0 z-20" />

                                            <div className="w-full aspect-square rounded-full overflow-hidden mb-4 mx-auto bg-black/5 transform group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                                                <img
                                                    src={post.image}
                                                    alt={post.title}
                                                    className="w-[90%] h-[90%] object-cover rounded-full"
                                                />
                                            </div>

                                            <div className="mt-auto">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-[10px] font-bold tracking-widest uppercase text-black/60">
                                                        {post.category}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl md:text-2xl font-bold leading-tight text-black group-hover:underline decoration-2 underline-offset-4 line-clamp-3">
                                                    {post.title}
                                                </h3>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                                {sidebarPosts.length < 4 && (
                                    // Fill empty slots if we don't have enough posts
                                    Array.from({ length: 4 - sidebarPosts.length }).map((_, i) => (
                                        <div key={`empty-${i}`} className="bg-muted/30 rounded-[2.5rem] p-6 flex items-center justify-center border border-dashed border-black/10">
                                            <p className="text-muted-foreground text-sm font-medium">Coming Soon</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {/* 3. Popular Section (Horizontal Scroll) */}
                <section className="mb-32 overflow-hidden">
                    <div className="container mx-auto px-4 md:px-8 max-w-[95%] w-full">
                        <h2 className="text-5xl md:text-7xl font-serif font-medium mb-12 text-black">Popular</h2>
                    </div>

                    <div className="w-full overflow-x-auto pb-8 hide-scrollbar">
                        <div className="flex gap-6 px-4 md:px-8 container mx-auto max-w-[95%] w-full min-w-max">
                            {/* Colorful Cards */}
                            {[
                                { color: "bg-[#FA2E6E]", title: "Web Design: 16 Basic Types of Web Pages", category: "UI/UX", desc: "In this guide, we break down the anatomy and role of 16 must-know web page types.", image: "/illustration-1.png" },
                                { color: "bg-[#5EACFF]", title: "The Anatomy of a Web Page: 14 Design Elements", category: "UI/UX", desc: "Explore how headers, CTAs, sliders & more shape user behavior.", image: "/illustration-2.png" },
                                { color: "bg-[#FFBB54]", title: "Mobile UI Design: 15 Basic Types of Screens", category: "Processes and Tools", desc: "Mobile applications evolve with user's needs offering new functionality.", image: "/illustration-3.png" },
                                { color: "bg-[#5CDF95]", title: "Color Theory in UI & Graphic Design: Practical Guide", category: "Processes and Tools", desc: "We feel color before we see it. This guide explains how color theory works in UI.", image: "/illustration-4.png" },
                            ].map((card, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`relative flex-shrink-0 w-[350px] md:w-[400px] h-[500px] ${card.color} rounded-[2rem] p-8 md:p-10 flex flex-col justify-between text-black transition-transform hover:-translate-y-2 hover:shadow-xl duration-300`}
                                >
                                    {/* Link overlay */}
                                    <Link href="/blog" className="absolute inset-0 z-20" />

                                    <div className="relative z-10">
                                        <span className="text-xs font-bold tracking-[0.2em] uppercase opacity-70 mb-6 block">
                                            {card.category}
                                        </span>
                                        <h3 className="text-3xl md:text-4xl font-medium leading-tight mb-6">
                                            {card.title}
                                        </h3>
                                        <p className="text-lg font-medium opacity-80 leading-relaxed">
                                            {card.desc}
                                        </p>
                                    </div>

                                    {/* Illustration placeholder */}
                                    <div className="relative h-32 w-full mt-auto flex justify-end items-end opacity-90">
                                        {/* Using random abstract shapes/icons as placeholders since we don't have specific illustrations */}
                                        <div className="w-24 h-24 bg-black/10 rounded-full blur-2xl absolute -bottom-4 -right-4" />
                                        <div className="w-20 h-20 border-4 border-black/10 rounded-full absolute -bottom-8 right-12" />
                                        <div className="w-32 h-32 border-2 border-black/5 rotate-12 absolute -bottom-10 -right-10" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 4. Case Studies Section */}
                <section className="container mx-auto px-4 md:px-8 max-w-[95%] w-full mb-32">
                    <div className="flex items-end justify-between gap-4 mb-12 border-b border-black/5 pb-8">
                        <h2 className="text-5xl md:text-7xl font-serif font-medium text-black">Case studies</h2>
                        <Link href="#" className="text-lg font-medium text-black hover:underline underline-offset-4 mb-2">view all</Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                id: "cs-1",
                                color: "bg-[#F4A8FF]", // Pink
                                category: "CASE STUDY, UI/UX, ILLUSTRATION",
                                title: "Case Study: Orakle. Modern Web Design for Medical Education",
                                desc: "A case study on designing a modern, credible website for Orakle—a medical education platform for clinicians. Subtle 3D, modular layouts, and motion built for trust, clarity, and scale.",
                                image: "https://tubikstudio.com/wp-content/uploads/2024/02/orakle-medical-education-platform-identity-mockup-tubik-0.jpg"
                            },
                            {
                                id: "cs-2",
                                color: "bg-[#9D7BCE]", // Purple
                                category: "CASE STUDY, UI/UX",
                                title: "Case Study: ABUK—Designing Ukraine’s Leading Audiobook Platform",
                                desc: "Designing a comprehensive audiobook platform that connects authors and listeners.",
                                image: "https://tubikstudio.com/wp-content/uploads/2021/05/abuk-audiobook-app-design-tubik-0.png"
                            },
                            {
                                id: "cs-3",
                                color: "bg-[#FCDDEC]", // Light Pink
                                category: "CASE STUDY, UI/UX, ILLUSTRATION, WEB DEVELOPMENT",
                                title: "EternaCloud Case Study: Calm Design for Complex Systems",
                                desc: "How we simplified complex data visualization for a cloud management platform.",
                                image: "https://tubikstudio.com/wp-content/uploads/2023/11/eternacloud-website-design-tubik-0.jpg"
                            }
                        ].map((study, index) => (
                            <motion.div
                                key={study.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`group relative ${study.color} rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between h-[600px] overflow-hidden transition-transform hover:-translate-y-2 duration-300`}
                            >
                                <Link href="#" className="absolute inset-0 z-20" />

                                <div className="relative z-10 mb-8">
                                    <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-black/60 mb-6 leading-relaxed">
                                        {study.category}
                                    </div>
                                    <h3 className="text-3xl md:text-4xl font-medium leading-[1.1] text-black group-hover:underline decoration-2 underline-offset-4 mb-6">
                                        {study.title}
                                    </h3>
                                    <p className="text-black/80 font-medium leading-relaxed line-clamp-3">
                                        {study.desc}
                                    </p>
                                </div>

                                <div className="relative mt-auto w-[120%] -ml-[10%] aspect-square self-center transform group-hover:scale-105 transition-transform duration-700">
                                    {/* Image placeholder with perspective */}
                                    <div className="absolute inset-0 flex items-center justify-center translate-y-12">
                                        <img
                                            src={study.image}
                                            alt={study.title}
                                            className="w-[80%] h-auto object-contain drop-shadow-2xl rounded-xl rotate-12 group-hover:rotate-6 transition-transform duration-700"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* 3. Remaining Posts (Standard Grid) */}
                {remainingPosts.length > 0 && (
                    <section className="container mx-auto px-4 md:px-8 max-w-[95%] w-full mb-32">
                        <div className="flex items-center gap-4 mb-8">
                            <h3 className="text-2xl font-bold">More Stories</h3>
                            <div className="h-px flex-1 bg-black/10" />
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {remainingPosts.map((post, idx) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="group relative flex flex-col gap-4"
                                >
                                    <Link href={`/blog/${post.id}`} className="block overflow-hidden rounded-[2rem]">
                                        <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            {/* Hover overlay icon */}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-all duration-300">
                                                    <ArrowUpRight className="w-6 h-6 text-black" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>

                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                            <span>{post.category}</span>
                                            <span className="w-1 h-1 rounded-full bg-black/20" />
                                            <span>{post.date}</span>
                                        </div>
                                        <h3 className="text-2xl font-bold leading-tight group-hover:underline underline-offset-4">
                                            <Link href={`/blog/${post.id}`}>
                                                {post.title}
                                            </Link>
                                        </h3>
                                        <p className="text-muted-foreground line-clamp-2">
                                            {post.excerpt}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

                {filteredPosts.length === 0 && !loading && (
                    <div className="container mx-auto px-4 text-center py-20 bg-muted/30 rounded-[2rem] max-w-[95%]">
                        <p className="text-xl font-medium text-muted-foreground">Bu kategoride henüz içerik bulunmuyor.</p>
                        <button onClick={() => setSelectedCategory("all topics")} className="mt-4 text-primary hover:underline font-bold">
                            Tüm yazıları gör
                        </button>
                    </div>
                )}

            </main>
            <ModernFooter />
        </>
    )
}
