"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import Header from "@/components/Header"
import ModernFooter from "@/components/ModernFooter"
import { Project, ContentSection } from "@/types/firebase"
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Loader2, ArrowLeft } from "lucide-react"

export default function ProjectDetailPage() {
    const params = useParams()
    const router = useRouter()
    const t = useTranslations("ProjectDetail")
    const [project, setProject] = useState<Project | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const slug = params.slug as string
                const projectsRef = collection(db, "projects")
                const q = query(projectsRef, where("slug", "==", slug))
                const querySnapshot = await getDocs(q)

                if (!querySnapshot.empty) {
                    const docData = querySnapshot.docs[0].data() as Project
                    setProject({ ...docData, id: querySnapshot.docs[0].id })
                }
            } catch (err) {
                console.error("Error fetching project:", err)
            } finally {
                setLoading(false)
            }
        }

        if (params.slug) {
            fetchProject()
        }
    }, [params.slug])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white text-black">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        )
    }

    if (!project) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black text-center px-4">
                <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
                <button onClick={() => router.back()} className="text-lg font-medium border-b border-black">
                    Go Back
                </button>
            </div>
        )
    }

    return (
        <>
            <Header />
            <main className="bg-white min-h-screen pt-24 pb-0 text-black">
                {/* 16:9 Hero Media */}
                <section className="container mx-auto px-4 md:px-8 max-w-[1500px] mb-12">
                    <div className="aspect-video w-full rounded-[2rem] overflow-hidden bg-black/5 relative group">
                        {project.heroVideo ? (
                            <video
                                src={project.heroVideo}
                                className="w-full h-full object-cover"
                                autoPlay
                                muted
                                loop
                                playsInline
                            />
                        ) : (
                            <img
                                src={project.heroImage || project.image || project.thumbnail}
                                alt={project.publicTitle}
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                </section>

                {/* Project Metadata & THE CASE */}
                <section className="container mx-auto px-4 md:px-8 max-w-[1500px] mb-32">
                    <div className="flex flex-col gap-8 mb-16 px-4">
                        <div className="flex flex-col gap-2">
                            <span className="text-sm font-bold uppercase tracking-widest text-black/40">{t("projectLabel")}</span>
                            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter leading-[0.8] uppercase">
                                {project.publicTitle}
                            </h1>
                        </div>
                    </div>

                    <div className="w-full h-px bg-black/10 mb-20" />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 px-4">
                        {/* Info Column */}
                        <div className="lg:col-span-5 grid grid-cols-2 gap-12 self-start">
                            <div className="flex flex-col gap-3">
                                <span className="text-sm font-bold uppercase tracking-widest text-black/40">{t("clientLabel")}</span>
                                <span className="text-lg font-medium">{project.client || "Vogo Client"}</span>
                            </div>
                            <div className="flex flex-col gap-3">
                                <span className="text-sm font-bold uppercase tracking-widest text-black/40">{t("marketLabel")}</span>
                                <span className="text-lg font-medium">{project.market || project.industry || "Global"}</span>
                            </div>
                            <div className="flex flex-col gap-3">
                                <span className="text-sm font-bold uppercase tracking-widest text-black/40">{t("typeLabel")}</span>
                                <span className="text-lg font-medium uppercase tracking-tight">{project.clientType || "Enterprise"}</span>
                            </div>
                            <div className="flex flex-col gap-3">
                                <span className="text-sm font-bold uppercase tracking-widest text-black/40">{t("servicesLabel")}</span>
                                <ul className="flex flex-col gap-1">
                                    {project.services?.map((s: any, i: number) => (
                                        <li key={i} className="text-lg font-medium uppercase text-black/60">{typeof s === 'string' ? s : s.title}</li>
                                    )) || project.categories?.map((c, i) => (
                                        <li key={i} className="text-lg font-medium uppercase text-black/60">{c}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* CASE Column */}
                        <div className="lg:col-span-7 flex flex-col gap-10">
                            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase leading-none">{t("caseLabel")}</h2>
                            <div className="prose prose-xl prose-p:text-black/60 prose-p:font-medium prose-p:leading-relaxed max-w-none">
                                <p>
                                    {project.description || project.desc || project.content}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Dynamic Content Grid Sections */}
                {project.contentBlocks && project.contentBlocks.length > 0 && (
                    <section className="container mx-auto px-4 md:px-8 max-w-[1500px] flex flex-col gap-16 lg:gap-24 mb-32">
                        {project.contentBlocks.map((block, index) => (
                            <div key={index} className="w-full">
                                {block.type === '2-square' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8">
                                        {block.media.slice(0, 2).map((m, mi) => (
                                            <div key={mi} className="aspect-square rounded-[2rem] overflow-hidden bg-black/5">
                                                {m.type === 'video' ? (
                                                    <video src={m.url} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                                                ) : (
                                                    <img src={m.url} alt="" className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {block.type === '3-square' && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8">
                                        {block.media.slice(0, 3).map((m, mi) => (
                                            <div key={mi} className="aspect-square rounded-[2rem] overflow-hidden bg-black/5">
                                                {m.type === 'video' ? (
                                                    <video src={m.url} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                                                ) : (
                                                    <img src={m.url} alt="" className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {block.type === '3-vertical-9-16' && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8">
                                        {block.media.slice(0, 3).map((m, mi) => (
                                            <div key={mi} className="aspect-[9/16] rounded-[2rem] overflow-hidden bg-black/5">
                                                {m.type === 'video' ? (
                                                    <video src={m.url} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                                                ) : (
                                                    <img src={m.url} alt="" className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </section>
                )}

                <ModernFooter />
            </main>
        </>
    )
}
