"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Briefcase, ArrowLeft, Calendar, DollarSign, Building2, CheckCircle2, AlertCircle, Printer, StickyNote, Plus, Trash2, Edit2, Circle, Loader2 } from "lucide-react"
import Link from "next/link"
import { createClient } from '@/lib/supabase-client'
import TaskDetailModal from "@/components/admin/tasks/TaskDetailModal"

export default function ProjectDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [project, setProject] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    // Notes State
    const [notes, setNotes] = useState<any[]>([])
    const [newNote, setNewNote] = useState("")
    const [addingNote, setAddingNote] = useState(false)

    // Quick Task State
    const [newTaskTitle, setNewTaskTitle] = useState("")
    const [addingTask, setAddingTask] = useState(false)
    const [selectedTask, setSelectedTask] = useState<any>(null)

    const supabase = createClient()

    useEffect(() => {
        if (params.id) {
            fetchProject(params.id as string)
            fetchNotes(params.id as string)
            // Her render'da güncel task'ları yükle
            refreshProjectTasks(params.id as string)
        }
    }, [params.id])

    const fetchProject = async (id: string) => {
        try {
            const res = await fetch(`/api/projects?id=${id}`)
            if (res.ok) {
                const data = await res.json()
                if (data && data.id) {
                    setProject(data)
                    return
                }
            }

            // API'den gelmediyse ve Dev ortamındaysak, HATA ATMADAN ÖNCE Mock'a bak
            if (process.env.NODE_ENV === 'development') {
                console.log("⚠️ Dev Mode: Looking for Mock Project")
                const mockP = require('@/lib/mock-data').MOCK_PROJECTS.find((p: any) => p.id == id)
                if (mockP) {
                    // 1. Önce LocalStorage'dan güncel görevleri çek
                    let allTasks = require('@/lib/mock-data').MOCK_TASKS
                    try {
                        if (typeof window !== 'undefined') {
                            const local = localStorage.getItem('mock_tasks')
                            if (local) allTasks = JSON.parse(local)
                        }
                    } catch (e) { console.error("LS Read Error", e) }

                    // 2. Bu projeye ait olanları filtrele
                    const mockTasks = allTasks.filter((t: any) => t.project_id == id)

                    // 3. Proje verisine ekle
                    setProject({ ...mockP, tasks: mockTasks })
                    return
                }
            }

            throw new Error('Proje bulunamadı')

        } catch (error) {
            console.error(error)
            alert("Proje bulunamadı")
            router.push('/admin/projects')
        } finally {
            setLoading(false)
        }
    }

    const refreshProjectTasks = (projectId: string) => {
        if (process.env.NODE_ENV === 'development') {
            // localStorage'dan güncel task listesini al
            try {
                const stored = localStorage.getItem('mock_tasks')
                if (stored) {
                    const allTasks = JSON.parse(stored)
                    const projectTasks = allTasks.filter((t: any) => t.project_id == projectId)
                    setProject((prev: any) => prev ? { ...prev, tasks: projectTasks } : null)
                }
            } catch (e) {
                console.error("Task refresh error:", e)
            }
        } else {
            // Production: API'den task'ları çek
            fetch(`/api/tasks`)
                .then(r => r.json())
                .then(allTasks => {
                    const projectTasks = allTasks.filter((t: any) => t.project_id == projectId)
                    setProject((prev: any) => prev ? { ...prev, tasks: projectTasks } : null)
                })
                .catch(e => console.error("Task fetch error:", e))
        }
    }

    const fetchNotes = async (id: string) => {
        const { data, error } = await supabase
            .from('project_notes')
            .select('*')
            .eq('project_id', id)
            .order('created_at', { ascending: false })

        if (!error && data) {
            setNotes(data)
        }
    }

    const handleQuickAddTask = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newTaskTitle.trim()) return

        setAddingTask(true)

        const tempId = Date.now()
        const newTask = {
            id: tempId,
            title: newTaskTitle,
            status: 'todo',
            project_id: project.id,
            projects: {
                id: project.id,
                name: project.name || project.title || "Proje",
                title: project.name || project.title || "Proje"
            },
            priority: 'medium',
            assigned_to: null,
            created_at: new Date().toISOString()
        }

        // Optimistic UI Update
        const updatedTasks = [newTask, ...(project.tasks || [])]
        setProject({ ...project, tasks: updatedTasks })
        setNewTaskTitle("")

        // Dev Mode: Sync with LocalStorage for Tasks Page Visibility
        if (process.env.NODE_ENV === 'development') {
            console.log("Mock Task Added & Synced:", newTask)

            try {
                // 1. Get existing mock tasks
                let localTasks = []
                const stored = localStorage.getItem('mock_tasks')
                if (stored) {
                    localTasks = JSON.parse(stored)
                } else {
                    localTasks = require('@/lib/mock-data').MOCK_TASKS
                }

                // 2. Add new task
                localTasks.unshift(newTask)

                // 3. Save back
                localStorage.setItem('mock_tasks', JSON.stringify(localTasks))

                // 4. Task board'a bildir
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new Event('tasks-updated'))
                }

            } catch (e) { console.error("LS Sync Error", e) }

            setTimeout(() => setAddingTask(false), 500)
            return
        }

        try {
            await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newTask, id: undefined })
            })
        } catch (error) {
            console.error(error)
            alert("Görev eklenirken hata oluştu")
        } finally {
            setAddingTask(false)
        }
    }

    const toggleTaskStatus = async (task: any, e?: React.MouseEvent) => {
        if (e) e.stopPropagation() // Prevent modal opening

        const newStatus = task.status === 'done' ? 'todo' : 'done'

        // Optimistic UI Update
        const updatedTasks = project.tasks.map((t: any) =>
            t.id === task.id ? { ...t, status: newStatus } : t
        )
        setProject({ ...project, tasks: updatedTasks })

        // Dev Mode: Sync with LocalStorage
        if (process.env.NODE_ENV === 'development') {
            try {
                let localTasks = []
                const stored = localStorage.getItem('mock_tasks')
                if (stored) localTasks = JSON.parse(stored)
                else localTasks = require('@/lib/mock-data').MOCK_TASKS

                // Update status in global store
                const globalUpdated = localTasks.map((t: any) =>
                    t.id === task.id ? { ...t, status: newStatus } : t
                )
                localStorage.setItem('mock_tasks', JSON.stringify(globalUpdated))
            } catch (e) { console.error("LS Sync Error", e) }
            return
        }

        try {
            await fetch('/api/tasks', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: task.id, status: newStatus })
            })
        } catch (e) {
            console.error(e)
            // Revert changes could be handled here
        }
    }

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newNote.trim()) return

        setAddingNote(true)
        try {
            const { error } = await supabase
                .from('project_notes')
                .insert([{
                    project_id: params.id,
                    content: newNote
                }])

            if (error) throw error

            setNewNote("")
            fetchNotes(params.id as string)
        } catch (error) {
            console.error(error)
            alert('Not eklenirken hata oluştu.')
        } finally {
            setAddingNote(false)
        }
    }

    const handleDeleteNote = async (noteId: number) => {
        if (!confirm("Notu silmek istediğinize emin misiniz?")) return

        try {
            const { error } = await supabase
                .from('project_notes')
                .delete()
                .eq('id', noteId)

            if (error) throw error

            setNotes(notes.filter(n => n.id !== noteId))
        } catch (error) {
            console.error(error)
            alert('Silme hatası')
        }
    }

    const handlePrint = () => {
        window.print()
    }

    if (loading) return <div className="p-8 text-slate-400">Yükleniyor...</div>
    if (!project) return <div className="p-8 text-slate-400">Proje bulunamadı.</div>

    // Stats Hesaplama
    const totalTasks = project.tasks?.length || 0
    const completedTasks = project.tasks?.filter((t: any) => t.status === 'done').length || 0
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 print:p-0 print:bg-white print:text-black">
            {/* Header */}
            <div className="flex items-center gap-4 print:hidden">
                <Link href="/admin/projects" className="p-2 bg-muted rounded-lg hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${project.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            project.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                'bg-slate-800 text-slate-400 border-slate-700'
                            }`}>
                            {project.status === 'completed' ? 'Tamamlandı' :
                                project.status === 'in_progress' ? 'Devam Ediyor' : project.status}
                        </span>
                    </div>
                    <p className="text-muted-foreground mt-1 flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        {project.clients?.company || project.clients?.name || 'Müşteri Yok'}
                    </p>
                </div>
            </div>

            {/* Print Header (Only visible when printing) */}
            <div className="hidden print:block mb-8">
                <h1 className="text-2xl font-bold">{project.name} - Proje Raporu</h1>
                <p className="text-gray-500">Tarih: {new Date().toLocaleDateString('tr-TR')}</p>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:block print:space-y-8">

                {/* Sol Kolon: Detaylar */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Açıklama Kartı */}
                    <div className="bg-card border border-border rounded-notebook p-6 print:border-gray-200 print:bg-white print:p-0">
                        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2 print:text-black">
                            <Briefcase className="w-5 h-5 text-emerald-500 print:text-black" />
                            Proje Detayları
                        </h2>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap print:text-gray-700">
                            {project.description || 'Açıklama girilmemiş.'}
                        </p>
                    </div>

                    {/* Notlar Bölümü */}
                    <div className="bg-card border border-border rounded-notebook p-6 print:hidden">
                        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                            <StickyNote className="w-5 h-5 text-yellow-500" />
                            Proje Notları
                        </h2>

                        {/* Not Ekleme Formu */}
                        <form onSubmit={handleAddNote} className="mb-6 flex gap-2">
                            <input
                                type="text"
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                placeholder="Proje ile ilgili not ekle..."
                                className="flex-1 bg-background border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-emerald-500"
                            />
                            <button
                                type="submit"
                                disabled={addingNote || !newNote.trim()}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-xl disabled:opacity-50 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </form>

                        {/* Not Listesi */}
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {notes.length === 0 ? (
                                <p className="text-slate-500 text-sm text-center py-4">Henüz not eklenmemiş.</p>
                            ) : (
                                notes.map((note) => (
                                    <div key={note.id} className="group flex items-start justify-between bg-muted p-3 rounded-xl border border-border hover:border-border/80 transition-colors">
                                        <div>
                                            <p className="text-foreground text-sm">{note.content}</p>
                                            <span className="text-slate-600 text-[10px] mt-1 block">
                                                {new Date(note.created_at).toLocaleString('tr-TR')}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteNote(note.id)}
                                            className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Görevler Listesi */}
                    <div className="bg-card border border-border rounded-notebook p-6 print:hidden">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                Proje Görevleri
                            </h2>
                            <Link href="/admin/tasks" className="text-sm text-emerald-500 hover:text-emerald-400 font-medium flex items-center gap-1 transition-colors">
                                Tüm Görevleri Yönet
                            </Link>
                        </div>

                        {/* Hızlı Ekleme Formu */}
                        <form onSubmit={handleQuickAddTask} className="mb-6 flex gap-2">
                            <input
                                type="text"
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                placeholder="Yeni görev ekle... (Enter)"
                                className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500 transition-all placeholder:text-muted-foreground"
                            />
                            <button
                                type="submit"
                                disabled={addingTask || !newTaskTitle.trim()}
                                className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl disabled:opacity-50 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
                            >
                                {addingTask ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                            </button>
                        </form>

                        {(!project.tasks || project.tasks.length === 0) ? (
                            <div className="text-center py-8 border border-dashed border-border rounded-2xl">
                                <p className="text-muted-foreground text-sm italic">Henüz görev atanmamış. Yukarıdan ekleyebilirsin.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {project.tasks.map((task: any) => (
                                    <div
                                        key={task.id}
                                        className={`group flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${task.status === 'done'
                                            ? 'bg-emerald-500/5 border-emerald-500/20 opacity-70'
                                            : 'bg-card hover:bg-muted/50 border-border hover:border-blue-500/30 hover:shadow-md'
                                            }`}
                                        onClick={() => setSelectedTask(task)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={(e) => toggleTaskStatus(task, e)}
                                                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${task.status === 'done'
                                                    ? 'bg-emerald-500 text-white scale-110'
                                                    : 'border-2 border-slate-400 text-transparent hover:border-emerald-500'
                                                    }`}>
                                                <CheckCircle2 className="w-4 h-4" />
                                            </button>

                                            <span className={`font-medium transition-all ${task.status === 'done'
                                                ? 'text-muted-foreground line-through decoration-emerald-500/50'
                                                : 'text-foreground'
                                                }`}>
                                                {task.title}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {task.priority && (
                                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${task.priority === 'high' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                    task.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                        'bg-slate-500/10 text-slate-500 border-slate-500/20'
                                                    }`}>
                                                    {task.priority === 'high' ? 'Yüksek' : task.priority === 'medium' ? 'Orta' : 'Düşük'}
                                                </span>
                                            )}
                                            <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded hidden sm:inline-block">
                                                {task.assigned_to ? 'Atandı' : 'Atanmadı'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

                {/* Sağ Kolon: Özet & Meta */}
                <div className="space-y-6 print:hidden">

                    {/* İlerleme Durumu */}
                    <div className="bg-card border border-border rounded-notebook p-6">
                        <h3 className="text-sm font-bold text-muted-foreground uppercase mb-4">İlerleme</h3>
                        <div className="flex items-end justify-between mb-2">
                            <span className="text-3xl font-bold text-foreground">%{progress}</span>
                            <span className="text-sm text-muted-foreground">{completedTasks}/{totalTasks} Görev</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }} />
                        </div>
                    </div>

                    {/* Finansal Özet */}
                    <div className="bg-card border border-border rounded-notebook p-6">
                        <h3 className="text-sm font-bold text-muted-foreground uppercase mb-4">Finansal</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-500 block mb-1">Toplam Bütçe</label>
                                <div className="text-xl font-bold text-foreground flex items-center gap-1">
                                    <DollarSign className="w-5 h-5 text-emerald-500" />
                                    {project.budget ? project.budget.toLocaleString('tr-TR') : '0'} ₺
                                </div>
                            </div>
                            <div className="pt-4 border-t border-border">
                                <label className="text-xs text-muted-foreground block mb-1">Bitiş Tarihi</label>
                                <div className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-blue-500" />
                                    {project.end_date ? new Date(project.end_date).toLocaleDateString('tr-TR') : 'Belirsiz'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Aksiyonlar */}
                    <div className="bg-card border border-border rounded-notebook p-6 space-y-3">
                        <Link
                            href={`/admin/projects/edit/${project.id}`}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors"
                        >
                            <Edit2 className="w-4 h-4" />
                            Projeyi Düzenle
                        </Link>
                        <button
                            onClick={handlePrint}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-muted hover:bg-muted/80 text-foreground rounded-xl font-medium transition-colors"
                        >
                            <Printer className="w-4 h-4" />
                            Rapor Oluştur
                        </button>
                    </div>

                </div>
            </div>

            {/* Task Detail Modal */}
            {selectedTask && (
                <TaskDetailModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onUpdate={() => {
                        // Refresh project data to reflect changes
                        // For mock/dev, we can just reload from LS or fetchProject
                        if (process.env.NODE_ENV === 'development') {
                            const localTasks = JSON.parse(localStorage.getItem('mock_tasks') || '[]')
                            const updatedProjectTasks = localTasks.filter((t: any) => t.project_id == project.id)
                            setProject((prev: any) => ({ ...prev, tasks: updatedProjectTasks }))
                        } else {
                            fetch(`/api/projects?id=${project.id}`)
                                .then(r => r.json())
                                .then(data => setProject(data))
                        }
                    }}
                    onDelete={() => {
                        // Remove from UI
                        setProject((prev: any) => ({
                            ...prev,
                            tasks: prev.tasks.filter((t: any) => t.id !== selectedTask.id)
                        }))
                        setSelectedTask(null)

                        // Dev Sync
                        if (process.env.NODE_ENV === 'development') {
                            const localTasks = JSON.parse(localStorage.getItem('mock_tasks') || '[]')
                            const filtered = localTasks.filter((t: any) => t.id !== selectedTask.id)
                            localStorage.setItem('mock_tasks', JSON.stringify(filtered))
                        }
                    }}
                    projects={require('@/lib/mock-data').MOCK_PROJECTS} // Pass available projects if needed
                    team={require('@/lib/mock-data').MOCK_TEAM} // Pass available team
                />
            )}
        </div>
    )
}
