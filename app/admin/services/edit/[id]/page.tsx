"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Save, Trash2, Layers, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"

export default function EditServicePage() {
    const router = useRouter()
    const params = useParams()
    const { id } = params

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [formData, setFormData] = useState<any>({
        title: "",
        slug: "",
        desc: "",
        icon: "Layers",
        status: "Aktif"
    })

    // Veriyi Getir
    useEffect(() => {
        // Tekil GET API olmadığı için tüm listeyi çekip filtreliyoruz (Geçici çözüm)
        // İdealde: /api/services?id=1 gibi olmalı
        const fetchData = async () => {
            try {
                const res = await fetch('/api/services')
                const data = await res.json()
                const service = data.find((item: any) => item.id == id)
                if (service) {
                    setFormData(service)
                } else {
                    alert("Hizmet bulunamadı!")
                    router.push('/admin/services')
                }
            } catch (error) {
                console.error("Veri çekme hatası:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [id, router])

    // Güncelle (PUT)
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            const res = await fetch('/api/services', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (!res.ok) throw new Error('Güncellenemedi')

            alert("Hizmet başarıyla güncellendi!")
            router.push('/admin/services')
            router.refresh()
        } catch (error) {
            console.error(error)
            alert("Bir hata oluştu!")
        } finally {
            setSaving(false)
        }
    }

    // Sil (DELETE)
    const handleDelete = async () => {
        if (!confirm("Bu hizmeti silmek istediğinize emin misiniz?")) return

        setDeleting(true)
        try {
            const res = await fetch(`/api/services?id=${id}`, {
                method: 'DELETE',
            })

            if (!res.ok) throw new Error('Silinemedi')

            alert("Hizmet silindi.")
            router.push('/admin/services')
            router.refresh()
        } catch (error) {
            console.error(error)
            alert("Silme işlemi başarısız!")
        } finally {
            setDeleting(false)
        }
    }

    if (loading) return <div className="p-8 text-white">Yükleniyor...</div>

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/services" className="p-2 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Layers className="w-6 h-6 text-emerald-500" />
                            Hizmeti Düzenle
                        </h1>
                        <p className="text-slate-400 text-sm">#{id} numaralı hizmet kaydını düzenliyorsunuz.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-bold transition-all border border-red-500/20 flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" /> {deleting ? 'Siliniyor...' : 'Sil'}
                    </button>
                    <button
                        onClick={handleUpdate}
                        disabled={saving}
                        className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" /> {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                    </button>
                </div>
            </div>

            {/* Form */}
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">Hizmet Adı</label>
                            <input
                                type="text"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">Slug (URL)</label>
                            <input
                                type="text"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-400 focus:outline-none focus:border-emerald-500"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">Kısa Açıklama</label>
                            <textarea
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 h-32 resize-none"
                                value={formData.desc}
                                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                        <label className="block text-slate-400 text-sm font-medium mb-2">Durum</label>
                        <select
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="Aktif">Aktif</option>
                            <option value="Pasif">Pasif</option>
                            <option value="Beta">Beta</option>
                        </select>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                        <label className="block text-slate-400 text-sm font-medium mb-2">İkon Adı (Lucide React)</label>
                        <input
                            type="text"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                            placeholder="Örn: Globe, Monitor, Code"
                            value={formData.icon}
                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        />
                        <p className="text-xs text-slate-500">Lucide ikon setinden bir isim girin.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
