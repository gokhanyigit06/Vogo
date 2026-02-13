"use client"

import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

const projects = [
    {
        title: "Starthub X",
        image: "https://cdn.dribbble.com/userupload/15115598/file/original-09026410134f54c93f0b06df0702c815.png?resize=1504x1128",
    },
    {
        title: "Colorfolio X",
        image: "https://cdn.dribbble.com/userupload/12476569/file/original-ee7f31be2764b8a24564c7ad3db371a5.png?resize=1504x1128",
    },
    {
        title: "Pastel X",
        image: "https://cdn.dribbble.com/userupload/11145152/file/original-4d37536f9b23b8764a781b0f55444b0f.png?resize=1504x1128",
    }
]

export default function LatestProjectsModern() {
    return (
        <section className="py-16 sm:py-20 md:py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-8 max-w-[95%] w-full">

                {/* Header Section */}
                <div className="text-center space-y-4 md:space-y-6 mb-10 md:mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif font-medium text-black leading-tight"
                    >
                        Our <span className="relative inline-block mx-1 sm:mx-2">
                            <span className="absolute -inset-1 sm:-inset-2 bg-[#4D45FF] rounded-xl sm:rounded-2xl transform -rotate-2 shadow-lg" />
                            <span className="relative text-white px-1 sm:px-2">latest</span>
                        </span> projects
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-base sm:text-lg md:text-xl text-black/60 max-w-2xl mx-auto leading-relaxed font-medium px-2"
                    >
                        Check out some examples of our recent design work. We've helped startups across various industries achieve their visual communication goals.
                    </motion.p>
                </div>

                {/* Bento Grid - Always 2 cols, expands to 4 on desktop */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 auto-rows-[140px] sm:auto-rows-[200px] md:auto-rows-[300px] mb-10 md:mb-16">

                    {/* Big Card - Starthub X (full width on mobile, half on desktop) */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="col-span-2 row-span-2 rounded-2xl sm:rounded-[2.5rem] bg-[#0A0D14] p-5 sm:p-8 md:p-10 flex flex-col justify-between overflow-hidden relative group"
                    >
                        <div className="relative z-10 flex items-center gap-2 sm:gap-4">
                            <div className="w-7 h-7 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-400 to-rose-400 rounded-lg shadow-lg" />
                            <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-white uppercase tracking-tighter">Starthub X</h3>
                        </div>
                        <div className="absolute top-[20%] sm:top-[25%] left-4 sm:left-10 right-0 bottom-0 pointer-events-none group-hover:scale-105 transition-transform duration-500">
                            <img src={projects[0].image} alt="Starthub X" className="w-full h-full object-contain object-left-top shadow-2xl" />
                        </div>
                    </motion.div>

                    {/* Horizontal Card - Colorfolio X */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="col-span-2 rounded-2xl sm:rounded-[2.5rem] bg-white border border-black/10 p-4 sm:p-6 md:p-8 flex flex-col justify-between overflow-hidden relative group"
                    >
                        <div className="relative z-10 flex items-center gap-2 sm:gap-4">
                            <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-8 sm:h-8 fill-black">
                                <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
                            </svg>
                            <h3 className="text-base sm:text-xl md:text-2xl font-bold text-black uppercase tracking-tighter">Colorfolio X</h3>
                        </div>
                        <div className="absolute top-[15%] sm:top-[20%] right-[-10%] bottom-0 w-[80%] pointer-events-none group-hover:scale-105 transition-transform duration-500">
                            <img src={projects[1].image} alt="Colorfolio X" className="w-full h-full object-contain object-right-top shadow-xl" />
                        </div>
                    </motion.div>

                    {/* Square Icon 1 - Blue */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="rounded-2xl sm:rounded-[2.5rem] bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center p-4 sm:p-8 md:p-12 overflow-hidden"
                    >
                        <div className="w-full h-full bg-white rounded-xl sm:rounded-2xl md:rounded-3xl flex items-center justify-center shadow-lg transform rotate-3">
                            <span className="text-2xl sm:text-4xl md:text-5xl font-black text-blue-500">{"\u003E"}_</span>
                        </div>
                    </motion.div>

                    {/* Square Icon 2 - Orange */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="rounded-2xl sm:rounded-[2.5rem] bg-[#FF7324] flex items-center justify-center p-4 sm:p-8 md:p-12"
                    >
                        <div className="w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 border-3 sm:border-4 border-white/40 rounded-lg sm:rounded-xl flex items-center justify-center relative shadow-lg">
                            <div className="w-2.5 h-2.5 sm:w-4 sm:h-4 bg-white rounded-full shadow-sm" />
                        </div>
                    </motion.div>

                    {/* Dark Blue Circle Card */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="rounded-2xl sm:rounded-[2.5rem] bg-[#001B3D] flex items-center justify-center p-4 sm:p-8 md:p-12 overflow-hidden"
                    >
                        <div className="w-12 h-12 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-blue-500 rounded-full flex items-center justify-center shadow-xl">
                            <div className="w-full h-1/2 bg-yellow-400 mt-auto transform rotate-[-30deg]" />
                        </div>
                    </motion.div>

                    {/* Purple Document Card */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="rounded-2xl sm:rounded-[2.5rem] bg-[#714DFF] flex items-center justify-center p-4 sm:p-8 md:p-12"
                    >
                        <div className="relative w-10 h-14 sm:w-14 sm:h-20 md:w-16 md:h-24 bg-white rounded-lg sm:rounded-xl shadow-2xl skew-x-[-10deg] flex flex-col p-2 sm:p-3 gap-1 sm:gap-2">
                            <div className="w-full h-1.5 sm:h-2 bg-gray-200 rounded-full" />
                            <div className="w-2/3 h-1.5 sm:h-2 bg-gray-100 rounded-full" />
                        </div>
                    </motion.div>

                    {/* Bottom Horizontal Card - Pastel X */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="col-span-2 rounded-2xl sm:rounded-[2.5rem] bg-white border border-black/10 p-4 sm:p-6 md:p-8 flex flex-col justify-between overflow-hidden relative group"
                    >
                        <div className="relative z-10 flex items-center gap-2 sm:gap-4">
                            <div className="w-5 h-5 sm:w-8 sm:h-8 bg-blue-600 rounded-full shadow-md" />
                            <h3 className="text-base sm:text-xl md:text-2xl font-bold text-black uppercase tracking-tighter">Pastel X</h3>
                        </div>
                        <div className="absolute top-[25%] sm:top-[30%] left-[30%] right-[-10%] bottom-0 pointer-events-none group-hover:scale-105 transition-transform duration-500">
                            <img src={projects[2].image} alt="Pastel X" className="w-full h-full object-contain object-right-top shadow-2xl" />
                        </div>
                    </motion.div>
                </div>

                {/* Footer Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                    <Link
                        href="/contact"
                        className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-black text-white rounded-xl sm:rounded-2xl text-base sm:text-xl font-bold hover:scale-[1.05] transition-all shadow-xl active:scale-95 text-center"
                    >
                        Get in touch
                    </Link>

                    <Link
                        href="/services"
                        className="group flex items-center justify-center gap-3 text-base sm:text-xl font-bold text-black hover:opacity-70 transition-all font-sans"
                    >
                        Browse all services
                        <div className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-black rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                            <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    )
}
