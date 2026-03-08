"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

const testimonials = [
    {
        id: "01",
        quote: "\"Vogo helped us launch a high-performing website with 20% faster load times and 40% less manual work thanks to seamless integrations. DatoCMS also allowed our team to update content 50% faster, all delivered with clear communication and reliable project management.\"",
        authorName: "Gal Lampel",
        authorRole: "Operations Manager, QuantHealth",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "02",
        quote: "\"The transition to a headless architecture was smoother than we could have ever imagined. The team's expertise in Next.js and Vercel made our store incredibly fast, resulting in a 35% increase in conversion rate during the first month.\"",
        authorName: "Sarah Jenkins",
        authorRole: "E-commerce Director, Caleffi",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "03",
        quote: "\"Working with them felt like an extension of our own team. They didn't just write code; they provided strategic guidance on content modeling which has saved our marketing team countless hours.\"",
        authorName: "Marcus Thorne",
        authorRole: "CMO, Arrive",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "04",
        quote: "\"The SEO improvements alone paid for the project within the first quarter. Our organic traffic doubled, and the new design system is a joy for our editors to use on a daily basis.\"",
        authorName: "Elena Rodriguez",
        authorRole: "Head of Digital, EasyPark",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "05",
        quote: "\"They set the gold standard for agency partnerships. From the initial discovery phase to the final deployment, every step was transparent, on-time, and exceeded our technical expectations.\"",
        authorName: "David Chen",
        authorRole: "CTO, EmailOctopus",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop"
    }
]

export default function OurClientsSay() {
    const [activeIndex, setActiveIndex] = useState(0)
    const [direction, setDirection] = useState(1) // 1 for right, -1 for left
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    // Auto play functionality
    const startTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current)
        timerRef.current = setInterval(() => {
            setDirection(1)
            setActiveIndex((prev) => (prev + 1) % testimonials.length)
        }, 6000)
    }

    useEffect(() => {
        startTimer()
        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [])

    const handleDotClick = (index: number) => {
        setDirection(index > activeIndex ? 1 : -1)
        setActiveIndex(index)
        startTimer() // Reset timer on manual interaction
    }

    const slideVariants = {
        initial: (dir: number) => ({
            opacity: 0,
            x: dir > 0 ? 50 : -50,
        }),
        active: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
        },
        exit: (dir: number) => ({
            opacity: 0,
            x: dir > 0 ? -50 : 50,
            transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }
        })
    }

    return (
        <section className="bg-white py-20 lg:py-32 text-black overflow-hidden border-t border-black/10">
            <div className="container mx-auto px-4 md:px-8 max-w-[1500px]">

                {/* Header */}
                <h2 className="text-[4rem] md:text-[6rem] lg:text-[8rem] leading-[0.9] tracking-[-0.04em] font-medium mb-12">
                    Our Clients Say
                </h2>

                {/* Progress Lines Array (Top) */}
                <div className="flex gap-2 mb-16 lg:mb-24 w-full md:w-1/2 lg:w-1/3">
                    {testimonials.map((_, idx) => (
                        <div key={idx} className="flex-1 h-[2px] bg-black/10 relative overflow-hidden">
                            {idx === activeIndex && (
                                <motion.div
                                    className="absolute inset-0 bg-black"
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "0%" }}
                                    transition={{ duration: 6, ease: "linear" }}
                                    key={`progress-${activeIndex}`}
                                />
                            )}
                            {idx < activeIndex && (
                                <div className="absolute inset-0 bg-black" />
                            )}
                        </div>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="relative min-h-[500px] lg:min-h-[400px]">
                    <AnimatePresence custom={direction} mode="wait">
                        <motion.div
                            key={activeIndex}
                            custom={direction}
                            variants={slideVariants}
                            initial="initial"
                            animate="active"
                            exit="exit"
                            className="flex flex-col lg:flex-row gap-12 lg:gap-24 w-full h-full"
                        >
                            {/* Left: Quote */}
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    {/* Abstract Quote Icon */}
                                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 md:w-12 md:h-12 mb-8 -ml-2">
                                        <path d="M0 0 L15 0 L10 20 L0 20 Z" fill="black" />
                                        <path d="M20 0 L35 0 L30 20 L20 20 Z" fill="black" />
                                    </svg>

                                    <p className="text-xl md:text-2xl lg:text-3xl lg:leading-normal font-medium tracking-tight text-black/80">
                                        {testimonials[activeIndex].quote}
                                    </p>
                                </div>

                                <div className="mt-12 lg:mt-24">
                                    <p className="text-lg md:text-xl font-bold tracking-tight">
                                        {testimonials[activeIndex].authorName}
                                    </p>
                                    <p className="text-sm md:text-base font-medium text-black/40">
                                        {testimonials[activeIndex].authorRole}
                                    </p>
                                </div>
                            </div>

                            {/* Right: Image */}
                            <div className="w-full lg:w-[400px] shrink-0 h-[300px] lg:h-[450px]">
                                <img
                                    src={testimonials[activeIndex].image}
                                    alt={testimonials[activeIndex].authorName}
                                    className="w-full h-full object-cover object-center bg-[#F4F4F4]"
                                />
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Big Horizontal Scrollable Numbers Bottom */}
                <div className="mt-16 lg:mt-24 w-full overflow-x-auto select-none no-scrollbar flex items-center justify-start pb-4 border-b border-white hover:border-black/5 transition-colors">
                    <div className="flex gap-12 sm:gap-16 lg:gap-32 w-max pr-8">
                        {testimonials.map((testim, idx) => {
                            const isActive = idx === activeIndex;
                            return (
                                <button
                                    key={testim.id}
                                    onClick={() => handleDotClick(idx)}
                                    className={`text-[4rem] sm:text-[5rem] lg:text-[7rem] leading-none font-medium tracking-tighter transition-colors duration-500 ${isActive ? "text-black" : "text-black/10 hover:text-black/30"}`}
                                >
                                    {testim.id}
                                </button>
                            )
                        })}
                    </div>
                </div>

            </div>
        </section>
    )
}
