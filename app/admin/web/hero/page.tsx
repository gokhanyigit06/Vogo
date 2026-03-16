"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Save, RefreshCw, CheckCircle, Upload, X, Film, Image as ImageIcon,
    Eye, Type, ArrowUpRight, Loader2, Trash2
} from "lucide-react"

interface HeroSettings {
    titleLine1: string
    titleLine2: string
    titleLine3: string
    heroMediaUrl: string
    heroMediaType: "image" | "video"
}

const defaultSettings: HeroSettings = {
    titleLine1: "Engineering",
    titleLine2: "high-end digital",
    titleLine3: "experiences",
    heroMediaUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop",
    heroMediaType: "image",
}

export default function HeroAdminPage() {
    const [settings, setSettings] = useState<HeroSettings>(defaultSettings)
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saved, setSaved] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [dragOver, setDragOver] = useState(false)
    const [uploadError, setUploadError] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        fetch("/api/settings")
            .then(r => r.json())
            .then(data => {
                setSettings({
                    titleLine1: data.heroTitleLine1 || defaultSettings.titleLine1,
                    titleLine2: data.heroTitleLine2 || defaultSettings.titleLine2,
                    titleLine3: data.heroTitleLine3 || defaultSettings.titleLine3,
                    heroMediaUrl: data.heroMediaUrl || defaultSettings.heroMediaUrl,
                    heroMediaType: data.heroMediaType || defaultSettings.heroMediaType,
                })
            })
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    const handleSave = async () => {
        setSaving(true)
        try {
            await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    heroTitleLine1: settings.titleLine1,
                    heroTitleLine2: settings.titleLine2,
                    heroTitleLine3: settings.titleLine3,
                    heroMediaUrl: settings.heroMediaUrl,
                    heroMediaType: settings.heroMediaType,
                })
            })
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } catch { }
        setSaving(false)
    }

    const handleFileUpload = async (file: File) => {
        setUploadError("")
        const isImage = file.type.startsWith("image/")
        const isVideo = file.type.startsWith("video/")

        if (!isImage && !isVideo) {
            setUploadError("Sadece görsel (JPG, PNG, WebP) veya video (MP4, MOV, WebM) yükleyebilirsin.")
            return
        }

        const maxSize = isVideo ? 200 * 1024 * 1024 : 10 * 1024 * 1024
        if (file.size > maxSize) {
            setUploadError(`Dosya çok büyük. Limit: ${isVideo ? "200MB" : "10MB"}`)
            return
        }

        setUploading(true)
        setUploadProgress(0)

        // Fake progress for UX
        const interval = setInterval(() => {
            setUploadProgress(p => Math.min(p + (isVideo ? 3 : 10), 85))
        }, 300)

        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("folder", "hero")

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })
            const data = await res.json()

            clearInterval(interval)

            if (!res.ok || data.error) {
                setUploadError(data.error || "Yükleme başarısız.")
                return
            }

            setUploadProgress(100)
            setTimeout(() => {
                setSettings(s => ({
                    ...s,
                    heroMediaUrl: data.url,
                    heroMediaType: isVideo ? "video" : "image",
                }))
                setUploading(false)
                setUploadProgress(0)
            }, 500)

        } catch {
            clearInterval(interval)
            setUploadError("Sunucu hatası. Tekrar dene.")
            setUploading(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(false)
        const file = e.dataTransfer.files[0]
        if (file) handleFileUpload(file)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) handleFileUpload(file)
        e.target.value = ""
    }

    const clearMedia = () => {
        setSettings(s => ({
            ...s,
            heroMediaUrl: defaultSettings.heroMediaUrl,
            heroMediaType: "image",
        }))
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-16 md:py-20">

            {/* Page Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
                <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-black/40 mb-4">HERO</p>
                <h1 className="text-[2.5rem] sm:text-[4rem] md:text-[5.5rem] leading-[0.9] tracking-[-0.04em] font-medium text-black mb-6">
                    Hero Bölümü
                </h1>
                <p className="text-black/50 text-base max-w-lg">
                    Ana sayfa hero bölümündeki yazıları ve sağdaki görseli / videoyu düzenle.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                {/* LEFT: Settings */}
                <div className="space-y-6">

                    {/* Title Lines */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-3xl p-8 border border-black/5"
                    >
                        <h2 className="text-lg font-bold text-black mb-2 flex items-center gap-2">
                            <Type className="w-5 h-5 text-black/40" />
                            Başlık Metinleri
                        </h2>
                        <p className="text-xs text-black/40 mb-6 font-medium">Her satır ayrı büyük yazı olarak görünür.</p>

                        <div className="space-y-4">
                            {(["titleLine1", "titleLine2", "titleLine3"] as const).map((key, i) => (
                                <div key={key}>
                                    <label className="block text-xs font-bold tracking-widets uppercase text-black/40 mb-2">
                                        {i + 1}. Satır
                                    </label>
                                    <input
                                        type="text"
                                        value={settings[key]}
                                        onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))}
                                        className="w-full bg-[#F4F4F4] border border-black/10 rounded-xl px-4 py-3.5 text-black font-medium focus:outline-none focus:border-black/30 transition-colors text-lg"
                                        placeholder={defaultSettings[key]}
                                    />
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Media Upload */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="bg-white rounded-3xl p-8 border border-black/5"
                    >
                        <h2 className="text-lg font-bold text-black mb-2 flex items-center gap-2">
                            <Film className="w-5 h-5 text-black/40" />
                            Sağ Medya (Görsel / Video)
                        </h2>
                        <p className="text-xs text-black/40 mb-6 font-medium">
                            Hero'nun sağ tarafında gösterilecek görsel veya video. Önerilen boyut: 1:1 kare.
                        </p>

                        {/* Drop Zone */}
                        <div
                            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            onClick={() => !uploading && fileInputRef.current?.click()}
                            className={`relative border-2 border-dashed rounded-2xl transition-all duration-200 cursor-pointer group ${
                                dragOver
                                    ? "border-black bg-black/5"
                                    : "border-black/15 hover:border-black/30 hover:bg-black/[0.02]"
                            }`}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*,video/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            {uploading ? (
                                <div className="p-10 flex flex-col items-center gap-4">
                                    <div className="relative w-14 h-14">
                                        <div className="w-14 h-14 border-2 border-black/10 rounded-full" />
                                        <div
                                            className="absolute inset-0 border-2 border-black rounded-full transition-all duration-300"
                                            style={{
                                                clipPath: `inset(0 ${100 - uploadProgress}% 0 0 round 999px)`,
                                            }}
                                        />
                                        <Loader2 className="absolute inset-0 m-auto w-6 h-6 text-black animate-spin" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-bold text-black text-sm">Yükleniyor...</p>
                                        <p className="text-black/40 text-xs mt-0.5">{uploadProgress}%</p>
                                    </div>
                                    <div className="w-48 h-1.5 bg-black/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-black rounded-full transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="p-10 flex flex-col items-center gap-3 text-center">
                                    <div className="w-14 h-14 bg-black/5 rounded-2xl flex items-center justify-center group-hover:bg-black/10 transition-colors">
                                        <Upload className="w-6 h-6 text-black/40" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-black text-sm">
                                            Sürükle bırak veya <span className="underline underline-offset-2">dosya seç</span>
                                        </p>
                                        <p className="text-black/40 text-xs mt-1">
                                            Görsel: JPG, PNG, WebP (max 10MB) &nbsp;•&nbsp; Video: MP4, MOV, WebM (max 200MB)
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Upload Error */}
                        <AnimatePresence>
                            {uploadError && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="mt-3 flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-red-500 text-sm"
                                >
                                    <X className="w-4 h-4 flex-shrink-0" />
                                    {uploadError}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Current media URL */}
                        {settings.heroMediaUrl && (
                            <div className="mt-4 flex items-center gap-3 p-3 bg-[#F4F4F4] rounded-xl">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${settings.heroMediaType === "video" ? "bg-purple-100" : "bg-blue-100"}`}>
                                    {settings.heroMediaType === "video"
                                        ? <Film className="w-4 h-4 text-purple-500" />
                                        : <ImageIcon className="w-4 h-4 text-blue-500" />}
                                </div>
                                <p className="flex-1 text-xs text-black/50 truncate font-mono">
                                    {settings.heroMediaUrl.length > 50
                                        ? settings.heroMediaUrl.slice(0, 50) + "..."
                                        : settings.heroMediaUrl}
                                </p>
                                <button
                                    onClick={clearMedia}
                                    className="p-1.5 rounded-lg hover:bg-red-50 text-black/30 hover:text-red-400 transition-colors"
                                    title="Varsayılana sıfırla"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )}
                    </motion.div>

                    {/* Save */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.25 }}
                        className="flex items-center justify-between pt-4 border-t border-black/10"
                    >
                        <p className="text-xs text-black/30 font-medium">Siteyi görüntüle →</p>
                        <button
                            onClick={handleSave}
                            disabled={saving || uploading}
                            className="flex items-center gap-2 px-7 py-3.5 bg-black text-white font-bold rounded-full hover:bg-black/80 disabled:opacity-50 transition-all"
                        >
                            {saving ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : saved ? (
                                <>
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                    Kaydedildi!
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Kaydet
                                </>
                            )}
                        </button>
                    </motion.div>
                </div>

                {/* RIGHT: Live Preview */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:sticky lg:top-24"
                >
                    <div className="bg-white rounded-3xl border border-black/5 overflow-hidden">
                        <div className="px-6 py-4 border-b border-black/5 flex items-center gap-2">
                            <Eye className="w-4 h-4 text-black/30" />
                            <span className="text-xs font-bold tracking-widets uppercase text-black/30">Canlı Önizleme</span>
                        </div>

                        {/* Mini Hero Preview */}
                        <div className="p-6">
                            <div className="bg-[#F4F4F4] rounded-2xl p-6 flex gap-4">

                                {/* Left text */}
                                <div className="flex-1 flex flex-col justify-center">
                                    <div className="space-y-[-2px]">
                                        {[settings.titleLine1, settings.titleLine2, settings.titleLine3].map((line, i) => (
                                            <p
                                                key={i}
                                                className="text-black font-medium leading-tight tracking-tight"
                                                style={{ fontSize: "clamp(14px, 3vw, 22px)" }}
                                            >
                                                {line || <span className="opacity-20">Satır {i + 1}</span>}
                                            </p>
                                        ))}
                                    </div>
                                </div>

                                {/* Right media preview */}
                                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#D7CCF5] to-[#B6A6EB] relative">
                                    {settings.heroMediaUrl && (
                                        settings.heroMediaType === "video" ? (
                                            <video
                                                src={settings.heroMediaUrl}
                                                autoPlay
                                                muted
                                                loop
                                                playsInline
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <img
                                                src={settings.heroMediaUrl}
                                                alt="Hero preview"
                                                className="w-full h-full object-cover mix-blend-multiply opacity-60"
                                            />
                                        )
                                    )}
                                    {/* Play icon button overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                                            <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-black ml-0.5" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p className="text-center text-xs text-black/30 mt-4 font-medium">
                                Önizleme oransal değildir
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
