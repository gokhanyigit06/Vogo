"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { DndContext, DragOverlay, useDraggable, useDroppable, DragEndEvent, useSensors, useSensor, PointerSensor } from '@dnd-kit/core'
import { Plus, Clock, CheckCircle2, AlertCircle, X } from "lucide-react"
import { createPortal } from "react-dom"
import TaskDetailModal from "@/components/admin/tasks/TaskDetailModal"
import { useTeamWithCurrentUser } from "@/hooks/useTeamWithCurrentUser"

// --- Types ---
interface Task {
    id: number
    title: string
    description: string
    status: 'todo' | 'in_progress' | 'done'
    priority: 'low' | 'medium' | 'high'
    due_date?: string
    dueDate?: string // API response
    assigned_to?: string // Changed to String
    assignedTo?: string // API response (String)
    project_id?: number
    projectId?: number // API response
    team_members?: { name: string }
    teamMember?: { name: string }
    user?: { name: string, image?: string, email?: string } // New relation
    projects?: { name: string }
    project?: { title: string, name: string } // API response
    checklists?: any[]
    labels?: any[]
}

const COLUMNS = [
    { id: 'todo', title: 'Yapılacaklar', color: 'bg-slate-500/10 border-slate-500/20 text-muted-foreground' },
    { id: 'in_progress', title: 'Sürüyor', color: 'bg-blue-500/10 border-blue-500/20 text-blue-400' },
    { id: 'done', title: 'Tamamlandı', color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' }
]

// --- Visual Component (Pure UI) ---
function TaskCardView({ task, team = [], isOverlay = false, onClick }: { task: Task, team?: any[], isOverlay?: boolean, onClick?: () => void }) {
    // API assignedTo (camelCase) dönüyor olabilir, kontrol et
    const assignedId = task.assignedTo || task.assigned_to
    // API user objesi dönüyor (image ile), team listesinde avatar_url olabilir
    const assignedUser = task.user || team.find((m: any) => m.id == assignedId)

    // API projectId dönüyor olabilir
    const projectId = task.projectId || task.project_id
    const projectTitle = task.project?.title || task.project?.name || task.projects?.name

    const priorityColor = {
        low: 'bg-muted text-foreground',
        medium: 'bg-yellow-500/10 text-yellow-500',
        high: 'bg-red-500/10 text-red-500'
    }[task.priority || 'medium']

    const checklistCount = task.checklists?.length || 0
    const completedChecklist = task.checklists?.filter((i: any) => i.checked).length || 0

    return (
        <div
            onClick={onClick}
            className={`bg-card border border-border p-4 rounded-xl cursor-grab active:cursor-grabbing hover:border-border transition-colors shadow-sm group ${isOverlay ? 'rotate-2 scale-105 shadow-xl border-emerald-500/50 z-50 cursor-grabbing' : ''}`}
        >
            <div className="flex justify-between items-start mb-2">
                <span className={`text-xs px-2 py-0.5 rounded font-medium ${priorityColor}`}>
                    {task.priority === 'high' ? 'Yüksek' : task.priority === 'medium' ? 'Orta' : 'Düşük'}
                </span>
                {(task.dueDate || task.due_date) && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(task.dueDate || task.due_date || '').toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                    </span>
                )}
            </div>

            {projectTitle && (
                <div className="text-[10px] text-muted-foreground bg-muted rounded px-2 py-1 mb-2 inline-block max-w-full truncate border border-border/50">
                    📁 {projectTitle}
                </div>
            )}

            <h4 className="font-bold text-foreground mb-2 group-hover:text-emerald-400 transition-colors">{task.title}</h4>

            <div className="flex items-center gap-4 text-muted-foreground text-xs mt-3">
                <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-foreground border border-border overflow-hidden ring-1 ring-border">
                        {assignedUser?.image || assignedUser?.avatar_url ? (
                            <img src={assignedUser.image || assignedUser.avatar_url} alt={assignedUser.name} className="w-full h-full object-cover" />
                        ) : (
                            assignedUser?.name?.[0]?.toUpperCase() || '?'
                        )}
                    </div>
                </div>

                {checklistCount > 0 && (
                    <div className={`flex items-center gap-1 ${completedChecklist === checklistCount ? 'text-emerald-500' : ''}`}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{completedChecklist}/{checklistCount}</span>
                    </div>
                )}
            </div>
        </div>
    )
}

// --- Draggable Wrapper ---
function DraggableTaskCard({ task, team, onClick }: { task: Task, team: any[], onClick: () => void }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task.id.toString(),
        data: task
    })

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined

    if (isDragging) {
        return (
            <div ref={setNodeRef} style={style} className="opacity-50">
                <TaskCardView task={task} team={team} />
            </div>
        )
    }

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            <TaskCardView task={task} team={team} onClick={onClick} />
        </div>
    )
}

