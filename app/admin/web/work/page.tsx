"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Pencil, Trash2, GripVertical, ExternalLink, ArrowUpRight, Image as ImageIcon } from "lucide-react"
import { useRouter } from "next/navigation"

interface Project {
    id: string
    publicTitle?: string
    title?: string
    name?: string
    description?: string
    thumbnail?: string
    thumbnailType?: "image" | "video"
    image?: string
    tags?: string[]
    category?: string
    year?: string
    liveUrl?: string
    websiteUrl?: string
    isLabProject?: boolean
    order?: number
    status?: string
    slug?: string
}

export default function WorkAdminPage() {
    const router = useRouter()
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/projects?type=work")
            const data = await res.json()
            setProjects(Array.isArray(data) ? data : [])
        } catch {
            setProjects([])
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        await fetch(`/api/projects?id=${id}`, { method: "DELETE" })
        setDeleteConfirm(null)
        await fetchProjects()
    }

    const displayTitle = (p: Project) => p.publicTitle || p.title || p.name || "—"

    return (
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-16 md:py-20">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-black/40 mb-4">WORK</p>
                    <h1 className="text-[2.5rem] sm:text-[3.5rem] md:text-[5rem] leading-[0.9] tracking-[-0.04em] font-medium text-black">
                        Portfolio<br />Projeleri
                    </h1>
                </motion.div>
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    onClick={() => router.push("/admin/web/work/new")}
                    className="flex items-center gap-2 px-6 py-3.5 bg-black text-white font-bold rounded-full hover:bg-black/80 transition-colors self-start md:self-auto"
                >
                    <Plus className="w-4 h-4" />
                    Proje Ekle
                </motion.button>
            </div>

            {/* Projects List */}
            {loading ? (
                <div className="py-32 flex items-center justify-center">
                    <div className="w-10 h-10 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                </div>
            ) : projects.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-32 text-center">
                    <p className="text-5xl mb-6">🎨</p>
                    <p className="text-black/40 text-lg font-medium">Henüz proje eklenmemiş.</p>
                    <button
                        onClick={() => router.push("/admin/web/work/new")}
                        className="mt-6 px-6 py-3 bg-black text-white rounded-full font-bold text-sm hover:bg-black/80 transition-colors"
                    >
                        İlk Projeyi Ekle
                    </button>
                </motion.div>
            ) : (
                <div className="space-y-3">
                    {projects.map((p, i) => (
                        <motion.div
                            key={p.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className="group flex items-center gap-5 p-5 bg-white rounded-2xl border border-black/5 hover:border-black/15 transition-all"
                        >
                            <GripVertical className="w-4 h-4 text-black/20 group-hover:text-black/40 transition-colors flex-shrink-0 cursor-grab" />

                            {/* Thumbnail */}
                            <div className="w-16 h-12 rounded-xl overflow-hidden bg-black/5 flex-shrink-0">
                                {(p.thumbnail || p.image) ? (() => {
                                    const url = p.thumbnail || p.image || ''
                                    const isVid = p.thumbnailType === 'video' || (url && (/\.(mp4|mov|webm|ogg|m4v|avi)($|\?)/i.test(url) || url.includes('video') || url.includes('mp4') || url.includes('webm')))
                                    return isVid ? (
                                        <video src={url} muted playsInline className="w-full h-full object-cover" />
                                    ) : (
                                        <img
                                            src={url}
                                            alt={displayTitle(p)}
                                            className="w-full h-full object-cover"
                                            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                                        />
                                    )
                                })() : (
                                    <div className="w-full h-full flex items-center justify-center text-black/20">
                                        <ImageIcon className="w-5 h-5" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-black text-base truncate">{displayTitle(p)}</h3>
                                <div className="flex items-center gap-3 mt-1 flex-wrap">
                                    {p.year && <span className="text-xs text-black/40 font-medium">{p.year}</span>}
                                    {p.category && (
                                        <span className="text-xs bg-black/5 text-black/50 px-2.5 py-0.5 rounded-full font-medium">{p.category}</span>
                                    )}
                                    {p.tags?.slice(0, 2).map(t => (
                                        <span key={t} className="text-xs bg-black/5 text-black/40 px-2.5 py-0.5 rounded-full">{t}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Status */}
                            <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                p.status === "published" ? "bg-green-50 text-green-600" : "bg-black/5 text-black/40"
                            }`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${p.status === "published" ? "bg-green-500" : "bg-black/30"}`} />
                                {p.status === "published" ? "Yayında" : "Taslak"}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                                {(p.liveUrl || p.websiteUrl) && (
                                    <a href={p.liveUrl || p.websiteUrl} target="_blank"
                                        className="p-2 rounded-xl text-black/30 hover:text-black hover:bg-black/5 transition-all">
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}
                                <button
                                    onClick={() => router.push(`/admin/web/work/${p.id}`)}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/5 text-black/60 hover:bg-black hover:text-white text-xs font-bold transition-all"
                                >
                                    <Pencil className="w-3 h-3" />
                                    Düzenle
                                </button>
                                <button onClick={() => setDeleteConfirm(p.id)}
                                    className="p-2 rounded-xl text-black/20 hover:text-red-500 hover:bg-red-50 transition-all">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Delete Confirm Modal */}
            <AnimatePresence>
                {deleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
                        onClick={() => setDeleteConfirm(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white rounded-3xl p-8 max-w-sm w-full"
                        >
                            <h3 className="text-xl font-bold text-black mb-2">Projeyi sil?</h3>
                            <p className="text-black/50 text-sm mb-8">Bu işlem geri alınamaz.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setDeleteConfirm(null)}
                                    className="flex-1 py-3 rounded-full border border-black/10 font-bold text-sm hover:bg-black/5 transition-colors">
                                    Vazgeç
                                </button>
                                <button onClick={() => handleDelete(deleteConfirm)}
                                    className="flex-1 py-3 rounded-full bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors">
                                    Sil
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
