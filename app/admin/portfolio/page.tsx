"use client"

import { useState, useEffect } from "react"
import { Briefcase, Plus, ExternalLink, Edit } from "lucide-react"
import Link from "next/link"

export default function PortfolioAdminPage() {
    const [projects, setProjects] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/projects')
            .then(res => res.json())
            .then(data => {
                setProjects(Array.isArray(data) ? data : [])
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-transparent">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                        <Briefcase className="w-8 h-8 text-emerald-500" />
                        Portfolyo Yönetimi
                    </h1>
                    <p className="text-slate-400 mt-1">Tamamlanan projeleri sergileyin ve yönetin.</p>
                </div>
                <Link href="/admin/projects/new">
                    <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 active:scale-95">
                        <Plus className="w-5 h-5" /> Yeni Proje Ekle
                    </button>
                </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                    <div key={project.id} className="group bg-card border border-border rounded-3xl overflow-hidden hover:border-emerald-500/50 transition-all flex flex-col h-full">
                        <div className="relative h-48 overflow-hidden bg-muted">
                            {project.image && (
                                <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                            <div className="absolute top-4 right-4">
                                <span className="bg-slate-950/80 backdrop-blur text-foreground text-xs font-bold px-3 py-1 rounded-full border border-white/10">
                                    {project.category}
                                </span>
                            </div>
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                            <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-emerald-400 transition-colors line-clamp-1">{project.publicTitle || project.title || project.name}</h3>
                            <p className="text-slate-500 text-sm mb-4 line-clamp-1">{project.client?.company || project.client?.name || 'Müşteri Yok'}</p>

                            <div className="mt-auto flex gap-2 pt-4 border-t border-border/50">
                                <Link href={`/admin/projects/edit/${project.id}`} className="flex-1">
                                    <button className="w-full bg-muted hover:bg-muted text-foreground py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2">
                                        <Edit className="w-4 h-4" /> Düzenle
                                    </button>
                                </Link>
                                <button className="p-2 bg-muted hover:bg-muted text-slate-400 hover:text-foreground rounded-lg transition-colors">
                                    <ExternalLink className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add New Placeholder - Always visible */}
                <Link href="/admin/projects/new" className="block h-full min-h-[300px]">
                    <button className="w-full h-full border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center text-slate-500 hover:text-emerald-500 hover:border-emerald-500/50 hover:bg-slate-900/50 transition-all group">
                        <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Plus className="w-8 h-8" />
                        </div>
                        <span className="font-bold">Yeni Proje Oluştur</span>
                    </button>
                </Link>
            </div>
        </div>
    )
}
