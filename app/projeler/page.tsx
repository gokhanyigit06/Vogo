
import { Metadata } from "next"
import prisma from "@/lib/prisma"
import { Briefcase } from "lucide-react"
import ProjectGrid from "@/components/ProjectGrid"

export const metadata: Metadata = {
    title: "Projelerimiz | Vogo Lab",
    description: "Vogo Lab olarak hayata geçirdiğimiz başarılı e-ticaret ve yazılım projeleri.",
}

// Data fetching helper (Server Component)
async function getProjects() {
    try {
        const projects = await prisma.project.findMany({
            where: {
                // Filter options can go here
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

            {/* Projects Grid with Animations and Parallax */}
            <section className="py-20 px-6 lg:px-12 max-w-7xl mx-auto">
                <ProjectGrid projects={projects} />
            </section>
        </main>
    )
}
