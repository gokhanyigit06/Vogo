"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Save, RefreshCw, CheckCircle, Plus, Trash2, Upload, Loader2, Image as ImageIcon } from "lucide-react"

interface TestimonialItem {
    id: string
    quote: string
    authorName: string
    authorRole: string
    image: string
}

const defaultItems: TestimonialItem[] = [
    {
        id: "01",
        quote: "\"Working with them felt like an extension of our own team...\"",
        authorName: "Marcus Thorne",
        authorRole: "CMO, Arrive",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop"
    }
]

export default function TestimonialsAdminPage() {
    const [items, setItems] = useState<TestimonialItem[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    // For file uploads per item
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [targetIndexForUpload, setTargetIndexForUpload] = useState<number | null>(null)

    useEffect(() => {
        fetch("/api/settings")
            .then(r => r.json())
            .then(data => {
                if (data.testimonialsSettings && Array.isArray(data.testimonialsSettings)) {
                    setItems(data.testimonialsSettings)
                } else {
                    setItems(defaultItems)
                }
            })
            .catch(() => setItems(defaultItems))
            .finally(() => setLoading(false))
    }, [])

    const handleSave = async () => {
        setSaving(true)
        try {
            // Fix numbering before save
            const renumberedItems = items.map((t, i) => ({
                ...t,
                id: (i + 1).toString().padStart(2, "0")
            }))
            
            await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    testimonialsSettings: renumberedItems
                })
            })
            setItems(renumberedItems)
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } catch { }
        setSaving(false)
    }

    const addItem = () => {
        const newId = (items.length + 1).toString().padStart(2, "0")
        setItems([
            ...items, 
            { id: newId, quote: "", authorName: "", authorRole: "", image: "" }
        ])
    }

    const updateItem = (index: number, field: keyof TestimonialItem, value: string) => {
        const newItems = [...items]
        newItems[index] = { ...newItems[index], [field]: value }
        setItems(newItems)
    }

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index))
    }

    const triggerUpload = (index: number) => {
        setTargetIndexForUpload(index)
        fileInputRef.current?.click()
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || targetIndexForUpload === null) return
        e.target.value = ""

        if (!file.type.startsWith("image/")) {
            alert("Sadece görsel yükleyebilirsiniz.")
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Dosya çok büyük. Maksimum 5MB.")
            return
        }

        const idx = targetIndexForUpload
        setUploadingIndex(idx)

        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("folder", "testimonials")

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })
            const data = await res.json()

            if (res.ok && data.url) {
                updateItem(idx, "image", data.url)
            } else {
                alert(data.error || "Yükleme başarısız.")
            }
        } catch {
            alert("Sunucu hatası.")
        }
        
        setUploadingIndex(null)
        setTargetIndexForUpload(null)
    }

    const moveItem = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return
        if (direction === 'down' && index === items.length - 1) return
        
        const newItems = [...items]
        const temp = newItems[index]
        newItems[index] = newItems[index + (direction === 'up' ? -1 : 1)]
        newItems[index + (direction === 'up' ? -1 : 1)] = temp
        setItems(newItems)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="max-w-[1000px] mx-auto px-6 md:px-10 py-16 md:py-20 text-black">
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
            />

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-black/40 mb-4">TESTIMONIALS</p>
                    <h1 className="text-[2.5rem] sm:text-[4rem] leading-[0.9] tracking-[-0.04em] font-medium text-black mb-6">
                        Müşteri Yorumları
                    </h1>
                    <p className="text-black/50 text-base max-w-lg">
                        Anasayfadaki "Our Clients Say" dönen yorum kısmını yönet. (Sağ alttaki büyük sayılar otomatik sıralanır)
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={addItem}
                        className="flex items-center gap-2 px-6 py-3.5 bg-white border border-black/10 text-black font-bold rounded-full hover:bg-black/5 transition-all"
                    >
                        <Plus className="w-4 h-4" /> Ekle
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-7 py-3.5 bg-black text-white font-bold rounded-full hover:bg-black/80 disabled:opacity-50 transition-all shadow-lg"
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
                </div>
            </motion.div>

            {/* List */}
            <div className="space-y-6">
                <AnimatePresence>
                    {items.map((item, index) => (
                        <motion.div
                            key={index}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white border border-black/10 hover:border-black/30 transition-colors p-6 rounded-3xl flex flex-col md:flex-row gap-6 relative group"
                        >
                            {/* Sort Arrows */}
                            <div className="flex flex-row md:flex-col items-center justify-center gap-2 text-black/20">
                                <button 
                                    onClick={() => moveItem(index, 'up')}
                                    disabled={index === 0}
                                    className="p-1 hover:text-black hover:bg-black/5 rounded disabled:opacity-30"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                                </button>
                                <span className="font-bold text-sm text-black/40 w-6 text-center shrink-0">
                                    {(index + 1).toString().padStart(2, '0')}
                                </span>
                                <button 
                                    onClick={() => moveItem(index, 'down')}
                                    disabled={index === items.length - 1}
                                    className="p-1 hover:text-black hover:bg-black/5 rounded disabled:opacity-30"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                </button>
                            </div>

                            {/* Author Info & Quote */}
                            <div className="flex-1 space-y-4">
                                <div className="grid grid-cols-2 gap-4 border-b border-black/5 pb-4">
                                    <input
                                        type="text"
                                        value={item.authorName}
                                        onChange={e => updateItem(index, "authorName", e.target.value)}
                                        className="w-full text-xl font-bold bg-transparent focus:outline-none transition-colors placeholder:text-black/20"
                                        placeholder="Kişi Adı (Örn: Sarah Jenkins)"
                                    />
                                    <input
                                        type="text"
                                        value={item.authorRole}
                                        onChange={e => updateItem(index, "authorRole", e.target.value)}
                                        className="w-full text-sm font-medium text-black/60 bg-transparent focus:outline-none transition-colors placeholder:text-black/20 text-right"
                                        placeholder="Pozisyon & Şirket (Örn: E-commerce Director, Caleffi)"
                                    />
                                </div>
                                <textarea
                                    value={item.quote}
                                    onChange={e => updateItem(index, "quote", e.target.value)}
                                    className="w-full text-lg lg:text-xl leading-relaxed font-medium bg-[#FAFAFA] border border-transparent hover:border-black/5 focus:border-black/10 focus:bg-white focus:outline-none p-4 rounded-2xl transition-all resize-y min-h-[140px] placeholder:text-black/20 italic"
                                    placeholder='"Vogo helped us launch a high-performing website..."'
                                />
                            </div>

                            {/* Image area */}
                            <div className="w-full md:w-40 shrink-0 h-40 border border-black/10 rounded-2xl overflow-hidden relative group/img cursor-pointer bg-[#FAFAFA]" onClick={() => triggerUpload(index)}>
                                {uploadingIndex === index ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/5 backdrop-blur-sm z-10 transition-all">
                                        <Loader2 className="w-6 h-6 animate-spin text-black/40 mb-2" />
                                        <span className="text-[10px] font-bold text-black/40 uppercase tracking-wider">Yükleniyor</span>
                                    </div>
                                ) : item.image ? (
                                    <>
                                        <img src={item.image} alt={item.authorName} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                            <Upload className="w-6 h-6 text-white" />
                                        </div>
                                    </>
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-black/30 group-hover/img:text-black/60 transition-colors">
                                        <ImageIcon className="w-8 h-8 mb-2" />
                                        <span className="text-xs font-bold text-center px-4">Fotoğraf<br/>Yükle</span>
                                    </div>
                                )}
                            </div>

                            {/* Delete Button */}
                            <button
                                onClick={() => removeItem(index)}
                                className="absolute -top-3 -right-3 p-2 bg-white text-black/20 hover:text-red-500 hover:bg-red-50 border border-black/10 rounded-full transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                                title="Sil"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {items.length === 0 && (
                    <div className="py-20 text-center border-2 border-dashed border-black/10 rounded-3xl">
                        <p className="text-black/40 font-medium">Hiç müşteri yorumu eklenmemiş.</p>
                        <button onClick={addItem} className="mt-4 text-sm font-bold underline underline-offset-4 hover:text-black/60 transition-colors">
                            Hemen Ekleyin
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
