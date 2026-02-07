"use client"

import { useEffect, useState } from "react"
import { Briefcase, Plus, Save, LayoutGrid, List as ListIcon, Trash2, MoreHorizontal, GripVertical } from "lucide-react"
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

// Interface
interface LabProject {
    id: number
    internalName?: string
    publicTitle?: string
    name?: string
    thumbnail?: string
    liveUrl?: string
    status: string
    order: number
    tags: string[]
}

// Sortable Item
function SortableLabProject({ project, viewMode, handleDelete }: any) {
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
                className="group relative bg-card border border-border rounded-3xl p-4 transition-all hover:border-emerald-500/30 hover:shadow-xl flex flex-col h-full overflow-hidden"
            >
                {/* Drag Handle */}
                <div className="absolute top-4 right-4 z-20 cursor-grab active:cursor-grabbing p-2 bg-black/20 hover:bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" {...attributes} {...listeners}>
                    <GripVertical className="w-4 h-4" />
                </div>

                {/* Thumbnail */}
                <div className="relative aspect-video rounded-2xl bg-muted overflow-hidden mb-4 border border-border/50">
                    {project.thumbnail ? (
                        <img src={project.thumbnail} alt={project.publicTitle} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted">
                            <Briefcase className="w-8 h-8 opacity-20" />
                        </div>
                    )}
                </div>

                <div className="flex-1 space-y-2">
                    {/* Internal Name */}
                    <div className="text-xs text-emerald-500 font-bold uppercase tracking-wider">
                        {project.internalName || 'İsimsiz'}
                    </div>
                    {/* Public Title */}
                    <h3 className="text-lg font-bold text-foreground line-clamp-1">
                        {project.publicTitle || project.name || '-'}
                    </h3>

                    {/* URL */}
                    {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" className="text-xs text-blue-500 hover:underline block truncate">
                            {project.liveUrl}
                        </a>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-2">
                        {project.tags && project.tags.slice(0, 3).map((tag: string) => (
                            <span key={tag} className="px-1.5 py-0.5 bg-muted rounded text-[10px] text-muted-foreground border border-border">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                    <Link
                        href={`/admin/laboratuvar/edit/${project.id}`}
                        className="text-sm font-medium text-emerald-500 hover:text-emerald-400 transition-colors"
                    >
                        Düzenle
                    </Link>
                    <button
                        onClick={() => handleDelete(project.id)}
                        className="p-1.5 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        )
    }

    // List View
    return (
        <tr ref={setNodeRef} style={style} className="group hover:bg-muted/30 transition-colors bg-card">
            <td className="p-4 w-10">
                <button className="cursor-grab active:cursor-grabbing p-2 text-slate-400 hover:text-foreground" {...attributes} {...listeners}>
                    <GripVertical className="w-4 h-4" />
                </button>
            </td>
            <td className="p-4 w-16">
                {project.thumbnail ? (
                    <img src={project.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover bg-muted" />
                ) : (
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center"><Briefcase className="w-4 h-4 opacity-50" /></div>
                )}
            </td>
            <td className="p-4 pl-2">
                <div className="font-bold text-foreground text-sm">{project.publicTitle || project.name}</div>
                <div className="text-xs text-slate-500">{project.internalName}</div>
            </td>
            <td className="p-4 text-muted-foreground text-sm truncate max-w-[200px]">
                {project.liveUrl || '-'}
            </td>
            <td className="p-4 text-right">
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={`/admin/laboratuvar/edit/${project.id}`}
                        className="p-2 hover:bg-muted rounded-lg text-emerald-500 transition-colors"
                    >
                        Düzenle
                    </Link>
                    <button
                        onClick={() => handleDelete(project.id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg text-red-500 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    )
}

export default function LabProjectsPage() {
    const [projects, setProjects] = useState<LabProject[]>([])
    const [loading, setLoading] = useState(true)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [isOrderChanged, setIsOrderChanged] = useState(false)
    const [savingOrder, setSavingOrder] = useState(false)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        try {
            // Fetch only 'lab' type projects
            const res = await fetch('/api/projects?type=lab')
            const data = await res.json()
            if (Array.isArray(data)) {
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
            const orderData = projects.map((p, index) => ({ id: p.id, order: index }))
            const res = await fetch('/api/projects/reorder', { // Re-use existing reorder endpoint
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projects: orderData })
            })
            if (res.ok) {
                setIsOrderChanged(false)
                alert("Sıralama başarıyla güncellendi!")
            } else throw new Error("Failed")
        } catch (e) {
            alert("Hata oluştu")
        } finally {
            setSavingOrder(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Silmek istediğinize emin misiniz?')) return
        try {
            const res = await fetch(`/api/projects?id=${id}`, { method: 'DELETE' })
            if (res.ok) setProjects(prev => prev.filter(p => p.id !== id))
        } catch (e) { alert('Hata') }
    }

    if (loading) return <div className="p-20 text-center animate-pulse">Laboratuvar verileri yükleniyor...</div>

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <span className="text-4xl bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">Vogo Labs</span>
                    </h1>
                    <p className="text-muted-foreground mt-2">Deneysel ve iç projelerimizin yönetim merkezi.</p>
                </div>
                <div className="flex gap-3">
                    {isOrderChanged && (
                        <button
                            onClick={saveOrder}
                            disabled={savingOrder}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20"
                        >
                            <Save className="w-5 h-5 inline mr-2" />
                            {savingOrder ? '...' : 'Sıralamayı Kaydet'}
                        </button>
                    )}
                    <Link
                        href="/admin/laboratuvar/new"
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Yeni Proje Ekle
                    </Link>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex justify-end mb-4">
                <div className="flex bg-card border border-border rounded-lg p-1">
                    <button onClick={() => setViewMode('grid')} className={cn("p-2 rounded", viewMode === 'grid' && "bg-muted shadow")}><LayoutGrid className="w-4 h-4" /></button>
                    <button onClick={() => setViewMode('list')} className={cn("p-2 rounded", viewMode === 'list' && "bg-muted shadow")}><ListIcon className="w-4 h-4" /></button>
                </div>
            </div>

            {/* List */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={projects.map(p => p.id)} strategy={verticalListSortingStrategy}>
                    {viewMode === 'grid' ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {projects.map(project => (
                                <SortableLabProject key={project.id} project={project} viewMode="grid" handleDelete={handleDelete} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-card border border-border rounded-3xl overflow-hidden">
                            <table className="w-full text-left">
                                <tbody className="divide-y divide-border">
                                    {projects.map(project => (
                                        <SortableLabProject key={project.id} project={project} viewMode="list" handleDelete={handleDelete} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </SortableContext>
            </DndContext>

            {projects.length === 0 && (
                <div className="text-center py-20 opacity-50">
                    <Briefcase className="w-16 h-16 mx-auto mb-4" />
                    <p>Henüz laboratuvar projesi eklenmemiş.</p>
                </div>
            )}
        </div>
    )
}
