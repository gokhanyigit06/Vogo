"use client"
import { useParams, notFound } from "next/navigation"
import { useEffect, useState } from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import Head from "next/head"
import Header from "@/components/Header"
import ModernFooter from "@/components/ModernFooter"
import ModernCTA from "@/components/ModernCTA"
import BlogSEO from "@/components/BlogSEO"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, ArrowLeft, Twitter, Linkedin, Share2, MessageCircle, Loader2, User } from "lucide-react"

// Blog Post Type
type BlogPost = {
    id: string | number
    title: string
    slug: string
    excerpt: string
    content: string
    category: string
    image: string
    status?: string
    read_time?: string
    readTime?: string
    date?: string
    created_at?: string
}


export default function BlogPostPage() {
    const params = useParams()
    const slug = params?.slug as string

    const [post, setPost] = useState<BlogPost | null>(null)
    const [loading, setLoading] = useState(true)
    const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])

    const { scrollYProgress } = useScroll()
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    // Fetch post data
    useEffect(() => {
        if (!slug) return

        const fetchPost = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/posts/${slug}`)

                if (!res.ok) {
                    notFound()
                    return
                }

                const data = await res.json()
                setPost(data)

                // Fetch all posts for related posts section
                const allPostsRes = await fetch('/api/posts')
                if (allPostsRes.ok) {
                    const allPosts = await allPostsRes.json()
                    const filtered = allPosts
                        .filter((p: BlogPost) => p.slug !== slug && p.status !== 'draft')
                        .slice(0, 3)
                    setRelatedPosts(filtered)
                }
            } catch (error) {
                console.error('Error fetching post:', error)
                notFound()
            } finally {
                setLoading(false)
            }
        }

        fetchPost()
    }, [slug])

    // Loading state
    if (loading) {
        return (
            <>
                <Header />
                <div className="bg-background min-h-screen flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                        <p className="text-muted-foreground font-medium">Yazı yükleniyor...</p>
                    </div>
                </div>
            </>
        )
    }

    if (!post) {
        notFound()
        return null
    }

    // Format date
    const formattedDate = post.date || (post.created_at ? new Date(post.created_at).toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }) : 'Tarih yok')

    // Read time
    const readTime = post.read_time || post.readTime || '5 dk'


    return (
        <>
            <Head>
                <BlogSEO
                    title={post.title}
                    description={post.excerpt}
                    image={post.image}
                    url={`https://vogo-agency.vercel.app/blog/${post.slug || post.id}`}
                    publishedTime={post.created_at}
                    category={post.category}
                />
            </Head>

            <Header />

            {/* 3. Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1.5 bg-emerald-500 origin-left z-[100]"
                style={{ scaleX }}
            />

            <main className="bg-background min-h-screen pb-20 text-foreground transition-colors duration-300">

                {/* 1. Hero Section (60vh) */}
                <div className="relative h-[60vh] w-full">
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Gradient Overlay: Darker at bottom for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

                    <div className="absolute inset-0 flex flex-col justify-end container mx-auto px-4 md:px-8 max-w-7xl pb-16 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
                                <span className="bg-emerald-500 text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg shadow-emerald-500/20">
                                    {post.category}
                                </span>
                                <div className="flex items-center gap-2 text-foreground/80 font-bold bg-background/50 backdrop-blur-md px-3 py-1 rounded-full border border-foreground/5">
                                    <Clock className="w-4 h-4" />
                                    {readTime} okuma
                                </div>
                            </div>

                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-foreground max-w-5xl leading-tight mb-4 drop-shadow-sm">
                                {post.title}
                            </h1>
                        </motion.div>
                    </div>
                </div>

                <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10 -mt-8">
                    <div className="grid lg:grid-cols-[80px_1fr_300px] gap-12">

                        {/* 3. Sticky Social Share (Left) */}
                        <aside className="hidden lg:block relative">
                            <div className="sticky top-32 flex flex-col gap-4">
                                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest text-center mb-2 [writing-mode:vertical-rl]">Paylaş</p>
                                <button className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-white hover:bg-[#0077b5] hover:border-[#0077b5] transition-all shadow-sm">
                                    <Linkedin className="w-4 h-4" />
                                </button>
                                <button className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-white hover:bg-black hover:border-black transition-all shadow-sm">
                                    <Twitter className="w-4 h-4" />
                                </button>
                                <button className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-white hover:bg-[#25D366] hover:border-[#25D366] transition-all shadow-sm">
                                    <MessageCircle className="w-4 h-4" />
                                </button>
                            </div>
                        </aside>

                        {/* 2. Content Area (Center) */}
                        <article className="max-w-3xl mx-auto w-full">
                            {/* Author Info (Top) */}
                            <div className="flex items-center gap-4 mb-12 border-b border-border pb-8">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 p-0.5 shadow-md">
                                    <div className="w-full h-full rounded-full bg-card flex items-center justify-center text-emerald-600 font-bold border-2 border-white">
                                        VY
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-foreground font-bold">Volkan Yıldırım</h4>
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                                        <span>{formattedDate}</span>
                                        <span className="w-1 h-1 rounded-full bg-border"></span>
                                        <span>Görüntülenme: 1.2k</span>
                                    </div>
                                </div>
                            </div>

                            {/* Main Text Content */}
                            <div className="prose prose-lg dark:prose-invert max-w-none prose-emerald prose-headings:font-bold prose-p:text-muted-foreground prose-a:text-emerald-500 hover:prose-a:text-emerald-600">
                                <p className="text-xl leading-relaxed text-foreground font-medium mb-8 font-serif italic border-l-4 border-emerald-500 pl-6 py-4 bg-muted/30 rounded-r-xl">
                                    {post.excerpt}
                                </p>

                                {/* DYNAMIC CONTENT RENDERED HERE */}
                                <div
                                    dangerouslySetInnerHTML={{ __html: post.content || '' }}
                                    className="leading-relaxed"
                                />
                            </div>

                            {/* 4. Author Card (Bottom) */}
                            <div className="mt-16 bg-card border border-border rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-8 text-center md:text-left shadow-sm">
                                <div className="w-24 h-24 rounded-full bg-muted border-4 border-background shadow-lg flex-shrink-0 overflow-hidden relative flex items-center justify-center">
                                    <User className="w-10 h-10 text-muted-foreground" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-foreground mb-2">Hakkında: Volkan Yıldırım</h3>
                                    <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
                                        Vogo Agency'nin kurucu ortağı. 10+ yıldır dijital ürün tasarımı ve kullanıcı deneyimi üzerine çalışıyor. Minimalist ve işlevsel tasarımlar üzerine uzmanlaşmış.
                                    </p>
                                    <div className="flex justify-center md:justify-start gap-5">
                                        <a href="#" className="text-emerald-600 font-bold text-sm hover:underline hover:text-emerald-700">Twitter</a>
                                        <a href="#" className="text-emerald-600 font-bold text-sm hover:underline hover:text-emerald-700">LinkedIn</a>
                                        <a href="#" className="text-emerald-600 font-bold text-sm hover:underline hover:text-emerald-700">Behance</a>
                                    </div>
                                </div>
                            </div>
                        </article>

                        {/* Right Column (Empty for now/Ads) */}
                        <div className="hidden lg:block"></div>
                    </div>

                    {/* 4. Related Posts */}
                    {relatedPosts.length > 0 && (
                        <div className="mt-24 border-t border-border pt-16">
                            <h3 className="text-2xl font-bold text-foreground mb-8">İlginizi Çekebilecek Diğer Yazılar</h3>
                            <div className="grid md:grid-cols-3 gap-8">
                                {relatedPosts.map((related) => {
                                    const relatedReadTime = related.read_time || related.readTime || '5 dk'
                                    return (
                                        <Link href={`/blog/${related.slug || related.id}`} key={related.id} className="group block">
                                            <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 border border-border group-hover:border-emerald-500/50 transition-all shadow-sm group-hover:shadow-md">
                                                <Image
                                                    src={related.image}
                                                    alt={related.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
                                                {related.category}
                                            </div>
                                            <h4 className="text-foreground font-bold text-lg mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-tight">
                                                {related.title}
                                            </h4>
                                            <div className="text-xs text-muted-foreground font-medium">
                                                {relatedReadTime} okuma
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <ModernCTA />
            </main>
            <ModernFooter />
        </>
    )
}
