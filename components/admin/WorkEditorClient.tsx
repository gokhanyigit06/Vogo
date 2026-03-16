"use client"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    ArrowLeft, Save, RefreshCw, CheckCircle, Upload, X, Film,
    Image as ImageIcon, Plus, Trash2, GripVertical, Loader2,
    LayoutGrid, Rows, RectangleHorizontal, Columns3, Square, Monitor
} from "lucide-react"
import { useRouter } from "next/navigation"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { signInWithCustomToken } from "firebase/auth"
import { storage, auth } from "@/lib/firebase"

/* ────────────────────────────────────────────
   TYPES
──────────────────────────────────────────── */
type MediaType = "image" | "video"
type LayoutType = "single-16-9" | "two-square" | "three-square" | "three-portrait" | "single-square" | "two-16-9" | "single-16-5"

interface MediaItem {
    url: string
    type: MediaType
}

interface ContentBlock {
    id: string
    layout: LayoutType
    media: MediaItem[]
}

interface ProjectForm {
    publicTitle: string
    description: string
    thumbnail: string
    thumbnailType: MediaType
    category: string
    industry: string
    year: string
    liveUrl: string
    tags: string[]
    scope: string[]
    status: "published" | "draft"
    showOnHomepage: boolean
    accordionImage: string
    accordionImageType: MediaType
    contentBlocks: ContentBlock[]
}

const CATEGORIES = ["Web Design", "Mobile", "Branding", "SEO", "Social Media", "Development", "Other"]
const YEARS = ["2026", "2025", "2024", "2023", "2022"]

const EMPTY_FORM: ProjectForm = {
    publicTitle: "",
    description: "",
    thumbnail: "",
    thumbnailType: "image",
    category: "",
    industry: "",
    year: new Date().getFullYear().toString(),
    liveUrl: "",
    tags: [],
    scope: [],
    status: "published",
    showOnHomepage: false,
    accordionImage: "",
    accordionImageType: "image",
    contentBlocks: [],
}

/* ── LAYOUT CONFIG ── */
const LAYOUTS: { type: LayoutType; label: string; desc: string; cells: number; icon: React.ReactNode; preview: string[] }[] = [
    {
        type: "single-16-9",
        label: "Tek Geniş",
        desc: "16:9 yatay",
        cells: 1,
        icon: <RectangleHorizontal className="w-4 h-4" />,
        preview: ["col-span-2 aspect-video"],
    },
    {
        type: "single-16-5",
        label: "Panoramik",
        desc: "16:5 yatay",
        cells: 1,
        icon: <RectangleHorizontal className="w-4 h-4" />,
        preview: ["col-span-2 aspect-[16/5]"],
    },
    {
        type: "single-square",
        label: "Tek Kare",
        desc: "1:1",
        cells: 1,
        icon: <Square className="w-4 h-4" />,
        preview: ["col-span-2 aspect-square max-w-sm mx-auto"],
    },
    {
        type: "two-16-9",
        label: "2'li Geniş",
        desc: "2 × 16:9",
        cells: 2,
        icon: <LayoutGrid className="w-4 h-4" />,
        preview: ["aspect-video", "aspect-video"],
    },
    {
        type: "two-square",
        label: "2'li Kare",
        desc: "2 × 1:1",
        cells: 2,
        icon: <LayoutGrid className="w-4 h-4" />,
        preview: ["aspect-square", "aspect-square"],
    },
    {
        type: "three-square",
        label: "3'lü Kare",
        desc: "3 × 1:1",
        cells: 3,
        icon: <Columns3 className="w-4 h-4" />,
        preview: ["aspect-square", "aspect-square", "aspect-square"],
    },
    {
        type: "three-portrait",
        label: "3'lü Dikey",
        desc: "3 × 3:4",
        cells: 3,
        icon: <Rows className="w-4 h-4" />,
        preview: ["aspect-[3/4]", "aspect-[3/4]", "aspect-[3/4]"],
    },
]

const gridCols: Record<LayoutType, string> = {
    "single-16-9": "grid-cols-1",
    "single-16-5": "grid-cols-1",
    "single-square": "grid-cols-1",
    "two-16-9": "grid-cols-2",
    "two-square": "grid-cols-2",
    "three-square": "grid-cols-3",
    "three-portrait": "grid-cols-3",
}

