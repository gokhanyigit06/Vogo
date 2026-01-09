"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { Briefcase, Plus, Calendar, DollarSign, Trash2 } from "lucide-react"
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Briefcase className="w-8 h-8 text-emerald-500" />
                        Projeler
                    </h1>
                    <p className="text-slate-400 mt-1">Tüm projelerinizi buradan yönetin</p>
                </div>
                <Link
                    href="/admin/projects/new"
                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Yeni Proje
                </Link>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                    <p className="text-slate-400 text-sm">Toplam Proje</p>
                    <p className="text-2xl font-bold text-white mt-1">{projects.length}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                    <p className="text-slate-400 text-sm">Devam Eden</p>
                    <p className="text-2xl font-bold text-blue-400 mt-1">
                        {projects.filter(p => p.status === 'in_progress').length}
                    </p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                    <p className="text-slate-400 text-sm">Tamamlanan</p>
                    <p className="text-2xl font-bold text-emerald-400 mt-1">
                        {projects.filter(p => p.status === 'completed').length}
                    </p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                    <p className="text-slate-400 text-sm">Teklif Aşamasında</p>
                    <p className="text-2xl font-bold text-yellow-400 mt-1">
                        {projects.filter(p => p.status === 'quote').length}
                    </p>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.length === 0 ? (
                    <div className="col-span-full p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl">
                        <Briefcase className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                        <p className="text-slate-400">Henüz proje eklenmemiş</p>
                        <Link
                            href="/admin/projects/new"
                            className="inline-block mt-4 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-all"
                        >
                            İlk Projeyi Ekle
                        </Link>
                    </div>
                ) : (
                    projects.map((project) => (
                        <div key={project.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/30 transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white mb-1">{project.name}</h3>
                                    {project.clients && (
                                        <p className="text-slate-400 text-sm">
                                            {project.clients.name}
                                            {project.clients.company && ` | ${project.clients.company}`}
                                        </p>
                                    )}
                                </div>
                                <span className={`text-xs px-2.5 py-1 rounded-md font-medium border ${getStatusColor(project.status)}`}>
                                    {getStatusText(project.status)}
                                </span>
                            </div>

                            {project.description && (
                                <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                                    {project.description}
                                </p>
                            )}

                            <div className="space-y-2 mb-4">
                                {project.budget && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <DollarSign className="w-4 h-4 text-emerald-400" />
                                        <span className="text-slate-300">{formatCurrency(project.budget)}</span>
                                    </div>
                                )}
                                {project.end_date && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="w-4 h-4 text-blue-400" />
                                        <span className="text-slate-300">
                                            {new Date(project.end_date).toLocaleDateString('tr-TR')}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-2 pt-4 border-t border-slate-800">
                                <Link
                                    href={`/admin/projects/${project.id}`}
                                    className="flex-1 text-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors text-sm"
                                >
                                    Detay
                                </Link>
                                <button
                                    onClick={() => handleDelete(project.id)}
                                    className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                                    title="Sil"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
