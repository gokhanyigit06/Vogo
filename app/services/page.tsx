"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Header from "@/components/Header"
import ModernFooter from "@/components/ModernFooter"
import { ArrowRight } from "lucide-react"

// Import components and types
interface Subsection {
    subtitle: string
    description: string
    items: string[]
}

interface ServiceSection {
    id: string
    title: string
    subsections: Subsection[]
}

interface GridBox {
    title: string
    link: string
    iconType: string
}

interface ServicesPageSettings {
    heroTitle: string
    gridBoxes: GridBox[]
    sections: ServiceSection[]
}

const defaultData: ServicesPageSettings = {
    heroTitle: "DİJİTAL UZMANLIĞIMIZ",
    gridBoxes: [
        { title: "Headless CMS Mimarisi", link: "#headless-cms", iconType: "cms" },
        { title: "Headless E-Ticaret", link: "#headless-ecommerce", iconType: "ecommerce" },
        { title: "Yapay Zeka Entegrasyonları", link: "#ai-integrations", iconType: "ai" },
        { title: "UI/UX Tasarım", link: "#design", iconType: "design" }
    ],
    sections: [
        {
            id: "headless-cms",
            title: "Yeni Nesil İçerik Yönetimi\n(Headless CMS)",
            subsections: [
                {
                    subtitle: "Özgür ve Esnek İçerik Dağıtımı",
                    description: "İçeriğinizi tek bir yerden yönetip, web'den mobile her platforma ışık hızında dağıtmanız için sektörün en iyi Headless CMS altyapılarını kuruyoruz.",
                    items: ["Payload", "Storyblok", "Sanity", "Directus", "Contentful", "Dato CMS"]
                }
            ]
        },
        {
            id: "headless-ecommerce",
            title: "Headless E-Ticaret Mimarisi",
            subsections: [
                {
                    subtitle: "Sınır Tanımayan Çevrimiçi Alışveriş Deneyimi",
                    description: "Monolitik e-ticaret altyapılarının hantallığından kurtulun. Hızlı, güvenli ve tamamen size özel tasar lanmış \"composable commerce\" çözümleriyle satışlatınızı katlayın.",
                    items: ["Shopify Hydrogen", "Swell", "Crystallize", "Medusa", "Commerce Layer"]
                }
            ]
        },
        {
            id: "modern-web",
            title: "Modern Web &\nJamstack Geliştirme",
            subsections: [
                {
                    subtitle: "Jamstack ve Yeni Nesil Web",
                    description: "Güvenlik açıklarını minimuma indiren, sunucu maliyetlerini düşüren ve sayfa hızlarını uçuran modern Jamstack mimarisi ile geleceğin web uygulamalarını geliştiriyoruz.",
                    items: ["Jamstack Mimarisi", "Next.JS Geliştirme", "Self-Hosted Next.JS", "Next.JS App Router"]
                },
                {
                    subtitle: "Next.js Performans Denetimleri",
                    description: "Mevcut Next.js projeniz yavaş mı çalışıyor? Kod kalitesinden render stratejilerine kadar derinlemesine teknik denetimler yapıyor ve darboğazları ortadan kaldırıyoruz.",
                    items: ["Next.JS Yapay Zeka SEO Denetimi", "Next.JS Performans Denetimi"]
                }
            ]
        },
        {
            id: "ai-integrations",
            title: "Yapay Zeka (AI) &\nGelişmiş Entegrasyonlar",
            subsections: [
                {
                    subtitle: "İş Süreçlerinde AI Dönüşümü",
                    description: "Operasyonlarınızı otomatize eden özel ChatGPT entegrasyonları, e-ticaret asistanları ve işinize özel eğitilmiş yapay zeka modelleriyle rekabette bir adım öne geçin.",
                    items: ["ChatGPT & Yapay Zeka Entegrasyonları", "Yapay Zeka KIT", "E-Ticaret için Özel ChatGPT Uygulamaları", "MedusaJS ChatGPT Uygulaması"]
                }
            ]
        },
        {
            id: "design",
            title: "Dijital Tasarım & Arayüz",
            subsections: [
                {
                    subtitle: "Markanıza Kimlik Kazandıran Arayüzler",
                    description: "VogoLab yaratıcı ekibiyle, kullanıcı psikolojisini temel alan, estetik ve dönüşüm odaklı UI/UX tasarımları üretiyoruz. İlk tel kafesten (wireframe) son piksele kadar sanat ve veriyi birleştiriyoruz.",
                    items: ["UI/UX Tasarım", "Markalaşma", "Hareketli Grafikler ve Animasyonlar"]
                }
            ]
        }
    ]
}

const getIcon = (type: string) => {
    switch (type) {
        case 'cms':
            return (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 12 12 17 22 12" />
                    <polyline points="2 17 12 22 22 17" />
                </svg>
            )
        case 'ecommerce':
            return (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
            )
        case 'ai':
            return (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                    <path d="M12 2v20" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
            )
        case 'design':
        case 'web':
        default:
            return (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
            )
    }
}

