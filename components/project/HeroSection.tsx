"use client"

import Image from "next/image"
import { ChevronDown } from "lucide-react"

interface HeroSectionProps {
    title: string
    heroImage?: string
    heroVideo?: string
    tagline?: string
}

export default function HeroSection({ title, heroImage, heroVideo, tagline }: HeroSectionProps) {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-stone-100 to-neutral-100">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.15) 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }} />
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-20">
                <div className="flex flex-col items-center text-center space-y-12">

                    {/* Main Headline */}
                    <div className="space-y-4">
                        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-stone-800 via-stone-900 to-black"
                            style={{
                                WebkitTextStroke: '2px rgba(0,0,0,0.1)',
                                paintOrder: 'stroke fill'
                            }}>
                            {title}
                        </h1>

                        {tagline && (
                            <p className="text-2xl md:text-3xl font-serif italic text-rose-600">
                                {tagline}
                            </p>
                        )}
                    </div>

                    {/* Device Mockups Container */}
                    {(heroImage || heroVideo) && (
                        <div className="relative w-full max-w-6xl mx-auto mt-8 lg:mt-16">
                            <div className="relative flex flex-col lg:flex-row items-center justify-center lg:items-end gap-8 lg:gap-0">

                                {/* Laptop Frame (Left - Shifted) */}
                                <div className="relative w-full max-w-4xl lg:-ml-12 z-10 transition-transform hover:scale-[1.01] duration-500">
                                    <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900 p-3">
                                        {/* Screen */}
                                        <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-white">
                                            {heroVideo ? (
                                                <video
                                                    src={heroVideo}
                                                    autoPlay
                                                    loop
                                                    muted
                                                    playsInline
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : heroImage ? (
                                                <Image
                                                    src={heroImage}
                                                    alt={title}
                                                    fill
                                                    className="object-cover"
                                                    priority
                                                />
                                            ) : null}
                                        </div>
                                        {/* Laptop Base */}
                                        <div className="absolute -bottom-1 left-0 right-0 h-4 bg-gradient-to-b from-gray-800 to-gray-900 rounded-b-2xl" />
                                    </div>
                                </div>

                                {/* Phone Frame (Right - Overlapping or Next to) */}
                                <div className="relative w-64 lg:w-72 shrink-0 lg:-ml-16 lg:mb-4 z-20 transition-transform hover:-translate-y-2 duration-500">
                                    <div className="relative rounded-[3rem] overflow-hidden shadow-2xl bg-gray-900 p-2 border-[6px] border-gray-900">
                                        {/* Dynamic Island / Notch */}
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-black rounded-b-xl z-30"></div>

                                        {/* Screen */}
                                        <div className="relative aspect-[9/19.5] rounded-[2.5rem] overflow-hidden bg-white">
                                            {heroImage ? (
                                                <Image
                                                    src={heroImage}
                                                    alt={`${title} mobile view`}
                                                    fill
                                                    className="object-cover object-top" // Focus on top left/center
                                                />
                                            ) : null}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <ChevronDown className="w-8 h-8 text-stone-400" />
            </div>
        </section>
    )
}
