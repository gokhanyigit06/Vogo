"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Header from "@/components/Header"
import ModernFooter from "@/components/ModernFooter"
import { ArrowUpRight, ArrowRight } from "lucide-react"

export default function ServicesPage() {

    const expertiseBoxes = [
        {
            title: "Headless CMS\nDevelopment",
            link: "#headless-cms",
            icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 12 12 17 22 12" />
                    <polyline points="2 17 12 22 22 17" />
                </svg>
            )
        },
        {
            title: "Headless eCommerce\nDevelopment",
            link: "#headless-ecommerce",
            icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
            )
        },
        {
            title: "AI & Advanced\nIntegrations",
            link: "#ai-integrations",
            icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                    <path d="M12 2v20" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
            )
        },
        {
            title: "Design",
            link: "#design",
            icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
            )
        }
    ]

    const cmsTools = ["Payload", "Storyblok", "Sanity", "Directus", "Contentful", "Dato CMS"]
    const commerceTools = ["Shopify Hydrogen", "Swell", "Crystallize", "Medusa", "Commerce Layer"]

    return (
        <>
            <Header />
            <main className="bg-white min-h-screen pt-24 pb-0 text-black selection:bg-black selection:text-white overflow-hidden">

                {/* Hero Section */}
                <section className="w-full pt-16 md:pt-24 lg:pt-32 pb-16 lg:pb-24 border-b border-black/10">
                    <div className="container mx-auto px-4 md:px-8 max-w-[1500px]">
                        <motion.h1
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="text-[4.5rem] sm:text-[7rem] md:text-[9rem] lg:text-[11.5rem] xl:text-[14rem] font-bold leading-[0.85] tracking-tighter uppercase text-black"
                        >
                            OUR<br />
                            EXPERTISE
                        </motion.h1>
                    </div>
                </section>

                {/* The 4 Grid Boxes */}
                <section className="w-full border-b border-black/10 flex flex-col md:flex-row">
                    {expertiseBoxes.map((box, idx) => (
                        <Link
                            key={idx}
                            href={box.link}
                            className={`group relative flex-1 min-h-[300px] lg:min-h-[400px] border-b md:border-b-0 md:border-r border-black/10 last:border-r-0 last:border-b-0 p-8 lg:p-10 flex flex-col justify-between overflow-hidden bg-white hover:bg-[#FAFAFA] transition-colors duration-500`}
                        >
                            {/* Title */}
                            <h3 className="text-xl md:text-2xl lg:text-3xl font-medium tracking-tight whitespace-pre-line relative z-10 transition-transform duration-500 group-hover:translate-y-2">
                                {box.title}
                            </h3>

                            {/* Go to section pill (hidden by default, slides down) */}
                            <div className="absolute top-1/2 left-8 -translate-y-1/2 opacity-0 -mt-10 group-hover:opacity-100 group-hover:mt-0 transition-all duration-500 z-10">
                                <span className="bg-black/5 backdrop-blur-sm border border-black/10 text-black px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                    Go to Section
                                    <ArrowRight size={14} />
                                </span>
                            </div>

                            {/* Icon at bottom right */}
                            <div className="self-end mt-12 transform transition-transform duration-700 group-hover:scale-110 group-hover:-translate-y-2 opacity-50 group-hover:opacity-100">
                                {box.icon}
                            </div>
                        </Link>
                    ))}
                </section>

                {/* Headless CMS Section */}
                <section id="headless-cms" className="w-full pt-20 lg:pt-32 pb-20 border-b border-black/10">
                    <div className="container mx-auto px-4 md:px-8 max-w-[1500px]">

                        {/* Top Header Row */}
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 lg:mb-16 gap-8">
                            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.05]">
                                Headless CMS<br />Development
                            </h2>
                            <Link href="/contact" className="px-8 py-3 rounded-full border border-black text-black font-semibold hover:bg-black hover:text-white transition-colors duration-300 text-sm tracking-wide shrink-0">
                                About Service
                            </Link>
                        </div>

                        {/* Content Row */}
                        <div className="border-t border-black/10 pt-16">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
                                {/* Left Side: Description */}
                                <div className="lg:col-span-5">
                                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">CMS Implementation</h3>
                                    <p className="text-base md:text-lg font-medium text-black/60 max-w-sm leading-relaxed">
                                        Expert CMS implementations for dynamic content delivery
                                    </p>
                                </div>

                                {/* Right Side: List */}
                                <div className="lg:col-span-7 flex flex-col pt-2 lg:pt-0">
                                    {cmsTools.map((tool, idx) => (
                                        <div key={idx} className="group cursor-default flex items-center justify-between py-6 border-b border-black/10 hover:bg-black transition-colors px-4 -mx-4 sm:mx-0 sm:px-4 rounded-lg">
                                            <div className="flex items-center gap-6">
                                                <span className="text-black/30 group-hover:text-white/30 font-mono text-xs md:text-sm transition-colors duration-300">{(idx + 1).toString().padStart(2, '0')}</span>
                                                <span className="text-xl md:text-3xl font-medium tracking-tight text-black group-hover:text-white group-hover:translate-x-2 transition-all duration-300">{tool}</span>
                                            </div>
                                            <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[6px] border-l-white border-b-[5px] border-b-transparent opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* Headless eCommerce Section */}
                <section id="headless-ecommerce" className="w-full pt-20 lg:pt-32 pb-32 border-b border-black/10">
                    <div className="container mx-auto px-4 md:px-8 max-w-[1500px]">

                        {/* Top Header Row */}
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 lg:mb-16 gap-8">
                            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.05]">
                                Headless<br />eCommerce<br />Development
                            </h2>
                            <Link href="/contact" className="px-8 py-3 rounded-full border border-black text-black font-semibold hover:bg-black hover:text-white transition-colors duration-300 text-sm tracking-wide shrink-0">
                                About Service
                            </Link>
                        </div>

                        {/* Content Row */}
                        <div className="border-t border-black/10 pt-16">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
                                {/* Left Side: Description */}
                                <div className="lg:col-span-5">
                                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">eCommerce Architecture</h3>
                                    <p className="text-base md:text-lg font-medium text-black/60 max-w-sm leading-relaxed">
                                        Tailored eCommerce systems for cutting-edge Online Retail
                                    </p>
                                </div>

                                {/* Right Side: List */}
                                <div className="lg:col-span-7 flex flex-col pt-2 lg:pt-0">
                                    {commerceTools.map((tool, idx) => (
                                        <div key={idx} className="group cursor-default flex items-center justify-between py-6 border-b border-black/10 hover:bg-black transition-colors px-4 -mx-4 sm:mx-0 sm:px-4 rounded-lg">
                                            <div className="flex items-center gap-6">
                                                <span className="text-black/30 group-hover:text-white/30 font-mono text-xs md:text-sm transition-colors duration-300">{(idx + 1).toString().padStart(2, '0')}</span>
                                                <span className="text-xl md:text-3xl font-medium tracking-tight text-black group-hover:text-white group-hover:translate-x-2 transition-all duration-300">{tool}</span>
                                            </div>
                                            <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[6px] border-l-white border-b-[5px] border-b-transparent opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* Modern Web & Jamstack Development */}
                <section id="modern-web" className="w-full pt-20 lg:pt-32 pb-20 border-b border-black/10">
                    <div className="container mx-auto px-4 md:px-8 max-w-[1500px]">

                        {/* Top Header Row */}
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 lg:mb-16 gap-8">
                            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.05]">
                                Modern Web &<br />Jamstack Development
                            </h2>
                            <Link href="/contact" className="px-8 py-3 rounded-full border border-black text-black font-semibold hover:bg-black hover:text-white transition-colors duration-300 text-sm tracking-wide shrink-0">
                                About Service
                            </Link>
                        </div>

                        {/* Content Rows */}
                        <div className="border-t border-black/10 pt-16">

                            {/* Sub-section 1 */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-black/10 mb-16">
                                {/* Left Side: Description */}
                                <div className="lg:col-span-5">
                                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">Modern Web Development</h3>
                                    <p className="text-base md:text-lg font-medium text-black/60 max-w-sm leading-relaxed">
                                        Pioneering Web solutions<br />with a modern Agile approach
                                    </p>
                                </div>

                                {/* Right Side: List */}
                                <div className="lg:col-span-7 flex flex-col pt-2 lg:pt-0">
                                    {["Jamstack Architecture", "Next.JS Development", "Self-Hosted Next.JS", "Next.JS App Router"].map((tool, idx) => (
                                        <div key={idx} className="group cursor-default flex items-center justify-between py-6 border-b border-black/10 hover:bg-black transition-colors px-4 -mx-4 sm:mx-0 sm:px-4 rounded-lg">
                                            <div className="flex items-center gap-6">
                                                <span className="text-black/30 group-hover:text-white/30 font-mono text-xs md:text-sm transition-colors duration-300">{(idx + 1).toString().padStart(2, '0')}</span>
                                                <span className="text-xl md:text-3xl font-medium tracking-tight text-black group-hover:text-white group-hover:translate-x-2 transition-all duration-300">{tool}</span>
                                            </div>
                                            <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[6px] border-l-white border-b-[5px] border-b-transparent opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sub-section 2 */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
                                {/* Left Side: Description */}
                                <div className="lg:col-span-5">
                                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">Next.JS Audits</h3>
                                    <p className="text-base md:text-lg font-medium text-black/60 max-w-sm leading-relaxed">
                                        Next.JS website's performance<br />and architectural audit services
                                    </p>
                                </div>

                                {/* Right Side: List */}
                                <div className="lg:col-span-7 flex flex-col pt-2 lg:pt-0">
                                    {["Next.JS AI SEO Audit", "Next.JS Performance Audit"].map((tool, idx) => (
                                        <div key={`audit-${idx}`} className="group cursor-default flex items-center justify-between py-6 border-b border-black/10 hover:bg-black transition-colors px-4 -mx-4 sm:mx-0 sm:px-4 rounded-lg">
                                            <div className="flex items-center gap-6">
                                                <span className="text-black/30 group-hover:text-white/30 font-mono text-xs md:text-sm transition-colors duration-300">{(idx + 1).toString().padStart(2, '0')}</span>
                                                <span className="text-xl md:text-3xl font-medium tracking-tight text-black group-hover:text-white group-hover:translate-x-2 transition-all duration-300">{tool}</span>
                                            </div>
                                            <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[6px] border-l-white border-b-[5px] border-b-transparent opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* AI & Advanced Integrations Section */}
                <section id="ai-integrations" className="w-full pt-20 lg:pt-32 pb-20 border-b border-black/10">
                    <div className="container mx-auto px-4 md:px-8 max-w-[1500px]">

                        {/* Top Header Row */}
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 lg:mb-16 gap-8">
                            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.05]">
                                AI & Advanced<br />Integrations
                            </h2>
                            <Link href="/contact" className="px-8 py-3 rounded-full border border-black text-black font-semibold hover:bg-black hover:text-white transition-colors duration-300 text-sm tracking-wide shrink-0">
                                About Service
                            </Link>
                        </div>

                        {/* Content Row */}
                        <div className="border-t border-black/10 pt-16">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
                                {/* Left Side: Description */}
                                <div className="lg:col-span-5">
                                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">AI Integration Services</h3>
                                    <p className="text-base md:text-lg font-medium text-black/60 max-w-sm leading-relaxed">
                                        Developing advanced integrations<br />using AI tools and frameworks
                                    </p>
                                </div>

                                {/* Right Side: List */}
                                <div className="lg:col-span-7 flex flex-col pt-2 lg:pt-0">
                                    {["ChatGPT & AI Integrations", "AI KIT", "Custom ChatGPT Shopping Apps For ECommerce", "MedusaJS ChatGPT App"].map((tool, idx) => (
                                        <div key={idx} className="group cursor-default flex items-center justify-between py-6 border-b border-black/10 hover:bg-black transition-colors px-4 -mx-4 sm:mx-0 sm:px-4 rounded-lg">
                                            <div className="flex items-center gap-6">
                                                <span className="text-black/30 group-hover:text-white/30 font-mono text-xs md:text-sm transition-colors duration-300">{(idx + 1).toString().padStart(2, '0')}</span>
                                                <span className="text-xl md:text-3xl font-medium tracking-tight text-black group-hover:text-white group-hover:translate-x-2 transition-all duration-300">{tool}</span>
                                            </div>
                                            <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[6px] border-l-white border-b-[5px] border-b-transparent opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* Design Section */}
                <section id="design" className="w-full pt-20 lg:pt-32 pb-32 border-b border-black/10">
                    <div className="container mx-auto px-4 md:px-8 max-w-[1500px]">

                        {/* Top Header Row */}
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 lg:mb-16 gap-8">
                            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.05]">
                                Design
                            </h2>
                            <Link href="/contact" className="px-8 py-3 rounded-full border border-black text-black font-semibold hover:bg-black hover:text-white transition-colors duration-300 text-sm tracking-wide shrink-0">
                                About Service
                            </Link>
                        </div>

                        {/* Content Row */}
                        <div className="border-t border-black/10 pt-16">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
                                {/* Left Side: Description */}
                                <div className="lg:col-span-5">
                                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">Digital Design</h3>
                                    <p className="text-base md:text-lg font-medium text-black/60 max-w-sm leading-relaxed">
                                        All creative work is delivered by FocusReactive<br />in collaboration with our sister agency<br />Habitat — from first sketch to final interface.
                                    </p>
                                </div>

                                {/* Right Side: List */}
                                <div className="lg:col-span-7 flex flex-col pt-2 lg:pt-0">
                                    {["UI/UX Design", "Branding", "Motion & Animations"].map((tool, idx) => (
                                        <div key={idx} className="group cursor-default flex items-center justify-between py-6 border-b border-black/10 hover:bg-black transition-colors px-4 -mx-4 sm:mx-0 sm:px-4 rounded-lg">
                                            <div className="flex items-center gap-6">
                                                <span className="text-black/30 group-hover:text-white/30 font-mono text-xs md:text-sm transition-colors duration-300">{(idx + 1).toString().padStart(2, '0')}</span>
                                                <span className="text-xl md:text-3xl font-medium tracking-tight text-black group-hover:text-white group-hover:translate-x-2 transition-all duration-300">{tool}</span>
                                            </div>
                                            <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[6px] border-l-white border-b-[5px] border-b-transparent opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

            </main>
            <ModernFooter />
        </>
    )
}
