"use client"

import { useState, useEffect, use } from "react"
import { ArrowLeft, Save, UserCheck, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import ImageUpload from "@/components/ImageUpload"

export default function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
    // Next.js 15+ Params Handling
    const { id } = use(params)
    const router = useRouter()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        company: "",
        email: "",
        phone: "",
        address: "",
        website: "",
        status: "potential",
        logo_url: "",
        tags: [] as string[],
        notes: ""
    })

    useEffect(() => {
        fetchClient()
    }, [])

    const fetchClient = async () => {
        try {
            const res = await fetch(`/api/clients/${id}`)
            const data = await res.json()
            if (data.error) throw new Error(data.error)

            // Populate form
            setFormData({
                name: data.name || "",
                company: data.company || "",
                email: data.email || "",
                phone: data.phone || "",
                address: data.address || "",
                website: data.website || "",
                status: data.status || "potential",
                logo_url: data.logo_url || "",
                tags: data.tags || [],
                notes: data.notes || ""
            })
        } catch (error) {
            console.error('Fetch error:', error)
            alert('Müşteri bilgileri alınamadı!')
            router.push('/admin/clients')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const res = await fetch('/api/clients', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...formData })
            })

            if (!res.ok) throw new Error('Güncellenemedi')

            alert('Müşteri başarıyla güncellendi!')
            router.push(`/admin/clients/${id}`)
            router.refresh()
        } catch (error) {
            alert('Bir hata oluştu!')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Yükleniyor...</div>
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <Link
                    href={`/admin/clients/${id}`}
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-foreground transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Profile Dön
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                            <UserCheck className="w-8 h-8 text-emerald-500" />
                            Müşteriyi Düzenle
                        </h1>
                        <p className="text-slate-400 mt-1">{formData.name || 'Müşteri'} bilgilerini güncelleyin</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Temel Bilgiler */}
                <div className="bg-card border border-border rounded-notebook p-6 space-y-4">
                    <h2 className="text-lg font-bold text-foreground border-b border-border pb-3">
                        Temel Bilgiler
                    </h2>

                    <div className="mb-6">
                        <ImageUpload
                            label="Firma Logosu"
                            value={formData.logo_url}
                            onChange={(url) => setFormData(prev => ({ ...prev, logo_url: url }))}
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">
                                İsim Soyisim *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">
                                Şirket
                            </label>
                            <input
                                type="text"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">
                                E-posta
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">
                                Telefon
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-slate-400 text-sm font-medium mb-2">
                            Web Sitesi
                        </label>
                        <input
                            type="url"
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 text-sm font-medium mb-2">
                            Adres
                        </label>
                        <textarea
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500 h-20 resize-none"
                        />
                    </div>
                </div>

                {/* Durum */}
                <div className="bg-card border border-border rounded-notebook p-6 space-y-4">
                    <h2 className="text-lg font-bold text-foreground border-b border-border pb-3">
                        Durum
                    </h2>

                    <div>
                        <label className="block text-slate-400 text-sm font-medium mb-2">
                            Müşteri Durumu
                        </label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
                        >
                            <option value="potential">Potansiyel</option>
                            <option value="active">Aktif</option>
                            <option value="inactive">Pasif</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-slate-400 text-sm font-medium mb-2">
                            Notlar
                        </label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500 h-32 resize-none"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                    >
                        <Save className="w-5 h-5" />
                        {saving ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
                    </button>
                    <Link
                        href={`/admin/clients/${id}`}
                        className="px-6 py-3 bg-muted hover:bg-muted text-foreground rounded-xl font-bold transition-all border border-border"
                    >
                        İptal
                    </Link>
                </div>
            </form>
        </div>
    )
}
