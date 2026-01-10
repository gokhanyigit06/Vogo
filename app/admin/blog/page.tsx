"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Eye, Edit, Trash2, FileText, Filter, Loader2 } from "lucide-react"
import Link from "next/link"

export default function BlogManagementPage() {
    const [posts, setPosts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        fetch('/api/posts')
            .then(res => res.json())
            .then(data => {
                setPosts(data)
                setLoading(false)
            })
            .catch(err => setLoading(false))
    }, [])

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                        <FileText className="w-8 h-8 text-emerald-500" />
                        Blog Yönetimi
                    </h1>
                    <p className="text-muted-foreground mt-1">Tüm blog yazılarınızı buradan yönetebilir, düzenleyebilir veya silebilirsiniz.</p>
                </div>
                <Link href="/admin/blog/new">
                    <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-3xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 active:scale-95">
                        <Plus className="w-5 h-5" /> Yeni Yazı Ekle
                    </button>
                </Link>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 bg-card/50 p-4 rounded-notebook border border-border card-light-shadow">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Yazı başlığı veya kategori ara..."
                        className="w-full bg-background border border-border rounded-2xl pl-10 pr-4 py-3 text-foreground focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-muted-foreground"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Content Table */}
            <div className="bg-card border border-border rounded-notebook overflow-hidden shadow-xl card-light-shadow">
                {loading ? (
                    <div className="p-12 flex justify-center text-emerald-500"><Loader2 className="animate-spin w-8 h-8" /></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-muted-foreground">
                            <thead className="bg-muted text-foreground uppercase font-semibold text-xs tracking-wider border-b border-border">
                                <tr>
                                    <th className="px-6 py-5">Başlık</th>
                                    <th className="px-6 py-5">Kategori</th>
                                    <th className="px-6 py-5">Durum</th>
                                    <th className="px-6 py-5">Tarih</th>
                                    <th className="px-6 py-5 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredPosts.map((post) => (
                                    <tr key={post.id} className="hover:bg-muted/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-foreground text-base group-hover:text-emerald-500 transition-colors line-clamp-1">{post.title}</p>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">{post.category}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${post.status === 'published' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-muted text-muted-foreground border-border'
                                                }`}>
                                                {post.status || 'Taslak'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{post.date}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/blog`} target="_blank">
                                                    <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors" title="Önizle">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                <Link href={`/admin/blog/edit/${post.id}`}>
                                                    <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-blue-500 transition-colors" title="Düzenle">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredPosts.length === 0 && <div className="p-8 text-center text-slate-500">Kayıt bulunamadı.</div>}
                    </div>
                )}
            </div>
        </div>
    )
}
