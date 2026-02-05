"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

interface Project {
    id: number
    title: string
    slug: string
    heroImage?: string
    image?: string
    categories: string[]
}

interface RelatedProjectsProps {
    currentId: number
    currentCategories: string[]
}

export default function RelatedProjects({ currentId, currentCategories }: RelatedProjectsProps) {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // Fetch all projects to filter on client side for simplicity in this artifact
                // Ideally, backend would have a "related" endpoint
                const res = await fetch('/api/projects') // Assuming this returns list
                if (!res.ok) throw new Error('Failed to fetch')
                const allProjects: Project[] = await res.json()

                // Filter out current project
                const others = allProjects.filter(p => p.id !== currentId)

                // Sort by relevance (shared categories)
                const scored = others.map(p => {
                    // Safety check: ensure categories is an array
                    const pCats = Array.isArray(p.categories) ? p.categories : []
                    // Count how many categories match current project's categories
                    const matchCount = pCats.filter(c => currentCategories.includes(c)).length
                    return { project: p, score: matchCount }
                })

                // Sort descending by score, take top 3
                // If scores equal, original order (usually recency) is preserved
                scored.sort((a, b) => b.score - a.score)
                setProjects(scored.slice(0, 3).map(item => item.project))

            } catch (error) {
                console.error("Related projects error:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchProjects()
    }, [currentId, currentCategories])

    if (loading || projects.length === 0) return null

    return (
        <section className="py-24 bg-stone-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-stone-900 mb-2">Diğer Projeler</h2>
                        <p className="text-stone-500">İlginizi çekebilecek benzer çalışmalarımız</p>
                    </div>
                    <Link
                        href="/portfolio"
                        className="hidden md:flex items-center gap-2 text-stone-600 hover:text-emerald-600 font-medium transition-colors"
                    >
                        Tümünü Gör <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <Link
                            key={project.id}
                            href={`/projeler/${project.slug}`}
                            className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                        >
                            <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                                {(project.image || project.heroImage) ? (
                                    <Image
                                        src={project.image || project.heroImage!}
                                        alt={project.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                                        No Image
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                            </div>

                            <div className="p-6">
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {(Array.isArray(project.categories) ? project.categories : []).slice(0, 2).map((cat, idx) => (
                                        <span key={idx} className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                            {cat}
                                        </span>
                                    ))}
                                </div>
                                <h3 className="text-xl font-bold text-stone-900 mb-2 group-hover:text-emerald-600 transition-colors">
                                    {project.title}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-8 md:hidden text-center">
                    <Link
                        href="/portfolio"
                        className="inline-flex items-center gap-2 text-stone-600 hover:text-emerald-600 font-medium transition-colors"
                    >
                        Tümünü Gör <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    )
}
