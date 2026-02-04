
import { Metadata } from "next"
import Link from "next/link"
import prisma from "@/lib/prisma"
import { ArrowRight, Briefcase } from "lucide-react"

export const metadata: Metadata = {
    title: "Projelerimiz | Vogo Agency",
    description: "Vogo Agency olarak hayata geçirdiğimiz başarılı e-ticaret ve yazılım projeleri.",
}

// Data fetching helper (Server Component)
async function getProjects() {
    try {
        const projects = await prisma.project.findMany({
            where: {
                // Sadece aktif/yayında olanları göster
                // Şimdilik status check'i esnek bırakıyorum, isterseniz 'completed' only yapabilirsiniz
            },
            orderBy: [
                { order: 'asc' },
                { createdAt: 'desc' }
            ],
            select: {
                id: true,
                publicTitle: true,
                slug: true,
                description: true,
                image: true,
                category: true,
                name: true, // fallback
                // image: true, // Remove duplicated key
                client: {
                    select: { company: true }
                }
            }
        })
        return projects
    } catch (error) {
        console.error("Projeler yüklenirken hata:", error)
        return []
    }
}

export default async function ProjectsPage() {
    const projects = await getProjects()

    return (
        <main className="min-h-screen bg-black text-white">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 lg:px-12 border-b border-white/10 bg-gradient-to-b from-black to-zinc-900">
                <div className="max-w-7xl mx-auto text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium animate-fade-in-up">
                        <Briefcase className="w-4 h-4" />
                        <span>Referanslarımız</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-500 animate-fade-in-up delay-100">
                        Başarı Hikayelerimiz
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto animate-fade-in-up delay-200">
                        Markaların dijital dönüşümüne öncülük ediyoruz. İşte gurur duyduğumuz bazı işler.
                    </p>
                </div>
            </section>

            {/* Projects Grid */}
            <section className="py-20 px-6 lg:px-12 max-w-7xl mx-auto">
                {projects.length === 0 ? (
                    <div className="text-center py-20 text-slate-500">
                        Henüz proje eklenmemiş.
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project, idx) => (
                            <Link
                                href={`/projeler/${project.slug || project.id}`}
                                key={project.id}
                                className="group block bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-900/20"
                            >
                                {/* Image Placeholder or Real Image */}
                                <div className="aspect-[16/10] bg-zinc-800 relative overflow-hidden">
                                    {project.image ? (
                                        <img
                                            src={project.image}
                                            alt={project.publicTitle || project.name || 'Proje'}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-700 bg-zinc-900/80">
                                            <Briefcase className="w-12 h-12 opacity-20" />
                                        </div>
                                    )}

                                    {/* Overlay Category */}
                                    {project.category && (
                                        <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs text-white border border-white/10">
                                            {project.category}
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 space-y-4">
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

                                    <p className="text-slate-400 text-sm line-clamp-3">
                                        {project.description || 'Proje detayları hazırlanıyor...'}
                                    </p>

                                    <div className="pt-4 flex items-center text-sm font-medium text-white group-hover:text-emerald-400 transition-colors gap-2">
                                        İncele
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </main>
    )
}
