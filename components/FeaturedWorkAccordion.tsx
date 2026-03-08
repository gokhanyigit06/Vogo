"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

const projects = [
    {
        id: "arrive",
        title: "Arrive",
        industry: "Mobility & Transportation",
        stack: ["Storyblok", "NextJS", "Tailwind", "Vercel"],
        scope: ["Design", "Website development", "Maintenance"],
        mainTag: "Storyblok",
        image: "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?q=80&w=2000&auto=format&fit=crop",
    },
    {
        id: "easypark",
        title: "EasyPark",
        industry: "Parking & Mobility",
        stack: ["Storyblok", "NextJS", "Vercel"],
        scope: ["Design", "Content Strategy", "Development"],
        mainTag: "Storyblok",
        image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=2000&auto=format&fit=crop",
    },
    {
        id: "caleffi",
        title: "Caleffi",
        industry: "Home & Textur",
        stack: ["Shopify Plus + Sanity", "React", "AWS"],
        scope: ["E-commerce", "UI/UX", "Brand Identity"],
        mainTag: "Shopify Plus + Sanity",
        image: "https://images.unsplash.com/photo-1583847268964-b28ce8f52859?q=80&w=2000&auto=format&fit=crop",
    },
    {
        id: "quanthealth",
        title: "QuantHealth",
        industry: "Health Tech & AI",
        stack: ["DatoCMS", "Typescript", "Node.js"],
        scope: ["Platform Design", "Frontend Development"],
        mainTag: "DatoCMS",
        image: "https://images.unsplash.com/photo-1532187863486-abf9db090b2b?q=80&w=2000&auto=format&fit=crop",
    },
    {
        id: "emailoctopus",
        title: "EmailOctopus",
        industry: "Marketing SaaS",
        stack: ["Payload CMS", "React", "PostgreSQL"],
        scope: ["Product Design", "Website development"],
        mainTag: "Payload CMS",
        image: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?q=80&w=2000&auto=format&fit=crop",
    }
]

export default function FeaturedWorkAccordion() {
    const [activeProject, setActiveProject] = useState<string>(projects[0].id)

    return (
        <section className="bg-white py-20 lg:py-32 text-black">
            <div className="container mx-auto px-4 md:px-8 max-w-[1500px]">
                {/* Header */}
                <div className="mb-12 lg:mb-20">
                    <h2 className="text-[4rem] md:text-[6rem] lg:text-[8rem] leading-[0.9] tracking-[-0.04em] font-medium">
                        Featured Work
                    </h2>
                </div>

                {/* Accordion List */}
                <div className="border-t border-black/15">
                    {projects.map((project) => {
                        const isActive = activeProject === project.id

                        return (
                            <div
                                key={project.id}
                                className="border-b border-black/15 group"
                            >
                                <div
                                    onClick={() => setActiveProject(project.id)}
                                    className="py-6 lg:py-8 cursor-pointer flex flex-col w-full"
                                >
                                    {/* Top Row: Always visible (Title + Inactive Banner OR Active "View Case") */}
                                    <div className="grid grid-cols-1 md:grid-cols-12 md:items-center gap-4 lg:gap-8 min-h-[4rem] lg:min-h-[5rem]">

                                        {/* Left Side: Title & View Case (When Active) */}
                                        <div className="md:col-span-5 lg:col-span-4 flex items-center gap-4 lg:gap-8 min-w-0">
                                            <h3 className={`text-4xl md:text-5xl lg:text-7xl font-medium tracking-[-0.03em] origin-left transition-all duration-500 ease-[0.16,1,0.3,1] whitespace-nowrap truncate ${isActive ? "opacity-100" : "opacity-40 group-hover:opacity-70"} `}>
                                                {project.title}
                                            </h3>

                                            <AnimatePresence>
                                                {isActive && (
                                                    <motion.div
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -10 }}
                                                        transition={{ duration: 0.4 }}
                                                        className="hidden md:flex items-center gap-2 text-sm font-bold tracking-tight whitespace-nowrap relative z-10"
                                                    >
                                                        View Case <ArrowUpRight className="w-4 h-4 text-green-500" />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Right Side: Pill + Banner (When Inactive) */}
                                        <div className="hidden md:block md:col-span-7 lg:col-span-8 relative h-12 lg:h-16 w-full">
                                            <AnimatePresence>
                                                {!isActive && (
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="absolute inset-0 flex items-center justify-end w-full h-full"
                                                    >
                                                        <div className="h-full flex-1 rounded-full overflow-hidden relative border border-black/5 flex items-center bg-[#F8F8F8]">
                                                            {/* Pill INSIDE the image container */}
                                                            <div className="absolute left-2 z-10 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full border border-black/10 text-xs md:text-sm font-semibold whitespace-nowrap shadow-sm text-black group-hover:bg-white transition-colors duration-300">
                                                                {project.mainTag}
                                                            </div>

                                                            <img
                                                                src={project.image}
                                                                alt={project.title}
                                                                className="absolute inset-0 w-full h-[250%] object-cover object-center translate-y-[10%] opacity-90 group-hover:scale-105 transition-transform duration-700"
                                                            />
                                                            <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors duration-500" />
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    {/* Bottom Expanded Content (When Active) */}
                                    <AnimatePresence initial={false}>
                                        {isActive && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1, transition: { height: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.4, delay: 0.2 } } }}
                                                exit={{ height: 0, opacity: 0, transition: { height: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.2 } } }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pt-10 lg:pt-16 pb-4 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8">

                                                    {/* Meta Info Left */}
                                                    <div className="lg:col-span-3 flex flex-col gap-10">
                                                        <div>
                                                            <p className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-black/50 uppercase mb-3">Industry</p>
                                                            <p className="text-lg md:text-xl font-medium tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-black to-black/70">{project.industry}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-black/50 uppercase mb-3">Technical Stack</p>
                                                            <ul className="flex flex-col gap-1">
                                                                {project.stack.map(s => (
                                                                    <li key={s} className="text-lg md:text-xl font-medium tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-black to-black/70">{s}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-black/50 uppercase mb-3">Scope of work</p>
                                                            <ul className="flex flex-col gap-1">
                                                                {project.scope.map(s => (
                                                                    <li key={s} className="text-lg md:text-xl font-medium tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-black to-black/70">{s}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    {/* Big Image Right */}
                                                    <div className="lg:col-span-9 relative">
                                                        <div className="w-full h-[300px] sm:h-[450px] lg:h-[650px] rounded-[2rem] overflow-hidden bg-black flex items-center justify-center">
                                                            <img
                                                                src={project.image}
                                                                alt={project.title}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-[0.16,1,0.3,1]"
                                                            />
                                                        </div>
                                                    </div>

                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
