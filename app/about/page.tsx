"use client"

import { useState, useEffect } from "react"
import Header from "@/components/Header"
import ModernFooter from "@/components/ModernFooter"
import Link from "next/link"
import HowWeWorkModern from "@/components/HowWeWorkModern"
import { ArrowRight } from "lucide-react"

interface DeliveryCard {
    title: string
    desc: string
    iconType: string
}

interface InfoRow {
    title: string
    description: string
    linkText: string
    linkHref: string
}

interface AboutPageSettings {
    heroTitleLine1: string
    heroTitleLine2: string
    heroSubtitle1: string
    heroSubtitle2: string
    deliverySectionTitle: string
    deliverySectionSubtitle: string
    deliveryCards: DeliveryCard[]
    whoWeBuildFor: InfoRow
    ourServices: InfoRow
}

const defaultData: AboutPageSettings = {
    heroTitleLine1: "Headless CMS ile",
    heroTitleLine2: "Gerçek Sonuçlar",
    heroSubtitle1: "Pazarlama ve geliştirme ekiplerinin kullanmayı sevdiği hızlı, esnek platformlar kuruyoruz.",
    heroSubtitle2: "Misyonumuz modern web'i ileriye taşımak — Next.js ve piyasadaki en iyi Headless araçlarını kullanarak teknik netlik, performans ve ölçeklenebilir mimariyi birleştirmek.",
    deliverySectionTitle: "Nasıl Çalışıyoruz?",
    deliverySectionSubtitle: "İlk görüşmeden son teslimata kadar —\nbirlikte nasıl çalışıyoruz?",
    deliveryCards: [
        {
            title: "İş İhtiyaçlarını Belirleme",
            desc: "Biz sadece hizmet süresine değil, çözüm sunmaya odaklanıyoruz. Hedeflerinizi inceleyip, eyleme dönüştürülebilir bir plan oluşturarak başlıyoruz.",
            iconType: "points"
        },
        {
            title: "Doğru Çözümleri Seçme",
            desc: "İşbirlikçi uzmanlığımızdan yararlanarak doğru araç setini seçiyor ve iş hedefleriyle uyumlu hale getiriyoruz.",
            iconType: "rectangles"
        },
        {
            title: "Uygulama Süreci",
            desc: "Süreçlerimizi sizin tercihlerinize göre hizalıyoruz. Şeffaf ve hızlı ilerleyen bir yapıda demolarla geri bildirim seansları düzenliyoruz.",
            iconType: "triangle"
        },
        {
            title: "Proje Sonrası Destek",
            desc: "İster teslimat sonrası molaya ihtiyacınız olsun ister sürekli bakım — çözümlerin sorunsuz çalışması için esnek paketler sunuyoruz.",
            iconType: "cube"
        }
    ],
    whoWeBuildFor: {
        title: "Kimin İçin Üretiyoruz",
        description: "Müşterilerimiz, gelişmiş içerik altyapısı, güçlü editör deneyimi ve performans odaklı bir yapı arayan büyüyen markalar ve kurumsal firmalardır.",
        linkText: "Projelerimiz",
        linkHref: "/portfolio"
    },
    ourServices: {
        title: "Hizmetlerimiz",
        description: "Ölçeklenebilir, UX odaklı pazarlama ve içerik platformları inşa etme konusunda uzmanız — her zaman verimli bütçelerle.",
        linkText: "Hizmetler",
        linkHref: "/services"
    }
}

const getDeliveryIcon = (type: string) => {
    switch (type) {
        case 'rectangles':
            return (
                <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0" y="26" width="11" height="14" fill="black" fillOpacity="0.25" />
                    <rect x="14" y="14" width="11" height="26" fill="black" fillOpacity="0.6" />
                    <rect x="28" y="0" width="11" height="40" fill="black" />
                </svg>
            )
        case 'triangle':
            return (
                <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 40 L16 20 L0 20 Z" fill="black" fillOpacity="0.25" />
                    <path d="M28 28 L28 10 L10 10 Z" fill="black" fillOpacity="0.6" />
                    <path d="M40 16 L40 0 L24 0 Z" fill="black" />
                </svg>
            )
        case 'cube':
            return (
                <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 0 L40 10 L20 20 L0 10 Z" fill="black" fillOpacity="0.25" />
                    <path d="M0 10 L20 20 L20 40 L0 30 Z" fill="black" fillOpacity="0.6" />
                    <path d="M40 10 L40 30 L20 40 L20 20 Z" fill="black" />
                </svg>
            )
        case 'points':
        default:
            return (
                <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 30 L18 18 L26 24 L34 10" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    <circle cx="10" cy="30" r="3" fill="black" />
                    <circle cx="18" cy="18" r="3" fill="black" />
                    <circle cx="26" cy="24" r="3" fill="black" />
                    <circle cx="34" cy="10" r="3" fill="black" />
                </svg>
            )
    }
}

