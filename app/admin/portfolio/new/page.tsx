"use client"

import { useState } from "react"
import { ArrowLeft, Save, Send, Image as ImageIcon, Briefcase, Tag, AlignLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import ImageUploader from "@/components/admin/ImageUploader"

export default function NewProjectPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        client: "",
        category: "Web Tasarım",
        image: "",
        desc: ""
    })

    const handlePublish = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (!res.ok) throw new Error('Proje eklenemedi')

            alert("Proje başarıyla eklendi!")
            router.push('/admin/portfolio')
            router.refresh()
        } catch (error) {
            console.error(error)
            alert("Bir hata oluştu!")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b border-border">
                <div className="flex items-center gap-4">
                    <Link href="/admin/portfolio" className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-xl transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">Yeni Proje Ekle</h1>
                        <p className="text-muted-foreground mt-1">Portfolyonuza yeni bir başarı hikayesi ekleyin.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/portfolio" className="px-6 py-2.5 rounded-xl border border-border text-foreground font-medium hover:bg-muted transition-colors">
                        İptal
                    </Link>
                    <button
                        onClick={handlePublish}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 active:scale-95"
                    >
                        {isSubmitting ? <span className="animate-pulse">Ekleniyor...</span> : <><Send className="w-4 h-4" /> Projeyi Yayınla</>}
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Sol: Genel Bilgiler */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-card border border-border rounded-notebook p-8 space-y-6 shadow-sm">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="block text-foreground text-sm font-bold ml-1">Proje Başlığı</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-border rounded-xl px-4 py-3.5 text-foreground focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"
                                    placeholder="Örn: A City AVM Web Sitesi"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="block text-foreground text-sm font-bold ml-1">Müşteri Adı</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-border rounded-xl px-4 py-3.5 text-foreground focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"
                                    placeholder="Örn: A City AVM"
                                    value={formData.client}
                                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-foreground text-sm font-bold ml-1">Kategori</label>
                            <div className="relative">
                                <select
                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-border rounded-xl px-4 py-3.5 text-foreground focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all appearance-none font-medium cursor-pointer"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    {["Web Tasarım", "Reklam Yönetimi", "E-Ticaret", "AI Çözümleri", "Marka", "Yazılım"].map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                    <Tag className="w-4 h-4" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-foreground text-sm font-bold ml-1">Açıklama (Kısa)</label>
                            <div className="relative">
                                <textarea
                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-border rounded-xl px-4 py-3.5 text-foreground focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all h-40 resize-none font-medium leading-relaxed"
                                    placeholder="Projenin amacı ve sonucu hakkında kısa bilgi..."
                                    value={formData.desc}
                                    onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                                />
                                <div className="absolute right-4 top-4 pointer-events-none text-muted-foreground">
                                    <AlignLeft className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sağ: Görsel */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-card border border-border rounded-notebook p-8 space-y-6 shadow-sm sticky top-8">
                        <div>
                            <h3 className="font-bold text-foreground flex items-center gap-2 text-lg mb-1">
                                <ImageIcon className="w-5 h-5 text-emerald-500" />
                                Proje Görseli
                            </h3>
                            <p className="text-muted-foreground text-sm mb-6">Projenizi en iyi yansıtan ana görseli yükleyin.</p>
                        </div>
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
