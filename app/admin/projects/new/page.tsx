"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { ArrowLeft, Save, Briefcase, Globe, FileText } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function NewProjectPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [clients, setClients] = useState<any[]>([])
    const [formData, setFormData] = useState({
        internalName: "",
        publicTitle: "",
        client_id: "",
        description: "",
        content: "",
        status: "in_progress",
        budget: "",
        start_date: new Date().toISOString().split('T')[0],
        end_date: "",
        priority: "medium",
    })

    useEffect(() => {
        fetch('/api/clients')
            .then(res => res.json())
            .then(data => setClients(Array.isArray(data) ? data : []))
            .catch(err => {
                console.error('Error fetching clients:', err)
                setClients([])
            })
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const payload = {
                ...formData,
                name: formData.internalName, // fallback
                title: formData.publicTitle, // fallback
                client_id: formData.client_id ? parseInt(formData.client_id) : null,
                budget: formData.budget ? parseFloat(formData.budget) : null,
            }

            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (!res.ok) throw new Error('Eklenemedi')

            alert('Proje başarıyla eklendi!')
            router.push('/admin/projects')
            router.refresh()
        } catch (error) {
            alert('Bir hata oluştu!')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <Link
                    href="/admin/projects"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-foreground transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Projelere Dön
                </Link>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                    <Briefcase className="w-8 h-8 text-emerald-500" />
                    Yeni Proje Ekle
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-card border border-border rounded-notebook p-6 space-y-4">
                    <h2 className="text-lg font-bold text-foreground border-b border-border pb-3">
                        Temel Bilgiler
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Internal Name */}
                        <div className="md:col-span-2">
                            <label className="block text-slate-400 text-sm font-medium mb-2">
                                Link / Takip İsmi (Sadece Admin Görür) *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.internalName}
                                onChange={(e) => setFormData({ ...formData, internalName: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500 font-mono text-sm"
                                placeholder="Örn: 2026_Revize_VogoAgency"
                            />
                            <p className="text-xs text-slate-500 mt-1">Bu isim sadece yönetim panelinde görünür.</p>
                        </div>

                        {/* Public Title */}
                        <div className="md:col-span-2 bg-slate-50/5 p-4 rounded-xl border border-dashed border-border">
                            <label className="block text-emerald-400 text-sm font-bold mb-2 flex items-center gap-2">
                                <Globe className="w-4 h-4" />
                                Site Başlığı (Müşteri Görür) *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.publicTitle}
                                onChange={(e) => setFormData({ ...formData, publicTitle: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xl font-bold text-foreground focus:outline-none focus:border-emerald-500"
                                placeholder="Örn: Profesyonel E-Ticaret Çözümü"
                            />
                            <p className="text-xs text-slate-500 mt-1">Sitede yayınlanacak ana başlık budur.</p>
                        </div>

                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">Müşteri</label>
                            <select
                                value={formData.client_id}
                                onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
                            >
                                <option value="">Seçiniz (Opsiyonel)</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>
                                        {client.name} {client.company ? `(${client.company})` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">Durum</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
                            >
                                <option value="quote">Teklif Aşamasında</option>
                                <option value="in_progress">Devam Ediyor</option>
                                <option value="completed">Tamamlandı</option>
                                <option value="cancelled">İptal</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">Başlangıç Tarihi</label>
                            <input
                                type="date"
                                value={formData.start_date}
                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">Bitiş Tarihi</label>
                            <input
                                type="date"
                                value={formData.end_date}
                                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-notebook p-6 space-y-4">
                    <h2 className="text-lg font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-400" />
                        İçerik Detayları
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">Kısa Açıklama (Liste Görünümü)</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500 h-24 resize-none"
                                placeholder="Projenin 1-2 cümlelik özeti..."
                            />
                        </div>

                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">Detaylı İçerik (HTML)</label>
                            <textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500 h-64 font-mono text-sm"
                                placeholder="<p>Proje detayları buraya HTML formatında gelebilir veya düz metin yazabilirsiniz.</p>"
                            />
                            <p className="text-xs text-slate-500 mt-2">İleriki aşamada buraya Rich Text Editor eklenecek.</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                    >
                        <Save className="w-5 h-5" />
                        {loading ? 'Kaydediliyor...' : 'Projeyi Kaydet'}
                    </button>
                    <Link
                        href="/admin/projects"
                        className="px-6 py-3 bg-muted hover:bg-muted text-foreground rounded-xl font-bold transition-all border border-border"
                    >
                        İptal
                    </Link>
                </div>
            </form>
        </div>
    )
}
