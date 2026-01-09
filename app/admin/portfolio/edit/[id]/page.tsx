"use client"

export const dynamic = "force-dynamic"
export const revalidate = 0

import { useState, useEffect } from "react"
import { ArrowLeft, Save, Trash2, Briefcase, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import ImageUploader from "@/components/admin/ImageUploader"

export default function EditProjectPage() {
    const router = useRouter()
    const params = useParams()
    const { id } = params

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [formData, setFormData] = useState<any>({
        title: "",
        client: "",
        category: "Web Tasarım",
        image: "",
        desc: ""
    })

    // Veriyi Getir
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/projects')
                const data = await res.json()
                const project = data.find((item: any) => item.id == id)
                if (project) {
                    setFormData(project)
                } else {
                    alert("Proje bulunamadı!")
                    router.push('/admin/portfolio')
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
            const res = await fetch('/api/projects', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (!res.ok) throw new Error('Güncellenemedi')

            alert("Proje güncellendi!")
            router.push('/admin/portfolio')
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
        if (!confirm("Bu projeyi silmek istediğinize emin misiniz?")) return

        setDeleting(true)
        try {
            const res = await fetch(`/api/projects?id=${id}`, {
                method: 'DELETE',
            })

            if (!res.ok) throw new Error('Silinemedi')

            alert("Proje silindi.")
            router.push('/admin/portfolio')
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
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-16 z-20 bg-slate-950/80 backdrop-blur-md py-4 -my-4 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <Link href="/admin/portfolio" className="p-2 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Projeyi Düzenle</h1>
                        <p className="text-slate-400 text-sm">#{id} numaralı proje üzerinde çalışıyorsunuz.</p>
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
                        className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 active:scale-95"
                    >
                        <Save className="w-4 h-4" /> {saving ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Sol: Genel Bilgiler */}
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">Proje Başlığı</label>
                            <input
                                type="text"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">Müşteri Adı</label>
                            <input
                                type="text"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                value={formData.client}
                                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">Kategori</label>
                            <select
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                {["Web Tasarım", "Reklam Yönetimi", "E-Ticaret", "AI Çözümleri", "Marka", "Yazılım"].map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                        <label className="block text-slate-400 text-sm font-medium mb-2">Açıklama (Kısa)</label>
                        <textarea
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 h-32 resize-none"
                            value={formData.desc || formData.description}
                            onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                        />
                    </div>
                </div>

                {/* Sağ: Görsel */}
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                        <h3 className="font-bold text-white flex items-center gap-2 text-sm border-b border-slate-800 pb-3">
                            <ImageIcon className="w-4 h-4 text-emerald-500" />
                            Proje Görseli
                        </h3>
                        <ImageUploader
                            value={formData.image}
                            onChange={(url) => setFormData({ ...formData, image: url })}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
