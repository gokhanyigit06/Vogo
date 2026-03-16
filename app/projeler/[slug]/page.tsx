import { Metadata } from "next"
import { db } from "@/lib/firebase"
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore"
import { notFound } from "next/navigation"
import ModernFooter from "@/components/ModernFooter"
import Header from "@/components/Header"
import { Project, ContentSection } from "@/types/firebase"

type Props = {
    params: Promise<{ slug: string }>
}

// SEO Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params
    const project = await getProject(resolvedParams.slug)

    if (!project) return { title: 'Project Not Found' }

    return {
        title: `${project.publicTitle || project.name} | Vogo Lab`,
        description: project.description || 'Project details.',
        openGraph: {
            title: `${project.publicTitle || project.name} | Vogo Lab`,
            description: project.description || 'Project details.',
            images: project.heroImage || project.image ? [project.heroImage || project.image!] : [],
        }
    }
}

// Helper to fetch project
async function getProject(slugOrId: string): Promise<Project | null> {
    try {
        const q = query(collection(db, "projects"), where("slug", "==", slugOrId))
        const snapshot = await getDocs(q)
        let projectData: any = null

        if (!snapshot.empty) {
            projectData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() }
        } else {
            const docRef = doc(db, "projects", slugOrId)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                projectData = { id: docSnap.id, ...docSnap.data() }
            }
        }

        if (projectData && projectData.clientId) {
            const clientDoc = await getDoc(doc(db, "clients", projectData.clientId))
            if (clientDoc.exists()) {
                projectData.clientInfo = clientDoc.data()
            }
        }

        return projectData
    } catch (e) {
        return null
    }
}

