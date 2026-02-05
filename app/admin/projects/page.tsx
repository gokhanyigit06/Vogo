"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { Briefcase, Plus, Calendar, DollarSign, Trash2, Users, Search, Filter, LayoutGrid, List as ListIcon, MoreHorizontal, GripVertical, Save } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Project {
    id: number
    internalName?: string
    publicTitle?: string
    name?: string // fallback
    description: string
    status: 'completed' | 'in_progress' | 'quote' | 'cancelled'
    budget: number
    end_date: string
    order: number
    client?: {
        name: string
        company: string
    }
}

// Sortable Item Component
function SortableProjectItem({ project, viewMode, statusConfig, formatCurrency, handleDelete }: any) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: project.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

    if (viewMode === 'grid') {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="group relative bg-card border border-border rounded-3xl p-6 transition-all hover:border-emerald-500/30 hover:shadow-xl flex flex-col h-full"
            >
                {/* Drag Handle */}
                <div className="absolute top-4 right-4 cursor-grab active:cursor-grabbing p-2 hover:bg-muted rounded-full opacity-0 group-hover:opacity-100 transition-opacity" {...attributes} {...listeners}>
                    <GripVertical className="w-4 h-4 text-slate-400" />
                </div>

                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-muted rounded-notebook flex items-center justify-center text-2xl shadow-inner border border-border">
                        {statusConfig[project.status]?.icon || '📁'}
                    </div>
                </div>

                <div className="flex-1">
                    {/* Internal Name (Admin) */}
                    <div className="text-xs text-emerald-500 font-bold uppercase tracking-wider mb-1">
                        {project.internalName || project.name || 'İsimsiz'}
                    </div>
                    {/* Public Title */}
                    <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-1">
                        {project.publicTitle || project.name || '-'}
                    </h3>

                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                        <Users className="w-4 h-4" />
                        <span className="truncate">
                            {project.client?.company || project.client?.name || 'Müşteri Yok'}
                        </span>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-auto pt-4 border-t border-border/50 flex justify-between items-center">
                    <div className="flex gap-2">
                        <span className={cn("px-2 py-1 rounded-md text-xs font-bold border", statusConfig[project.status]?.color)}>
                            {statusConfig[project.status]?.label}
                        </span>
                    </div>
                    <Link
                        href={`/admin/projects/edit/${project.id}`}
                        className="text-sm font-medium text-emerald-500 hover:underline"
                    >
                        Düzenle
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <tr ref={setNodeRef} style={style} className="group hover:bg-muted/30 transition-colors bg-card">
            <td className="p-4 w-10">
                <button className="cursor-grab active:cursor-grabbing p-2 text-slate-400 hover:text-foreground" {...attributes} {...listeners}>
                    <GripVertical className="w-4 h-4" />
                </button>
            </td>
            <td className="p-4 pl-2">
                <div className="font-bold text-foreground text-sm">{project.internalName || project.name}</div>
                <div className="text-xs text-slate-500">{project.publicTitle}</div>
            </td>
            <td className="p-4 text-muted-foreground text-sm">
                {project.client?.company || project.client?.name || '-'}
            </td>
            <td className="p-4 font-mono text-sm">
                {formatCurrency(project.budget)}
            </td>
            <td className="p-4">
                <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border", statusConfig[project.status]?.color)}>
                    {statusConfig[project.status]?.label}
                </span>
            </td>
            <td className="p-4 text-right">
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={`/admin/projects/${project.id}`}
                        className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <MoreHorizontal className="w-4 h-4" />
                    </Link>
                    <button
                        onClick={() => handleDelete(project.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg text-muted-foreground hover:text-red-400 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    )
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [isOrderChanged, setIsOrderChanged] = useState(false)
    const [savingOrder, setSavingOrder] = useState(false)

    // DND Sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects')
            const data = await res.json()
            if (Array.isArray(data)) {
                // Ensure they are sorted by order if API doesn't
                setProjects(data)
            }
        } catch (error) {
            console.error('Fetch error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setProjects((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
            setIsOrderChanged(true)
        }
    };

    const saveOrder = async () => {
        setSavingOrder(true)
        try {
            const orderData = projects.map((p, index) => ({
                id: p.id,
                order: index
            }))

            const res = await fetch('/api/projects/reorder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projects: orderData })
            })

            if (res.ok) {
                setIsOrderChanged(false)
                alert("Sıralama kaydedildi!")
            } else {
                throw new Error("Kaydedilemedi")
            }
        } catch (error) {
            alert("Sıralama kaydedilirken hata oluştu.")
        } finally {
            setSavingOrder(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Bu projeyi silmek istediğinize emin misiniz?')) return
        try {
            const res = await fetch(`/api/projects?id=${id}`, { method: 'DELETE' })
            if (res.ok) setProjects(projects.filter(p => p.id !== id))
        } catch (error) {
            alert('Silme hatası')
        }
    }

    const formatCurrency = (amount: number) => {
        if (!amount) return '-'
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(amount)
    }

    const filteredProjects = projects.filter(project => {
        const search = searchTerm.toLowerCase()
        return (
            (project.internalName?.toLowerCase().includes(search)) ||
            (project.publicTitle?.toLowerCase().includes(search)) ||
            (project.name?.toLowerCase().includes(search))
        )
    })

    const statusConfig: any = {
        completed: { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', label: 'Tamamlandı', icon: '✅' },
        in_progress: { color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', label: 'Devam Ediyor', icon: '🚀' },
        quote: { color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', label: 'Teklif', icon: '📝' },
        cancelled: { color: 'bg-slate-700/50 text-muted-foreground border-border', label: 'İptal', icon: '❌' },
    }

    if (loading) return <div className="p-20 text-center">Yükleniyor...</div>

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Briefcase className="w-8 h-8 text-emerald-500" />
                        Projeler
                    </h1>
                    <p className="text-muted-foreground mt-2">Dilediğiniz gibi sürükleyip sıralayın.</p>
                </div>
                <div className="flex gap-3">
                    {isOrderChanged && (
                        <button
                            onClick={saveOrder}
                            disabled={savingOrder}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all flex items-center gap-2 animate-pulse"
                        >
                            <Save className="w-5 h-5" />
                            {savingOrder ? 'Kaydediliyor...' : 'Sıralamayı Kaydet'}
                        </button>
                    )}
                    <Link
                        href="/admin/projects/new"
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Yeni Proje
                    </Link>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex justify-between items-center gap-4 bg-card p-4 rounded-xl border border-border">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 focus:ring-emerald-500"
                    />
                </div>
                <div className="flex bg-background border border-border rounded-lg p-1">
                    <button onClick={() => setViewMode('grid')} className={cn("p-2 rounded", viewMode === 'grid' && "bg-muted shadow")}>
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button onClick={() => setViewMode('list')} className={cn("p-2 rounded", viewMode === 'list' && "bg-muted shadow")}>
                        <ListIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={filteredProjects.map(p => p.id)} strategy={verticalListSortingStrategy}>
                    {viewMode === 'grid' ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProjects.map(project => (
                                <SortableProjectItem
                                    key={project.id}
                                    project={project}
                                    viewMode="grid"
                                    statusConfig={statusConfig}
                                    formatCurrency={formatCurrency}
                                    handleDelete={handleDelete}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-card border border-border rounded-3xl overflow-hidden">
                            <table className="w-full text-left">
                                <tbody className="divide-y divide-border">
                                    {filteredProjects.map(project => (
                                        <SortableProjectItem
                                            key={project.id}
                                            project={project}
                                            viewMode="list"
                                            statusConfig={statusConfig}
                                            formatCurrency={formatCurrency}
                                            handleDelete={handleDelete}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </SortableContext>
            </DndContext>
        </div>
    )
}

