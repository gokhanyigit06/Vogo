"use client"

import { useState, useEffect } from "react"
import { Mail, Search, Star, Trash2, Reply, MoreHorizontal, User, Clock, Loader2 } from "lucide-react"

export default function MessagesAdminPage() {
    const [messages, setMessages] = useState<any[]>([])
    const [selectedId, setSelectedId] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadMessages()
    }, [])

    const loadMessages = () => {
        setLoading(true)
        fetch('/api/messages')
            .then(res => res.json())
            .then(data => {
                setMessages(data)
                setLoading(false)
                if (data.length > 0 && !selectedId) setSelectedId(data[0].id)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Bu mesajı silmek istediğinizden emin misiniz?')) return

        try {
            const res = await fetch('/api/messages', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            })

            if (res.ok) {
                setSelectedId(null)
                loadMessages()
            }
        } catch (error) {
            console.error('Delete error:', error)
        }
    }

    const markAsRead = async (id: number, is_read: boolean) => {
        try {
            await fetch('/api/messages', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, is_read })
            })
            loadMessages()
        } catch (error) {
            console.error('Mark as read error:', error)
        }
    }

    const selectedMessage = messages.find(m => m.id === selectedId)

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-64px)] items-center justify-center">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">

            {/* List */}
            <div className="w-full md:w-1/3 border-r border-border bg-card/50 flex flex-col">
                <div className="p-4 border-b border-border">
                    <h1 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                        <Mail className="w-5 h-5 text-emerald-500" /> Gelen Kutusu
                    </h1>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Mesajlarda ara..."
                            className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:border-emerald-500"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {messages.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 text-sm">Hiç mesaj yok.</div>
                    ) : (
                        messages.map((msg) => (
                            <div
                                key={msg.id}
                                onClick={() => setSelectedId(msg.id)}
                                className={`p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${selectedId === msg.id ? 'bg-emerald-500/5 border-l-2 border-l-emerald-500' : 'border-l-2 border-l-transparent'}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className={`text-sm font-bold ${!msg.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>{msg.name}</h4>
                                    <span className="text-xs text-slate-500">
                                        {new Date(msg.created_at || Date.now()).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                                    </span>
                                </div>
                                <p className={`text-sm mb-1 ${!msg.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>{msg.subject || 'Konu Yok'}</p>
                                <p className="text-xs text-slate-500 line-clamp-1">{msg.message}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Detail */}
            <div className="hidden md:flex flex-1 flex-col bg-background">
                {selectedMessage ? (
                    <>
                        <div className="h-16 border-b border-border flex items-center justify-between px-8 bg-card/50">
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground" title="Yanıtla">
                                    <Reply className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(selectedMessage.id)}
                                    className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-red-400"
                                    title="Sil"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-yellow-400"><Star className="w-5 h-5" /></button>
                                <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"><MoreHorizontal className="w-5 h-5" /></button>
                            </div>
                        </div>

                        <div className="flex-1 p-8 overflow-y-auto">
                            <h2 className="text-2xl font-bold text-foreground mb-6">{selectedMessage.subject || 'Başlıksız Mesaj'}</h2>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                    <User className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-foreground font-bold">{selectedMessage.name} <span className="text-slate-500 font-normal text-sm">&lt;{selectedMessage.email}&gt;</span></p>
                                    <p className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                                        <Clock className="w-3 h-3" /> {new Date(selectedMessage.created_at || Date.now()).toLocaleString('tr-TR')}
                                    </p>
                                </div>
                            </div>

                            <div className="prose prose-invert prose-emerald max-w-none text-muted-foreground leading-relaxed font-light whitespace-pre-wrap">
                                {selectedMessage.message}
                            </div>
                        </div>

                        <div className="p-4 border-t border-border bg-card/30">
                            <a href={`mailto:${selectedMessage.email}?subject=Ynt: ${selectedMessage.subject}`} className="inline-flex px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors items-center gap-2">
                                <Reply className="w-4 h-4" /> E-posta ile Yanıtla
                            </a>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-500">
                        <div className="text-center">
                            <Mail className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>Görüntülenecek mesaj yok.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

