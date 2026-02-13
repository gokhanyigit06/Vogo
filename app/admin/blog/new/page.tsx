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
        <div className="p-8 max-w-5xl mx-auto space-y-8 pb-20">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b border-border">
                <div className="flex items-center gap-4">
                    <Link href="/admin/blog" className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-xl transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">Yeni Yazı Ekle</h1>
                        <p className="text-muted-foreground mt-1">Blogunuz için yeni bir içerik oluşturun.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-muted/50 hover:bg-muted text-foreground border border-border rounded-xl transition-all font-medium flex items-center gap-2">
                        <Save className="w-4 h-4" /> Taslak
                    </button>
                    <button
                        onClick={handlePublish}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 active:scale-95"
                    >
                        {isSubmitting ? <span className="animate-pulse">Yayınlanıyor...</span> : <><Send className="w-4 h-4" /> Yayınla</>}
                    </button>
                </div>
            </div>

            {/* Editor Area */}
            <div className="grid lg:grid-cols-12 gap-8">

                {/* Main Content (Left, 8/12) */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Title Input */}
                    <div className="bg-card border border-border rounded-notebook p-8 shadow-sm space-y-4">
                        <div className="space-y-2">
                            <label className="block text-foreground text-sm font-bold ml-1">Yazı Başlığı</label>
                            <input
                                type="text"
                                placeholder="Müşterileri Etkileyecek 10 Web Tasarım İpucu..."
                                className="w-full bg-white dark:bg-slate-900/50 border border-border rounded-xl px-5 py-4 text-foreground text-lg font-bold placeholder:font-normal focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-muted-foreground"
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
                        </div>

                        <div className="flex justify-between items-center text-xs text-muted-foreground px-1">
                            {formData.slug ? (
                                <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg border border-border">
                                    <span className="font-semibold">URL:</span>
                                    <span className="font-mono text-emerald-500">vogo.com/blog/{formData.slug}</span>
                                </div>
                            ) : <span></span>}
                            <span>{formData.title.length} / 60 karakter</span>
                        </div>
                    </div>

                    {/* Content Editor (TipTap) */}
                    <div className="space-y-3">
                        <label className="block text-foreground text-sm font-bold ml-1">İçerik</label>
                        <RichTextEditor
                            content={formData.content}
                            onChange={(html) => setFormData({ ...formData, content: html })}
                            placeholder="Hikayenizi anlatın..."
                        />
                    </div>
                </div>

                {/* Sidebar Settings (Right, 4/12) */}
                <div className="lg:col-span-4 space-y-8">

                    {/* Category & Status */}
                    <div className="bg-card border border-border rounded-notebook p-6 space-y-6 shadow-sm sticky top-8">
                        <h3 className="font-bold text-foreground flex items-center gap-2 text-lg">
                            <Tag className="w-5 h-5 text-emerald-500" />
                            Yayın Ayarları
                        </h3>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="block text-foreground text-sm font-semibold">Kategori</label>
                                <select
                                    className="w-full bg-white dark:bg-slate-900/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all appearance-none cursor-pointer"
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

                            <div className="space-y-2">
                                <label className="block text-foreground text-sm font-semibold">Durum</label>
                                <select
                                    className="w-full bg-white dark:bg-slate-900/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all appearance-none cursor-pointer"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="published">Yayında</option>
                                    <option value="draft">Taslak</option>
                                    <option value="archived">Arşiv</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-border">
                            <h3 className="font-bold text-foreground flex items-center gap-2 text-lg mb-4">
                                <ImageIcon className="w-5 h-5 text-emerald-500" />
                                Kapak Görseli
                            </h3>
                            <ImageUploader
                                value={formData.image}
                                onChange={(url) => setFormData({ ...formData, image: url })}
                            />
                        </div>

                        <div className="pt-6 border-t border-border space-y-4">
                            <h3 className="font-bold text-foreground flex items-center gap-2 text-lg">
                                <FileText className="w-5 h-5 text-emerald-500" />
                                Özet (SEO)
                            </h3>
                            <textarea
                                placeholder="Yazının kısa bir özeti..."
                                className="w-full bg-white dark:bg-slate-900/50 border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 h-32 resize-none placeholder:text-muted-foreground transition-all"
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

