"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { Briefcase, Plus, Calendar, DollarSign, Trash2, Users } from "lucide-react"
import Link from "next/link"

interface Project {
    id: number
    name: string
    description: string
    status: string
    budget: number
    end_date: string
    clients?: {
        name: string
        company: string
    }
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects')
            const data = await res.json()
            setProjects(data)
        } catch (error) {
            console.error('Fetch error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Bu projeyi silmek istediğinize emin misiniz?')) return

        try {
            const res = await fetch(`/api/projects?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                setProjects(projects.filter(p => p.id !== id))
                alert('Proje silindi')
            }
        } catch (error) {
            alert('Silme hatası')
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            case 'in_progress': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
            case 'quote': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
            case 'cancelled': return 'bg-slate-700/50 text-slate-400 border-slate-600'
            default: return 'bg-slate-700/50 text-slate-400'
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed': return 'Tamamlandı'
            case 'in_progress': return 'Devam Ediyor'
            case 'quote': return 'Teklif'
            case 'cancelled': return 'İptal'
            default: return status
        }
    }

    const formatCurrency = (amount: number) => {
        if (!amount) return '-'
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(amount)
    }

    if (loading) {
        return <div className="p-8"><div className="text-slate-400">Yükleniyor...</div></div>
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">

            {/* Header */}
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 flex items-center gap-3">
                        <Briefcase className="w-8 h-8 text-emerald-500" />
                        Projeler
                    </h1>
                    <p className="text-slate-400 mt-2 text-lg">Tüm projelerinizi buradan yönetin ve takip edin.</p>
                </div>
                <Link
                    href="/admin/projects/new"
                    className="group px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 hover:scale-105 active:scale-95"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    Yeni Proje Oluştur
                </Link>
            </div>

            {/* Stats */}
            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-6">
                <div className="relative group overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-6 transition-all hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-emerald-500/20" />
                    <p className="text-slate-400 text-sm font-medium relative z-10">Toplam Proje</p>
                    <p className="text-4xl font-bold text-white mt-2 relative z-10 tracking-tight">{projects.length}</p>
                </div>
                <div className="relative group overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-6 transition-all hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-blue-500/20" />
                    <p className="text-slate-400 text-sm font-medium relative z-10">Devam Eden</p>
                    <p className="text-4xl font-bold text-white mt-2 relative z-10 tracking-tight text-blue-400">
                        {projects.filter(p => p.status === 'in_progress').length}
                    </p>
                </div>
                <div className="relative group overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-6 transition-all hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-emerald-500/20" />
                    <p className="text-slate-400 text-sm font-medium relative z-10">Tamamlanan</p>
                    <p className="text-4xl font-bold text-white mt-2 relative z-10 tracking-tight text-emerald-400">
                        {projects.filter(p => p.status === 'completed').length}
                    </p>
                </div>
                <div className="relative group overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-6 transition-all hover:border-yellow-500/50 hover:shadow-2xl hover:shadow-yellow-500/10">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-yellow-500/20" />
                    <p className="text-slate-400 text-sm font-medium relative z-10">Teklif Aşamasında</p>
                    <p className="text-4xl font-bold text-white mt-2 relative z-10 tracking-tight text-yellow-500">
                        {projects.filter(p => p.status === 'quote').length}
                    </p>
                </div>
            </div>

            {/* Projects Grid */}
            {/* Projects Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-slate-900/50 border border-slate-800 rounded-3xl border-dashed">
                        <Briefcase className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                        <h3 className="text-white text-xl font-bold mb-2">Henüz proje yok</h3>
                        <p className="text-slate-500 mb-6">Yeni bir proje ekleyerek işlerinizi takip etmeye başlayın.</p>
                        <Link
                            href="/admin/projects/new"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            İlk Projeyi Ekle
                        </Link>
                    </div>
                ) : (
                    projects.map((project) => (
                        <div key={project.id} className="group flex flex-col justify-between bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300">
                            <div>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300 group-hover:bg-slate-700">
                                        🚀
                                    </div>
                                    <span className={`text-xs px-3 py-1.5 rounded-full font-bold border ${getStatusColor(project.status)}`}>
                                        {getStatusText(project.status)}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">{project.name}</h3>

                                {project.clients && (
                                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                                        <Users className="w-4 h-4" />
                                        <span>{project.clients.name}</span>
                                        {project.clients.company && <span className="text-slate-600">({project.clients.company})</span>}
                                    </div>
                                )}

                                {project.description && (
                                    <p className="text-slate-500 text-sm mb-6 line-clamp-2">
                                        {project.description}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-3 border-t border-slate-800/50">
                                    {project.budget && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                                                <DollarSign className="w-4 h-4 text-emerald-400" />
                                            </div>
                                            <span className="text-white font-bold">{formatCurrency(project.budget)}</span>
                                        </div>
                                    )}
                                    {project.end_date && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="w-4 h-4 text-slate-500" />
                                            <span className="text-slate-400">
                                                {new Date(project.end_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <Link
                                        href={`/admin/projects/${project.id}`}
                                        className="text-center px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors text-sm"
                                    >
                                        Detaylar
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        className="text-center px-4 py-2.5 bg-red-500/5 hover:bg-red-500/10 text-red-400 hover:text-red-300 rounded-xl font-medium transition-colors text-sm"
                                    >
                                        Sil
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
