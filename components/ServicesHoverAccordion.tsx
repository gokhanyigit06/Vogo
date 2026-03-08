"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const services = [
    {
        id: "01",
        title: "Content Marketing Platforms",
        description: "Custom built CMS solutions tailored for high-volume content operations and editorial teams. We ensure scalable architecture and headless flexibility.",
    },
    {
        id: "02",
        title: "Content-Rich Ecommerce",
        description: "Seamlessly blending commerce and content. We build high-performance storefronts that tell your brand's unique story and drive conversions.",
    },
    {
        id: "03",
        title: "NextJS SEO & Performance Audits",
        description: "Technical audits focused on NextJS performance, accessibility, Core Web Vitals, and structured SEO — actionable and dev-ready.",
    },
    {
        id: "04",
        title: "AI & Advanced Integrations",
        description: "Connecting your business to the future. We integrate cutting-edge AI features, specialized APIs, and complex backend systems flawlessly.",
    },
    {
        id: "05",
        title: "Web Design",
        description: "Strategic, user-centric, and wildly aesthetic. We design digital experiences that elevate your brand and engage your audience profoundly.",
    }
]

export default function ServicesHoverAccordion() {
    const [hoveredService, setHoveredService] = useState<string | null>(null)

    return (
        <section className="bg-white py-20 lg:py-32 text-black">
            <div className="container mx-auto px-4 md:px-8 max-w-[1500px]">
                {/* Header */}
                <div className="mb-12 lg:mb-20">
                    <h2 className="text-[4rem] md:text-[6rem] lg:text-[8rem] leading-[0.9] tracking-[-0.04em] font-medium">
                        Services
                    </h2>
                </div>

                <div className="w-full flex flex-col border-t border-black/15">
                    {services.map((service) => {
                        const isHovered = hoveredService === service.id;

                        // Used onMouseEnter/onMouseLeave for desktop hover effect
                        // Click is kept for mobile interaction
                        return (
                            <div
                                key={service.id}
                                onMouseEnter={() => setHoveredService(service.id)}
                                onMouseLeave={() => setHoveredService(null)}
                                onClick={() => setHoveredService(isHovered ? null : service.id)}
                                className={`border-b border-black/15 transition-colors duration-500 cursor-pointer ${isHovered ? 'bg-[#FAFAFA]' : 'bg-transparent'}`}
                            >
                                <div className="py-6 lg:py-10 px-4 md:px-8 flex flex-col md:flex-row md:items-start justify-between gap-4">

                                    {/* Left Side: Number + Title + Description */}
                                    <div className="flex gap-6 lg:gap-32 w-full md:w-3/4">
                                        {/* Number */}
                                        <div className="text-black/30 font-medium text-xl md:text-2xl mt-1 lg:w-16 shrink-0">
                                            {service.id}
                                        </div>

                                        {/* Title area */}
                                        <div className="flex-1 flex flex-col">
                                            <h3 className={`text-2xl md:text-4xl lg:text-5xl font-medium tracking-tight transition-colors duration-300 ${isHovered ? 'text-black' : 'text-black/80'}`}>
                                                {service.title}
                                            </h3>

                                            <AnimatePresence>
                                                {isHovered && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                                        className="overflow-hidden"
                                                    >
                                                        <p className="pt-4 lg:pt-6 text-black/60 font-medium text-sm md:text-base leading-relaxed max-w-lg lg:max-w-2xl">
                                                            {service.description}
                                                        </p>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    {/* Right Side: Triangle Icon */}
                                    <div className="hidden md:flex shrink-0 items-start justify-end w-12 pt-2">
                                        <motion.div
                                            animate={{
                                                rotate: isHovered ? 90 : 0,
                                            }}
                                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                            className="w-4 h-4 md:w-5 md:h-5 bg-black"
                                            style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
                                        />
                                    </div>

                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
