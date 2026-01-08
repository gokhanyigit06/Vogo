"use client"
import { useParams } from "next/navigation"

import { useEffect, useState } from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import Header from "@/components/Header"
import ModernFooter from "@/components/ModernFooter"
import ModernCTA from "@/components/ModernCTA"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, ArrowLeft, Twitter, Linkedin, Share2, MessageCircle } from "lucide-react"

// Mock Blog Data (Zengin İçerikli)
const blogPosts = [
    {
        id: 1,
        title: "2026 Web Tasarım Trendleri: Minimalizm ve Yapay Zeka",
        excerpt: "Web tasarım dünyası hızla değişiyor. Yapay zeka destekli arayüzler ve neo-brutalism akımının yükselişi hakkında bilmeniz gerekenler.",
        category: "Tasarım",
        date: "10 Ocak 2026",
        readTime: "5 dk",
        image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=1200&q=80",
        content: `
            <p>Dijital dünyada yenilikler hız kesmeden devam ediyor. Minimalist tasarımların, kullanıcı deneyimini (UX) ön planda tutan yaklaşımlarla birleşmesi, 2026 yılının en belirgin trendlerinden biri olacak.</p>
            
            <h2 class="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 flex items-center gap-3">
                <span class="w-2 h-8 bg-emerald-500 rounded-full"></span>
                Yapay Zekanın Tasarıma Etkisi
            </h2>
            <p>AI destekli araçlar, tasarımcıların rutin işlerini otomatikleştirirken, yaratıcılıklarına daha fazla zaman ayırmalarına olanak tanıyor. Midjourney ve DALL-E gibi araçlarla oluşturulan görseller, web sitelerine özgünlük katıyor.</p>

            <div class="my-10 relative h-[400px] w-full rounded-2xl overflow-hidden border border-slate-700 shadow-2xl block">
                <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80" alt="AI Design" class="object-cover w-full h-full" />
                <div class="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-4 text-xs text-slate-300">
                    Yapay zeka ile oluşturulmuş fütüristik bir arayüz konsepti.
                </div>
            </div>

            <h2 class="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 flex items-center gap-3">
                <span class="w-2 h-8 bg-emerald-500 rounded-full"></span>
                Neo-Brutalism Akımı
            </h2>
            <p>Geçmişin cesur ve ham tasarım dili, modern dokunuşlarla geri dönüyor. Kalın tipografi, kontrast renkler ve asimetrik düzenler, markaların daha akılda kalıcı olmasını sağlıyor.</p>
        `,
        featured: true
    },
    {
        id: 2,
        title: "Next.js 15 ve Sunucu Bileşenlerinin Gücü",
        excerpt: "React ekosisteminin amiral gemisi Next.js'in yeni sürümüyle gelen performans iyileştirmeleri ve Server Actions kullanımı.",
        category: "Yazılım",
        date: "8 Ocak 2026",
        readTime: "8 dk",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
        content: `
            <p>React ekosistemi, Next.js 15 ile devrim niteliğinde bir güncelleme aldı. Artık <strong>Server Components</strong> varsayılan olarak geliyor ve bu, istemciye gönderilen JavaScript miktarını (bundle size) inanılmaz derecede azaltıyor.</p>

            <h2 class="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 flex items-center gap-3">
                <span class="w-2 h-8 bg-emerald-500 rounded-full"></span>
                Neden Server Actions?
            </h2>
            <p>Eskiden form gönderimleri için ayrı API route'ları yazmak zorundaydık. Next.js 15 ile birlikte, <code>server actions</code> sayesinde fonksiyonları doğrudan bileşenlerin içinde tanımlayıp çağırabiliyoruz. Bu hem geliştirme hızını artırıyor hem de tip güvenliğini (type-safety) koruyor.</p>

            <pre class="bg-slate-900 border border-slate-800 p-6 rounded-xl overflow-x-auto my-8 text-emerald-400 font-mono text-sm">
async function createPost(formData: FormData) {
  'use server'
  const title = formData.get('title')
  await db.post.create({ data: { title } })
}
            </pre>

            <p>Vogo Agency olarak tüm yeni projelerimizde Next.js 15 altyapısını kullanarak müşterilerimize ışık hızında web deneyimleri sunuyoruz.</p>
        `,
        featured: false
    },
    {
        id: 3,
        title: "SEO 2.0: Yapay Zeka Çağında Arama Motoru Optimizasyonu",
        excerpt: "Google'ın SGE (Search Generative Experience) güncellemesi sonrası SEO stratejileri nasıl değişmeli?",
        category: "SEO",
        date: "5 Ocak 2026",
        readTime: "6 dk",
        image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80",
        content: `
            <p>SEO artık sadece anahtar kelime doldurmak değil. Google'ın yeni yapay zeka destekli arama deneyimi (SGE), kullanıcıların sorularına doğrudan yanıtlar üretiyor. Peki siteniz bu yeni dünyada nasıl öne çıkacak?</p>

            <h2 class="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 flex items-center gap-3">
                <span class="w-2 h-8 bg-emerald-500 rounded-full"></span>
                E-E-A-T Kriterleri
            </h2>
            <p>Deneyim, Uzmanlık, Yetkinlik ve Güvenilirlik. İçerikleriniz artık bu 4 kriteri tam olarak karşılamak zorunda. Yazar biyografileri, kaynak gösterme ve derinlemesine analizler hiç olmadığı kadar önemli.</p>

            <ul class="space-y-4 my-8 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                <li class="flex items-start gap-3 text-slate-300">
                    <div class="w-2 h-2 rounded-full bg-emerald-500 mt-2"></div>
                    Soru-Cevap formatında içerikler üretin.
                </li>
                <li class="flex items-start gap-3 text-slate-300">
                    <div class="w-2 h-2 rounded-full bg-emerald-500 mt-2"></div>
                    Yapılandırılmış veri (Schema Markup) kullanımını artırın.
                </li>
                <li class="flex items-start gap-3 text-slate-300">
                    <div class="w-2 h-2 rounded-full bg-emerald-500 mt-2"></div>
                    Kullanıcı niyetine (Search Intent) odaklanın.
                </li>
            </ul>
        `,
        featured: false
    },
    {
        id: 4,
        title: "Veri Odaklı Dijital Pazarlama Stratejileri",
        excerpt: "Reklam bütçenizi en verimli şekilde kullanmak için ROAS ve ROI metriklerini nasıl analiz etmelisiniz?",
        category: "Pazarlama",
        date: "2 Ocak 2026",
        readTime: "4 dk",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
        content: `<p>Veri, modern pazarlamanın petrolüdür. Ancak ham veri tek başına bir anlam ifade etmez. Doğru analiz araçları ve stratejilerle veriyi işleyerek rakiplerinizin önüne geçebilirsiniz.</p>`,
        featured: false
    },
    {
        id: 5,
        title: "E-Ticarette Dönüşüm Oranını Artıran UX İpuçları",
        excerpt: "Kullanıcıların sepeti terk etmesini engelleyen psikolojik tetikleyiciler ve tasarım taktikleri.",
        category: "E-Ticaret",
        date: "28 Aralık 2025",
        readTime: "7 dk",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?w=800&q=80",
        content: `<p>Bir e-ticaret sitesinin başarısı, ziyaretçiyi müşteriye dönüştürebilme yeteneğiyle ölçülür. Hızlı ödeme sayfaları, güven sinyalleri ve net CTA butonları dönüşüm oranlarınızı (CRO) ikiye katlayabilir.</p>`,
        featured: false
    },
    {
        id: 6,
        title: "Global Pazarda Markalaşma: Etsy ve Amazon",
        excerpt: "Yerel bir üreticiden global bir markaya dönüşmek için pazar yeri optimizasyonunun püf noktaları.",
        category: "E-Ticaret",
        date: "25 Aralık 2025",
        readTime: "6 dk",
        image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
        content: `<p>Türkiye'den dünyaya açılmak artık hayal değil. Etsy ve Amazon gibi dev pazaryerlerinde doğru ürün fotoğrafları, SEO uyumlu başlıklar ve müşteri hizmetleri yönetimi ile global bir marka olabilirsiniz.</p>`,
        featured: false
    }
]

