"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function CustomCursor() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [isHovering, setIsHovering] = useState(false)

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY })
        }

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            // Linkler, butonlar ve interaktif elementler üzerinde cursor değişsin
            if (target.tagName === "A" || target.tagName === "BUTTON" || target.closest("a") || target.closest("button") || target.closest(".group")) {
                setIsHovering(true)
            } else {
                setIsHovering(false)
            }
        }

        window.addEventListener("mousemove", updateMousePosition)
        window.addEventListener("mouseover", handleMouseOver)

        return () => {
            window.removeEventListener("mousemove", updateMousePosition)
            window.removeEventListener("mouseover", handleMouseOver)
        }
    }, [])

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block mix-blend-difference">
            {/* Ana Nokta */}
            <motion.div
                className="absolute w-4 h-4 bg-white rounded-full top-0 left-0"
                animate={{
                    x: mousePosition.x - 8,
                    y: mousePosition.y - 8,
                    scale: isHovering ? 0.5 : 1
                }}
                transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
            />

            {/* Takip Eden Halka */}
            <motion.div
                className="absolute w-12 h-12 border border-white rounded-full top-0 left-0"
                animate={{
                    x: mousePosition.x - 24,
                    y: mousePosition.y - 24,
                    scale: isHovering ? 2.5 : 1,
                    backgroundColor: isHovering ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0)"
                }}
                transition={{ type: "spring", stiffness: 250, damping: 20, mass: 0.8 }}
            />
        </div>
    )
}
