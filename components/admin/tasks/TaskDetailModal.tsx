"use client"
import { useState, useEffect } from "react"
import { X, Paperclip, MessageSquare, CheckSquare, Tag, Clock, Plus, Trash2, Send, Loader2 } from "lucide-react"
import { createBrowserClient } from '@supabase/ssr'

export default function TaskDetailModal({ task, onClose, onUpdate, onDelete }: any) {
    const [checklists, setChecklists] = useState<any[]>(task.checklists || [])
    const [newChecklistItem, setNewChecklistItem] = useState('')
    const [uploading, setUploading] = useState(false)
    const [attachments, setAttachments] = useState<any[]>(task.task_attachments || [])

    // Sync state with props when task updates (e.g. after upload)
    useEffect(() => {
        const fetchAttachments = async () => {
            try {
                // Task ID yoksa boş getir
                if (!task.id) {
                    setAttachments([])
                    return
                }

                // API'den taze veriyi çek
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

    // Client-side Supabase Client
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // --- Dosya Yükleme (Server-Side Proxy) ---
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

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || 'Upload failed')
            }

            const savedData = await res.json()
            const dataToAdd = Array.isArray(savedData) ? savedData[0] : savedData

            setAttachments(prev => [...prev, dataToAdd])
            onUpdate() // Ana listeyi yenile

        } catch (error: any) {
            console.error(error)
            alert(`Yükleme hatası: ${error.message}`)
        } finally {
            setUploading(false)
        }
    }

    // --- Checklist ---
    const handleAddChecklistItem = (e: any) => {
        e.preventDefault()
        if (!newChecklistItem.trim()) return
        const newItem = { id: Date.now(), text: newChecklistItem, checked: false }
        const newList = [...checklists, newItem]
        setChecklists(newList)
        setNewChecklistItem('')
        // TODO: API update call for checklist
    }

    const toggleChecklist = (id: number) => {
        const newList = checklists.map((item: any) =>
            item.id === id ? { ...item, checked: !item.checked } : item
        )
        setChecklists(newList)
        // TODO: API update call for checklist
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-card border border-border rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="p-6 border-b border-border flex justify-between items-start bg-background">
                    <div className="flex-1 mr-8">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20">
                                {task.status === 'todo' ? 'Yapılacak' : task.status === 'in_progress' ? 'Sürüyor' : 'Tamamlandı'}
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold text-white">{task.title}</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        {onDelete && (
                            <button
                                onClick={onDelete}
                                title="Görevi Sil"
                                className="text-slate-400 hover:text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-6 h-6" />
                            </button>
                        )}
                        <button onClick={onClose} className="text-slate-400 hover:text-foreground p-2 hover:bg-muted rounded-lg transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Body Content */}
                <div className="flex-1 flex overflow-hidden">

                    {/* Left Column (Main Info) */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-8 border-r border-border">
                        {/* Description */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-400 mb-3 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" />
                                Açıklama
                            </h3>
                            <div className="bg-background border border-border rounded-xl p-4 min-h-[100px] text-slate-300">
                                {task.description || 'Açıklama yok.'}
                            </div>
                        </div>

                        {/* Checklist */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-bold text-slate-400 flex items-center gap-2">
                                    <CheckSquare className="w-4 h-4" />
                                    Kontrol Listesi ({Math.round((checklists.filter((i: any) => i.checked).length / (checklists.length || 1)) * 100)}%)
                                </h3>
                            </div>

                            <div className="h-2 bg-muted rounded-full mb-4 overflow-hidden">
                                <div
                                    className="h-full bg-emerald-500 transition-all duration-300"
                                    style={{ width: `${Math.round((checklists.filter((i: any) => i.checked).length / (checklists.length || 1)) * 100)}%` }}
                                />
                            </div>

                            <div className="space-y-2">
                                {checklists.map((item: any) => (
                                    <div key={item.id} className="flex items-center gap-3 group">
                                        <input
                                            type="checkbox"
                                            checked={item.checked}
                                            onChange={() => toggleChecklist(item.id)}
                                            className="w-5 h-5 rounded border-slate-700 bg-card checked:bg-emerald-500 text-emerald-500 focus:ring-0 focus:ring-offset-0"
                                        />
                                        <span className={`flex-1 text-sm ${item.checked ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                                            {item.text}
                                        </span>
                                    </div>
                                ))}

                                <form onSubmit={handleAddChecklistItem} className="mt-2 flex gap-2">
                                    <input
                                        type="text"
                                        value={newChecklistItem}
                                        onChange={(e) => setNewChecklistItem(e.target.value)}
                                        placeholder="Yeni madde ekle..."
                                        className="flex-1 bg-transparent border-b border-border focus:border-emerald-500 outline-none text-sm py-2 text-foreground placeholder:text-slate-600"
                                    />
                                    <button type="submit" className="text-emerald-500 hover:text-emerald-400 text-sm font-medium">Ekle</button>
                                </form>
                            </div>
                        </div>

                        {/* Attachments */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-400 mb-3 flex items-center gap-2">
                                <Paperclip className="w-4 h-4" />
                                Dosyalar & Ekler
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <label className="border border-dashed border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center text-slate-500 hover:text-emerald-500 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all cursor-pointer h-24 relative overflow-hidden">
                                    {uploading ? (
                                        <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                                    ) : (
                                        <>
                                            <Plus className="w-6 h-6 mb-2" />
                                            <span className="text-xs">Dosya Yükle</span>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileUpload}
                                        disabled={uploading}
                                    />
                                </label>

                                {attachments.map((file: any, i: number) => (
                                    <a key={file.id || i} href={file.file_url} target="_blank" rel="noopener noreferrer" className="bg-background border border-border rounded-xl p-3 flex items-center gap-3 group hover:border-slate-700 transition-colors">
                                        <div className="w-10 h-10 bg-card rounded-lg flex items-center justify-center text-blue-400 font-bold text-sm">
                                            {file.file_name?.split('.').pop()?.toUpperCase() || 'FILE'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-foreground truncate">{file.file_name}</p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Meta) */}
                    <div className="w-80 bg-background p-6 space-y-6 overflow-y-auto border-l border-slate-900">
                        {/* Meta Info */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Atanan</label>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-slate-400">
                                        {task.team_members?.name?.[0]}
                                    </div>
                                    <span className="text-sm text-foreground font-medium">{task.team_members?.name || 'Atanmamış'}</span>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Son Tarih</label>
                                <div className="flex items-center gap-2 text-slate-300 text-sm">
                                    <Clock className="w-4 h-4 text-emerald-500" />
                                    {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'Belirtilmemiş'}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-card/50 rounded-lg border border-border/50">
                            <p className="text-xs text-slate-500">
                                * Dosya yüklemek için Supabase'de <strong>task-attachments</strong> adında <strong>Public</strong> bir bucket gereklidir.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