// --- Column Component ---
function KanbanColumn({ id, title, tasks, team, color, onTaskClick }: { id: string, title: string, tasks: Task[], team: any[], color: string, onTaskClick: (t: Task) => void }) {
    const { setNodeRef } = useDroppable({ id })

    return (
        <div ref={setNodeRef} className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 rounded-notebook p-5 border border-border min-h-[500px] shadow-sm">
            <div className={`flex items-center justify-between border-b border-border pb-3 mb-4 ${color.replace('bg-', 'text-')}`}>
                <h3 className="font-bold flex items-center gap-2">
                    {id === 'todo' && <AlertCircle className="w-5 h-5" />}
                    {id === 'in_progress' && <Clock className="w-5 h-5" />}
                    {id === 'done' && <CheckCircle2 className="w-5 h-5" />}
                    {title}
                </h3>
                <span className={`text-xs px-2 py-1 rounded-full ${color.split(' ')[0]} ${color.split(' ')[2]}`}>
                    {tasks.length}
                </span>
            </div>
            <div className="space-y-3 flex-1">
                {tasks.map(task => (
                    <DraggableTaskCard key={task.id} task={task} team={team} onClick={() => onTaskClick(task)} />
                ))}
            </div>
        </div>
    )
}

// --- Main Page ---

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([])
    const { team } = useTeamWithCurrentUser()
    const [projects, setProjects] = useState<any[]>([])
    const [selectedProjectId, setSelectedProjectId] = useState<string>("")
    const [activeId, setActiveId] = useState<string | null>(null)
    const [showModal, setShowModal] = useState(false)
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)
    const [mounted, setMounted] = useState(false)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    )

    const [formData, setFormData] = useState<any>({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        assigned_to: '',
        project_id: '',
        due_date: ''
    })

    useEffect(() => {
        setMounted(true)
        fetchTasks()
        fetchProjects()

        // LocalStorage değişikliklerini dinle
        const handleTasksUpdate = () => {
            console.log('🔄 Tasks updated event received, refreshing...')
            fetchTasks()
        }

        if (typeof window !== 'undefined') {
            window.addEventListener('tasks-updated', handleTasksUpdate)
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('tasks-updated', handleTasksUpdate)
            }
        }
    }, [])

    const fetchTasks = () => fetch('/api/tasks')
        .then(r => r.json())
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                setTasks(data)
            } else if (process.env.NODE_ENV === 'development') {
                console.log("⚠️ Dev Mode: Using Mock Tasks")
                // LocalStorage varsa oradan al, yoksa sabit mock data
                try {
                    const localTasks = localStorage.getItem('mock_tasks')
                    if (localTasks) setTasks(JSON.parse(localTasks))
                    else setTasks(require('@/lib/mock-data').MOCK_TASKS)
                } catch (e) {
                    setTasks(require('@/lib/mock-data').MOCK_TASKS)
                }
            } else {
                setTasks([])
            }
        })
        .catch(err => {
            console.error("Fetch error:", err)
            if (process.env.NODE_ENV === 'development') {
                setTasks(require('@/lib/mock-data').MOCK_TASKS)
            } else {
                setTasks([])
            }
        })


    const fetchProjects = () => fetch('/api/projects')
        .then(r => r.json())
        .then(data => {
            if (Array.isArray(data) && data.length > 0) setProjects(data)
            else if (process.env.NODE_ENV === 'development') setProjects(require('@/lib/mock-data').MOCK_PROJECTS)
            else setProjects([])
        })

    const handleDelete = async (id: number) => {
        if (!confirm('Bu görevi silmek istediğinize emin misiniz?')) return

        try {
            const res = await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                setSelectedTaskId(null)
                fetchTasks()
            } else {
                alert('Silinemedi. Lütfen tekrar deneyin.')
            }
        } catch (error) {
            console.error(error)
            alert('Hata oluştu.')
        }
    }

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id)
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event
        setActiveId(null)

        if (!over) return

        const taskId = parseInt(active.id as string)
        const newStatus = over.id as Task['status']
        const currentTask = tasks.find(t => t.id === taskId)

        if (currentTask && currentTask.status !== newStatus) {
            setTasks(tasks.map(t =>
                t.id === taskId ? { ...t, status: newStatus } : t
            ))

            await fetch('/api/tasks', {
                method: 'PUT',
                body: JSON.stringify({ id: taskId, status: newStatus })
            })
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const payload = {
            ...formData,
            assigned_to: formData.assigned_to ? String(formData.assigned_to) : null,
            project_id: formData.project_id ? Number(formData.project_id) : null,
            due_date: formData.due_date || null
        }

        try {
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                setShowModal(false)
                fetchTasks()
                setFormData({
                    title: '',
                    description: '',
                    status: 'todo',
                    priority: 'medium',
                    assigned_to: '',
                    project_id: '',
                    due_date: ''
                })
            } else {
                const err = await res.json()
                alert(`Görev oluşturulamadı: ${err.error || 'Bilinmeyen hata'}`)
            }
        } catch (error) {
            console.error("Submit Error:", error)
            alert('Sunucu ile iletişim kurulamadı.')
        }
    }

    const activeTask = activeId ? tasks.find(t => t.id.toString() === activeId) : null
    const selectedTask = selectedTaskId ? tasks.find(t => t.id === selectedTaskId) : null

    const filteredTasks = selectedProjectId
        ? tasks.filter(t => (t.projectId || t.project_id) === Number(selectedProjectId))
        : tasks

    if (!mounted) return <div className="p-8 text-muted-foreground">Yükleniyor...</div>

    return (
        <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                        Görev Yönetimi
                    </h1>
                    <p className="text-muted-foreground mt-1">Ekip iş takibi ve süreç yönetimi.</p>
                </div>

                <div className="flex gap-3">
                    <select
                        className="bg-card border border-border text-foreground text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 shadow-sm"
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                    >
                        <option value="">Tüm Projeler</option>
                        {projects.map(p => (
                            <option key={p.id} value={p.id}>{p.title || p.name}</option>
                        ))}
                    </select>

                    <button
                        onClick={() => {
                            setFormData({ title: '', description: '', status: 'todo', priority: 'medium', assigned_to: '', project_id: '', due_date: '' })
                            setShowModal(true)
                        }}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
                    >
                        <Plus className="w-5 h-5" />
                        Yeni Görev
                    </button>
                </div>
            </div>

            <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 overflow-hidden">
                    {COLUMNS.map(col => (
                        <KanbanColumn
                            key={col.id}
                            id={col.id}
                            title={col.title}
                            color={col.color}
                            team={team}
                            tasks={filteredTasks.filter(t => t.status === col.id)}
                            onTaskClick={(task) => {
                                setSelectedTaskId(task.id)
                            }}
                        />
                    ))}
                </div>
                {createPortal(
                    <DragOverlay>
                        {activeTask ? <TaskCardView task={activeTask} team={team} isOverlay /> : null}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>

            {selectedTask && (
                <TaskDetailModal
                    task={selectedTask}
                    onClose={() => setSelectedTaskId(null)}
                    onUpdate={() => fetchTasks()}
                    onDelete={() => handleDelete(selectedTask.id)}
                    projects={projects}
                    team={team}
                />
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-card border border-border rounded-notebook p-6 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
                            <h2 className="text-xl font-bold text-foreground">Yeni Görev Ekle</h2>
                            <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-foreground mb-1.5">Başlık</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-muted/30 border border-border rounded-xl p-3 text-foreground focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all font-medium"
                                    placeholder="Görev başlığı..."
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-foreground mb-1.5">Proje</label>
                                <select
                                    className="w-full bg-muted/30 border border-border rounded-xl p-3 text-foreground focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all cursor-pointer"
                                    value={formData.project_id}
                                    onChange={e => setFormData({ ...formData, project_id: e.target.value })}
                                >
                                    <option value="">Proje Yok (Genel)</option>
                                    {projects.map(p => (
                                        <option key={p.id} value={p.id}>{p.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-foreground mb-1.5">Atanan Kişi</label>
                                    <select
                                        className="w-full bg-muted/30 border border-border rounded-xl p-3 text-foreground focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all cursor-pointer"
                                        value={formData.assigned_to}
                                        onChange={e => setFormData({ ...formData, assigned_to: e.target.value })}
                                    >
                                        <option value="">Seçiniz</option>
                                        {team.map(m => (
                                            <option key={m.id} value={m.id}>{m.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-foreground mb-1.5">Öncelik</label>
                                    <select
                                        className="w-full bg-muted/30 border border-border rounded-xl p-3 text-foreground focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all cursor-pointer"
                                        value={formData.priority}
                                        onChange={e => setFormData({ ...formData, priority: e.target.value })}
                                    >
                                        <option value="low">Düşük</option>
                                        <option value="medium">Orta</option>
                                        <option value="high">Yüksek</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-foreground mb-1.5">Bitiş Tarihi</label>
                                <input
                                    type="date"
                                    className="w-full bg-muted/30 border border-border rounded-xl p-3 text-foreground focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                                    value={formData.due_date}
                                    onChange={e => setFormData({ ...formData, due_date: e.target.value })}
                                />
                            </div>
                            <div className="pt-4 border-t border-border mt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-5 h-5" />
                                    Görevi Oluştur
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
