import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

export const metadata = {
    title: "Vogo Labs | Deneysel Çalışmalar",
    description: "Vogo Lab ekibinin geliştirdiği yan projeler, deneysel çalışmalar ve SaaS ürünleri."
}

// ISR - 1 saatte bir yenile
export const revalidate = 3600

export default async function LabListingPage() {
    let projects = []
    try {
        projects = await prisma.project.findMany({
            where: { isLabProject: true, status: { not: 'archived' } }, // Filter active
            orderBy: { order: 'asc' }
        })
    } catch (e) {
        console.error("Lab fetch error:", e)
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            {/* Header */}
            <div className="container mx-auto px-6 py-24">
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8">
                    Vogo <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Labs</span>
                </h1>
                <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed">
                    Dijital dünyada iz bırakan, ekibimizin tutkuyla geliştirdiği yan projeler ve deneysel çalışmalar kütüphanesi.
                </p>
            </div>

            {/* Grid */}
            <div className="container mx-auto px-6 pb-32">
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    {projects.map((project) => (
                        <Link
                            key={project.id}
                            href={`/laboratuvar/${project.slug}`}
                            className="group relative block bg-zinc-900 rounded-3xl overflow-hidden aspect-[4/3] border border-zinc-800 hover:border-emerald-500/50 transition-all duration-500"
                        >
                            {/* Image */}
                            <div className="absolute inset-0 bg-zinc-800">
                                {project.thumbnail || project.heroImage ? (
                                    <img
                                        src={project.thumbnail || project.heroImage}
                                        alt={project.publicTitle || ''}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-700 font-mono text-xs uppercase tracking-widest">
                                        Görsel Yok
                                    </div>
                                )}
                            </div>

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-8 flex flex-col justify-end">
                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <h2 className="text-3xl font-bold mb-2 text-white group-hover:text-emerald-400 transition-colors">
                                        {project.publicTitle}
                                    </h2>
                                    <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                        <div className="flex gap-2 text-sm text-zinc-300">
                                            {project.year && <span>{project.year}</span>}
                                            {project.tags && project.tags.length > 0 && (
                                                <>
                                                    <span>•</span>
                                                    <span>{project.tags[0]}</span>
                                                </>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 text-emerald-400 text-sm font-bold uppercase tracking-wider">
                                            İncele <ArrowUpRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {projects.length === 0 && (
                    <div className="text-center py-20 border border-dashed border-zinc-800 rounded-3xl text-zinc-500">
                        Henüz proje eklenmemiş.
                    </div>
                )}
            </div>
        </div>
    )
}
