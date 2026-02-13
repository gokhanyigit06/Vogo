"use client"

import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

const services = [
    {
        title: "Digital advertising",
        desc: "We create compelling ad creatives for various digital platforms to boost your campaign performance and overall reach effectively.",
        icon: (
            <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
                <path d="M20,60 L40,60 L60,80 L60,40 L40,60" fill="none" stroke="black" strokeWidth="3" />
                <path d="M65,50 Q75,60 65,70" fill="none" stroke="black" strokeWidth="3" />
                <circle cx="30" cy="60" r="2" fill="black" />
                <line x1="15" y1="55" x2="10" y2="52" stroke="black" strokeWidth="2" opacity="0.3" />
                <line x1="15" y1="65" x2="10" y2="68" stroke="black" strokeWidth="2" opacity="0.3" />
            </svg>
        ),
        hasShadow: true
    },
    {
        title: "Social media graphics",
        desc: "Get eye-catching visuals tailored for your social channels, designed to effectively engage your target audience online.",
        icon: (
            <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
                <path d="M30,70 L30,50 Q30,40 40,40 L60,40 Q70,40 70,50 L70,70 L30,70" fill="none" stroke="black" strokeWidth="3" />
                <path d="M40,40 L45,15 L55,15 L60,40" fill="none" stroke="black" strokeWidth="3" />
                <circle cx="75" cy="30" r="10" fill="none" stroke="black" strokeWidth="3" />
                <path d="M72,30 L78,30 M75,27 L75,33" stroke="black" strokeWidth="2" />
            </svg>
        ),
        hasShadow: false
    },
    {
        title: "Web design",
        desc: "We design beautiful, user-friendly websites and landing pages that effectively communicate your brand's unique message.",
        icon: (
            <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
                <rect x="20" y="30" width="60" height="40" rx="5" fill="none" stroke="black" strokeWidth="3" />
                <line x1="20" y1="40" x2="80" y2="40" stroke="black" strokeWidth="3" />
                <circle cx="27" cy="35" r="2" fill="black" />
                <circle cx="34" cy="35" r="2" fill="black" />
                <rect x="28" y="48" width="20" height="15" fill="#FFBC11" />
                <line x1="55" y1="50" x2="72" y2="50" stroke="black" strokeWidth="2" />
                <line x1="55" y1="58" x2="72" y2="58" stroke="black" strokeWidth="2" />
            </svg>
        ),
        hasShadow: false
    },
    {
        title: "Mobile Design",
        desc: "Crafting intuitive and engaging mobile app interfaces optimized for seamless user experiences across all devices.",
        icon: (
            <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
                <rect x="35" y="20" width="30" height="60" rx="8" fill="none" stroke="black" strokeWidth="3" />
                <circle cx="50" cy="72" r="3" fill="black" />
                <path d="M45,35 L55,35" stroke="black" strokeWidth="3" strokeLinecap="round" />
                <circle cx="30" cy="35" r="8" fill="none" stroke="black" strokeWidth="2" />
                <circle cx="30" cy="32" r="3" fill="black" />
            </svg>
        ),
        hasShadow: false
    }
]

export default function ServiceGridModern() {
    return (
        <section className="py-16 sm:py-24 md:py-32 bg-[#FDFDFD] overflow-hidden text-black font-sans">
            <div className="container mx-auto px-4 md:px-8 max-w-[95%]">

                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 md:gap-12 mb-12 sm:mb-16 md:mb-20 px-2 sm:px-4">
                    <div className="max-w-3xl">
                        <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-extrabold tracking-tight leading-[1.1]">
                            We offer a wide range <br className="hidden sm:block" />
                            of <span className="relative inline-block mx-1 sm:mx-2">
                                <span className="relative z-10 text-white px-3 sm:px-6">design</span>
                                <div className="absolute inset-0 bg-[#FF5C35] -rotate-3 rounded-xl sm:rounded-2xl z-0 scale-110"></div>
                            </span> services
                        </h2>
                    </div>
                    <div className="max-w-lg">
                        <p className="text-gray-500 text-base sm:text-lg md:text-xl lg:text-2xl font-medium leading-relaxed">
                            From branding and web design to mobile apps and marketing materials, discover our comprehensive suite of creative solutions tailored for you.
                        </p>
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 sm:mb-16 md:mb-20">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className={`group relative bg-white border-[3px] border-black rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-8 md:p-10 flex flex-col min-h-[320px] sm:min-h-[400px] md:min-h-[520px] transition-all duration-500 hover:-translate-y-3 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] ${service.hasShadow ? 'shadow-[8px_8px_2px_0px_rgba(0,0,0,0.1),_8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[12px_12px_2px_0px_rgba(0,0,0,0.1),_12px_12px_0px_0px_rgba(0,0,0,1)]' : ''}`}
                        >
                            {/* Top row: Title and Arrow */}
                            <div className="flex justify-between items-start mb-4 sm:mb-6 md:mb-8">
                                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black leading-tight max-w-[180px] sm:max-w-[200px]">
                                    {service.title}
                                </h3>
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white group-hover:border-black transition-all shrink-0">
                                    <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                            </div>

                            {/* Middle: Description */}
                            <p className="text-gray-500 text-sm sm:text-base md:text-lg lg:text-xl font-medium leading-relaxed mb-6 sm:mb-8 md:mb-12">
                                {service.desc}
                            </p>

                            {/* Bottom: Icon */}
                            <div className="mt-auto pt-4 sm:pt-6">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-2xl sm:rounded-3xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500">
                                    {service.icon}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Link */}
                <div className="flex justify-center">
                    <Link
                        href="/services"
                        className="group flex items-center gap-3 sm:gap-4 text-base sm:text-lg md:text-xl font-bold hover:opacity-70 transition-opacity"
                    >
                        Browse all services
                        <div className="w-10 h-10 sm:w-12 sm:h-12 border-[3px] border-black rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                            <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    )
}
