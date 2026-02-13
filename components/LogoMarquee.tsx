"use client"

import { motion } from "framer-motion"

const StarIcon = () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 fill-white">
        <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
    </svg>
)

const marqueeItems = [
    "Agency", "Venture", "Startup", "Institute", "Enterprise", "Company"
]

export default function LogoMarquee() {
    // Silinmez bir döngü için öğeleri çoğaltıyoruz
    const displayItems = [...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems]

    return (
        <div className="relative py-6 sm:py-8 md:py-12 bg-black overflow-hidden select-none border-y border-white/10">
            <motion.div
                initial={{ x: 0 }}
                animate={{ x: "-50%" }}
                transition={{
                    duration: 35,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="flex items-center gap-8 sm:gap-12 md:gap-20 whitespace-nowrap"
            >
                {displayItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-8 sm:gap-12 md:gap-20">
                        <span className="text-white text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter uppercase">
                            {item}
                        </span>
                        <StarIcon />
                    </div>
                ))}
            </motion.div>
        </div>
    )
}
