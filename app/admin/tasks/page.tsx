"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { DndContext, DragOverlay, useDraggable, useDroppable, DragEndEvent, useSensors, useSensor, PointerSensor } from '@dnd-kit/core'
import { Plus, Clock, CheckCircle2, AlertCircle, X } from "lucide-react"
import { createPortal } from "react-dom"
import TaskDetailModal from "@/components/admin/tasks/TaskDetailModal"

// --- Types ---
interface Task {
    id: number
    title: string
    description: string
    status: 'todo' | 'in_progress' | 'done'
    priority: 'low' | 'medium' | 'high'
    due_date: string
    assigned_to: number
    project_id: number
    team_members?: { name: string }
    projects?: { name: string }
    checklists?: any[]
    labels?: any[]
}

const COLUMNS = [
    { id: 'todo', title: 'Yapılacaklar', color: 'bg-slate-500/10 border-slate-500/20 text-slate-400' },
    { id: 'in_progress', title: 'Sürüyor', color: 'bg-blue-500/10 border-blue-500/20 text-blue-400' },
    { id: 'done', title: 'Tamamlandı', color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' }
]

// --- Visual Component (Pure UI) ---
function TaskCardView({ task, isOverlay = false, onClick }: { task: Task, isOverlay?: boolean, onClick?: () => void }) {
    const priorityColor = {
        low: 'bg-slate-700 text-slate-300',
        medium: 'bg-yellow-500/10 text-yellow-500',
        high: 'bg-red-500/10 text-red-500'
    }[task.priority || 'medium']

    const checklistCount = task.checklists?.length || 0
    const completedChecklist = task.checklists?.filter((i: any) => i.checked).length || 0

    return (
        <div
            onClick={onClick}
            className={`bg-slate-900 border border-slate-800 p-4 rounded-xl cursor-grab active:cursor-grabbing hover:border-slate-600 transition-colors shadow-sm group ${isOverlay ? 'rotate-2 scale-105 shadow-xl border-emerald-500/50 z-50 cursor-grabbing' : ''}`}
        >
            <div className="flex justify-between items-start mb-2">
                <span className={`text-xs px-2 py-0.5 rounded font-medium ${priorityColor}`}>
                    {task.priority === 'high' ? 'Yüksek' : task.priority === 'medium' ? 'Orta' : 'Düşük'}
                </span>
                {task.due_date && (
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(task.due_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                    </span>
                )}
            </div>

            <h4 className="font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">{task.title}</h4>

            <div className="flex items-center gap-4 text-slate-500 text-xs mt-3">
                <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">
                        {task.team_members?.name?.[0] || '?'}
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
function DraggableTaskCard({ task, onClick }: { task: Task, onClick: () => void }) {
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
                <TaskCardView task={task} />
            </div>
        )
    }

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            <TaskCardView task={task} onClick={onClick} />
        </div>
    )
}

// --- Column Component ---
function KanbanColumn({ id, title, tasks, color, onTaskClick }: { id: string, title: string, tasks: Task[], color: string, onTaskClick: (t: Task) => void }) {
    const { setNodeRef } = useDroppable({ id })

    return (
        <div ref={setNodeRef} className="flex flex-col h-full bg-slate-950/50 rounded-2xl p-4 border border-slate-800 min-h-[500px]">
            <div className={`flex items-center justify-between border-b border-slate-800 pb-3 mb-4 ${color.replace('bg-', 'text-')}`}>
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
                    <DraggableTaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
                ))}
            </div>
        </div>
    )
}

// --- Main Page ---

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [team, setTeam] = useState<any[]>([])
    const [activeId, setActiveId] = useState<string | null>(null)
    const [showModal, setShowModal] = useState(false)
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)
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
        fetchTeam()
    }, [])

    // Güvenli Fetch (Hata fırlatmaz)
    const fetchTasks = () => fetch('/api/tasks')
        .then(r => r.json())
        .then(data => {
            if (Array.isArray(data)) {
                setTasks(data)
            } else {
                console.error("Tasks API returned non-array:", data)
                setTasks([])
            }
        })
        .catch(err => {
            console.error("Fetch error:", err)
            setTasks([])
        })

    const fetchTeam = () => fetch('/api/team').then(r => r.json()).then(data => setTeam(data.filter((m: any) => m.active)))

    const handleDelete = async (id: number) => {
        if (!confirm('Bu görevi silmek istediğinize emin misiniz?')) return

        try {
            const res = await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                setSelectedTask(null)
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
            assigned_to: formData.assigned_to ? Number(formData.assigned_to) : null,
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

    if (!mounted) return <div className="p-8 text-slate-400">Yükleniyor...</div>

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 h-screen flex flex-col">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                        Görev Yönetimi
                    </h1>
                    <p className="text-slate-400 mt-1">Ekip iş takibi ve süreç yönetimi</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Yeni Görev
                </button>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
                <DndContext
                    sensors={sensors}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-w-[1000px] md:min-w-0">
                        {COLUMNS.map(col => (
                            <KanbanColumn
                                key={col.id}
                                id={col.id}
                                title={col.title}
                                color={col.color}
                                tasks={tasks.filter(t => t.status === col.id)}
                                onTaskClick={setSelectedTask}
                            />
                        ))}
                    </div>
                    {createPortal(
                        <DragOverlay>
                            {activeTask ? <TaskCardView task={activeTask} isOverlay /> : null}
                        </DragOverlay>,
                        document.body
                    )}
                </DndContext>
            </div>

            {selectedTask && (
                <TaskDetailModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onUpdate={() => fetchTasks()}
                    onDelete={() => handleDelete(selectedTask.id)}
                />
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Yeni Görev Ekle</h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Başlık</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Atanan Kişi</label>
                                    <select
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white"
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
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Öncelik</label>
                                    <select
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white"
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
                                <label className="block text-sm font-medium text-slate-400 mb-1">Bitiş Tarihi</label>
                                <input
                                    type="date"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white"
                                    value={formData.due_date}
                                    onChange={e => setFormData({ ...formData, due_date: e.target.value })}
                                />
                            </div>
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-colors"
                                >
                                    Oluştur
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
