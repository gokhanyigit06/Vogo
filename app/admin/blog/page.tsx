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
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <FileText className="w-8 h-8 text-emerald-500" />
                        Blog Yönetimi
                    </h1>
                    <p className="text-slate-400 mt-1">Tüm blog yazılarınızı buradan yönetebilir, düzenleyebilir veya silebilirsiniz.</p>
                </div>
                <Link href="/admin/blog/new">
                    <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 active:scale-95">
                        <Plus className="w-5 h-5" /> Yeni Yazı Ekle
                    </button>
                </Link>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Yazı başlığı veya kategori ara..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-600"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Content Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl shadow-black/20">
                {loading ? (
                    <div className="p-12 flex justify-center text-emerald-500"><Loader2 className="animate-spin w-8 h-8" /></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="bg-slate-950/80 text-slate-200 uppercase font-semibold text-xs tracking-wider border-b border-slate-800">
                                <tr>
                                    <th className="px-6 py-5">Başlık</th>
                                    <th className="px-6 py-5">Kategori</th>
                                    <th className="px-6 py-5">Durum</th>
                                    <th className="px-6 py-5">Tarih</th>
                                    <th className="px-6 py-5 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredPosts.map((post) => (
                                    <tr key={post.id} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors line-clamp-1">{post.title}</p>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300">{post.category}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${post.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-700/50 text-slate-400 border-slate-600'
                                                }`}>
                                                {post.status || 'Taslak'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{post.date}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/blog`} target="_blank">
                                                    <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors" title="Önizle">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                <Link href={`/admin/blog/edit/${post.id}`}>
                                                    <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-blue-400 transition-colors" title="Düzenle">
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
