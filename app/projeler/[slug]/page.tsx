import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import HeroSection from "@/components/project/HeroSection"
import ProjectInfoCard from "@/components/project/ProjectInfoCard"
import ContentBlockRenderer from "@/components/project/ContentBlockRenderer"
import ProjectGallery from "@/components/project/ProjectGallery"
import RelatedProjects from "@/components/project/RelatedProjects"
import Contact from "@/components/Contact"
import ModernFooter from "@/components/ModernFooter"

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
        openGraph: {
            title: `${project.publicTitle || project.name} | Vogo Agency`,
            description: project.description || 'Proje detayları.',
            images: project.heroImage || project.image ? [project.heroImage || project.image!] : [],
        }
    }
}

// Helper to fetch project
async function getProject(slugOrId: string) {
    // Try finding by slug first
    let project = await prisma.project.findUnique({
        where: { slug: slugOrId },
        include: { client: true }
    })

    // If not found, check if it's an ID (backward compatibility)
    if (!project && !isNaN(Number(slugOrId))) {
        project = await prisma.project.findUnique({
            where: { id: Number(slugOrId) },
            include: { client: true }
        })
    }

    return project
}

export default async function ProjectDetailPage({ params }: Props) {
    const resolvedParams = await params
    const project = await getProject(resolvedParams.slug)

    if (!project) notFound()

    // Parse services and content blocks from JSON
    const services = Array.isArray(project.services) ? (project.services as string[]) : []
    const contentBlocks = Array.isArray(project.contentBlocks) ? (project.contentBlocks as any[]) : []
    const gallery = Array.isArray(project.gallery) ? (project.gallery as string[]) : []

    return (
        <main className="min-h-screen bg-white">
            {/* Back Button */}
            <div className="fixed top-8 left-8 z-50">
                <Link
                    href="/portfolio"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm border border-stone-200 rounded-full text-stone-700 hover:bg-stone-100 transition-all shadow-lg hover:shadow-xl"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="font-medium">Tüm Projeler</span>
                </Link>
            </div>

            {/* Hero Section */}
            <HeroSection
                title={project.publicTitle || project.name || 'Proje'}
                heroImage={project.heroImage || project.image || undefined}
                heroVideo={project.heroVideo || undefined}
                tagline={
                    (project.categories && project.categories.length > 0)
                        ? project.categories.join(', ')
                        : project.category || undefined
                }
            />

            {/* Project Info Card */}
            <ProjectInfoCard
                description={project.description || undefined}
                client={project.client?.company || project.client?.name || undefined}
                services={services}
                year={project.year || undefined}
                category={project.category || undefined}
                market={project.market || undefined}
                clientType={project.clientType || undefined}
                websiteUrl={project.websiteUrl || undefined}
            />

            {/* Content Blocks */}
            <ContentBlockRenderer blocks={contentBlocks} />

            {/* Project Gallery */}
            <ProjectGallery images={gallery} />

            {/* Related Projects */}
            <RelatedProjects
                currentId={project.id}
                currentCategories={project.categories || []}
            />

            {/* Contact CTA */}
            <Contact />

            {/* Legacy Content (if no blocks) */}
            {contentBlocks.length === 0 && project.content && (
                <section className="py-16 px-6 lg:px-12 bg-white">
                    <div className="max-w-4xl mx-auto">
                        <article className="prose prose-lg prose-stone max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: project.content }} />
                        </article>
                    </div>
                </section>
            )}

            <ModernFooter />
        </main>
    )
}
