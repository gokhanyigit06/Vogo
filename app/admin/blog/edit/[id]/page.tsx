"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Save, Trash2, FileText, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import ImageUploader from "@/components/admin/ImageUploader"
import RichTextEditor from "@/components/admin/RichTextEditor"

export default function EditBlogPostPage() {
    const router = useRouter()
    const params = useParams()
    const { id } = params

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [formData, setFormData] = useState<any>({
        title: "",
        category: "Teknoloji",
        image: "",
        excerpt: "",
        content: ""
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/posts')
                const data = await res.json()
                const postsArray = Array.isArray(data) ? data : []
                const post = postsArray.find((item: any) => item.id == id)
                if (post) {
                    setFormData(post)
                } else {
                    alert("Yazı bulunamadı!")
                    router.push('/admin/blog')
                }
            } catch (error) {
                console.error("Veri hatası:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [id, router])

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            const res = await fetch('/api/posts', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })
            if (!res.ok) throw new Error('Güncellenemedi')
            alert("Yazı güncellendi!")
            router.push('/admin/blog')
            router.refresh()
        } catch (error) {
            alert("Hata oluştu")
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm("Bu yazıyı silmek istediğinize emin misiniz?")) return
        setDeleting(true)
        try {
            const res = await fetch(`/api/posts?id=${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Silinemedi')
            alert("Yazı silindi.")
            router.push('/admin/blog')
            router.refresh()
        } catch (error) {
            alert("Silme hatası")
        } finally {
            setDeleting(false)
        }
    }

    if (loading) return <div className="p-8 text-foreground">Yükleniyor...</div>

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-center sticky top-0 py-4 bg-background/80 backdrop-blur z-20 border-b border-border">
                <div className="flex items-center gap-4">
                    <Link href="/admin/blog" className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"><ArrowLeft className="w-5 h-5" /></Link>
                    <h1 className="text-2xl font-bold text-foreground">Yazıyı Düzenle</h1>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleDelete} disabled={deleting} className="px-4 py-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 font-bold flex gap-2 items-center"><Trash2 className="w-4 h-4" /> Sil</button>
                    <button onClick={handleUpdate} disabled={saving} className="px-6 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 font-bold shadow-lg shadow-emerald-500/20 flex gap-2 items-center"><Save className="w-4 h-4" /> Kaydet</button>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="bg-card border border-border rounded-notebook p-6 space-y-4">
                        <label className="text-muted-foreground text-sm font-bold">Başlık</label>
                        <input type="text" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-emerald-500" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />

                        <label className="text-muted-foreground text-sm font-bold">Kategori</label>
                        <select className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-emerald-500" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                            {["Teknoloji", "Tasarım", "Yazılım", "Pazarlama", "SEO", "E-Ticaret"].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="bg-card border border-border rounded-notebook p-6 space-y-4">
                        <label className="text-muted-foreground text-sm font-bold">Kısa Özet</label>
                        <textarea className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-emerald-500 h-32" value={formData.excerpt} onChange={e => setFormData({ ...formData, excerpt: e.target.value })} />
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-card border border-border rounded-notebook p-6 space-y-4">
                        <label className="text-muted-foreground text-sm font-bold">Görsel URL</label>
                        <ImageUploader
                            value={formData.image}
                            onChange={(url) => setFormData({ ...formData, image: url })}
                        />
                    </div>
                    <div className="bg-card border border-border rounded-notebook p-6 space-y-4">
                        <label className="text-muted-foreground text-sm font-bold">İçerik</label>
                        <RichTextEditor
                            content={formData.content}
                            onChange={(html) => setFormData({ ...formData, content: html })}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
