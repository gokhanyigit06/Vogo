"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Header from "@/components/Header"
import ModernFooter from "@/components/ModernFooter"
import ModernCTA from "@/components/ModernCTA"
import Link from "next/link"
import { Calendar, Clock, ArrowRight } from "lucide-react"

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

const categories = ["Hepsi", "Tasarım", "Yazılım", "SEO", "Pazarlama", "E-Ticaret"]

export default function BlogPage() {
    const [selectedCategory, setSelectedCategory] = useState("Hepsi")
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
    const [loading, setLoading] = useState(true)

    // API'den verileri çek
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/posts')
                if (!res.ok) throw new Error('Veri çekilemedi')
                const data = await res.json()
                setBlogPosts(data)
            } catch (error) {
                console.error("Blog yüklenirken hata:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchPosts()
    }, [])

    const featuredPost = blogPosts.length > 0 ? blogPosts[0] : null

    // Güvenli filter işlemi (featuredPost undefined olabilir)
    const regularPosts = selectedCategory === "Hepsi"
        ? blogPosts.slice(1)
        : blogPosts.filter(post => post.category === selectedCategory && post.id !== (featuredPost?.id || -1))

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

                {/* 1. Sayfa Başlığı ve Giriş */}
                <section className="container mx-auto px-4 md:px-8 max-w-7xl mb-16 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                            Vogo Blog & İçgörüler
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                            Dijital dünyadaki son trendler, stratejiler ve Vogo uzmanlarından ipuçları.
                        </p>
                    </motion.div>
                </section>

                {/* 2. Öne Çıkan Yazı (Featured Post) */}
                {selectedCategory === "Hepsi" && featuredPost && (
                    <section className="container mx-auto px-4 md:px-8 max-w-7xl mb-24 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="group relative bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-emerald-500/30 transition-all duration-300 shadow-2xl shadow-emerald-900/10"
                        >
                            <Link href={`/blog/${featuredPost.id}`} className="grid lg:grid-cols-2 h-full">
                                {/* Sol: Görsel */}
                                <div className="relative h-[300px] lg:h-auto overflow-hidden">
                                    <img
                                        src={featuredPost.image}
                                        alt={featuredPost.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>

                                {/* Sağ: İçerik */}
                                <div className="p-8 lg:p-12 flex flex-col justify-center">
                                    <div className="flex items-center gap-4 mb-6">
                                        <span className="bg-emerald-500 text-slate-950 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">
                                            {featuredPost.category}
                                        </span>
                                        <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                                            <Calendar className="w-4 h-4" />
                                            {featuredPost.date}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                                            <Clock className="w-4 h-4" />
                                            {featuredPost.readTime}
                                        </div>
                                    </div>

                                    <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6 leading-tight group-hover:text-emerald-400 transition-colors">
                                        {featuredPost.title}
                                    </h2>

                                    <p className="text-slate-400 text-lg mb-8 line-clamp-3 leading-relaxed">
                                        {featuredPost.excerpt}
                                    </p>

                                    <div className="flex items-center gap-2 text-white font-semibold text-lg group-hover:gap-3 transition-all mt-auto">
                                        Devamını Oku <ArrowRight className="w-5 h-5 text-emerald-400" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    </section>
                )}

                {/* Filtreler */}
                <section className="container mx-auto px-4 md:px-8 max-w-7xl mb-12 relative z-10">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-slate-500 text-sm font-medium mr-2">Kategoriler:</span>
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${selectedCategory === category
                                    ? "bg-white text-slate-900 font-bold"
                                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </section>

                {/* 3. Düzenli Izgara (Clean Grid) */}
                <section className="container mx-auto px-4 md:px-8 max-w-7xl mb-32 relative z-10">
                    <motion.div
                        layout
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <AnimatePresence mode="popLayout">
                            {regularPosts.map((post) => (
                                <motion.div
                                    layout
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.1)] transition-all duration-300 hover:border-emerald-500/30 flex flex-col h-full"
                                >
                                    <Link href={`/blog/${post.id}`} className="flex flex-col h-full">
                                        {/* Görsel */}
                                        <div className="relative aspect-video overflow-hidden">
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>

                                        {/* İçerik */}
                                        <div className="p-6 flex flex-col flex-1">
                                            {/* Meta */}
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                                    {post.category}
                                                </span>
                                                <div className="flex items-center gap-3 text-slate-500 text-xs">
                                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                                                </div>
                                            </div>

                                            {/* Başlık */}
                                            <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                                                {post.title}
                                            </h3>

                                            {/* Özet */}
                                            <p className="text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                                                {post.excerpt}
                                            </p>

                                            {/* Link */}
                                            <div className="flex items-center gap-2 text-white text-sm font-semibold mt-auto group-hover:gap-3 transition-all">
                                                Devamını Oku <ArrowRight className="w-4 h-4 text-emerald-500" />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {regularPosts.length === 0 && !loading && (
                        <div className="text-center py-20 text-slate-500">
                            Bu kategoride şimdilik içerik yok.
                        </div>
                    )}
                </section>

                <ModernCTA />
            </main>
            <ModernFooter />
        </>
    )
}