export default function BlogPostPage() {
    const params = useParams()
    const slug = params?.slug as string

    // Debug için: Konsola basıp bakalım ne geliyor
    // console.log("Current Slug:", slug)

    const postId = slug ? parseInt(slug) : 1
    const post = blogPosts.find(p => p.id === postId) || blogPosts[0]

    const { scrollYProgress } = useScroll()
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    if (!post) return <div>Yazı bulunamadı.</div>

    return (
        <>
            <Header />

            {/* 3. Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1.5 bg-emerald-500 origin-left z-[100]"
                style={{ scaleX }}
            />

            <main className="bg-slate-950 min-h-screen pb-20">

                {/* 1. Hero Section (60vh) */}
                <div className="relative h-[60vh] w-full">
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                    <div className="absolute inset-0 flex flex-col justify-end container mx-auto px-4 md:px-8 max-w-7xl pb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <span className="bg-emerald-500 text-slate-950 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">
                                    {post.category}
                                </span>
                                <div className="flex items-center gap-2 text-slate-300 font-medium">
                                    <Clock className="w-4 h-4" />
                                    {post.readTime} okuma
                                </div>
                            </div>

                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white max-w-5xl leading-tight">
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
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest text-center mb-2 [writing-mode:vertical-rl]">Paylaş</p>
                                <button className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#0077b5] hover:border-[#0077b5] transition-all">
                                    <Linkedin className="w-4 h-4" />
                                </button>
                                <button className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-black hover:border-white transition-all">
                                    <Twitter className="w-4 h-4" />
                                </button>
                                <button className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#25D366] hover:border-[#25D366] transition-all">
                                    <MessageCircle className="w-4 h-4" />
                                </button>
                            </div>
                        </aside>

                        {/* 2. Content Area (Center) */}
                        <article className="max-w-3xl mx-auto w-full">
                            {/* Author Info (Top) */}
                            <div className="flex items-center gap-4 mb-12 border-b border-slate-800 pb-8">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 p-0.5">
                                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-emerald-400 font-bold">
                                        VY
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-white font-bold">Volkan Yıldırım</h4>
                                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                                        <span>{post.date}</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                        <span>Görüntülenme: 1.2k</span>
                                    </div>
                                </div>
                            </div>

                            {/* Main Text Content */}
                            <div className="prose prose-lg prose-invert max-w-none">
                                <p className="text-xl leading-relaxed text-slate-200 mb-8 font-serif italic border-l-4 border-emerald-500 pl-6 py-2 bg-slate-900/30 rounded-r-xl">
                                    {post.excerpt}
                                </p>

                                {/* DYNAMIC CONTENT RENDERED HERE */}
                                <div
                                    dangerouslySetInnerHTML={{ __html: post.content || '' }}
                                    className="text-slate-300 leading-relaxed"
                                />
                            </div>

                            {/* 4. Author Card (Bottom) */}
                            <div className="mt-16 bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                                <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-emerald-500/50 flex-shrink-0 overflow-hidden relative">
                                    <div className="w-full h-full bg-slate-700 flex items-center justify-center text-3xl font-bold text-slate-500">VY</div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-white mb-2">Hakkında: Volkan Yıldırım</h3>
                                    <p className="text-slate-400 text-sm mb-4">
                                        Vogo Agency'nin kurucu ortağı. 10+ yıldır dijital ürün tasarımı ve kullanıcı deneyimi üzerine çalışıyor. Minimalist ve işlevsel tasarımlar üzerine uzmanlaşmış.
                                    </p>
                                    <div className="flex justify-center md:justify-start gap-4">
                                        <a href="#" className="text-emerald-400 text-sm font-medium hover:underline">Twitter</a>
                                        <a href="#" className="text-emerald-400 text-sm font-medium hover:underline">LinkedIn</a>
                                        <a href="#" className="text-emerald-400 text-sm font-medium hover:underline">Behance</a>
                                    </div>
                                </div>
                            </div>
                        </article>

                        {/* Right Column (Empty for now/Ads) */}
                        <div className="hidden lg:block"></div>
                    </div>

                    {/* 4. Related Posts */}
                    <div className="mt-24 border-t border-slate-800 pt-16">
                        <h3 className="text-2xl font-bold text-white mb-8">İlginizi Çekebilecek Diğer Yazılar</h3>
                        <div className="grid md:grid-cols-3 gap-8">
                            {blogPosts.filter(p => p.id !== post.id).slice(0, 3).map(related => (
                                <Link href={`/blog/${related.id}`} key={related.id} className="group block">
                                    <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-slate-800 group-hover:border-emerald-500/50 transition-colors">
                                        <Image
                                            src={related.image}
                                            alt={related.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <h4 className="text-white font-bold mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
                                        {related.title}
                                    </h4>
                                    <div className="text-xs text-slate-500">
                                        {related.category} • {related.readTime}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <ModernCTA />
            </main>
            <ModernFooter />
        </>
    )
}