export default async function ProjectCaseStudyPage({ params }: Props) {
    const resolvedParams = await params
    const project = await getProject(resolvedParams.slug)

    if (!project) notFound()

    const contentBlocks = Array.isArray(project.contentBlocks) ? (project.contentBlocks as ContentSection[]) : []

    return (
        <>
            <Header />
            <main className="bg-white min-h-screen pt-32 pb-0 text-black selection:bg-black selection:text-white">
                {/* 16:9 Hero Media */}
                <section className="container mx-auto px-4 md:px-8 max-w-[1500px] mb-12 lg:mb-20">
                    <div className="aspect-video w-full rounded-[2rem] overflow-hidden bg-black/5 relative shadow-2xl shadow-black/5">
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
                            ((project.heroImage || project.image || project.thumbnail) && (/\.(mp4|mov|webm|ogg|m4v|avi)($|\?)/i.test((project.heroImage || project.image || project.thumbnail) as string) || ((project.heroImage || project.image || project.thumbnail) as string).includes('video') || ((project.heroImage || project.image || project.thumbnail) as string).includes('mp4') || ((project.heroImage || project.image || project.thumbnail) as string).includes('webm'))) ? (
                                <video
                                    src={project.heroImage || project.image || project.thumbnail || ""}
                                    className="w-full h-full object-cover"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                />
                            ) : (
                                <img
                                    src={project.heroImage || project.image || project.thumbnail || ""}
                                    alt={project.publicTitle || ""}
                                    className="w-full h-full object-cover"
                                />
                            )
                        )}
                    </div>
                </section>

                {/* Project Metadata & THE CASE */}
                <section className="container mx-auto px-4 md:px-8 max-w-[1500px] mb-32">
                    <div className="flex flex-col gap-8 mb-16 px-4">
                        <div className="flex flex-col gap-4">
                            <span className="text-sm font-bold uppercase tracking-[0.3em] text-black/30">PROJE DETAYI</span>
                            <h1 className="text-[14vw] sm:text-[12vw] md:text-[8vw] lg:text-[8rem] xl:text-[9.5rem] font-black tracking-tighter leading-[0.75] uppercase break-words w-full" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                {project.publicTitle}
                            </h1>
                        </div>
                    </div>

                    <div className="w-full h-px bg-black/10 mb-20" />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 px-4">
                        {/* Info Column */}
                        <div className="lg:col-span-5 grid grid-cols-2 gap-y-16 gap-x-12 self-start">
                            <div className="flex flex-col gap-4">
                                <span className="text-xs font-bold uppercase tracking-widest text-black/30 border-l-2 border-black pl-3">MÜŞTERİ</span>
                                <span className="text-xl font-bold uppercase tracking-tight">{project.client || project.clientInfo?.name || "Vogo Client"}</span>
                            </div>
                            <div className="flex flex-col gap-4">
                                <span className="text-xs font-bold uppercase tracking-widest text-black/30 border-l-2 border-black pl-3">PAZAR</span>
                                <span className="text-xl font-bold uppercase tracking-tight">{project.market || project.industry || "Global"}</span>
                            </div>
                            <div className="flex flex-col gap-4">
                                <span className="text-xs font-bold uppercase tracking-widest text-black/30 border-l-2 border-black pl-3">TÜR</span>
                                <span className="text-xl font-bold uppercase tracking-tight">{project.clientType || "Enterprise"}</span>
                            </div>
                            <div className="flex flex-col gap-4">
                                <span className="text-xs font-bold uppercase tracking-widest text-black/30 border-l-2 border-black pl-3">HİZMETLER</span>
                                <ul className="flex flex-col gap-2">
                                    {(project.services || project.categories)?.map((s: any, i: number) => (
                                        <li key={i} className="text-lg font-bold uppercase tracking-tighter text-black/60 leading-none">
                                            {typeof s === 'string' ? s : s.title}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* CASE Column */}
                        <div className="lg:col-span-7 flex flex-col gap-12">
                            <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8] mb-4">HİKAYE</h2>
                            <div className="max-w-2xl">
                                <p className="text-xl md:text-2xl font-medium text-black/70 leading-relaxed whitespace-pre-wrap">
                                    {project.description || project.desc || project.content}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Dynamic Content Grid Sections — supports both old & new layout types */}
                {contentBlocks.length > 0 && (
                    <section className="container mx-auto px-4 md:px-8 max-w-[1500px] flex flex-col gap-8 lg:gap-12 mb-32">
                        {contentBlocks.map((block: any, index: number) => {
                            const type: string = block.type || block.layout || ""
                            const media: { url: string; type: string }[] = block.media || []

                            // Map new editor layout names → grid + aspect config
                            const isSingle16x9 = type === "single-16-9"
                            const isSingle16x5 = type === "single-16-5"
                            const isSingleSquare = type === "single-square"
                            const isTwo16x9 = type === "two-16-9"
                            const isTwoSquare = type === "two-square" || type === "2-square"
                            const isThreeSquare = type === "three-square" || type === "3-square"
                            const isThreePortrait = type === "three-portrait" || type === "3-vertical-9-16"

                            const MediaEl = ({ m }: { m: { url: string; type: string } }) => {
                                const isVideo = m.type === "video" || (m.url && (/\.(mp4|mov|webm|ogg|m4v|avi)($|\?)/i.test(m.url) || m.url.includes('video') || m.url.includes('mp4') || m.url.includes('webm')))
                                return isVideo
                                    ? <video src={m.url} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                                    : <img src={m.url} alt="" className="w-full h-full object-cover" />
                            }

                            return (
                                <div key={index} className="w-full">
                                    {isSingle16x9 && media[0]?.url && (
                                        <div className="w-full aspect-video rounded-[2rem] overflow-hidden bg-black/5">
                                            <MediaEl m={media[0]} />
                                        </div>
                                    )}

                                    {isSingle16x5 && media[0]?.url && (
                                        <div className="w-full aspect-[16/5] rounded-[2rem] overflow-hidden bg-black/5">
                                            <MediaEl m={media[0]} />
                                        </div>
                                    )}

                                    {isTwo16x9 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                                            {media.slice(0, 2).map((m, mi) => m.url && (
                                                <div key={mi} className="aspect-video rounded-[2rem] overflow-hidden bg-black/5">
                                                    <MediaEl m={m} />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {isSingleSquare && media[0]?.url && (
                                        <div className="max-w-2xl mx-auto aspect-square rounded-[2rem] overflow-hidden bg-black/5">
                                            <MediaEl m={media[0]} />
                                        </div>
                                    )}

                                    {isTwoSquare && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                                            {media.slice(0, 2).map((m, mi) => m.url && (
                                                <div key={mi} className="aspect-square rounded-[2rem] overflow-hidden bg-black/5">
                                                    <MediaEl m={m} />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {isThreeSquare && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                                            {media.slice(0, 3).map((m, mi) => m.url && (
                                                <div key={mi} className="aspect-square rounded-[2rem] overflow-hidden bg-black/5">
                                                    <MediaEl m={m} />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {isThreePortrait && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                                            {media.slice(0, 3).map((m, mi) => m.url && (
                                                <div key={mi} className="aspect-[3/4] rounded-[2rem] overflow-hidden bg-black/5">
                                                    <MediaEl m={m} />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </section>
                )}

                <ModernFooter />
            </main>
        </>
    )
}
