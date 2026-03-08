"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const categories = [
    { id: "headless", label: "Headless CMS" },
    { id: "ecommerce", label: "eCommerce" },
    { id: "tech", label: "Technologies" },
    { id: "hosting", label: "Hosting Platforms" },
]

const technologies = {
    headless: [
        { name: "Sanity", isPartner: true },
        { name: "Storyblok", isPartner: true },
        { name: "Payload", isPartner: true },
        { name: "DatoCMS", isPartner: true },
        { name: "Contentful", isPartner: true },
        { name: "Directus", isPartner: true },
        { name: "Hygraph", isPartner: true }
    ],
    ecommerce: [
        { name: "Swell", isPartner: true },
        { name: "Shopify Plus", isPartner: true },
        { name: "Crystallize", isPartner: true },
        { name: "Commerce Layer", isPartner: true },
        { name: "BigCommerce", isPartner: false },
        { name: "WooCommerce", isPartner: false },
    ],
    tech: [
        { name: "Next.js", isPartner: true },
        { name: "Hydrogen", isPartner: true },
        { name: "React", isPartner: false },
        { name: "Remix", isPartner: false },
        { name: "Node.js", isPartner: false },
        { name: "Cloudflare", isPartner: false },
        { name: "TypeScript", isPartner: false },
        { name: "GraphQL", isPartner: false },
        { name: "Serverless", isPartner: false },
        { name: "Prisma", isPartner: false },
        { name: "Blitz", isPartner: true }
    ],
    hosting: [
        { name: "Vercel", isPartner: true },
        { name: "Netlify", isPartner: true },
        { name: "AWS", isPartner: false },
        { name: "Google Cloud", isPartner: false }
    ]
}

export default function TechnologiesTabs() {
    const [activeTab, setActiveTab] = useState(categories[0].id)
    const activeTechs = technologies[activeTab as keyof typeof technologies]

    return (
        <section className="bg-[#FAFAFA] py-20 lg:py-32 text-black">
            <div className="container mx-auto px-4 md:px-8 max-w-[1500px]">
                {/* Header */}
                <div className="mb-12 lg:mb-20">
                    <h2 className="text-[4rem] md:text-[6rem] lg:text-[8rem] leading-[0.9] tracking-[-0.04em] font-medium">
                        Technologies
                    </h2>
                </div>

                {/* Grid Container for Borders */}
                <div className="w-full">
                    {/* Top horizontal border */}
                    <div className="w-full bg-black/10 h-[1px]" />

                    {/* Tabs Area */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-[1px] bg-black/10 border-x border-black/10">
                        {categories.map((cat) => {
                            const isActive = activeTab === cat.id;

                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveTab(cat.id)}
                                    className="relative bg-[#FAFAFA] hover:bg-white transition-colors duration-500 h-24 md:h-28 flex items-center justify-center p-4 group cursor-pointer"
                                >
                                    <div className={`relative z-10 px-6 py-2.5 rounded-full transition-colors duration-500 ${isActive ? "bg-black text-white" : "text-black group-hover:bg-black/5"}`}>
                                        <span className="text-xs md:text-sm font-semibold tracking-wide">
                                            {cat.label}
                                        </span>
                                    </div>
                                </button>
                            )
                        })}
                    </div>

                    {/* Middle horizontal border */}
                    <div className="w-full bg-black/10 h-[1px]" />

                    {/* Content Grid */}
                    <div className="w-full bg-black/10 border-b border-x border-black/10 relative min-h-[560px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="grid grid-cols-2 lg:grid-cols-4 gap-[1px]"
                            >
                                {activeTechs.map((tech) => (
                                    <div
                                        key={tech.name}
                                        className="relative flex items-center justify-center aspect-[3/2] lg:aspect-auto lg:h-[280px] bg-white group hover:bg-[#F4F4F4] transition-colors overflow-hidden"
                                    >
                                        {tech.isPartner && (
                                            <span className="absolute top-4 left-6 text-[10px] md:text-[11px] font-bold tracking-[0.05em] text-black">
                                                Partner
                                            </span>
                                        )}

                                        {/* Corner tick on hover */}
                                        <div className="absolute top-0 right-0 w-3 h-3 md:w-4 md:h-4 bg-black translate-x-full -translate-y-full group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-300 ease-out" style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }} />

                                        {/* Technology Name */}
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-black group-hover:scale-110 transition-transform duration-500">
                                                {tech.name}
                                            </h3>
                                        </div>
                                    </div>
                                ))}

                                {/* Fill empty grid spaces if there are fewer items to maintain the grid lines */}
                                {Array.from({ length: Math.max(0, 8 - activeTechs.length) }).map((_, idx) => (
                                    <div
                                        key={`empty-${idx}`}
                                        className="relative aspect-[3/2] lg:aspect-auto lg:h-[280px] bg-[#FAFAFA]"
                                    />
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

            </div>
        </section>
    )
}
