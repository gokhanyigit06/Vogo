import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ArrowUpRight, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Metadata } from "next"
import { ContentBlock } from "@/types/lab"
import ParallaxImage from "@/components/ui/ParallaxImage"
import FadeIn from "@/components/ui/FadeIn"
import MagneticButton from "@/components/ui/MagneticButton"

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
            {/* 1. Hero Section (Parallax) */}
            <div className="relative h-[85vh] w-full overflow-hidden">
                {project.heroImage ? (
                    <ParallaxImage
                        src={project.heroImage}
                        alt={project.publicTitle || ''}
                        className="w-full h-full"
                        offset={60}
                    />
                ) : (
                    <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700">Görsel Yok</div>
                )}

                {/* Overlay Header */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-20">
                    <div className="container mx-auto">
                        <FadeIn delay={0.2}>
                            <Link href="/laboratuvar" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors">
                                <ArrowLeft className="w-5 h-5" /> Geri Dön
                            </Link>
                        </FadeIn>

                        <FadeIn delay={0.3}>
                            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-6 relative z-10">
                                {project.publicTitle}
                            </h1>
                        </FadeIn>

                        {project.description && (
                            <FadeIn delay={0.4}>
                                <p className="text-xl md:text-2xl text-white/90 max-w-2xl font-light leading-relaxed">
                                    {project.description}
                                </p>
                            </FadeIn>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. Main Layout (Sticky Sidebar style) */}
            <div className="container mx-auto px-6 py-20">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">

                    {/* Sidebar (Sticky) */}
                    <div className="lg:col-span-4 space-y-12">
                        <div className="sticky top-24 space-y-12">
                            {/* Meta Info */}
                            <FadeIn delay={0.5}>
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
                            </FadeIn>

                            {/* Tech Stack */}
                            {project.tags && project.tags.length > 0 && (
                                <FadeIn delay={0.6}>
                                    <div className="border-t border-border pt-8">
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Teknolojiler</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {project.tags.map(tag => (
                                                <span key={tag} className="px-3 py-1 bg-muted rounded-full text-xs font-medium border border-border">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </FadeIn>
                            )}

                            {/* Live Link Button */}
                            {project.liveUrl && (
                                <FadeIn delay={0.7}>
                                    <div className="pt-8">
                                        <MagneticButton className="inline-block">
                                            <a
                                                href={project.liveUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background rounded-full font-bold hover:bg-emerald-500 hover:text-white transition-all group shadow-lg"
                                            >
                                                Projeyi İncele
                                                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            </a>
                                        </MagneticButton>
                                    </div>
                                </FadeIn>
                            )}
                        </div>
                    </div>

                    {/* Content Blocks */}
                    <div className="lg:col-span-8 space-y-24">
                        {blocks.map((block, index) => {
                            // Render wrapper
                            const Wrapper = ({ children }: { children: React.ReactNode }) => (
                                <FadeIn>{children}</FadeIn>
                            )

                            switch (block.type) {
                                case 'text':
                                    return (
                                        <Wrapper key={block.id}>
                                            <div className="prose prose-lg dark:prose-invert max-w-none leading-loose text-muted-foreground" dangerouslySetInnerHTML={{ __html: (block as any).content }} />
                                        </Wrapper>
                                    )
                                case 'image-full':
                                    return (
                                        <Wrapper key={block.id}>
                                            <div className="space-y-4">
                                                <div className="rounded-2xl overflow-hidden shadow-2xl border border-border/50">
                                                    <img
                                                        src={(block as any).url}
                                                        alt={(block as any).alt || ''}
                                                        className="w-full"
                                                    />
                                                </div>
                                                {(block as any).caption && (
                                                    <p className="text-sm text-center text-muted-foreground italic">{(block as any).caption}</p>
                                                )}
                                            </div>
                                        </Wrapper>
                                    )
                                case 'image-split':
                                    return (
                                        <Wrapper key={block.id}>
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <ParallaxImage
                                                    src={(block as any).leftUrl}
                                                    alt="Detail"
                                                    className="w-full rounded-2xl shadow-lg border border-border/50"
                                                    offset={30}
                                                />
                                                <ParallaxImage
                                                    src={(block as any).rightUrl}
                                                    alt="Detail"
                                                    className="w-full rounded-2xl shadow-lg border border-border/50 mt-12 md:mt-0"
                                                    offset={30} // Stagger check? Parallax handles movement
                                                />
                                            </div>
                                        </Wrapper>
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
