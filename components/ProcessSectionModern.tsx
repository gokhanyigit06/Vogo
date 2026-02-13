"use client"

import { motion } from "framer-motion"
import { Search, PenTool, Rocket, ArrowUpRight } from "lucide-react"
import Link from "next/link"

const steps = [
    {
        number: "01",
        title: "Research",
        desc: "We dive deep into your industry, audience, and competitors to understand what makes your brand unique and to inform our creative strategy.",
        icon: <Search className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14" />,
        bgColor: "bg-gradient-to-br from-blue-100 to-blue-200",
        iconColor: "text-blue-600"
    },
    {
        number: "02",
        title: "Design",
        desc: "Our expert designers craft pixel-perfect mockups and prototypes, iterating with your feedback until every detail is just right.",
        icon: <PenTool className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14" />,
        bgColor: "bg-gradient-to-br from-purple-100 to-purple-200",
        iconColor: "text-purple-600"
    },
    {
        number: "03",
        title: "Launch",
        desc: "We deliver production-ready assets and provide support to ensure a smooth launch. Your brand goes live, looking its absolute best.",
        icon: <Rocket className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14" />,
        bgColor: "bg-gradient-to-br from-green-100 to-green-200",
        iconColor: "text-green-600"
    }
]

export default function ProcessSectionModern() {
    return (
        <section className="py-16 sm:py-20 md:py-24 bg-white overflow-hidden text-black font-sans">
            <div className="container mx-auto px-4 md:px-8 max-w-[95%] w-full">

                {/* Header */}
                <div className="text-center space-y-4 md:space-y-6 mb-12 sm:mb-16 md:mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif font-medium text-black leading-tight"
                    >
                        Our design <span className="relative inline-block mx-1 sm:mx-2">
                            <span className="absolute -inset-1 sm:-inset-2 bg-[#FF5C35] rounded-xl sm:rounded-2xl transform rotate-2 shadow-lg" />
                            <span className="relative text-white px-1 sm:px-2">process</span>
                        </span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-base sm:text-lg md:text-xl text-black/60 max-w-2xl mx-auto leading-relaxed font-medium px-2"
                    >
                        A streamlined three-step process designed to transform your vision into reality with efficiency and creative excellence.
                    </motion.p>
                </div>

                {/* Process Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 mb-12 sm:mb-16 md:mb-20">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15, duration: 0.6 }}
                            className="group relative bg-white border-[3px] border-black rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-8 md:p-10 flex flex-col items-center text-center hover:-translate-y-3 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-500"
                        >
                            {/* Step Number */}
                            <span className="text-xs sm:text-sm font-bold text-black/30 tracking-widest mb-4 sm:mb-6">STEP {step.number}</span>

                            {/* Icon Box */}
                            <div className={`${step.bgColor} w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-6 sm:mb-8 ${step.iconColor} group-hover:scale-110 transition-transform duration-500 shadow-md`}>
                                {step.icon}
                            </div>

                            {/* Title */}
                            <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-3 sm:mb-4">
                                {step.title}
                            </h3>

                            {/* Description */}
                            <p className="text-sm sm:text-base md:text-lg text-gray-500 font-medium leading-relaxed">
                                {step.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
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
