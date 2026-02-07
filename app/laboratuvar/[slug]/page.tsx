import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ArrowUpRight, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Metadata } from "next"
import { ContentBlock } from "@/types/lab"

// --- Metadata ---
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const project = await prisma.project.findUnique({
        where: { slug },
        select: { publicTitle: true, description: true, heroImage: true }
    })

    if (!project) return { title: "Proje Bulunamadı" }

    return {
        title: project.publicTitle,
        description: project.description,
        openGraph: {
            images: project.heroImage ? [project.heroImage] : []
        }
    }
}

// --- Component ---
export default async function LabProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const project = await prisma.project.findUnique({
        where: { slug },
    })

    if (!project) notFound()

    const blocks = (project.contentBlocks as unknown as ContentBlock[]) || []

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* 1. Hero Section (Full Height) */}
            <div className="relative h-[80vh] w-full overflow-hidden">
                {project.heroImage ? (
                    <img
                        src={project.heroImage}
                        alt={project.publicTitle || ''}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700">Görsel Yok</div>
                )}

                {/* Overlay Header */}
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-8 md:p-20">
                    <div className="container mx-auto">
                        <Link href="/laboratuvar" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors">
                            <ArrowLeft className="w-5 h-5" /> Geri Dön
                        </Link>
                        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-4">
                            {project.publicTitle}
                        </h1>
                        {project.description && (
                            <p className="text-xl md:text-2xl text-white/90 max-w-2xl font-light leading-relaxed">
                                {project.description}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. Main Layout (Sticky Sidebar style) */}
            <div className="container mx-auto px-6 py-20">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">

                    {/* Sidebar (Sticky) */}
                    <div className="lg:col-span-4 space-y-12">
                        <div className="sticky top-12 space-y-12">
                            {/* Meta Info */}
                            <div className="grid grid-cols-2 gap-8 border-t border-border pt-8">
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Yıl</h4>
                                    <p className="text-lg font-medium">{project.year || '—'}</p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Kategori</h4>
                                    <p className="text-lg font-medium">{project.tags?.[0] || 'Genel'}</p>
                                </div>
                            </div>

                            {/* Tech Stack */}
                            {project.tags && project.tags.length > 0 && (
                                <div className="border-t border-border pt-8">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Teknolojiler</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-muted rounded-full text-xs font-medium">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Live Link Button */}
                            {project.liveUrl && (
                                <div className="pt-8">
                                    <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background rounded-full font-bold hover:bg-emerald-500 hover:text-white transition-all group"
                                    >
                                        Projeyi İncele
                                        <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content Blocks */}
                    <div className="lg:col-span-8 space-y-24">
                        {blocks.map((block) => {
                            switch (block.type) {
                                case 'text':
                                    return (
                                        <div key={block.id} className="prose prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: (block as any).content }} />
                                    )
                                case 'image-full':
                                    return (
                                        <div key={block.id} className="space-y-4">
                                            <img
                                                src={(block as any).url}
                                                alt={(block as any).alt || ''}
                                                className="w-full rounded-2xl shadow-xl"
                                            />
                                            {(block as any).caption && (
                                                <p className="text-sm text-center text-muted-foreground italic">{(block as any).caption}</p>
                                            )}
                                        </div>
                                    )
                                case 'image-split':
                                    return (
                                        <div key={block.id} className="grid md:grid-cols-2 gap-8">
                                            <img
                                                src={(block as any).leftUrl}
                                                className="w-full rounded-2xl shadow-lg"
                                            />
                                            <img
                                                src={(block as any).rightUrl}
                                                className="w-full rounded-2xl shadow-lg mt-12 md:mt-0" // Stagger effect
                                            />
                                        </div>
                                    )
                                default:
                                    return null
                            }
                        })}
                    </div>

                </div>
            </div>
        </div>
    )
}
