"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { Briefcase, Plus, Calendar, DollarSign, Trash2, Users, Search, Filter, LayoutGrid, List as ListIcon, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Project {
    id: number
    name: string
    description: string
    status: 'completed' | 'in_progress' | 'quote' | 'cancelled'
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
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects')
            const data = await res.json()

            if (Array.isArray(data) && data.length > 0) {
                setProjects(data)
            } else if (process.env.NODE_ENV === 'development') {
                console.log("⚠️ Dev Mode: Using Mock Projects")
                // Mock data 'title' kullanırken interface 'name' kullanıyor, mapliyoruz
                const mocks = require('@/lib/mock-data').MOCK_PROJECTS.map((p: any) => ({
                    ...p,
                    name: p.title
                }))
                setProjects(mocks)
            } else {
                setProjects([])
            }

        } catch (error) {
            console.error('Fetch error:', error)
            if (process.env.NODE_ENV === 'development') {
                const mocks = require('@/lib/mock-data').MOCK_PROJECTS.map((p: any) => ({
                    ...p,
                    name: p.title
                }))
                setProjects(mocks)
            } else {
                setProjects([])
            }
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
            }
        } catch (error) {
            alert('Silme hatası')
        }
    }

    const formatCurrency = (amount: number) => {
        if (!amount) return '-'
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(amount)
    }

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.clients?.name?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === 'all' || project.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const statusConfig = {
        completed: { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', label: 'Tamamlandı', icon: '✅' },
        in_progress: { color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', label: 'Devam Ediyor', icon: '🚀' },
        quote: { color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', label: 'Teklif', icon: '📝' },
        cancelled: { color: 'bg-slate-700/50 text-muted-foreground border-border', label: 'İptal', icon: '❌' },
    }

    if (loading) {
        return (
            <div className="p-8 max-w-7xl mx-auto flex items-center justify-center h-[50vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                    <p className="text-muted-foreground animate-pulse">Projeler Yükleniyor...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">

            {/* Header Section */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                        <Briefcase className="w-8 h-8 text-emerald-500" />
                        Projeler
                    </h1>
                    <p className="text-muted-foreground mt-2">Toplam <span className="text-foreground font-bold">{projects.length}</span> projeniz bulunuyor.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Link
                        href="/admin/projects/new"
                        className="group px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 hover:scale-105 active:scale-95"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        Yeni Proje
                    </Link>
                </div>
            </div>

            {/* Filters & Actions Bar */}
            <div className="bg-card border border-border p-4 rounded-notebook flex flex-col md:flex-row gap-4 justify-between items-center sticky top-4 z-10 shadow-xl shadow-black/20 backdrop-blur-md bg-opacity-90">

                {/* Search */}
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Proje adı, müşteri veya açıklama ara..."
                        className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-muted-foreground focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex w-full md:w-auto gap-3">
                    {/* Status Filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <select
                            className="w-full md:w-48 bg-background border border-border rounded-xl pl-10 pr-8 py-2.5 text-muted-foreground focus:outline-none focus:border-emerald-500 appearance-none text-sm cursor-pointer hover:bg-card transition-colors"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">Tüm Durumlar</option>
                            <option value="in_progress">Devam Eden</option>
                            <option value="completed">Tamamlanan</option>
                            <option value="quote">Teklif</option>
                            <option value="cancelled">İptal</option>
                        </select>
                    </div>

                    {/* View Toggle */}
                    <div className="flex bg-background border border-border rounded-xl p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={cn(
                                "p-2 rounded-lg transition-all",
                                viewMode === 'grid' ? "bg-muted text-foreground shadow" : "text-slate-500 hover:text-muted-foreground"
                            )}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn(
                                "p-2 rounded-lg transition-all",
                                viewMode === 'list' ? "bg-muted text-foreground shadow" : "text-slate-500 hover:text-muted-foreground"
                            )}
                        >
                            <ListIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Projects List/Grid */}
            {filteredProjects.length === 0 ? (
                <div className="text-center py-20 bg-card border border-border border-dashed rounded-3xl">
                    <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-slate-500" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Sonuç Bulunamadı</h3>
                    <p className="text-muted-foreground mt-1">Arama kriterlerinize uygun proje yok.</p>
                </div>
            ) : viewMode === 'grid' ? (
                // GRID VIEW
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <div key={project.id} className="group relative bg-card border border-border rounded-3xl p-6 transition-all hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col h-full">

                            {/* Card Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-muted rounded-notebook flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow-inner border border-border">
                                    {statusConfig[project.status as keyof typeof statusConfig]?.icon || '📁'}
                                </div>
                                <div className="flex gap-2">
                                    <span className={cn("px-3 py-1.5 rounded-full text-xs font-bold border", statusConfig[project.status as keyof typeof statusConfig]?.color)}>
                                        {statusConfig[project.status as keyof typeof statusConfig]?.label || project.status}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-1 group-hover:text-emerald-400 transition-colors">
                                    {project.name || 'İsimsiz Proje'}
                                </h3>

                                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                                    <Users className="w-4 h-4" />
                                    <span className="truncate">
                                        {project.clients?.name || 'Müşteri Belirtilmedi'}
                                        {project.clients?.company && <span className="text-slate-600 ml-1">({project.clients.company})</span>}
                                    </span>
                                </div>

                                {project.description && (
                                    <p className="text-slate-500 text-sm mb-6 line-clamp-2 min-h-[40px]">
                                        {project.description}
                                    </p>
                                )}
                            </div>

                            {/* Footer Info */}
                            <div className="mt-auto space-y-4">
                                <div className="flex items-center justify-between py-4 border-t border-border/50">
                                    <div className="flex flex-col">
                                        <span className="text-slate-500 text-xs">Bütçe</span>
                                        <div className="flex items-center gap-1.5 text-sm font-bold text-foreground mt-0.5">
                                            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                                            {formatCurrency(project.budget)}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-slate-500 text-xs">Teslim Tarihi</span>
                                        <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground mt-0.5">
                                            <Calendar className="w-3.5 h-3.5 text-blue-500" />
                                            {project.end_date ? new Date(project.end_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }) : '-'}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="grid grid-cols-5 gap-2">
                                    <Link
                                        href={`/admin/projects/${project.id}`}
                                        className="col-span-4 flex items-center justify-center gap-2 bg-muted hover:bg-muted text-foreground py-2.5 rounded-xl text-sm font-medium transition-colors"
                                    >
                                        Projeyi Yönet
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        className="col-span-1 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors"
                                        title="Sil"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // LIST VIEW
                <div className="bg-card border border-border rounded-3xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-background/50 border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
                                <th className="p-4 font-medium pl-6">Proje Adı</th>
                                <th className="p-4 font-medium">Müşteri</th>
                                <th className="p-4 font-medium">Bütçe</th>
                                <th className="p-4 font-medium">Teslim</th>
                                <th className="p-4 font-medium">Durum</th>
                                <th className="p-4 font-medium pr-6 text-right">İşlem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredProjects.map((project) => (
                                <tr key={project.id} className="group hover:bg-muted/30 transition-colors">
                                    <td className="p-4 pl-6">
                                        <div className="font-bold text-foreground">{project.name || 'İsimsiz'}</div>
                                        <div className="text-xs text-slate-500 line-clamp-1 max-w-[200px]">{project.description}</div>
                                    </td>
                                    <td className="p-4 text-muted-foreground text-sm">
                                        {project.clients?.name || '-'}
                                        {project.clients?.company && <div className="text-xs text-slate-500">{project.clients.company}</div>}
                                    </td>
                                    <td className="p-4 text-emerald-400 font-mono text-sm font-bold">
                                        {formatCurrency(project.budget)}
                                    </td>
                                    <td className="p-4 text-muted-foreground text-sm">
                                        {project.end_date ? new Date(project.end_date).toLocaleDateString('tr-TR') : '-'}
                                    </td>
                                    <td className="p-4">
                                        <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border", statusConfig[project.status as keyof typeof statusConfig]?.color)}>
                                            {statusConfig[project.status as keyof typeof statusConfig]?.label}
                                        </span>
                                    </td>
                                    <td className="p-4 pr-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                href={`/admin/projects/${project.id}`}
                                                className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                                                title="Düzenle"
                                            >
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(project.id)}
                                                className="p-2 hover:bg-red-500/20 rounded-lg text-muted-foreground hover:text-red-400 transition-colors"
                                                title="Sil"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

