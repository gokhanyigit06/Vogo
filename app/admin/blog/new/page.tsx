"use client"

import { useState } from "react"
import { ArrowLeft, Save, Send, Image as ImageIcon, FileText, Tag, AlignLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function NewBlogPostPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        category: "Tasarım",
        status: "published", // published | draft
        image: "",
        excerpt: "",
        content: ""
    })

    const handlePublish = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    readTime: "5 dk" // Otomatik
                }),
            })

            if (!res.ok) throw new Error('Yazı yayınlanamadı')

            alert("Yazı başarıyla yayınlandı!")
            router.push('/admin/blog')
            router.refresh() // Verilerin güncellenmesi için
        } catch (error) {
            console.error(error)
            alert("Bir hata oluştu!")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">

            {/* Header & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-16 z-20 bg-slate-950/80 backdrop-blur-md py-4 -my-4 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <Link href="/admin/blog" className="p-2 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Yeni Yazı Ekle</h1>
                        <p className="text-slate-400 text-sm">Blogunuz için yeni bir içerik oluşturun.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors font-medium flex items-center gap-2">
                        <Save className="w-4 h-4" /> Taslak Kaydet
                    </button>
                    <button
                        onClick={handlePublish}
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 active:scale-95"
                    >
                        <Send className="w-4 h-4" /> {isSubmitting ? 'Yayınlanıyor...' : 'Yayınla'}
                    </button>
                </div>
            </div>

            {/* Editor Area */}
            <div className="grid lg:grid-cols-3 gap-8">

                {/* Main Content (Left, 2/3) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Title Input */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
                        <label className="block text-slate-400 text-sm font-medium mb-2">Yazı Başlığı</label>
                        <input
                            type="text"
                            placeholder="Müşterileri Etkileyecek 10 Web Tasarım İpucu..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 text-white text-lg font-bold placeholder:font-normal focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-600"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                        <p className="mt-2 text-xs text-slate-500 flex justify-between">
                            <span>Önerilen uzunluk: 40-60 karakter</span>
                            <span>{formData.title.length} karakter</span>
                        </p>
                    </div>

                    {/* Content Editor (Simple Textarea for now) */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col min-h-[500px]">
                        <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-4">
                            <span className="text-slate-400 text-sm font-medium flex items-center gap-2"><AlignLeft className="w-4 h-4" /> İçerik</span>
                            {/* Toolbar Placeholder */}
                            <div className="ml-auto flex gap-1">
                                {['B', 'I', 'U', 'H1', 'H2', 'Link'].map((tool) => (
                                    <button key={tool} className="w-8 h-8 rounded hover:bg-slate-800 text-slate-400 text-xs font-bold">{tool}</button>
                                ))}
                            </div>
                        </div>
                        <textarea
                            placeholder="İçeriğinizi buraya yazmaya başlayın..."
                            className="w-full flex-1 bg-transparent border-none text-slate-300 focus:ring-0 resize-none leading-relaxed placeholder:text-slate-700"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        />
                    </div>
                </div>

                {/* Sidebar Settings (Right, 1/3) */}
                <div className="space-y-6">

                    {/* Category & Status */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                        <h3 className="font-bold text-white flex items-center gap-2 text-sm border-b border-slate-800 pb-3">
                            <Tag className="w-4 h-4 text-emerald-500" />
                            Yayın Ayarları
                        </h3>

                        <div>
                            <label className="block text-slate-400 text-xs font-bold mb-2 uppercase">Kategori</label>
                            <select
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-300 focus:outline-none focus:border-emerald-500"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="Tasarım">Tasarım</option>
                                <option value="Yazılım">Yazılım</option>
                                <option value="SEO">SEO</option>
                                <option value="Pazarlama">Pazarlama</option>
                                <option value="E-Ticaret">E-Ticaret</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-slate-400 text-xs font-bold mb-2 uppercase">Durum</label>
                            <select
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-300 focus:outline-none focus:border-emerald-500"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="published">Yayında</option>
                                <option value="draft">Taslak</option>
                                <option value="archived">Arşiv</option>
                            </select>
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                        <h3 className="font-bold text-white flex items-center gap-2 text-sm border-b border-slate-800 pb-3">
                            <ImageIcon className="w-4 h-4 text-emerald-500" />
                            Kapak Görseli
                        </h3>

                        <div className="aspect-video bg-slate-950 border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-500 hover:border-emerald-500/50 hover:bg-slate-900/50 transition-all cursor-pointer group relative overflow-hidden">
                            {formData.image ? (
                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <>
                                    <ImageIcon className="w-8 h-8 mb-2 group-hover:text-emerald-500 transition-colors" />
                                    <span className="text-xs font-medium">Görsel Seç veya Sürükle</span>
                                </>
                            )}
                        </div>

                        <input
                            type="text"
                            placeholder="veya Görsel URL'i yapıştır..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        />
                    </div>

                    {/* Excerpt (SEO) */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                        <h3 className="font-bold text-white flex items-center gap-2 text-sm border-b border-slate-800 pb-3">
                            <FileText className="w-4 h-4 text-emerald-500" />
                            Özet (SEO Açıklaması)
                        </h3>
                        <textarea
                            placeholder="Yazının kısa bir özeti..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-sm text-slate-300 focus:outline-none focus:border-emerald-500 h-24 resize-none placeholder:text-slate-600"
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        />
                    </div>

                </div>
            </div>
        </div>
    )
}