export default function ServicesPage() {
    const [data, setData] = useState<ServicesPageSettings>(defaultData)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("/api/settings")
            .then(r => r.json())
            .then(res => {
                if (res.servicesPageSettings) {
                    setData(res.servicesPageSettings)
                }
            })
            .catch(() => setData(defaultData))
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return (
            <div className="bg-white min-h-screen pt-40 pb-20 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <>
            <Header />
            <main className="bg-white min-h-screen pt-24 pb-0 text-black selection:bg-black selection:text-white overflow-hidden">

                {/* Hero Section */}
                <section className="w-full pt-16 md:pt-24 lg:pt-32 pb-16 lg:pb-24 border-b border-black/10">
                    <div className="container mx-auto px-4 md:px-8 max-w-[1500px]">
                        <motion.h1
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="text-[4.5rem] sm:text-[7rem] md:text-[9rem] lg:text-[11.5rem] xl:text-[14rem] font-bold leading-[0.85] tracking-tighter uppercase text-black whitespace-pre-line"
                        >
                            {data.heroTitle}
                        </motion.h1>
                    </div>
                </section>

                {/* The 4 Grid Boxes */}
                <section className="w-full border-b border-black/10 flex flex-col md:flex-row">
                    {data.gridBoxes.map((box, idx) => (
                        <Link
                            key={idx}
                            href={box.link}
                            className={`group relative flex-1 min-h-[300px] lg:min-h-[400px] border-b md:border-b-0 md:border-r border-black/10 last:border-r-0 last:border-b-0 p-8 lg:p-10 flex flex-col justify-between overflow-hidden bg-white hover:bg-[#FAFAFA] transition-colors duration-500`}
                        >
                            <h3 className="text-xl md:text-2xl lg:text-3xl font-medium tracking-tight whitespace-pre-line relative z-10 transition-transform duration-500 group-hover:translate-y-2">
                                {box.title}
                            </h3>
                            <div className="absolute top-1/2 left-8 -translate-y-1/2 opacity-0 -mt-10 group-hover:opacity-100 group-hover:mt-0 transition-all duration-500 z-10">
                                <span className="bg-black/5 backdrop-blur-sm border border-black/10 text-black px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                    Bölüme Git
                                    <ArrowRight size={14} />
                                </span>
                            </div>
                            <div className="self-end mt-12 transform transition-transform duration-700 group-hover:scale-110 group-hover:-translate-y-2 opacity-50 group-hover:opacity-100">
                                {getIcon(box.iconType)}
                            </div>
                        </Link>
                    ))}
                </section>

                {/* Dynamic Sections */}
                {data.sections.map((section, idx) => (
                    <section key={section.id} id={section.id} className="w-full pt-20 lg:pt-32 pb-20 border-b border-black/10">
                        <div className="container mx-auto px-4 md:px-8 max-w-[1500px]">

                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 lg:mb-16 gap-8">
                                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.05] whitespace-pre-line">
                                    {section.title}
                                </h2>
                                <Link href="/contact" className="px-8 py-3 rounded-full border border-black text-black font-semibold hover:bg-black hover:text-white transition-colors duration-300 text-sm tracking-wide shrink-0">
                                    Projenizi Konuşalim
                                </Link>
                            </div>

                            <div className="border-t border-black/10 pt-16">
                                {section.subsections.map((sub, sIdx) => (
                                    <div key={sIdx} className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 ${sIdx < section.subsections.length - 1 ? "pb-16 border-b border-black/10 mb-16" : ""}`}>
                                        <div className="lg:col-span-5">
                                            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">{sub.subtitle}</h3>
                                            <p className="text-base md:text-lg font-medium text-black/60 max-w-sm leading-relaxed whitespace-pre-line">
                                                {sub.description}
                                            </p>
                                        </div>

                                        <div className="lg:col-span-7 flex flex-col pt-2 lg:pt-0">
                                            {sub.items.map((item, iIdx) => (
                                                <div key={iIdx} className="group cursor-default flex items-center justify-between py-6 border-b border-black/10 hover:bg-black transition-colors px-4 -mx-4 sm:mx-0 sm:px-4 rounded-lg">
                                                    <div className="flex items-center gap-6">
                                                        <span className="text-black/30 group-hover:text-white/30 font-mono text-xs md:text-sm transition-colors duration-300">{(iIdx + 1).toString().padStart(2, '0')}</span>
                                                        <span className="text-xl md:text-3xl font-medium tracking-tight text-black group-hover:text-white group-hover:translate-x-2 transition-all duration-300">{item}</span>
                                                    </div>
                                                    <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[6px] border-l-white border-b-[5px] border-b-transparent opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"></div>
                                                </div>
                                            ))}
                                            {sub.items.length === 0 && (
                                                <p className="text-black/30 italic py-6">No items listed.</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </section>
                ))}

            </main>
            <ModernFooter />
        </>
    )
}
