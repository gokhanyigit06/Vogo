"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, MotionValue } from "framer-motion"

interface ParallaxImageProps {
    src: string
    alt: string
    className?: string
    offset?: number
}

export default function ParallaxImage({ src, alt, className = "", offset = 50 }: ParallaxImageProps) {
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    })

    const y = useTransform(scrollYProgress, [0, 1], [-offset, offset])
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]) // Subtle zoom too

    return (
        <div ref={ref} className={`overflow-hidden relative ${className}`}>
            <motion.img
                src={src}
                alt={alt}
                style={{ y, scale }}
                className="w-full h-full object-cover"
            />
        </div>
    )
}
