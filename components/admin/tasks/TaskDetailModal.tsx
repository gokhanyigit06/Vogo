"use client"
import { useState, useEffect } from "react"
import { X, Paperclip, MessageSquare, CheckSquare, Tag, Clock, User, Plus, Trash2, Send } from "lucide-react"

export default function TaskDetailModal({ task, onClose, onUpdate }: any) {
    const [activeTab, setActiveTab] = useState('details') // details, comments, files
    const [comment, setComment] = useState('')
    const [checklists, setChecklists] = useState<any[]>(task.checklists || [])
    const [labels, setLabels] = useState<any[]>(task.labels || [])
    const [newChecklistItem, setNewChecklistItem] = useState('')

    // Mock data for UI development
    const comments = [
        { id: 1, user: 'Volkan K.', text: 'Tasarımı bitirdim, kontrole hazır.', time: '2s önce' }
    ]

    const handleAddChecklistItem = (e: any) => {
        e.preventDefault()
        if (!newChecklistItem.trim()) return
        const newItem = { id: Date.now(), text: newChecklistItem, checked: false }
        const newList = [...checklists, newItem]
        setChecklists(newList)
        setNewChecklistItem('')
        // TODO: API update call
    }

    const toggleChecklist = (id: number) => {
        const newList = checklists.map((item: any) =>
            item.id === id ? { ...item, checked: !item.checked } : item
        )
        setChecklists(newList)
        // TODO: API update call
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-950">
                    <div className="flex-1 mr-8">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20">
                                {task.status === 'todo' ? 'Yapılacak' : task.status === 'in_progress' ? 'Sürüyor' : 'Tamamlandı'}
                            </span>
                            {labels.map((label: any, i: number) => (
                                <span key={i} className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-medium border border-blue-500/20">
                                    {label.text}
                                </span>
                            ))}
                            <button className="text-slate-500 hover:text-white transition-colors">
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        <h2 className="text-2xl font-bold text-white">{task.title}</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-lg transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body Content */}
                <div className="flex-1 flex overflow-hidden">

                    {/* Left Column (Main Info) */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-8 border-r border-slate-800">
                        {/* Description */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-400 mb-3 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" />
                                Açıklama
                            </h3>
                            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 min-h-[100px] text-slate-300">
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

                            {/* Progress Bar */}
                            <div className="h-2 bg-slate-800 rounded-full mb-4 overflow-hidden">
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
                                            className="w-5 h-5 rounded border-slate-700 bg-slate-900 checked:bg-emerald-500 text-emerald-500 focus:ring-0 focus:ring-offset-0"
                                        />
                                        <span className={`flex-1 text-sm ${item.checked ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                                            {item.text}
                                        </span>
                                        <button className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-opacity">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}

                                <form onSubmit={handleAddChecklistItem} className="mt-2 flex gap-2">
                                    <input
                                        type="text"
                                        value={newChecklistItem}
                                        onChange={(e) => setNewChecklistItem(e.target.value)}
                                        placeholder="Yeni madde ekle..."
                                        className="flex-1 bg-transparent border-b border-slate-800 focus:border-emerald-500 outline-none text-sm py-2 text-white placeholder:text-slate-600"
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
                                <div className="border border-dashed border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center text-slate-500 hover:text-emerald-500 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all cursor-pointer h-24">
                                    <Plus className="w-6 h-6 mb-2" />
                                    <span className="text-xs">Dosya Yükle</span>
                                </div>
                                {/* Mock File */}
                                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center gap-3 group hover:border-slate-700 transition-colors">
                                    <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-blue-400">
                                        FIL
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white truncate">brief_revize_v2.pdf</p>
                                        <p className="text-xs text-slate-500">2.4 MB • Dün</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Activity & Details) */}
                    <div className="w-80 bg-slate-950 p-6 space-y-6 overflow-y-auto">

                        {/* Meta Info */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Atanan</label>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-400">
                                        {task.team_members?.name?.[0]}
                                    </div>
                                    <span className="text-sm text-white font-medium">{task.team_members?.name || 'Atanmamış'}</span>
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

                        <hr className="border-slate-800" />

                        {/* Comments System */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-400">Yorumlar</h3>

                            <div className="space-y-4">
                                {comments.map((c) => (
                                    <div key={c.id} className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">
                                            {c.user[0]}
                                        </div>
                                        <div>
                                            <div className="flex items-baseline gap-2 mb-1">
                                                <span className="text-sm font-bold text-white">{c.user}</span>
                                                <span className="text-[10px] text-slate-500">{c.time}</span>
                                            </div>
                                            <p className="text-sm text-slate-300 bg-slate-900 p-3 rounded-lg rounded-tl-none border border-slate-800">
                                                {c.text}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="relative">
                                <textarea
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-slate-700 min-h-[80px] resize-none"
                                    placeholder="Yorum yaz..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                ></textarea>
                                <button className="absolute bottom-3 right-3 p-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors">
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}
