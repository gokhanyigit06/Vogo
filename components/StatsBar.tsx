"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"

interface StatItemProps {
    end: number
    label: string
    suffix?: string
    prefix?: string
}

function StatItem({ end, label, suffix = "", prefix = "" }: StatItemProps) {
    const [count, setCount] = useState(0)
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })

    useEffect(() => {
        if (!isInView) return

        let startTime: number
        const duration = 2000 // 2 seconds

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)

            setCount(Math.floor(progress * end))

            if (progress < 1) {
                requestAnimationFrame(animate)
            }
        }

        requestAnimationFrame(animate)
    }, [isInView, end])

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
        >
            <div className="text-5xl md:text-6xl font-bold text-emerald-400 mb-2">
                {prefix}{count}{suffix}
            </div>
            <div className="text-sm md:text-base text-slate-400 uppercase tracking-wider">
                {label}
            </div>
        </motion.div>
    )
}

export default function StatsBar() {
    return (
        <section className="relative py-16 md:py-24 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-y border-slate-800">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)]" />

            <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    <StatItem end={10} label="Yıllık Deneyim" suffix="+" />
                    <StatItem end={200} label="Tamamlanan Proje" suffix="+" />
                    <StatItem end={50} label="Mutlu Marka" suffix="+" />
                    <StatItem end={24} label="Destek" suffix="/7" />
                </div>
            </div>
        </section>
    )
}
