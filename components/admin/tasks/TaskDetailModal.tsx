"use client"

import { useState, useEffect } from "react"
import { X, Paperclip, MessageSquare, CheckSquare, Clock, Plus, Trash2, Edit2, Save, Loader2, Link as LinkIcon, Calendar } from "lucide-react"
import { createBrowserClient } from '@supabase/ssr'

export default function TaskDetailModal({ task, onClose, onUpdate, onDelete, projects = [], team = [] }: any) {
    const [checklists, setChecklists] = useState<any[]>(task.checklists || [])
    const [newChecklistItem, setNewChecklistItem] = useState('')
    const [uploading, setUploading] = useState(false)
    const [attachments, setAttachments] = useState<any[]>(task.task_attachments || [])
    const [isEditing, setIsEditing] = useState(false)

    // Düzenleme state'i
    const [editForm, setEditForm] = useState({
        title: task.title,
        description: task.description,
        assigned_to: task.assigned_to,
        project_id: task.project_id,
        due_date: task.due_date ? task.due_date.split('T')[0] : '',
        status: task.status,
        priority: task.priority,
        tags: task.tags || []
    })

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'public-anon-key'
    )

    // Dosyaları çek
    useEffect(() => {
        if (!task.id) {
            setAttachments([])
            return
        }
        const fetchAttachments = async () => {
            try {
                const res = await fetch(`/api/tasks/attachments?task_id=${task.id}`)
                if (res.ok) {
                    const data = await res.json()
                    setAttachments(data)
                }
            } catch (e) {
                console.error("Attachment fetch error:", e)
            }
        }
        fetchAttachments()
    }, [task.id])

    // Dosya Yükleme
    const handleFileUpload = async (e: any) => {
        const file = e.target.files[0]
        if (!file) return

        try {
            setUploading(true)
            const formData = new FormData()
            formData.append('file', file)
            formData.append('task_id', task.id)

            const res = await fetch('/api/tasks/attachments', {
                method: 'POST',
                body: formData
            })

            if (!res.ok) throw new Error('Upload failed')

            const savedData = await res.json()
            const dataToAdd = Array.isArray(savedData) ? savedData[0] : savedData

            setAttachments(prev => [...prev, dataToAdd])
            onUpdate()

        } catch (error: any) {
            alert(`Yükleme hatası: ${error.message}`)
        } finally {
            setUploading(false)
        }
    }

    const deleteAttachment = async (attachmentId: number) => {
        if (!confirm('Dosyayı silmek istiyor musunuz?')) return
        try {
            await fetch(`/api/tasks/attachments?id=${attachmentId}`, { method: 'DELETE' })
            setAttachments(prev => prev.filter(a => a.id !== attachmentId))
        } catch (e) {
            console.error(e)
            alert('Dosya silinemedi')
        }
    }

    // Kaydetme
    const handleSaveEdit = async () => {
        try {
            const res = await fetch('/api/tasks', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: task.id, ...editForm })
            })
            if (res.ok) {
                setIsEditing(false)
                onUpdate()
            } else {
                alert('Güncellenemedi')
            }
        } catch (e) {
            console.error(e)
            alert('Hata oluştu')
        }
    }

    // Checklist
    const handleAddChecklistItem = (e: any) => {
        e.preventDefault()
        if (!newChecklistItem.trim()) return
        const newItem = { id: Date.now(), text: newChecklistItem, checked: false }
        setChecklists([...checklists, newItem])
        setNewChecklistItem('')
    }

    const toggleChecklist = (id: number) => {
        setChecklists(checklists.map((item: any) =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ))
    }

    if (!task) return null

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            {/* Modal Card Wrapper */}
            <div
                className="bg-card w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-border"
                onClick={(e) => e.stopPropagation()}
            >

                {/* --- HEADER SECTION --- */}
                <div className="flex-none flex items-center justify-between p-6 border-b border-border bg-muted/30">

                    {/* Title Area */}
                    <div className="flex-1 mr-8 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                            {/* Status Badge */}
                            <div className="relative">
                                {isEditing ? (
                                    <select
                                        className="appearance-none pl-3 pr-8 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-background border border-border cursor-pointer hover:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                                        value={editForm.status}
                                        onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                                    >
                                        <option value="todo">Yapılacak</option>
                                        <option value="in_progress">Sürüyor</option>
                                        <option value="done">Tamamlandı</option>
                                    </select>
                                ) : (
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${task.status === 'done' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                        task.status === 'in_progress' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                            'bg-slate-500/10 text-slate-500 border-slate-500/20'
                                        }`}>
                                        {task.status === 'done' ? 'Tamamlandı' :
                                            task.status === 'in_progress' ? 'Sürüyor' : 'Yapılacak'}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Title Input/Display */}
                        {isEditing ? (
                            <input
                                className="text-2xl font-bold bg-background border border-border rounded-lg px-3 py-2 w-full text-foreground focus:ring-2 focus:ring-emerald-500/20 outline-none"
                                value={editForm.title}
                                onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                                placeholder="Görev başlığı"
                            />
                        ) : (
                            <h2 className="text-2xl font-bold text-foreground leading-tight break-words">
                                {task.title}
                            </h2>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex-none flex items-center gap-2">
                        {isEditing ? (
                            <button onClick={handleSaveEdit} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-bold transition-all shadow-sm active:scale-95">
                                <Save className="w-4 h-4" /> Kaydet
                            </button>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-white border border-border text-foreground rounded-lg hover:bg-muted font-medium transition-all shadow-sm">
                                <Edit2 className="w-4 h-4" /> Düzenle
                            </button>
                        )}

                        {onDelete && !isEditing && (
                            <button onClick={onDelete} className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Sil">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        )}

                        <div className="w-px h-8 bg-border mx-1"></div>

                        <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors" title="Kapat">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* --- BODY SECTION --- */}
                <div className="flex-1 flex overflow-hidden bg-background relative">

                    {/* LEFT COLUMN: Main Content */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">

                        {/* Description */}
                        <div className="group">
                            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-emerald-500" />
                                Açıklama
                            </h3>
                            {isEditing ? (
                                <textarea
                                    className="w-full h-40 bg-slate-50 border border-border rounded-xl p-4 text-foreground focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none leading-relaxed"
                                    value={editForm.description}
                                    onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                                    placeholder="Detaylı bir açıklama ekleyin..."
                                />
                            ) : (
                                <div className={`prose prose-sm max-w-none text-foreground/80 leading-relaxed whitespace-pre-wrap ${!task.description && 'text-muted-foreground italic'}`}>
                                    {task.description || 'Bu görev için henüz bir açıklama girilmemiş.'}
                                </div>
                            )}
                        </div>

                        {/* Checklist */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                                    <CheckSquare className="w-4 h-4 text-emerald-500" />
                                    Kontrol Listesi
                                    <span className="text-xs font-normal text-muted-foreground ml-1">
                                        ({checklists.filter((i: any) => i.checked).length}/{checklists.length || 0})
                                    </span>
                                </h3>
                            </div>

                            {/* Progress Bar */}
                            {checklists.length > 0 && (
                                <div className="h-1.5 bg-muted rounded-full mb-4 overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 transition-all duration-300 ease-out"
                                        style={{ width: `${Math.round((checklists.filter((i: any) => i.checked).length / (checklists.length || 1)) * 100)}%` }}
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                {checklists.map((item: any) => (
                                    <div key={item.id} className="flex items-start gap-3 group p-2 rounded-lg hover:bg-slate-50 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={item.checked}
                                            onChange={() => toggleChecklist(item.id)}
                                            className="mt-0.5 w-5 h-5 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                                        />
                                        <span className={`flex-1 text-sm leading-snug break-words ${item.checked ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                                            {item.text}
                                        </span>
                                    </div>
                                ))}

                                <form onSubmit={handleAddChecklistItem} className="mt-3 flex items-center gap-2 group focus-within:ring-2 ring-emerald-500/20 rounded-lg">
                                    <div className="w-8 h-8 flex items-center justify-center text-muted-foreground">
                                        <Plus className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        value={newChecklistItem}
                                        onChange={(e) => setNewChecklistItem(e.target.value)}
                                        placeholder="Yeni madde ekle..."
                                        className="flex-1 bg-transparent border-none outline-none text-sm py-2 text-foreground placeholder:text-muted-foreground"
                                    />
                                    {newChecklistItem && (
                                        <button type="submit" className="px-3 py-1 text-xs font-bold bg-emerald-100 text-emerald-700 rounded-md mr-2">
                                            EKLE
                                        </button>
                                    )}
                                </form>
                            </div>
                        </div>

                        {/* Attachments */}
                        <div>
                            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                                <Paperclip className="w-4 h-4 text-emerald-500" />
                                Dosyalar & Ekler
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <label className="border-2 border-dashed border-border rounded-xl p-4 flex flex-col items-center justify-center text-muted-foreground hover:text-emerald-500 hover:border-emerald-500/50 hover:bg-emerald-50 transition-all cursor-pointer h-20 min-h-[80px]">
                                    {uploading ? <Loader2 className="w-6 h-6 animate-spin text-emerald-500" /> : <><Plus className="w-6 h-6 mb-1" /><span className="text-xs font-semibold">Dosya Yükle</span></>}
                                    <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                                </label>

                                {attachments.map((file: any, i: number) => (
                                    <div key={file.id || i} className="bg-card border border-border rounded-xl p-3 flex items-center gap-3 group hover:border-emerald-500/30 transition-colors relative pr-8">
                                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 font-bold text-xs uppercase flex-none">
                                            {file.file_name?.split('.').pop() || 'FILE'}
                                        </div>
                                        <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-0">
                                            <p className="text-sm text-foreground font-medium truncate hover:text-emerald-600 transition-colors">{file.file_name}</p>
                                        </a>
                                        <button onClick={() => deleteAttachment(file.id)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Sidebar (Meta Info) */}
                    <div className="w-80 bg-slate-50/50 p-6 space-y-8 overflow-y-auto border-l border-border h-full flex-none">

                        {/* Project Field */}
                        <div>
                            <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block tracking-wider">Proje</label>
                            {isEditing ? (
                                <select
                                    className="w-full bg-white border border-border rounded-lg p-2.5 text-sm text-foreground focus:ring-2 focus:ring-emerald-500/20 outline-none"
                                    value={editForm.project_id || ''}
                                    onChange={e => setEditForm({ ...editForm, project_id: e.target.value })}
                                >
                                    <option value="">Proje Yok</option>
                                    {projects.map((p: any) => (
                                        <option key={p.id} value={p.id}>{p.title}</option>
                                    ))}
                                </select>
                            ) : (
                                <div className="flex items-center gap-3 text-sm text-foreground bg-white border border-border p-3 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-none">
                                        <LinkIcon className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium truncate">
                                        {projects.find((p: any) => p.id == task.project_id)?.title || 'Bağlı Proje Yok'}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Assignee Field */}
                        <div>
                            <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block tracking-wider">Atanan Kişi</label>
                            {isEditing ? (
                                <select
                                    className="w-full bg-white border border-border rounded-lg p-2.5 text-sm text-foreground focus:ring-2 focus:ring-emerald-500/20 outline-none"
                                    value={editForm.assigned_to || ''}
                                    onChange={e => setEditForm({ ...editForm, assigned_to: e.target.value })}
                                >
                                    <option value="">Atanmamış</option>
                                    {team.map((m: any) => (
                                        <option key={m.id} value={m.id}>{m.name}</option>
                                    ))}
                                </select>
                            ) : (
                                <div className="flex items-center gap-3 p-1">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold border-2 border-white shadow-sm ring-1 ring-emerald-500/10">
                                        {task.team_members?.name?.[0]?.toUpperCase() || '?'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-foreground">{task.team_members?.name || 'Atanmamış'}</p>
                                        <p className="text-xs text-muted-foreground">{task.team_members?.role || 'Üye'}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Due Date Field */}
                        <div>
                            <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block tracking-wider">Son Teslim</label>
                            {isEditing ? (
                                <input
                                    type="date"
                                    className="w-full bg-white border border-border rounded-lg p-2.5 text-sm text-foreground"
                                    value={editForm.due_date}
                                    onChange={e => setEditForm({ ...editForm, due_date: e.target.value })}
                                />
                            ) : (
                                <div className={`flex items-center gap-3 text-sm font-medium bg-white border border-border p-3 rounded-xl shadow-sm ${!task.due_date && 'text-muted-foreground'}`}>
                                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center flex-none">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    {task.due_date ? new Date(task.due_date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Belirtilmemiş'}
                                </div>
                            )}
                        </div>

                        {/* Priority Field */}
                        <div>
                            <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block tracking-wider">Öncelik</label>
                            {isEditing ? (
                                <select
                                    className="w-full bg-white border border-border rounded-lg p-2.5 text-sm text-foreground"
                                    value={editForm.priority || 'medium'}
                                    onChange={e => setEditForm({ ...editForm, priority: e.target.value })}
                                >
                                    <option value="low">Düşük</option>
                                    <option value="medium">Orta</option>
                                    <option value="high">Yüksek</option>
                                </select>
                            ) : (
                                <div className="inline-flex">
                                    <span className={`px-4 py-2 rounded-lg text-sm font-bold capitalize border shadow-sm flex items-center gap-2 ${task.priority === 'high' ? 'bg-red-50 text-red-600 border-red-200' :
                                        task.priority === 'low' ? 'bg-slate-50 text-slate-600 border-slate-200' :
                                            'bg-amber-50 text-amber-600 border-amber-200'
                                        }`}>
                                        <span className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' :
                                            task.priority === 'low' ? 'bg-slate-500' :
                                                'bg-amber-500'
                                            }`}></span>
                                        {task.priority === 'high' ? 'Yüksek' : task.priority === 'low' ? 'Düşük' : 'Orta'}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Tags Field */}
                        <div>
                            <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block tracking-wider">Etiketler</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    className="w-full bg-white border border-border rounded-lg p-2.5 text-sm text-foreground"
                                    value={Array.isArray(editForm.tags) ? editForm.tags.join(', ') : editForm.tags || ''}
                                    onChange={e => setEditForm({ ...editForm, tags: e.target.value.split(',').map((t: string) => t.trim()) })}
                                    placeholder="Frontend, Bug, Acil (Virgülle ayırın)"
                                />
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {task.tags && Array.isArray(task.tags) && task.tags.length > 0 ? (
                                        task.tags.map((tag: string, i: number) => (
                                            <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded border border-slate-200">
                                                {tag}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-sm text-muted-foreground italic">Etiket yok</span>
                                    )}
                                </div>
                            )}
                        </div>

                    </div>

                </div>

            </div>
        </div>
    )
}