/* ────────────────────────────────────────────
   MAIN COMPONENT
──────────────────────────────────────────── */
export default function WorkEditorClient({
    projectId,
    initialData,
}: {
    projectId: string | null
    initialData: Partial<ProjectForm> | null
}) {
    const router = useRouter()
    const [form, setForm] = useState<ProjectForm>({ ...EMPTY_FORM, ...initialData })
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [tagInput, setTagInput] = useState("")

    /* ── SAVE ── */
    const handleSave = async () => {
        if (!form.publicTitle.trim()) return
        setSaving(true)
        try {
            const payload = {
                ...form,
                name: form.publicTitle,
                ...(projectId ? { id: projectId } : {}),
            }
            await fetch("/api/projects", {
                method: projectId ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
            if (!projectId) router.push("/admin/web/work")
        } catch { }
        setSaving(false)
    }

    /* ── TAGS ── */
    const addTag = () => {
        if (!tagInput.trim() || form.tags.includes(tagInput.trim())) return
        setForm(f => ({ ...f, tags: [...f.tags, tagInput.trim()] }))
        setTagInput("")
    }
    const removeTag = (t: string) => setForm(f => ({ ...f, tags: f.tags.filter(x => x !== t) }))

    /* ── BLOCKS ── */
    const addBlock = (layout: LayoutType) => {
        const cfg = LAYOUTS.find(l => l.type === layout)!
        const newBlock: ContentBlock = {
            id: crypto.randomUUID(),
            layout,
            media: Array(cfg.cells).fill({ url: "", type: "image" as MediaType }),
        }
        setForm(f => ({ ...f, contentBlocks: [...f.contentBlocks, newBlock] }))
    }

    const removeBlock = (id: string) =>
        setForm(f => ({ ...f, contentBlocks: f.contentBlocks.filter(b => b.id !== id) }))

    const updateBlockMedia = (blockId: string, index: number, media: MediaItem) => {
        setForm(f => ({
            ...f,
            contentBlocks: f.contentBlocks.map(b =>
                b.id !== blockId ? b : {
                    ...b,
                    media: b.media.map((m, i) => i === index ? media : m),
                }
            ),
        }))
    }

    return (
        <div className="min-h-screen bg-[#F4F4F4]">

            {/* ── STICKY TOP BAR ── */}
            <div className="sticky top-[68px] z-40 bg-[#F4F4F4]/95 backdrop-blur-md border-b border-black/10">
                <div className="max-w-[1200px] mx-auto px-6 md:px-10 h-14 flex items-center justify-between gap-4">
                    <button
                        onClick={() => router.push("/admin/web/work")}
                        className="flex items-center gap-2 text-sm text-black/40 hover:text-black transition-colors font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Portfolio
                    </button>

                    <div className="flex items-center gap-3">
                        {/* Status toggle */}
                        <div className="hidden sm:flex items-center gap-1 bg-black/5 rounded-full p-1">
                            {(["published", "draft"] as const).map(s => (
                                <button
                                    key={s}
                                    onClick={() => setForm(f => ({ ...f, status: s }))}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                                        form.status === s
                                            ? "bg-black text-white"
                                            : "text-black/40 hover:text-black"
                                    }`}
                                >
                                    {s === "published" ? "Yayında" : "Taslak"}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={saving || !form.publicTitle.trim()}
                            className="flex items-center gap-2 px-5 py-2.5 bg-black text-white font-bold text-sm rounded-full hover:bg-black/80 disabled:opacity-40 transition-all"
                        >
                            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> :
                                saved ? <><CheckCircle className="w-4 h-4 text-green-400" /> Kaydedildi</> :
                                    <><Save className="w-4 h-4" /> Kaydet</>}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-12 space-y-12">

                {/* ══════════════════════
                    1. TEMEL BİLGİLER
                ══════════════════════ */}
                <Section label="01" title="Temel Bilgiler">
                    <div className="space-y-8">
                        <UnderlineField
                            label="Proje Adı *"
                            value={form.publicTitle}
                            onChange={v => setForm(f => ({ ...f, publicTitle: v }))}
                            placeholder="Starthub X"
                            large
                        />
                        <UnderlineTextarea
                            label="Kısa Açıklama"
                            value={form.description}
                            onChange={v => setForm(f => ({ ...f, description: v }))}
                            placeholder="Projeyi birkaç cümleyle anlat..."
                        />
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                            <SelectField
                                label="Kategori"
                                value={form.category}
                                onChange={v => setForm(f => ({ ...f, category: v }))}
                                options={CATEGORIES}
                            />
                            <SelectField
                                label="Yıl"
                                value={form.year}
                                onChange={v => setForm(f => ({ ...f, year: v }))}
                                options={YEARS}
                            />
                            <div className="col-span-2">
                                <UnderlineField
                                    label="Canlı URL"
                                    value={form.liveUrl}
                                    onChange={v => setForm(f => ({ ...f, liveUrl: v }))}
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <UnderlineField
                                label="Sektör (Industry)"
                                value={form.industry}
                                onChange={v => setForm(f => ({ ...f, industry: v }))}
                                placeholder="örn. Health Tech & AI"
                            />
                            <UnderlineField
                                label="Kapsam (virgülle ayır)"
                                value={form.scope.join(", ")}
                                onChange={v => setForm(f => ({ ...f, scope: v.split(",").map(s => s.trim()).filter(Boolean) }))}
                                placeholder="örn. UI Design, Development"
                            />
                        </div>

                        {/* Tags */}
                        <div>
                            <p className="text-[10px] font-bold tracking-widets uppercase text-black/35 mb-3">Etiketler</p>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {form.tags.map(t => (
                                    <span key={t} className="flex items-center gap-1.5 bg-black text-white px-3 py-1.5 rounded-full text-xs font-medium">
                                        {t}
                                        <button onClick={() => removeTag(t)} className="hover:opacity-70"><X className="w-3 h-3" /></button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    value={tagInput}
                                    onChange={e => setTagInput(e.target.value)}
                                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag() } }}
                                    placeholder="Etiket yaz, Enter'a bas"
                                    className="flex-1 bg-white border border-black/10 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-black/30 transition-colors"
                                />
                                <button onClick={addTag} className="px-4 py-2.5 bg-black text-white rounded-xl font-bold text-sm hover:bg-black/80 transition-colors">Ekle</button>
                            </div>
                        </div>

                        {/* Visibility Toggles */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            {/* Status */}
                            <button
                                type="button"
                                onClick={() => setForm(f => ({ ...f, status: f.status === "published" ? "draft" : "published" }))}
                                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                                    form.status === "published"
                                        ? "border-black bg-black text-white"
                                        : "border-black/10 bg-white text-black/50 hover:border-black/20"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${form.status === "published" ? "bg-green-400" : "bg-black/20"}`} />
                                    <span className="font-bold text-sm">{form.status === "published" ? "Yayında" : "Taslak"}</span>
                                </div>
                                <div className={`w-10 h-6 rounded-full relative transition-colors ${
                                    form.status === "published" ? "bg-green-400" : "bg-black/20"
                                }`}>
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                                        form.status === "published" ? "left-5" : "left-1"
                                    }`} />
                                </div>
                            </button>

                            {/* Show on Homepage */}
                            <button
                                type="button"
                                onClick={() => setForm(f => ({ ...f, showOnHomepage: !f.showOnHomepage }))}
                                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                                    form.showOnHomepage
                                        ? "border-black bg-black text-white"
                                        : "border-black/10 bg-white text-black/50 hover:border-black/20"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Monitor className="w-4 h-4" />
                                    <span className="font-bold text-sm">Anasayfada Göster</span>
                                </div>
                                <div className={`w-10 h-6 rounded-full relative transition-colors ${
                                    form.showOnHomepage ? "bg-white/30" : "bg-black/20"
                                }`}>
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                                        form.showOnHomepage ? "left-5" : "left-1"
                                    }`} />
                                </div>
                            </button>
                        </div>
                    </div>
                </Section>

                {/* ══════════════════════
                    2. KAPAK GÖRSELİ
                ══════════════════════ */}
                <Section label="02" title="Kapak Görseli">
                    <p className="text-sm text-black/40 mb-6">Listede ve proje detay sayfasında öne çıkan görsel. Önerilen oran: 16:9 veya 3:2.</p>
                    <MediaUploadCell
                        media={{ url: form.thumbnail, type: form.thumbnailType }}
                        onChange={m => setForm(f => ({ ...f, thumbnail: m.url, thumbnailType: m.type }))}
                        folder="thumbnails"
                        aspectClass="aspect-video"
                        label="Kapak Görseli veya Videosu"
                    />
                </Section>
                
                {/* ══════════════════════
                    3. ANASAYFA AKORDİYON GÖRSELİ
                ══════════════════════ */}
                <Section label="03" title="Anasayfa Akordiyon Görseli">
                    <p className="text-sm text-black/40 mb-6">Anasayfada açılır (akordiyon) alanda görünecek ekstra geniş banner görseli.</p>
                    <MediaUploadCell
                        media={{ url: form.accordionImage, type: form.accordionImageType }}
                        onChange={m => setForm(f => ({ ...f, accordionImage: m.url, accordionImageType: m.type }))}
                        folder="thumbnails"
                        aspectClass="aspect-[16/5]"
                        label="Akordiyon Banner Görseli"
                    />
                </Section>

                {/* ══════════════════════
                    4. İÇERİK BLOKLARI
                ══════════════════════ */}
                <Section label="04" title="İçerik Blokları">
                    <p className="text-sm text-black/40 mb-8">
                        Proje detay sayfasında görünecek medya düzeni. Her bloğa tıklayarak görsel veya video yükle.
                    </p>

                    {/* Existing Blocks */}
                    <div className="space-y-8">
                        {form.contentBlocks.map((block, bi) => {
                            const cfg = LAYOUTS.find(l => l.type === block.layout)!
                            return (
                                <motion.div
                                    key={block.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-3xl p-6 border border-black/5"
                                >
                                    <div className="flex items-center justify-between mb-5">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-black/5 rounded-xl text-black/50">{cfg.icon}</div>
                                            <div>
                                                <p className="font-bold text-sm text-black">{cfg.label}</p>
                                                <p className="text-xs text-black/40">{cfg.desc}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeBlock(block.id)}
                                            className="p-2 rounded-xl text-black/20 hover:text-red-500 hover:bg-red-50 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className={`grid ${gridCols[block.layout]} gap-3`}>
                                        {block.media.map((m, mi) => (
                                            <MediaUploadCell
                                                key={mi}
                                                media={m}
                                                onChange={newM => updateBlockMedia(block.id, mi, newM)}
                                                folder="work"
                                                aspectClass={cfg.preview[mi]}
                                                label=""
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>

                    {/* ── Layout Picker ── */}
                    <div className="mt-8">
                        <p className="text-[10px] font-bold tracking-widets uppercase text-black/35 mb-5">Blok Ekle</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                            {LAYOUTS.map(layout => (
                                <button
                                    key={layout.type}
                                    onClick={() => addBlock(layout.type)}
                                    className="group flex flex-col items-center gap-3 p-4 bg-white hover:bg-black rounded-2xl border border-black/5 hover:border-black transition-all"
                                >
                                    {/* Mini visual preview */}
                                    <div className={`w-full grid ${
                                        layout.cells === 1 ? "grid-cols-1" :
                                        layout.cells === 2 ? "grid-cols-2" : "grid-cols-3"
                                    } gap-1`}>
                                        {Array(layout.cells).fill(0).map((_, i) => (
                                            <div
                                                key={i}
                                                className={`bg-black/10 group-hover:bg-white/20 rounded-md transition-colors ${
                                                    layout.type === "single-16-9" ? "aspect-video" :
                                                    layout.type === "three-portrait" ? "aspect-[3/4]" : "aspect-square"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs font-bold text-black/70 group-hover:text-white transition-colors">{layout.label}</p>
                                        <p className="text-[10px] text-black/30 group-hover:text-white/50 transition-colors">{layout.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </Section>

                {/* Bottom Save */}
                <div className="flex justify-end pt-4 pb-16">
                    <button
                        onClick={handleSave}
                        disabled={saving || !form.publicTitle.trim()}
                        className="flex items-center gap-2 px-8 py-4 bg-black text-white font-bold rounded-full hover:bg-black/80 disabled:opacity-40 transition-all text-sm"
                    >
                        {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {projectId ? "Güncelle" : "Projeyi Kaydet"}
                    </button>
                </div>
            </div>
        </div>
    )
}

/* ────────────────────────────────────────────
   MEDIA UPLOAD CELL
──────────────────────────────────────────── */
function MediaUploadCell({
    media,
    onChange,
    folder,
    aspectClass,
    label,
}: {
    media: MediaItem
    onChange: (m: MediaItem) => void
    folder: string
    aspectClass: string
    label: string
}) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [statusMsg, setStatusMsg] = useState("")
    const [savingsMsg, setSavingsMsg] = useState("")
    const [dragOver, setDragOver] = useState(false)
    const [err, setErr] = useState("")

    const upload = async (file: File) => {
        setErr("")
        setSavingsMsg("")
        const isImg = file.type.startsWith("image/")
        const isVid = file.type.startsWith("video/")
        if (!isImg && !isVid) { setErr("Görsel veya video seçin."); return }
        // Videos: direct Firebase, no server limit. Images: 10MB (Sharp processes them)
        const maxSize = isVid ? 500 * 1024 * 1024 : 10 * 1024 * 1024
        if (file.size > maxSize) { setErr(`Max ${isVid ? "500MB" : "10MB"}`); return }

        setUploading(true)
        setProgress(0)

        // ── VIDEO: upload directly to Firebase Storage (bypasses Next.js 4MB API limit) ──
        if (isVid) {
            const sizeMB = (file.size / 1024 / 1024).toFixed(0)
            setStatusMsg(`Video ${sizeMB}MB — Firebase'e yükleniyor...`)

            try {
                const timestamp = Date.now()
                const randomStr = Math.random().toString(36).substring(7)
                const ext = (file.name.split(".").pop() || "mp4").toLowerCase()
                const filename = `${timestamp}_${randomStr}.${ext}`
                const storageRef = ref(storage, `${folder}/${filename}`)

                const uploadTask = uploadBytesResumable(storageRef, file, {
                    contentType: file.type,
                })

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                        setProgress(pct)
                        setStatusMsg(`Yükleniyor... ${pct}%`)
                    },
                    (error) => {
                        console.error("Video upload error:", error)
                        setErr("Video yükleme başarısız: " + error.message)
                        setUploading(false)
                        setStatusMsg("")
                    },
                    async () => {
                        const url = await getDownloadURL(uploadTask.snapshot.ref)
                        setProgress(100)
                        setStatusMsg("Tamamlandı!")
                        setTimeout(() => {
                            onChange({ url, type: "video" })
                            setUploading(false)
                            setProgress(0)
                            setStatusMsg("")
                        }, 500)
                    }
                )
            } catch (err) {
                setErr("Video yükleme başarısız.")
                setUploading(false)
                setStatusMsg("")
            }
            return
        }

        // ── IMAGE: use API route (Sharp optimize + WebP) ──
        let fileToUpload = file
        if (!file.type.includes("svg")) {
            try {
                setStatusMsg("Optimize ediliyor...")
                const optimized = await compressImageClientSide(file)
                fileToUpload = optimized.file
                if (optimized.savings > 5) setSavingsMsg(`▼ %${optimized.savings} küçüldü`)
                setStatusMsg("Yükleniyor...")
            } catch {
                setStatusMsg("Yükleniyor...")
            }
        }

        const interval = setInterval(() => setProgress(p => Math.min(p + 8, 85)), 200)
        try {
            const fd = new FormData()
            fd.append("file", fileToUpload)
            fd.append("folder", folder)
            const res = await fetch("/api/upload", { method: "POST", body: fd })
            const data = await res.json()
            clearInterval(interval)
            if (!res.ok || data.error) { setErr(data.error || "Hata"); setUploading(false); return }
            setProgress(100)
            setTimeout(() => {
                onChange({ url: data.url, type: "image" })
                setUploading(false)
                setProgress(0)
                setStatusMsg("")
            }, 500)
        } catch {
            clearInterval(interval)
            setErr("Yükleme başarısız.")
            setUploading(false)
            setStatusMsg("")
        }
    }

    return (
        <div className="space-y-2">
            {label && <p className="text-[10px] font-bold tracking-widets uppercase text-black/35">{label}</p>}
            <div
                className={`relative ${aspectClass} rounded-2xl overflow-hidden border-2 border-dashed transition-all cursor-pointer group ${
                    dragOver ? "border-black bg-black/5" :
                    media.url ? "border-transparent" : "border-black/10 hover:border-black/25 bg-black/[0.02] hover:bg-black/[0.04]"
                }`}
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) upload(f) }}
                onClick={() => !uploading && inputRef.current?.click()}
            >
                <input ref={inputRef} type="file" accept="image/*,video/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = "" }} />

                {/* Existing media */}
                {media.url && !uploading && (
                    <>
                        {media.type === "video" ? (
                            <video src={media.url} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                        ) : (
                            <img src={media.url} alt="" className="w-full h-full object-cover" />
                        )}
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-xs font-bold shadow-lg">
                                <Upload className="w-3.5 h-3.5" />
                                Değiştir
                            </div>
                        </div>
                        <button
                            onClick={e => { e.stopPropagation(); onChange({ url: "", type: "image" }) }}
                            className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-500"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </>
                )}

                {/* Upload progress */}
                {uploading && (
                    <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center gap-3 p-4">
                        <Loader2 className="w-6 h-6 animate-spin text-black" />
                        <div className="w-28 h-1 bg-black/10 rounded-full overflow-hidden">
                            <div className="h-full bg-black rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] font-bold text-black/60">{statusMsg || "Yükleniyor..."}</p>
                            <p className="text-[10px] text-black/30">{progress}%</p>
                        </div>
                    </div>
                )}

                {/* Empty state */}
                {!media.url && !uploading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-black/25">
                        <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center">
                            <Upload className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold text-center px-4">Görsel veya Video</span>
                    </div>
                )}
            </div>
            {err && <p className="text-xs text-red-500 font-medium mt-1">{err}</p>}
            {savingsMsg && !err && !uploading && (
                <p className="text-[10px] font-bold text-green-600 mt-1">{savingsMsg}</p>
            )}
        </div>
    )
}

/* ────────────────────────────────────────────
   HELPER SUB-COMPONENTS
──────────────────────────────────────────── */
function Section({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
        >
            <div className="flex items-baseline gap-4 pb-5 border-b border-black/10">
                <span className="text-[10px] font-bold tracking-widets text-black/25">{label}</span>
                <h2 className="text-xl md:text-2xl font-bold text-black tracking-tight">{title}</h2>
            </div>
            {children}
        </motion.section>
    )
}

function UnderlineField({ label, value, onChange, placeholder, large }: {
    label: string; value: string; onChange: (v: string) => void; placeholder: string; large?: boolean
}) {
    return (
        <div className="group border-b border-black/15 pb-2 focus-within:border-black transition-colors">
            <label className="block text-[10px] font-bold tracking-widets uppercase text-black/35 mb-2 group-focus-within:text-black/60 transition-colors">{label}</label>
            <input
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full bg-transparent text-black font-medium placeholder:text-black/20 focus:outline-none ${large ? "text-2xl md:text-3xl" : "text-base"}`}
            />
        </div>
    )
}

function UnderlineTextarea({ label, value, onChange, placeholder }: {
    label: string; value: string; onChange: (v: string) => void; placeholder: string
}) {
    return (
        <div className="group border-b border-black/15 pb-2 focus-within:border-black transition-colors">
            <label className="block text-[10px] font-bold tracking-widets uppercase text-black/35 mb-2 group-focus-within:text-black/60 transition-colors">{label}</label>
            <textarea
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                rows={3}
                className="w-full bg-transparent text-base text-black font-medium placeholder:text-black/20 focus:outline-none resize-none"
            />
        </div>
    )
}

function SelectField({ label, value, onChange, options }: {
    label: string; value: string; onChange: (v: string) => void; options: string[]
}) {
    return (
        <div className="group border-b border-black/15 pb-2 focus-within:border-black transition-colors">
            <label className="block text-[10px] font-bold tracking-widets uppercase text-black/35 mb-2">{label}</label>
            <select
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full bg-transparent text-base text-black font-medium focus:outline-none"
            >
                <option value="">Seç...</option>
                {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
        </div>
    )
}

/* ────────────────────────────────────────────
   CLIENT-SIDE IMAGE COMPRESSOR
   Uses Canvas API — zero extra dependencies
──────────────────────────────────────────── */
async function compressImageClientSide(
    file: File,
    maxDim = 1920,
    quality = 0.85
): Promise<{ file: File; savings: number }> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        const url = URL.createObjectURL(file)

        img.onload = () => {
            URL.revokeObjectURL(url)
            let { width, height } = img

            // Scale down if needed
            if (width > maxDim || height > maxDim) {
                const ratio = Math.min(maxDim / width, maxDim / height)
                width = Math.round(width * ratio)
                height = Math.round(height * ratio)
            }

            const canvas = document.createElement("canvas")
            canvas.width = width
            canvas.height = height
            const ctx = canvas.getContext("2d")
            if (!ctx) { reject(new Error("no ctx")); return }
            ctx.drawImage(img, 0, 0, width, height)

            canvas.toBlob(
                (blob) => {
                    if (!blob) { reject(new Error("toBlob failed")); return }
                    const basename = file.name.replace(/\.[^.]+$/, "")
                    const optimized = new File([blob], `${basename}.webp`, { type: "image/webp" })
                    const savings = Math.max(0, Math.round((1 - optimized.size / file.size) * 100))
                    resolve({ file: optimized, savings })
                },
                "image/webp",
                quality
            )
        }

        img.onerror = () => {
            URL.revokeObjectURL(url)
            reject(new Error("Image load failed"))
        }

        img.src = url
    })
}
