"use client"

import Header from "@/components/Header"
import ModernFooter from "@/components/ModernFooter"
import { Link } from "@/i18n/routing"
import HowWeWorkModern from "@/components/HowWeWorkModern"
import { ArrowRight } from "lucide-react"


export default function AboutPage() {



    return (
        <>
            <Header />
            <main className="bg-white min-h-screen text-black selection:bg-black selection:text-white pb-20">

                {/* Hero Section */}
                <section className="w-full pt-40 lg:pt-56 pb-20 lg:pb-32">
                    <div className="container mx-auto px-4 md:px-8 max-w-[1500px]">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-end">
                            <div className="lg:col-span-8">
                                <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[9.5rem] font-bold tracking-tighter leading-[0.95] lg:-ml-2">
                                    Where Headless <br />
                                    <span className="text-black/30">Meets Real Results</span>
                                </h1>
                            </div>
                            <div className="lg:col-span-4 flex flex-col gap-6 lg:pb-6">
                                <p className="text-xl md:text-2xl font-medium leading-relaxed text-black">
                                    We build fast, flexible platforms that marketing and dev teams actually love to use.
                                </p>
                                <p className="text-lg text-black/60 font-medium leading-relaxed">
                                    Our mission is to push the modern web forward — combining technical clarity, performance, and scalable architecture using Next.js and the best Headless tools on the market.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How We Deliver Grid */}
                <section className="w-full py-20 lg:py-32 border-t border-black/10 bg-white">
                    <div className="container mx-auto px-4 md:px-8 max-w-[1500px]">
                        <div className="flex flex-col lg:flex-row justify-between lg:items-end mb-16 lg:mb-20 gap-8">
                            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.95]">
                                How We Deliver
                            </h2>
                            <p className="text-xl font-medium text-black/60 max-w-sm lg:pb-2">
                                From first call to final delivery —<br />how we work together.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                            {[
                                {
                                    title: "Identify Business Needs",
                                    desc: "We focus on delivering solutions, not service hours. We will start with digging into your goals and forming an actionable plan.",
                                    icon: (
                                        <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10 30 L18 18 L26 24 L34 10" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                            <circle cx="10" cy="30" r="3" fill="black" />
                                            <circle cx="18" cy="18" r="3" fill="black" />
                                            <circle cx="26" cy="24" r="3" fill="black" />
                                            <circle cx="34" cy="10" r="3" fill="black" />
                                        </svg>
                                    )
                                },
                                {
                                    title: "Picking The Right Solutions",
                                    desc: "Leveraging our collaborative expertise. We pick the right toolset and align it with the business goals.",
                                    icon: (
                                        <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="0" y="26" width="11" height="14" fill="black" fillOpacity="0.25" />
                                            <rect x="14" y="14" width="11" height="26" fill="black" fillOpacity="0.6" />
                                            <rect x="28" y="0" width="11" height="40" fill="black" />
                                        </svg>
                                    )
                                },
                                {
                                    title: "Implementation Process",
                                    desc: "Aligning our rituals with your preferences. We set up a fast-paced, transparency-oriented process with frequent feedback sessions through demos and slack updates.",
                                    icon: (
                                        <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M16 40 L16 20 L0 20 Z" fill="black" fillOpacity="0.25" />
                                            <path d="M28 28 L28 10 L10 10 Z" fill="black" fillOpacity="0.6" />
                                            <path d="M40 16 L40 0 L24 0 Z" fill="black" />
                                        </svg>
                                    )
                                },
                                {
                                    title: "Afterproject Support",
                                    desc: "Whether we have a pause between delivery stages or you need ongoing maintenance work - we offer flexible support packages to keep the solutions working.",
                                    icon: (
                                        <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20 0 L40 10 L20 20 L0 10 Z" fill="black" fillOpacity="0.25" />
                                            <path d="M0 10 L20 20 L20 40 L0 30 Z" fill="black" fillOpacity="0.6" />
                                            <path d="M40 10 L40 30 L20 40 L20 20 Z" fill="black" />
                                        </svg>
                                    )
                                }
                            ].map((card, idx) => (
                                <div key={idx} className="bg-[#FAFAFA] border border-black/5 p-10 lg:p-12 flex flex-col justify-between min-h-[300px] lg:min-h-[360px]">
                                    <div>
                                        <h3 className="text-3xl lg:text-4xl font-medium tracking-tight mb-4">{card.title}</h3>
                                        <p className="text-base lg:text-lg text-black/60 leading-relaxed font-medium max-w-lg">{card.desc}</p>
                                    </div>
                                    <div className="mt-10 self-end">
                                        {card.icon}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Who We Build For / Our Services */}
                <section className="w-full">
                    <div className="container mx-auto px-4 md:px-8 max-w-[1500px]">
                        {/* Row 1 */}
                        <div className="flex flex-col lg:flex-row justify-between lg:items-center py-20 lg:py-32 border-t border-black/10 gap-12">
                            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.95] lg:w-1/2">
                                Who We Build For
                            </h2>
                            <div className="lg:w-1/2 flex flex-col items-start lg:pl-16">
                                <p className="text-xl lg:text-2xl font-medium leading-relaxed text-black mb-8 max-w-xl">
                                    Our clients are growing brands, enterprises, and funded startups looking for advanced content infrastructure, powerful editor experience, and performance-first delivery.
                                </p>
                                <Link href="/portfolio" className="group flex items-center gap-2 text-lg font-bold hover:opacity-70 transition-opacity">
                                    <span className="border-b-2 border-black pb-0.5">Cases</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </Link>
                            </div>
                        </div>

                        {/* Row 2 */}
                        <div className="flex flex-col lg:flex-row justify-between lg:items-center py-20 lg:py-32 border-t border-b border-black/10 gap-12">
                            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.95] lg:w-1/2">
                                Our Services
                            </h2>
                            <div className="lg:w-1/2 flex flex-col items-start lg:pl-16">
                                <p className="text-xl lg:text-2xl font-medium leading-relaxed text-black mb-8 max-w-xl">
                                    We specialize in building scalable, UX-focused marketing and content platforms — delivered within efficient budgets.
                                </p>
                                <Link href="/services" className="group flex items-center gap-2 text-lg font-bold hover:opacity-70 transition-opacity">
                                    <span className="border-b-2 border-black pb-0.5">Services</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <HowWeWorkModern />


            </main>
            <ModernFooter />
        </>
    )
}
