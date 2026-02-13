"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, Megaphone } from "lucide-react"
import Link from "next/link"

export default function HeroModern() {
    return (
        <section className="relative min-h-screen bg-[#F5F5F5] pt-24 sm:pt-32 pb-8 sm:pb-20 overflow-hidden selection:bg-blue-600 selection:text-white">
            <div className="container mx-auto px-4 md:px-8 max-w-7xl w-full h-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center min-h-[60vh] lg:min-h-[70vh]">

                    {/* Left Side: Content - Centered on mobile, left-aligned on desktop */}
                    <div className="relative z-10 space-y-6 sm:space-y-8 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-4 sm:space-y-6"
                        >
                            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] text-black tracking-tight">
                                {/* Megaphone icon - visible on mobile */}
                                <span className="relative inline-block mr-1 sm:mr-2">
                                    <span className="absolute -inset-1 sm:-inset-2 bg-[#5B4EFF] rounded-xl sm:rounded-2xl transform -rotate-2 -z-10 shadow-lg" />
                                    <span className="relative text-white px-2 sm:px-4 inline-flex items-center gap-1 sm:gap-2">
                                        <Megaphone className="w-5 h-5 sm:w-7 sm:h-7 lg:hidden inline-block -rotate-12" />
                                        Unlimited
                                    </span>
                                </span>
                                <span className="inline sm:inline"> design</span>
                                <span className="block mt-2">for your startup</span>
                            </h1>

                            <p className="text-base sm:text-lg md:text-xl text-black/60 max-w-xl leading-relaxed mx-auto lg:mx-0">
                                Get exceptional, unlimited design tailored for your startup's needs. We focus on quality and speed to help your business stand out.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4"
                        >
                            <Link
                                href="/contact"
                                className="px-6 sm:px-8 py-3 sm:py-4 bg-black text-white rounded-full text-sm sm:text-base font-semibold hover:scale-[1.02] transition-transform shadow-lg"
                            >
                                Get in touch
                            </Link>

                            <Link
                                href="/services"
                                className="group flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base font-semibold text-black hover:opacity-70 transition-all"
                            >
                                Browse all services
                                <div className="w-7 h-7 sm:w-8 sm:h-8 border-2 border-black rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                                    <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </div>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right Side: Visual Mockups Collage */}
                    <div className="relative h-[420px] sm:h-[500px] md:h-[700px] w-full mt-2 sm:mt-8 lg:mt-0">

                        {/* Central Phone/Tablet Mockup */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, type: "spring" }}
                            className="absolute left-1/2 top-[45%] sm:top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] sm:w-[260px] md:w-[400px] z-30"
                        >
                            <div className="bg-[#8B7FFF] rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] p-1.5 sm:p-2 md:p-3 shadow-2xl border-2 sm:border-4 border-white aspect-[9/16] relative overflow-hidden transform rotate-[-2deg]">
                                <div className="w-full h-full bg-white rounded-[1.2rem] sm:rounded-[1.5rem] md:rounded-[2rem] overflow-hidden">
                                    <img
                                        src="https://cdn.dribbble.com/userupload/15115598/file/original-09026410134f54c93f0b06df0702c815.png?resize=1504x1128"
                                        alt="Mobile App"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Top Left - Blue Card with UI */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-[3%] sm:top-[8%] left-[0%] sm:left-[2%] w-28 sm:w-32 md:w-44 h-36 sm:h-44 md:h-56 bg-[#0D47A1] rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden transform rotate-[-15deg] z-20"
                        >
                            <div className="w-full h-full p-2 sm:p-3 md:p-4 flex flex-col gap-2 sm:gap-3">
                                <div className="w-14 sm:w-16 md:w-20 h-14 sm:h-16 md:h-20 bg-[#FFD93D] rounded-lg sm:rounded-xl md:rounded-2xl" />
                                <div className="w-full h-2 sm:h-3 bg-white/20 rounded-full" />
                                <div className="w-3/4 h-2 sm:h-3 bg-white/20 rounded-full" />
                                <div className="mt-auto grid grid-cols-2 gap-1 sm:gap-2">
                                    <div className="aspect-square bg-white/10 rounded-lg sm:rounded-xl" />
                                    <div className="aspect-square bg-white/10 rounded-lg sm:rounded-xl" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Bottom Left - Orange/Red 3D Boxes */}
                        <motion.div
                            animate={{ x: [0, -8, 0], rotate: [10, 12, 10] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute bottom-[5%] sm:bottom-[8%] left-[-2%] sm:left-[0%] w-28 sm:w-32 md:w-44 h-28 sm:h-32 md:h-44 transform rotate-[10deg] z-15"
                        >
                            <div className="relative w-full h-full">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35] to-[#FF4500] rounded-xl sm:rounded-2xl md:rounded-3xl shadow-xl transform rotate-6" />
                                <div className="absolute inset-0 bg-gradient-to-br from-[#FF8C42] to-[#FF6B35] rounded-xl sm:rounded-2xl md:rounded-3xl shadow-xl transform -rotate-3 scale-90" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 sm:w-12 md:w-16 h-10 sm:h-12 md:h-16 bg-white/20 rounded-lg sm:rounded-xl md:rounded-2xl" />
                            </div>
                        </motion.div>

                        {/* Top Right - Yellow Bitcoin/Crypto Card */}
                        <motion.div
                            animate={{ rotate: [-6, -8, -6] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-[6%] sm:top-[12%] right-[0%] sm:right-[2%] w-24 sm:w-32 md:w-40 h-24 sm:h-32 md:h-40 bg-[#FFD93D] rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl transform rotate-[-6deg] z-25 overflow-hidden"
                        >
                            <div className="w-full h-full p-2 sm:p-3 md:p-4 flex items-center justify-center relative">
                                <div className="text-4xl sm:text-5xl md:text-7xl font-black text-black/10">₿</div>
                                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 w-5 sm:w-6 md:w-8 h-5 sm:h-6 md:h-8 bg-black/10 rounded-full" />
                                <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 w-8 sm:w-10 md:w-12 h-2 sm:h-3 bg-black/10 rounded-full" />
                            </div>
                        </motion.div>

                        {/* Bottom Right - Light Blue Mobile UI */}
                        <motion.div
                            animate={{ y: [0, 12, 0], rotate: [5, 7, 5] }}
                            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute bottom-[8%] sm:bottom-[12%] right-[-2%] sm:right-[0%] w-28 sm:w-32 md:w-44 h-36 sm:h-44 md:h-56 bg-[#E3F2FD] rounded-xl sm:rounded-2xl md:rounded-3xl shadow-xl transform rotate-[5deg] z-20 overflow-hidden"
                        >
                            <div className="w-full h-full p-2 sm:p-3 md:p-4 flex flex-col gap-2 sm:gap-3">
                                <div className="w-full h-8 sm:h-10 md:h-12 bg-white rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center">
                                    <div className="w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full" />
                                </div>
                                <div className="grid grid-cols-4 gap-1 sm:gap-2">
                                    <div className="aspect-square bg-white rounded-lg sm:rounded-xl" />
                                    <div className="aspect-square bg-white rounded-lg sm:rounded-xl" />
                                    <div className="aspect-square bg-white rounded-lg sm:rounded-xl" />
                                    <div className="aspect-square bg-white rounded-lg sm:rounded-xl" />
                                </div>
                                <div className="w-full h-10 sm:h-12 md:h-16 bg-white rounded-lg sm:rounded-xl md:rounded-2xl" />
                            </div>
                        </motion.div>

                        {/* Hand Cursor - Top Right */}
                        <motion.div
                            animate={{ rotate: [0, 8, 0], y: [0, -5, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-[-2%] right-[10%] sm:right-[12%] w-10 sm:w-16 md:w-24 h-10 sm:h-16 md:h-24 z-40"
                        >
                            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                                <path d="M30,75 L30,45 Q30,35 40,35 L60,35 Q70,35 70,45 L70,75 L30,75 Z" fill="black" stroke="white" strokeWidth="2" />
                                <circle cx="50" cy="55" r="6" fill="white" />
                            </svg>
                        </motion.div>

                        {/* Hand Cursor - Bottom Left */}
                        <motion.div
                            animate={{ rotate: [0, -10, 0], x: [0, -5, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute bottom-[0%] left-[15%] sm:left-[18%] w-10 sm:w-14 md:w-20 h-10 sm:h-14 md:h-20 z-40"
                        >
                            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                                <path d="M25,70 L25,40 Q25,30 35,30 L55,30 Q65,30 65,40 L65,70 L25,70 Z" fill="black" stroke="white" strokeWidth="2" />
                                <circle cx="45" cy="50" r="5" fill="white" />
                            </svg>
                        </motion.div>

                        {/* Decorative Lines/Accents */}
                        <motion.div
                            animate={{ rotate: [0, 5, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="hidden sm:block absolute top-[18%] left-[8%] w-8 sm:w-10 md:w-12 h-1 bg-black z-5"
                            style={{ transformOrigin: 'left center' }}
                        />
                        <motion.div
                            animate={{ rotate: [0, -5, 0] }}
                            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                            className="hidden sm:block absolute top-[22%] left-[8%] w-6 sm:w-7 md:w-8 h-1 bg-black z-5"
                            style={{ transformOrigin: 'left center' }}
                        />
                    </div>
                </div>
            </div>

            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:40px_40px] sm:bg-[size:60px_60px] pointer-events-none" />
        </section>
    )
}
