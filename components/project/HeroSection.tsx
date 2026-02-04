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

                    {/* Device Mockup */}
                    {(heroImage || heroVideo) && (
                        <div className="relative w-full max-w-5xl">
                            {/* Laptop Frame */}
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
