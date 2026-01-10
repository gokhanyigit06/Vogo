"use client"

import { useState } from "react"
import { ArrowLeft, Save, Send, Image as ImageIcon, FileText, Tag, AlignLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import ImageUploader from "@/components/admin/ImageUploader"
import RichTextEditor from "@/components/admin/RichTextEditor"

// Türkçe karakter slug dönüştürme
function generateSlug(text: string): string {
    const turkishMap: { [key: string]: string } = {
        'ş': 's', 'Ş': 's',
        'ğ': 'g', 'Ğ': 'g',
        'ü': 'u', 'Ü': 'u',
        'ı': 'i', 'İ': 'i',
        'ö': 'o', 'Ö': 'o',
        'ç': 'c', 'Ç': 'c'
    }

    return text
        .split('')
        .map(char => turkishMap[char] || char)
        .join('')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-16 z-20 bg-background/80 backdrop-blur-md py-4 -my-4 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <Link href="/admin/blog" className="p-2 hover:bg-card rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Yeni Yazı Ekle</h1>
                        <p className="text-muted-foreground text-sm">Blogunuz için yeni bir içerik oluşturun.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-muted text-muted-foreground rounded-xl hover:bg-slate-700 transition-colors font-medium flex items-center gap-2">
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
                    <div className="bg-card border border-border rounded-notebook p-6 shadow-sm">
                        <label className="block text-muted-foreground text-sm font-medium mb-2">Yazı Başlığı</label>
                        <input
                            type="text"
                            placeholder="Müşterileri Etkileyecek 10 Web Tasarım İpucu..."
                            className="w-full bg-background border border-border rounded-xl px-4 py-4 text-foreground text-lg font-bold placeholder:font-normal focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-600"
                            value={formData.title}
                            onChange={(e) => {
                                const newTitle = e.target.value
                                setFormData({
                                    ...formData,
                                    title: newTitle,
                                    slug: generateSlug(newTitle)
                                })
                            }}
                        />
                        <p className="mt-2 text-xs text-slate-500 flex justify-between">
                            <span>Önerilen uzunluk: 40-60 karakter</span>
                            <span>{formData.title.length} karakter</span>
                        </p>
                        {formData.slug && (
                            <div className="mt-3 p-2 bg-background rounded-lg border border-border">
                                <span className="text-xs text-slate-500">URL: </span>
                                <span className="text-xs text-emerald-400 font-mono">
                                    vogo.com/blog/{formData.slug}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Content Editor (TipTap) */}
                    <div className="space-y-2">
                        <label className="block text-muted-foreground text-sm font-medium mb-1 pl-1">İçerik</label>
                        <RichTextEditor
                            content={formData.content}
                            onChange={(html) => setFormData({ ...formData, content: html })}
                            placeholder="Hikayenizi anlatın..."
                        />
                    </div>
                </div>

                {/* Sidebar Settings (Right, 1/3) */}
                <div className="space-y-6">

                    {/* Category & Status */}
                    <div className="bg-card border border-border rounded-notebook p-6 space-y-4">
                        <h3 className="font-bold text-foreground flex items-center gap-2 text-sm border-b border-border pb-3">
                            <Tag className="w-4 h-4 text-emerald-500" />
                            Yayın Ayarları
                        </h3>

                        <div>
                            <label className="block text-muted-foreground text-xs font-bold mb-2 uppercase">Kategori</label>
                            <select
                                className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-muted-foreground focus:outline-none focus:border-emerald-500"
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
                            <label className="block text-muted-foreground text-xs font-bold mb-2 uppercase">Durum</label>
                            <select
                                className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-muted-foreground focus:outline-none focus:border-emerald-500"
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
                    <div className="bg-card border border-border rounded-notebook p-6 space-y-4">
                        <h3 className="font-bold text-foreground flex items-center gap-2 text-sm border-b border-border pb-3">
                            <ImageIcon className="w-4 h-4 text-emerald-500" />
                            Kapak Görseli
                        </h3>
                        <ImageUploader
                            value={formData.image}
                            onChange={(url) => setFormData({ ...formData, image: url })}
                        />
                    </div>

                    {/* Excerpt (SEO) */}
                    <div className="bg-card border border-border rounded-notebook p-6 space-y-4">
                        <h3 className="font-bold text-foreground flex items-center gap-2 text-sm border-b border-border pb-3">
                            <FileText className="w-4 h-4 text-emerald-500" />
                            Özet (SEO Açıklaması)
                        </h3>
                        <textarea
                            placeholder="Yazının kısa bir özeti..."
                            className="w-full bg-background border border-border rounded-xl px-3 py-3 text-sm text-muted-foreground focus:outline-none focus:border-emerald-500 h-24 resize-none placeholder:text-slate-600"
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        />
                    </div>

                </div>
            </div>
        </div>
    )
}

