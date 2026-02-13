import { Metadata } from "next"
import Link from "next/link"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import ModernFooter from "@/components/ModernFooter"
import Header from "@/components/Header"

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
        title: `${project.publicTitle || project.name} | Vogo Lab`,
        description: project.description || 'Proje detayları.',
        openGraph: {
            title: `${project.publicTitle || project.name} | Vogo Lab`,
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
        <>
            <Header />
            <main className="min-h-screen bg-white pt-24">
                {/* Hero Image - Full Width */}
                <section className="w-full">
                    {project.heroImage || project.image ? (
                        <div className="w-full aspect-[16/9] relative overflow-hidden">
                            <img
                                src={project.heroImage || project.image || ''}
                                alt={project.publicTitle || project.name || 'Project'}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-full aspect-[16/9] bg-gray-100" />
                    )}
                </section>

                {/* Project Info Section */}
                <section className="w-full px-4 md:px-8 py-16">
                    <div className="max-w-7xl mx-auto">
                        {/* Project Title & Type */}
                        <div className="mb-12 pb-12 border-b border-black/10">
                            <p className="text-sm uppercase tracking-widest text-black/50 mb-4">PROJECT</p>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-black mb-2">
                                {project.publicTitle || project.name}
                            </h1>
                            <p className="text-2xl md:text-3xl font-medium text-black/60">
                                {project.category || 'WEBSITE'}
                            </p>
                        </div>

                        {/* Project Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                            {/* Client */}
                            {(project.client?.company || project.client?.name) && (
                                <div>
                                    <h3 className="text-xs uppercase tracking-widest text-black/50 mb-2">CLIENT</h3>
                                    <p className="text-lg font-medium text-black">
                                        {project.client.company || project.client.name}
                                    </p>
                                </div>
                            )}

                            {/* Market */}
                            {project.market && (
                                <div>
                                    <h3 className="text-xs uppercase tracking-widest text-black/50 mb-2">MARKET</h3>
                                    <p className="text-lg font-medium text-black">{project.market}</p>
                                </div>
                            )}

                            {/* Services */}
                            {services.length > 0 && (
                                <div>
                                    <h3 className="text-xs uppercase tracking-widest text-black/50 mb-2">SERVICES</h3>
                                    <p className="text-lg font-medium text-black">{services.join(', ')}</p>
                                </div>
                            )}

                            {/* Client Type */}
                            {project.clientType && (
                                <div>
                                    <h3 className="text-xs uppercase tracking-widest text-black/50 mb-2">CLIENT TYPE</h3>
                                    <p className="text-lg font-medium text-black">{project.clientType}</p>
                                </div>
                            )}

                            {/* Website */}
                            {project.websiteUrl && (
                                <div>
                                    <h3 className="text-xs uppercase tracking-widest text-black/50 mb-2">WEBSITE</h3>
                                    <a
                                        href={project.websiteUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-lg font-medium text-black hover:underline"
                                    >
                                        {project.websiteUrl.replace(/^https?:\/\//, '')}
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* The Case Section */}
                        {project.description && (
                            <div className="max-w-3xl">
                                <h2 className="text-4xl md:text-5xl font-black text-black mb-6">THE CASE</h2>
                                <p className="text-lg text-black/70 leading-relaxed mb-6">
                                    {project.description}
                                </p>
                                {/* Read More Button - Optional */}
                                {/* <button className="px-6 py-3 border-2 border-black rounded-full text-sm font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors">
                                    READ MORE →
                                </button> */}
                            </div>
                        )}
                    </div>
                </section>

                {/* Gallery Section - Mixed Layout */}
                {gallery.length > 0 && (
                    <section className="w-full px-4 md:px-8 py-16 space-y-8">
                        {gallery.map((image, index) => {
                            // Alternate between full width and 2-column
                            const isFullWidth = index % 3 === 0

                            if (isFullWidth) {
                                return (
                                    <div key={index} className="w-full">
                                        <img
                                            src={image}
                                            alt={`Gallery image ${index + 1}`}
                                            className="w-full h-auto object-cover rounded-2xl"
                                        />
                                    </div>
                                )
                            } else {
                                // Check if next image exists for 2-column layout
                                const nextImage = gallery[index + 1]
                                if (nextImage && index % 3 === 1) {
                                    return (
                                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <img
                                                src={image}
                                                alt={`Gallery image ${index + 1}`}
                                                className="w-full h-auto object-cover rounded-2xl"
                                            />
                                            <img
                                                src={nextImage}
                                                alt={`Gallery image ${index + 2}`}
                                                className="w-full h-auto object-cover rounded-2xl"
                                            />
                                        </div>
                                    )
                                } else if (index % 3 === 2) {
                                    // Skip this one as it was already rendered in the pair
                                    return null
                                } else {
                                    // Single image if no pair
                                    return (
                                        <div key={index} className="w-full">
                                            <img
                                                src={image}
                                                alt={`Gallery image ${index + 1}`}
                                                className="w-full h-auto object-cover rounded-2xl"
                                            />
                                        </div>
                                    )
                                }
                            }
                        })}
                    </section>
                )}
            </main>
            <ModernFooter />
        </>
    )
}
