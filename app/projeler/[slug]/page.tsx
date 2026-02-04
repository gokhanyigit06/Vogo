
import { Metadata } from "next"
import Link from "next/link"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, User, Tag, ExternalLink } from "lucide-react"

// Types for params
type Props = {
    params: Promise<{ slug: string }>
}

// SEO Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params
    const project = await getProject(resolvedParams.slug)

    if (!project) return { title: 'Proje Bulunamadı' }

    return {
        title: `${project.publicTitle || project.name} | Vogo Agency`,
        description: project.description || 'Proje detayları.',
    }
}

// Helper to fetch project
async function getProject(slugOrId: string) {
    // Try finding by slug first
    let project = await prisma.project.findUnique({
        where: { slug: slugOrId },
        include: { clients: true }
    })

    // If not found, check if it's an ID (backward compatibility)
    if (!project && !isNaN(Number(slugOrId))) {
        project = await prisma.project.findUnique({
            where: { id: Number(slugOrId) },
            include: { clients: true }
        })
    }

    return project
}

export default async function ProjectDetailPage({ params }: Props) {
    const resolvedParams = await params
    const project = await getProject(resolvedParams.slug)

    if (!project) notFound()

    return (
        <main className="min-h-screen bg-black text-white pb-20">
            {/* Header / Hero */}
            <section className="relative pt-32 pb-16 px-6 lg:px-12 border-b border-white/10 bg-zinc-900/50">
                <div className="max-w-4xl mx-auto">
                    <Link href="/projeler" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8">
                        <ArrowLeft className="w-4 h-4" />
                        Tüm Projeler
                    </Link>

                    <div className="space-y-4">
                        {project.category && (
                            <span className="inline-block px-3 py-1 text-sm font-bold text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 rounded-full">
                                {project.category}
                            </span>
                        )}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                            {project.publicTitle || project.name}
                        </h1>
                        <p className="text-xl text-slate-400 leading-relaxed max-w-2xl">
                            {project.description}
                        </p>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 py-8 border-t border-white/10">
                        {project.clients?.company && (
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Müşteri</div>
                                <div className="font-medium text-white">{project.clients.company}</div>
                            </div>
                        )}
                        {project.startDate && (
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Tarih</div>
                                <div className="font-medium text-white">
                                    {new Date(project.startDate).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' })}
                                </div>
                            </div>
                        )}
                        {project.category && (
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Kategori</div>
                                <div className="font-medium text-white">{project.category}</div>
                            </div>
                        )}
                        {/* Optional Live Link would go here */}
                    </div>
                </div>
            </section>

            {/* Content Body */}
            <section className="px-6 lg:px-12 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Main Image */}
                    {project.image && (
                        <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-emerald-900/10 mb-12">
                            <img
                                src={project.image}
                                alt={project.publicTitle || 'Proje Görseli'}
                                className="w-full h-auto"
                            />
                        </div>
                    )}

                    {/* Rich Text Content */}
                    <article className="prose prose-invert prose-lg max-w-none prose-emerald prose-headings:font-bold prose-headings:text-white prose-p:text-slate-300 prose-li:text-slate-300">
                        {project.content ? (
                            <div dangerouslySetInnerHTML={{ __html: project.content }} />
                        ) : (
                            <div className="text-slate-500 italic">
                                Bu proje için henüz detaylı içerik girilmemiş.
                            </div>
                        )}
                    </article>

                    {/* Gallery (If implemented in future with JSON) */}
                    {/* 
                    {project.gallery && Array.isArray(project.gallery) && (
                        <div className="grid grid-cols-2 gap-4 mt-12">
                             ...
                        </div>
                    )}
                    */}
                </div>
            </section>
        </main>
    )
}
