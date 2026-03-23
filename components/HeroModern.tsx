"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface Client {
    id: string
    name: string
    company?: string
    logoUrl?: string
    website?: string
}

const FALLBACK_LOGOS = [
    { id: "1", name: "Paladora" },
    { id: "2", name: "WeiboTV" },
    { id: "3", name: "Homne" },
    { id: "4", name: "HuranTV" },
    { id: "5", name: "Matsuri" },
    { id: "6", name: "Radical" },
]

export default function HeroModern() {
    const [clients, setClients] = useState<Client[]>(FALLBACK_LOGOS)
    const [heroSettings, setHeroSettings] = useState<{
        titleLine1: string
        titleLine2: string
        titleLine3: string
        heroMediaUrl: string
        heroMediaType: "image" | "video"
    } | null>(null)

    useEffect(() => {
        // Clients
        fetch("/api/clients")
            .then(r => r.json())
            .then((data: Client[]) => {
                if (Array.isArray(data) && data.length > 0) {
                    setClients(data.slice(0, 8))
                }
            })
            .catch(() => {/* fallback kalır */ })

        // Hero Settings
        fetch("/api/settings")
            .then(r => r.json())
            .then(data => {
                if (data.heroTitleLine1 || data.heroMediaUrl) {
                    setHeroSettings({
                        titleLine1: data.heroTitleLine1 || "",
                        titleLine2: data.heroTitleLine2 || "",
                        titleLine3: data.heroTitleLine3 || "",
                        heroMediaUrl: data.heroMediaUrl || "",
                        heroMediaType: data.heroMediaType || "image",
                    })
                }
            })
            .catch(() => { })
    }, [])

    const line1 = heroSettings?.titleLine1 || "DİJİTALDE"
    const line2 = heroSettings?.titleLine2 || "REKABETİ"
    const line3 = heroSettings?.titleLine3 || "GERİDE BIRAKIN"
    const mediaUrl = heroSettings?.heroMediaUrl || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop"
    const mediaType = heroSettings?.heroMediaType || "image"

    return (
        <section className="relative min-h-screen flex flex-col text-black justify-center bg-[#F4F4F4] pt-24 pb-12 selection:bg-black selection:text-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-8 max-w-[1500px] w-full mt-10 md:mt-0 lg:mt-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center h-full">

                    {/* Left Side: Typography */}
                    <div className="lg:col-span-7 flex flex-col justify-center relative z-10 w-full">
                        <div className="flex flex-col space-y-[-0.1em] md:space-y-[-0.12em]">
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <h1 className="text-[3.5rem] sm:text-[5rem] md:text-[5.5rem] lg:text-[6.5rem] xl:text-[8rem] 2xl:text-[9rem] leading-[0.85] tracking-[-0.04em] font-medium text-black">
                                    {line1}
                                </h1>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <h1 className="text-[3.5rem] sm:text-[5rem] md:text-[5.5rem] lg:text-[6.5rem] xl:text-[8rem] 2xl:text-[9rem] leading-[0.85] tracking-[-0.04em] font-medium text-black">
                                    {line2}
                                </h1>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <h1 className="text-[3.5rem] sm:text-[5rem] md:text-[5.5rem] lg:text-[6.5rem] xl:text-[8rem] 2xl:text-[9rem] leading-[0.85] tracking-[-0.04em] font-medium text-black">
                                    {line3}
                                </h1>
                            </motion.div>
                        </div>

                        {/* Logo Strip */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="mt-10 sm:mt-14 lg:mt-20"
                        >
                            <p className="text-[9px] md:text-[10px] font-bold tracking-[0.22em] uppercase text-black/40 mb-5">
                                BİZE GÜVENEN MARKALAR
                            </p>
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:gap-x-8 md:gap-x-10">
                                {clients.map((client, index) => (
                                    <motion.span
                                        key={client.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5, delay: 0.7 + index * 0.07 }}
                                        className="text-[11px] sm:text-xs md:text-sm font-bold tracking-[0.12em] uppercase text-black/30 hover:text-black/70 transition-colors duration-300 cursor-default select-none"
                                    >
                                        {client.company || client.name}
                                    </motion.span>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Side: Visual */}
                    <div className="lg:col-span-5 relative mt-12 lg:mt-0 w-full flex justify-center lg:justify-end xl:pl-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="relative w-full aspect-square max-w-[700px] xl:max-w-[850px] 2xl:max-w-[950px] rounded-3xl md:rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.2)] bg-gradient-to-br from-[#D7CCF5] to-[#B6A6EB]"
                        >
                            {mediaType === "video" ? (
                                <video
                                    src={mediaUrl}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <img
                                    src={mediaUrl}
                                    alt="Showreel preview graphic"
                                    className="w-full h-full object-cover mix-blend-multiply opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-1000 ease-out"
                                />
                            )}

                            {/* Play button circular sticker */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 bg-[#F4F4F4]/95 backdrop-blur-md rounded-full flex items-center justify-center text-black shadow-[0_8px_32px_rgba(0,0,0,0.12)] group-hover:scale-105 transition-all duration-500 z-10 cursor-pointer hover:bg-white">
                                <div className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center translate-x-1 text-black">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                                <svg className="absolute w-full h-full animate-[spin_12s_linear_infinite]" viewBox="0 0 100 100">
                                    <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
                                    <text fontSize="10.5" className="uppercase font-[700] tracking-[0.2em] text-black">
                                        <textPath href="#circlePath" startOffset="0%">VİZYONUMUZU İZLEYİN • VİZYONUMUZU İZLEYİN •</textPath>
                                    </text>
                                </svg>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>

        </section>
    )
}
