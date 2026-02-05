"use client"

import { useState, useEffect } from "react"
import { Building2, MessageSquare, Plus, Edit, Trash2, ArrowUp, ArrowDown, Save, X, Check, Loader2, Star, Quote } from "lucide-react"
import ImageUploader from "@/components/admin/ImageUploader"

interface Client {
    id: number
    name: string
    company: string
    logo_url: string
    order: number
}

interface Testimonial {
    id: number
    author: string
    role: string
    company: string
    content: string
    avatarUrl: string
    rating: number
    order: number
    isActive: boolean
}

export default function ReferencesPage() {
    const [activeTab, setActiveTab] = useState<'brands' | 'testimonials'>('brands')

    // Data States
    const [clients, setClients] = useState<Client[]>([])
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [loading, setLoading] = useState(true)

    // Edit/Create States
    const [isEditing, setIsEditing] = useState(false)
    const [editItem, setEditItem] = useState<any>(null) // For testimonial form

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        try {
            const [clientsRes, testimonialsRes] = await Promise.all([
                fetch('/api/clients'),
                fetch('/api/testimonials')
            ])

            const clientsData = await clientsRes.json()
            const testimonialsData = await testimonialsRes.json()

            // Sort clients client-side as fallback
            const sortedClients = Array.isArray(clientsData) ? clientsData.sort((a: any, b: any) => (a.order || 0) - (b.order || 0)) : []
            setClients(sortedClients)
            setTestimonials(Array.isArray(testimonialsData) ? testimonialsData : [])

        } catch (error) {
            console.error('Failed to load data:', error)
        } finally {
            setLoading(false)
        }
    }

    // --- Brand Ordering Logic ---
    const moveClient = async (index: number, direction: 'up' | 'down') => {
        const newClients = [...clients]
        const targetIndex = direction === 'up' ? index - 1 : index + 1

        if (targetIndex < 0 || targetIndex >= newClients.length) return;

        // Swap items
        [newClients[index], newClients[targetIndex]] = [newClients[targetIndex], newClients[index]]

        // Update 'order' property
        const updatedClients = newClients.map((client, idx) => ({ ...client, order: idx }))
        setClients(updatedClients)

        // Save order to server
        try {
            await fetch('/api/clients/reorder', {
                method: 'POST',
                body: JSON.stringify({ items: updatedClients.map(c => ({ id: c.id, order: c.order })) })
            })
        } catch (error) {
            console.error('Failed to save order:', error)
            alert('Sıralama kaydedilemedi!')
        }
    }

    // --- Testimonial CRUD Logic ---
    const handleSaveTestimonial = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editItem) return

        try {
            const url = editItem.id ? `/api/testimonials/${editItem.id}` : '/api/testimonials'
            const method = editItem.id ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editItem)
            })

            if (!res.ok) throw new Error('Failed to save')

            setIsEditing(false)
            setEditItem(null)
            loadData()
        } catch (error) {
            alert('Hata oluştu!')
        }
    }

    const handleDeleteTestimonial = async (id: number) => {
        if (!confirm('Silmek istediğinize emin misiniz?')) return
        try {
            await fetch(`/api/testimonials/${id}`, { method: 'DELETE' })
            loadData()
        } catch (error) {
            alert('Silinemedi!')
        }
    }

    // --- Render ---
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Referanslar & Yorumlar</h1>
                    <p className="text-muted-foreground">Marka sıralaması ve müşteri yorumlarını yönetin.</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-border">
                <button
                    onClick={() => setActiveTab('brands')}
                    className={`pb-4 px-4 font-medium transition-colors relative ${activeTab === 'brands' ? 'text-emerald-500' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    <Building2 className="w-5 h-5 inline-block mr-2" />
                    Markalar
                    {activeTab === 'brands' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-t-full" />}
                </button>
                <button
                    onClick={() => setActiveTab('testimonials')}
                    className={`pb-4 px-4 font-medium transition-colors relative ${activeTab === 'testimonials' ? 'text-emerald-500' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    <MessageSquare className="w-5 h-5 inline-block mr-2" />
                    Müşteri Yorumları
                    {activeTab === 'testimonials' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-t-full" />}
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                </div>
            ) : (
                <>
                    {/* --- BRANDS TAB --- */}
                    {activeTab === 'brands' && (
                        <div>
                            <div className="bg-emerald-900/10 border border-emerald-900/20 text-emerald-400 p-4 rounded-xl mb-6 text-sm flex items-start gap-3">
                                <ArrowUp className="w-5 h-5 shrink-0" />
                                <div>
                                    <p className="font-bold">Nasıl Sıralanır?</p>
                                    <p>Markaları yukarı/aşağı butonlarını kullanarak sıralayabilirsiniz. Değişiklikler anında kaydedilir.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {clients.map((client, index) => (
                                    <div key={client.id} className="bg-card border border-border p-4 rounded-xl flex items-center justify-between group hover:border-emerald-500/30 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                                                {index + 1}
                                            </span>
                                            {client.logo_url ? (
                                                <img src={client.logo_url} alt={client.name} className="h-10 w-24 object-contain" />
                                            ) : (
                                                <span className="font-bold text-foreground">{client.company || client.name}</span>
                                            )}
                                        </div>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => moveClient(index, 'up')}
                                                disabled={index === 0}
                                                className="p-2 hover:bg-muted rounded-lg disabled:opacity-30 disabled:cursor-not-allowed text-muted-foreground hover:text-foreground"
                                            >
                                                <ArrowUp className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => moveClient(index, 'down')}
                                                disabled={index === clients.length - 1}
                                                className="p-2 hover:bg-muted rounded-lg disabled:opacity-30 disabled:cursor-not-allowed text-muted-foreground hover:text-foreground"
                                            >
                                                <ArrowDown className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- TESTIMONIALS TAB --- */}
                    {activeTab === 'testimonials' && (
                        <div>
                            {!isEditing ? (
                                <>
                                    <div className="flex justify-end mb-6">
                                        <button
                                            onClick={() => {
                                                setEditItem({ author: '', role: '', company: '', content: '', rating: 5, avatarUrl: '' })
                                                setIsEditing(true)
                                            }}
                                            className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-600 transition-colors flex items-center gap-2"
                                        >
                                            <Plus className="w-4 h-4" /> Yeni Yorum Ekle
                                        </button>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        {testimonials.map(testimonial => (
                                            <div key={testimonial.id} className="bg-card border border-border p-6 rounded-xl relative group">
                                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => {
                                                            setEditItem(testimonial)
                                                            setIsEditing(true)
                                                        }}
                                                        className="p-2 bg-muted rounded-lg hover:bg-emerald-500 hover:text-white transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteTestimonial(testimonial.id)}
                                                        className="p-2 bg-muted rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <div className="flex items-start gap-4 mb-4">
                                                    {testimonial.avatarUrl ? (
                                                        <img src={testimonial.avatarUrl} alt={testimonial.author} className="w-12 h-12 rounded-full object-cover" />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold text-xl">
                                                            {testimonial.author.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h3 className="font-bold text-foreground">{testimonial.author}</h3>
                                                        <p className="text-sm text-emerald-500">{testimonial.role} {testimonial.company && `at ${testimonial.company}`}</p>
                                                    </div>
                                                </div>

                                                <div className="flex mb-3">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-700'}`} />
                                                    ))}
                                                </div>

                                                <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                                            </div>
                                        ))}
                                        {testimonials.length === 0 && (
                                            <div className="col-span-full text-center py-12 text-muted-foreground">
                                                Henüz müşteri yorumu eklenmemiş.
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                /* --- EDIT FORM --- */
                                <div className="max-w-2xl mx-auto bg-card border border-border p-8 rounded-xl">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold flex items-center gap-2">
                                            {editItem.id ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                            {editItem.id ? 'Yorumu Düzenle' : 'Yeni Yorum Ekle'}
                                        </h2>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="p-2 hover:bg-muted rounded-full"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSaveTestimonial} className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-slate-400">Yazar Adı Soyadı</label>
                                                <input
                                                    type="text"
                                                    value={editItem.author}
                                                    onChange={e => setEditItem({ ...editItem, author: e.target.value })}
                                                    required
                                                    className="w-full bg-background border border-border rounded-lg px-4 py-2"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-slate-400">Unvan (Role)</label>
                                                <input
                                                    type="text"
                                                    value={editItem.role || ''}
                                                    onChange={e => setEditItem({ ...editItem, role: e.target.value })}
                                                    className="w-full bg-background border border-border rounded-lg px-4 py-2"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-slate-400">Şirket</label>
                                                <input
                                                    type="text"
                                                    value={editItem.company || ''}
                                                    onChange={e => setEditItem({ ...editItem, company: e.target.value })}
                                                    className="w-full bg-background border border-border rounded-lg px-4 py-2"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-slate-400">Puan (1-5)</label>
                                                <select
                                                    value={editItem.rating}
                                                    onChange={e => setEditItem({ ...editItem, rating: parseInt(e.target.value) })}
                                                    className="w-full bg-background border border-border rounded-lg px-4 py-2"
                                                >
                                                    {[5, 4, 3, 2, 1].map(r => (
                                                        <option key={r} value={r}>{r} Yıldız</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1 text-slate-400">Yorum Metni</label>
                                            <textarea
                                                value={editItem.content}
                                                onChange={e => setEditItem({ ...editItem, content: e.target.value })}
                                                required
                                                rows={4}
                                                className="w-full bg-background border border-border rounded-lg px-4 py-2"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1 text-slate-400">Avatar Görseli</label>
                                            <ImageUploader
                                                value={editItem.avatarUrl}
                                                onChange={(url) => setEditItem({ ...editItem, avatarUrl: url })}
                                            />
                                        </div>

                                        <div className="flex justify-end gap-3 pt-4 border-t border-border">
                                            <button
                                                type="button"
                                                onClick={() => setIsEditing(false)}
                                                className="px-6 py-2 rounded-lg text-slate-400 hover:text-foreground font-medium"
                                            >
                                                İptal
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-6 py-2 bg-emerald-500 text-white rounded-lg font-bold hover:bg-emerald-600 transition-colors flex items-center gap-2"
                                            >
                                                <Save className="w-4 h-4" /> Kaydet
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
