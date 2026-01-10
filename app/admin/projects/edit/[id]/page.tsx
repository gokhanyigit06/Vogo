"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { ArrowLeft, Save, Briefcase, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"

export default function EditProjectPage() {
    const router = useRouter()
    const params = useParams()
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [clients, setClients] = useState<any[]>([])

    const [formData, setFormData] = useState({
        name: "",
        client_id: "",
        description: "",
        status: "in_progress",
        budget: "",
        start_date: "",
        end_date: "",
        priority: "medium",
    })

    useEffect(() => {
        const id = params.id
        if (!id) return

        // Fetch Clients & Project Data in parallel
        Promise.all([
            fetch('/api/clients').then(res => res.json()),
            fetch(`/api/projects?id=${id}`).then(res => res.json())
        ]).then(([clientsData, projectData]) => {
            setClients(clientsData)

            // Format dates for input type="date"
            const startDate = projectData.start_date ? new Date(projectData.start_date).toISOString().split('T')[0] : ""
            const endDate = projectData.end_date ? new Date(projectData.end_date).toISOString().split('T')[0] : ""

            setFormData({
                name: projectData.name || "",
                client_id: projectData.client_id || "",
                description: projectData.description || "",
                status: projectData.status || "in_progress",
                budget: projectData.budget || "",
                start_date: startDate,
                end_date: endDate,
                priority: projectData.priority || "medium",
            })
            setLoading(false)
        }).catch(err => {
            console.error(err)
            alert('Veriler yüklenirken hata oluştu')
            setLoading(false)
        })

    }, [params.id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            const payload = {
                id: params.id,
                ...formData,
                client_id: formData.client_id ? parseInt(formData.client_id as string) : null,
                budget: formData.budget ? parseFloat(formData.budget as string) : null,
            }

            const res = await fetch('/api/projects', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (!res.ok) throw new Error('Güncellenemedi')

            alert('Proje başarıyla güncellendi!')
            router.push(`/admin/projects/${params.id}`)
            router.refresh()
        } catch (error) {
            alert('Bir hata oluştu!')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return <div className="p-8 text-center text-slate-400">Yükleniyor...</div>
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <Link
                    href={`/admin/projects/${params.id}`}
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Projeye Dön
                </Link>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Briefcase className="w-8 h-8 text-emerald-500" />
                    Projeyi Düzenle
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
                        Proje Bilgileri
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-slate-400 text-sm font-medium mb-2">Proje Adı *</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">Müşteri</label>
                            <select
                                value={formData.client_id}
                                onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
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
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
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
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">Bitiş Tarihi</label>
                            <input
                                type="date"
                                value={formData.end_date}
                                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">Bütçe (TRY)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.budget}
                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">Öncelik</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                            >
                                <option value="low">Düşük</option>
                                <option value="medium">Orta</option>
                                <option value="high">Yüksek</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-slate-400 text-sm font-medium mb-2">Açıklama</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 h-32 resize-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                    >
                        <Save className="w-5 h-5" />
                        {submitting ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
                    </button>
                    <Link
                        href={`/admin/projects/${params.id}`}
                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all border border-slate-700"
                    >
                        İptal
                    </Link>
                </div>
            </form>
        </div>
    )
}
