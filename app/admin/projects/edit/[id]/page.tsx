"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { ArrowLeft, Save, Briefcase, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import ImageUploader from "@/components/admin/ImageUploader"
import MultiImageUploader from "@/components/admin/MultiImageUploader"
import TagsInput from "@/components/admin/TagsInput"
import CategorySelect from "@/components/admin/CategorySelect"

export default function EditProjectPage() {
    const router = useRouter()
    const params = useParams()
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [clients, setClients] = useState<any[]>([])

    const [formData, setFormData] = useState({
        internalName: "",
        publicTitle: "",
        clientId: "",
        description: "",
        content: "",
        status: "in_progress",
        categories: [] as string[],
        budget: "",
        start_date: "",
        end_date: "",
        priority: "medium",
        // Premium fields
        heroImage: "",
        image: "",
        year: new Date().getFullYear().toString(),
        services: [] as string[],
        // New metadata fields
        market: "",
        clientType: "",
        websiteUrl: "",
        gallery: [] as string[],
    })

    useEffect(() => {
        const id = params.id
        if (!id) return

        const loadData = async () => {
            try {
                // Clients Fetch
                let clientsData = []
                try {
                    const cRes = await fetch('/api/clients')
                    const cData = await cRes.json()
                    if (Array.isArray(cData) && cData.length > 0) clientsData = cData
                } catch (e) {
                    console.error("Clients fetch error", e)
                }
                setClients(clientsData)

                // Project Fetch
                const pRes = await fetch(`/api/projects?id=${id}`)
                if (!pRes.ok) throw new Error('Proje bulunamadı')

                const projectData = await pRes.json()

                if (!projectData || !projectData.id) throw new Error('Proje verisi geçersiz')

                // Form Data Set
                const startDate = projectData.start_date ? new Date(projectData.start_date).toISOString().split('T')[0] : ""
                const endDate = projectData.end_date ? new Date(projectData.end_date).toISOString().split('T')[0] : ""

                setFormData({
                    internalName: projectData.name || "",
                    publicTitle: projectData.publicTitle || projectData.title || "",
                    clientId: projectData.clientId || projectData.client_id || "",
                    description: projectData.description || "",
                    content: projectData.content || "",
                    status: projectData.status || "in_progress",
                    categories: Array.isArray(projectData.categories) && projectData.categories.length > 0
                        ? projectData.categories
                        : (projectData.category ? [projectData.category] : []),
                    budget: projectData.budget || "",
                    start_date: startDate,
                    end_date: endDate,
                    priority: projectData.priority || "medium",

                    heroImage: projectData.heroImage || "",
                    image: projectData.image || "",
                    year: projectData.year || "",
                    services: Array.isArray(projectData.services) ? projectData.services : [],
                    market: projectData.market || "",
                    clientType: projectData.clientType || "",
                    websiteUrl: projectData.websiteUrl || "",
                    gallery: Array.isArray(projectData.gallery) ? projectData.gallery : [],
                })
                setLoading(false)

            } catch (err) {
                console.error(err)
                alert('Veriler yüklenirken hata oluştu')
                setLoading(false)
            }
        }

        loadData()
    }, [params.id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            const payload = {
                id: params.id,
                ...formData,
                name: formData.internalName,
                title: formData.publicTitle,
                clientId: formData.clientId ? parseInt(formData.clientId as string) : null,
                budget: formData.budget ? parseFloat(formData.budget as string) : null,
            }

            const res = await fetch('/api/projects', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.error || 'Güncellenemedi')
            }

            alert('Proje başarıyla güncellendi!')
            router.push(`/admin/projects/${params.id}`)
            router.refresh()
        } catch (error: any) {
            console.error(error)
            alert(`Bir hata oluştu: ${error.message}`)
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground">Yükleniyor...</div>
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <Link
                    href={`/admin/projects/${params.id}`}
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Projeye Dön
                </Link>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                    <Briefcase className="w-8 h-8 text-emerald-500" />
                    Projeyi Düzenle
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-card border border-border rounded-notebook p-6 space-y-4 shadow-sm">
                    <h2 className="text-lg font-bold text-foreground border-b border-border pb-3">
                        Proje Bilgileri
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-muted-foreground text-sm font-medium mb-2">Proje Adı (Internal) *</label>
                            <input
                                type="text"
                                required
                                value={formData.internalName}
                                onChange={(e) => setFormData({ ...formData, internalName: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-slate-400 text-sm font-medium mb-2">Görünür Başlık (Public)</label>
                            <input
                                type="text"
                                required
                                value={formData.publicTitle}
                                onChange={(e) => setFormData({ ...formData, publicTitle: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-muted-foreground text-sm font-medium mb-2">Müşteri</label>
                            <select
                                value={formData.clientId}
                                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
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
                            <label className="block text-muted-foreground text-sm font-medium mb-2">Durum</label>
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
                            <label className="block text-slate-400 text-sm font-medium mb-2">Kategoriler</label>
                            <CategorySelect
                                value={formData.categories}
                                onChange={(cats) => setFormData({ ...formData, categories: cats })}
                            />
                        </div>

                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">Hero Görsel (Detay Sayfası)</label>
                            <ImageUploader
                                value={formData.heroImage}
                                onChange={(url) => setFormData({ ...formData, heroImage: url })}
                            />
                        </div>

                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">Liste/Kart Görseli (Öne Çıkan)</label>
                            <ImageUploader
                                value={formData.image}
                                onChange={(url) => setFormData({ ...formData, image: url })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 col-span-2 md:col-span-2">
                            <div>
                                <label className="block text-slate-400 text-sm font-medium mb-2">Yıl</label>
                                <input
                                    type="text"
                                    value={formData.year}
                                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-400 text-sm font-medium mb-2">Market/Bölge</label>
                                <input
                                    type="text"
                                    value={formData.market}
                                    onChange={(e) => setFormData({ ...formData, market: e.target.value })}
                                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 col-span-2 md:col-span-2">
                            <div>
                                <label className="block text-slate-400 text-sm font-medium mb-2">Client Type</label>
                                <input
                                    type="text"
                                    value={formData.clientType}
                                    onChange={(e) => setFormData({ ...formData, clientType: e.target.value })}
                                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-400 text-sm font-medium mb-2">Website URL</label>
                                <input
                                    type="url"
                                    value={formData.websiteUrl}
                                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                        </div>

                        <div className="col-span-2 md:col-span-2">
                            <label className="block text-slate-400 text-sm font-medium mb-2">Hizmetler</label>
                            <TagsInput
                                value={formData.services}
                                onChange={(tags) => setFormData({ ...formData, services: tags })}
                                placeholder="Hizmet yazıp Enter'a basın..."
                            />
                        </div>

                        <div className="col-span-2 md:col-span-2">
                            <label className="block text-slate-400 text-sm font-medium mb-2">Galeri Görselleri</label>
                            <MultiImageUploader
                                value={formData.gallery}
                                onChange={(urls) => setFormData({ ...formData, gallery: urls })}
                            />
                        </div>

                        <div>
                            <label className="block text-muted-foreground text-sm font-medium mb-2">Başlangıç Tarihi</label>
                            <input
                                type="date"
                                value={formData.start_date}
                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-muted-foreground text-sm font-medium mb-2">Bitiş Tarihi</label>
                            <input
                                type="date"
                                value={formData.end_date}
                                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-muted-foreground text-sm font-medium mb-2">Bütçe (TRY)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.budget}
                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-muted-foreground text-sm font-medium mb-2">Öncelik</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
                            >
                                <option value="low">Düşük</option>
                                <option value="medium">Orta</option>
                                <option value="high">Yüksek</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-muted-foreground text-sm font-medium mb-2">Açıklama</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500 h-32 resize-none"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-slate-400 text-sm font-medium mb-2">Detaylı İçerik (HTML)</label>
                            <textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500 h-64 font-mono text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading || submitting}
                        className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                    >
                        <Save className="w-5 h-5" />
                        {submitting ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                    </button>

                    <button
                        type="button"
                        onClick={async () => {
                            if (!window.confirm('Bu projeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!')) return

                            setSubmitting(true)
                            try {
                                const res = await fetch(`/api/projects?id=${params.id}`, { method: 'DELETE' })
                                if (!res.ok) throw new Error('Silinemedi')
                                router.push('/admin/projects')
                                router.refresh()
                            } catch (error) {
                                alert('Silinirken hata oluştu')
                                setSubmitting(false)
                            }
                        }}
                        className="px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold transition-all border border-red-200 flex items-center gap-2"
                    >
                        <Trash2 className="w-5 h-5" />
                        Projeyi Sil
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
