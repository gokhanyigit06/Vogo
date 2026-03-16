"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Save, RefreshCw, CheckCircle, GripVertical } from "lucide-react"

interface HowWeWorkItem {
    id: string
    title: string
    subtitle: string
    description: string
}

const defaultItems: HowWeWorkItem[] = [
    {
        id: "01",
        title: "Hızlı Teslimat",
        subtitle: "Yeniden kullanılabilir, test edilmiş mimari",
        description: "Temel altyapımız, sayfa oluşturucular, navigasyon, çoklu dil, içerik modelleri ve SEO yapılandırmaları ile onlarca projede iyileştirildi. Projeniz, bir öncekinin bittiği yerden başlar."
    },
    {
        id: "02",
        title: "Varsayılan Olarak Performans",
        subtitle: "İlk günden itibaren SEO ve performans",
        description: "Her proje standart olarak sıkı bir performans denetimi içerir — İçeriğinizin hem geleneksel hem de yapay zeka destekli aramalarda öne çıkması için Temel Web Verileri, yapılandırılmış veri, render stratejisi ve GEO yapılandırması."
    },
    {
        id: "03",
        title: "Kesin Tahminler",
        subtitle: "Kesin tahminler, öngörülebilir teslimat",
        description: "Projelerimizin %90'ı başlangıç kapsamı içinde kalır. Başlangıçta zaman yatırımını yaparak tahminin, inşa edeceğimiz şeyi yansıtmasını sağlarız ve yolda sürprizlerle karşılaşmamanızı garanti ederiz."
    }
]

export default function HowWeWorkAdminPage() {
    const [items, setItems] = useState<HowWeWorkItem[]>(defaultItems)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        fetch("/api/settings")
            .then(r => r.json())
            .then(data => {
                if (data.howWeWorkSettings && Array.isArray(data.howWeWorkSettings)) {
                    setItems(data.howWeWorkSettings)
                }
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
                    howWeWorkSettings: items
                })
            })
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } catch { }
        setSaving(false)
    }

    const updateItem = (index: number, field: keyof HowWeWorkItem, value: string) => {
        const newItems = [...items]
        newItems[index] = { ...newItems[index], [field]: value }
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

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-black/40 mb-4">HOW WE WORK</p>
                    <h1 className="text-[2.5rem] sm:text-[4rem] leading-[0.9] tracking-[-0.04em] font-medium text-black mb-6">
                        Nasıl Çalışıyoruz?
                    </h1>
                    <p className="text-black/50 text-base max-w-lg">
                        Anasayfadaki "How We Work" (Nasıl Çalışıyoruz) 3'lü kart alanındaki içerikleri yönetin.
                    </p>
                </div>

                <div className="flex items-center gap-4">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {items.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white border border-black/10 p-6 rounded-3xl flex flex-col gap-4"
                    >
                        <div className="mb-2">
                            <span className="text-xs font-bold text-black/30 tracking-widest uppercase">
                                Kart {index + 1}
                            </span>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1.5 block">Başlık</label>
                            <input
                                type="text"
                                value={item.title}
                                onChange={e => updateItem(index, "title", e.target.value)}
                                className="w-full text-xl font-bold bg-[#FAFAFA] border border-black/5 focus:border-black/30 focus:outline-none p-3 rounded-xl transition-colors"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1.5 block">Alt Başlık (Opak Yazı)</label>
                            <input
                                type="text"
                                value={item.subtitle}
                                onChange={e => updateItem(index, "subtitle", e.target.value)}
                                className="w-full text-xs font-semibold bg-[#FAFAFA] border border-black/5 focus:border-black/30 focus:outline-none p-3 rounded-xl transition-colors"
                            />
                        </div>

                        <div className="flex-1 flex flex-col">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1.5 block">İçerik</label>
                            <textarea
                                value={item.description}
                                onChange={e => updateItem(index, "description", e.target.value)}
                                className="w-full flex-1 min-h-[120px] text-sm leading-relaxed text-black/70 bg-[#FAFAFA] border border-black/5 focus:border-black/30 focus:outline-none p-3 rounded-xl resize-y transition-colors"
                            />
                        </div>

                    </motion.div>
                ))}
            </div>
            
            <p className="text-center text-xs font-bold text-black/30 tracking-wide mt-12 bg-black/5 rounded-full py-2 w-fit mx-auto px-6">
                Not: Animasyonlar ve iconlar temanın içinde sabit ayarlıdır.  Sadece metinler değiştirilebilir.
            </p>
        </div>
    )
}
