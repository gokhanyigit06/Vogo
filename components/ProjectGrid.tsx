"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Briefcase } from "lucide-react"
import ParallaxImage from "@/components/ui/ParallaxImage"
import MagneticButton from "@/components/ui/MagneticButton"

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
}

const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] as unknown as number[] } }
}

export default function ProjectGrid({ projects }: { projects: any[] }) {
    if (projects.length === 0) {
        return (
            <div className="text-center py-20 text-slate-500">
                Henüz proje eklenmemiş.
            </div>
        )
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
            {projects.map((project) => (
                <motion.div variants={item} key={project.id}>
                    <Link
                        href={`/projeler/${project.slug || project.id}`}
                        className="group block bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden hover:border-emerald-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-900/10"
                    >
                        {/* Image with Parallax */}
                        <div className="aspect-[16/10] bg-zinc-800 relative overflow-hidden">
                            {project.image ? (
                                <ParallaxImage
                                    src={project.image}
                                    alt={project.publicTitle || project.name || 'Proje'}
                                    className="w-full h-full"
                                    offset={30}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-700 bg-zinc-900/80">
                                    <Briefcase className="w-12 h-12 opacity-20" />
                                </div>
                            )}

                            {/* Overlay Category */}
                            {project.category && (
                                <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs text-white border border-white/10 z-10">
                                    {project.category}
                                </div>
                            )}

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500 z-0" />
                        </div>

                        <div className="p-6 space-y-4 relative z-10 bg-zinc-900/50 backdrop-blur-sm -mt-12 mx-4 rounded-xl border border-white/5 shadow-lg group-hover:-translate-y-2 transition-transform duration-500">
                            <div>
                                {project.client?.company && (
                                    <div className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                                        {project.client.company}
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                                    {project.publicTitle || project.name || 'İsimsiz Proje'}
                                </h3>
                            </div>

                            <p className="text-slate-400 text-sm line-clamp-2 mix-blend-plus-lighter">
                                {project.description || 'Proje detayları hazırlanıyor...'}
                            </p>

                            <div className="pt-2 flex justify-end">
                                <MagneticButton className="inline-block">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full text-sm font-bold group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                        İncele
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </MagneticButton>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </motion.div>
    )
}