export default function AboutPage() {
    const [data, setData] = useState<AboutPageSettings>(defaultData)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("/api/settings")
            .then(r => r.json())
            .then(res => {
                if (res.aboutPageSettings) {
                    setData(res.aboutPageSettings)
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
            <main className="bg-white min-h-screen text-black selection:bg-black selection:text-white pb-20">

                {/* Hero Section */}
                <section className="w-full pt-40 lg:pt-56 pb-20 lg:pb-32">
                    <div className="container mx-auto px-4 md:px-8 max-w-[1500px]">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-end">
                            <div className="lg:col-span-8">
                                <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[9.5rem] font-bold tracking-tighter leading-[0.95] lg:-ml-2">
                                    {data.heroTitleLine1} <br />
                                    <span className="text-black/30 whitespace-pre-line">{data.heroTitleLine2}</span>
                                </h1>
                            </div>
                            <div className="lg:col-span-4 flex flex-col gap-6 lg:pb-6">
                                <p className="text-xl md:text-2xl font-medium leading-relaxed text-black whitespace-pre-line">
                                    {data.heroSubtitle1}
                                </p>
                                <p className="text-lg text-black/60 font-medium leading-relaxed whitespace-pre-line">
                                    {data.heroSubtitle2}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How We Deliver Grid */}
                <section className="w-full py-20 lg:py-32 border-t border-black/10 bg-white">
                    <div className="container mx-auto px-4 md:px-8 max-w-[1500px]">
                        <div className="flex flex-col lg:flex-row justify-between lg:items-end mb-16 lg:mb-20 gap-8">
                            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.95]">
                                {data.deliverySectionTitle}
                            </h2>
                            <p className="text-xl font-medium text-black/60 max-w-sm lg:pb-2 whitespace-pre-line">
                                {data.deliverySectionSubtitle}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                            {data.deliveryCards.map((card, idx) => (
                                <div key={idx} className="bg-[#FAFAFA] border border-black/5 p-10 lg:p-12 flex flex-col justify-between min-h-[300px] lg:min-h-[360px]">
                                    <div>
                                        <h3 className="text-3xl lg:text-4xl font-medium tracking-tight mb-4 whitespace-pre-line">{card.title}</h3>
                                        <p className="text-base lg:text-lg text-black/60 leading-relaxed font-medium max-w-lg whitespace-pre-line">{card.desc}</p>
                                    </div>
                                    <div className="mt-10 self-end">
                                        {getDeliveryIcon(card.iconType)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Who We Build For / Our Services */}
                <section className="w-full">
                    <div className="container mx-auto px-4 md:px-8 max-w-[1500px]">
                        {/* Row 1 */}
                        <div className="flex flex-col lg:flex-row justify-between lg:items-center py-20 lg:py-32 border-t border-black/10 gap-12">
                            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.95] lg:w-1/2 whitespace-pre-line">
                                {data.whoWeBuildFor.title}
                            </h2>
                            <div className="lg:w-1/2 flex flex-col items-start lg:pl-16">
                                <p className="text-xl lg:text-2xl font-medium leading-relaxed text-black mb-8 max-w-xl whitespace-pre-line">
                                    {data.whoWeBuildFor.description}
                                </p>
                                <Link href={data.whoWeBuildFor.linkHref} className="group flex items-center gap-2 text-lg font-bold hover:opacity-70 transition-opacity">
                                    <span className="border-b-2 border-black pb-0.5">{data.whoWeBuildFor.linkText}</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </Link>
                            </div>
                        </div>

                        {/* Row 2 */}
                        <div className="flex flex-col lg:flex-row justify-between lg:items-center py-20 lg:py-32 border-t border-b border-black/10 gap-12">
                            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.95] lg:w-1/2 whitespace-pre-line">
                                {data.ourServices.title}
                            </h2>
                            <div className="lg:w-1/2 flex flex-col items-start lg:pl-16">
                                <p className="text-xl lg:text-2xl font-medium leading-relaxed text-black mb-8 max-w-xl whitespace-pre-line">
                                    {data.ourServices.description}
                                </p>
                                <Link href={data.ourServices.linkHref} className="group flex items-center gap-2 text-lg font-bold hover:opacity-70 transition-opacity">
                                    <span className="border-b-2 border-black pb-0.5">{data.ourServices.linkText}</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
                <HowWeWorkModern />

            </main>
            <ModernFooter />
        </>
    )
}
