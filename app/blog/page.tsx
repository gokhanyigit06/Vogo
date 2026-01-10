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

    // Güvenli filter işlemi
    const regularPosts = selectedCategory === "Hepsi"
        ? blogPosts.slice(1)
        : blogPosts.filter(post => post.category === selectedCategory && post.id !== (featuredPost?.id || -1))

    if (loading) {
        return (
            <div className="bg-background min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <>
            <Header />
            <main className="bg-background min-h-screen pt-24 pb-20 overflow-hidden">

                {/* 1. Sayfa Başlığı ve Giriş */}
                <section className="container mx-auto px-4 md:px-8 max-w-7xl mb-16 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
                            Vogo Blog & İçgörüler
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
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
                            className="group relative bg-card border border-border rounded-[2rem] overflow-hidden hover:border-emerald-500/30 transition-all duration-300 shadow-sm hover:shadow-lg"
                        >
                            <Link href={`/blog/${featuredPost.id}`} className="grid lg:grid-cols-2 h-full">
                                {/* Sol: Görsel */}
                                <div className="relative h-[300px] lg:h-auto overflow-hidden">
                                    <img
                                        src={featuredPost.image}
                                        alt={featuredPost.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:hidden" />
                                </div>

                                {/* Sağ: İçerik */}
                                <div className="p-8 lg:p-12 flex flex-col justify-center">
                                    <div className="flex items-center gap-4 mb-6">
                                        <span className="bg-emerald-500 text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider shadow-md shadow-emerald-500/20">
                                            {featuredPost.category}
                                        </span>
                                        <div className="flex items-center gap-1.5 text-muted-foreground text-sm font-medium">
                                            <Calendar className="w-4 h-4" />
                                            {featuredPost.date}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-muted-foreground text-sm font-medium">
                                            <Clock className="w-4 h-4" />
                                            {featuredPost.readTime}
                                        </div>
                                    </div>

                                    <h2 className="text-3xl lg:text-4xl font-black text-foreground mb-6 leading-tight group-hover:text-emerald-600 transition-colors">
                                        {featuredPost.title}
                                    </h2>

                                    <p className="text-muted-foreground text-lg mb-8 line-clamp-3 leading-relaxed">
                                        {featuredPost.excerpt}
                                    </p>

                                    <div className="flex items-center gap-2 text-foreground font-bold text-lg group-hover:gap-3 transition-all mt-auto">
                                        Devamını Oku <ArrowRight className="w-5 h-5 text-emerald-500" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    </section>
                )}

                {/* Filtreler */}
                <section className="container mx-auto px-4 md:px-8 max-w-7xl mb-12 relative z-10">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-muted-foreground text-sm font-bold uppercase tracking-wider mr-2">Kategoriler:</span>
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${selectedCategory === category
                                    ? "bg-foreground text-background shadow-lg scale-105"
                                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:scale-105"
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
                                    className="group bg-card border border-border rounded-[2rem] overflow-hidden hover:-translate-y-2 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 hover:border-emerald-500/30 flex flex-col h-full"
                                >
                                    <Link href={`/blog/${post.id}`} className="flex flex-col h-full">
                                        {/* Görsel */}
                                        <div className="relative aspect-video overflow-hidden">
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm border border-border px-3 py-1 rounded-full text-xs font-bold text-foreground">
                                                {post.category}
                                            </div>
                                        </div>

                                        {/* İçerik */}
                                        <div className="p-8 flex flex-col flex-1">

                                            {/* Meta */}
                                            <div className="flex items-center gap-4 mb-4 text-xs font-medium text-muted-foreground">
                                                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                                                <span className="w-1 h-1 rounded-full bg-border" />
                                                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                                            </div>

                                            {/* Başlık */}
                                            <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors leading-tight">
                                                {post.title}
                                            </h3>

                                            {/* Özet */}
                                            <p className="text-muted-foreground text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                                                {post.excerpt}
                                            </p>

                                            {/* Link */}
                                            <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold mt-auto group-hover:gap-3 transition-all">
                                                Makaleyi Oku <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {regularPosts.length === 0 && !loading && (
                        <div className="text-center py-20">
                            <div className="inline-block p-4 rounded-full bg-muted mb-4">
                                <Calendar className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground font-medium">Bu kategoride henüz içerik bulunmuyor.</p>
                        </div>
                    )}
                </section>

                <ModernCTA />
            </main>
            <ModernFooter />
        </>
    )
}
