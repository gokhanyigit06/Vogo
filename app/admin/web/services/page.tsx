"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Save, RefreshCw, CheckCircle, Plus, Trash2, GripVertical, Settings } from "lucide-react"

interface ServiceItem {
    id: string
    title: string
    description: string
}

const defaultServices: ServiceItem[] = [
    {
        id: "01",
        title: "İçerik Pazarlama Platformları",
        description: "Yüksek hacimli içerik operasyonları ve editör ekipleri için özel olarak oluşturulmuş CMS çözümleri. Ölçeklenebilir mimari ve headless esnekliği sağlıyoruz.",
    },
    {
        id: "02",
        title: "İçerik Odaklı E-Ticaret",
        description: "Ticaret ve içeriği kusursuz bir şekilde harmanlıyor, markanızın hikayesini anlatan ve dönüşümleri artıran yüksek performanslı vitrinler oluşturuyoruz.",
    },
    {
        id: "03",
        title: "NextJS SEO ve Performans Denetimleri",
        description: "NextJS performansı, erişilebilirlik, Core Web Vitals ve yapılandırılmış SEO üzerine odaklanan, eyleme geçirilebilir teknik denetimler.",
    },
    {
        id: "04",
        title: "Yapay Zeka ve Gelişmiş Entegrasyonlar",
        description: "İşletmenizi geleceğe bağlıyoruz. En yeni yapay zeka özelliklerini, özel API'leri ve karmaşık arka plan sistemlerini kusursuz bir şekilde entegre ediyoruz.",
    },
    {
        id: "05",
        title: "Web Tasarım",
        description: "Stratejik, kullanıcı odaklı ve son derece estetik. Markanızı yücelten ve hedef kitlenizi derinden etkileyen dijital deneyimler tasarlıyoruz.",
    }
]

export default function ServicesAdminPage() {
    const [services, setServices] = useState<ServiceItem[]>(defaultServices)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        fetch("/api/settings")
            .then(r => r.json())
            .then(data => {
                if (data.servicesSettings && Array.isArray(data.servicesSettings)) {
                    setServices(data.servicesSettings)
                }
            })
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    const handleSave = async () => {
        setSaving(true)
        try {
            // Fix numbering before save
            const renumberedServices = services.map((s, i) => ({
                ...s,
                id: (i + 1).toString().padStart(2, "0")
            }))
            
            await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    servicesSettings: renumberedServices
                })
            })
            setServices(renumberedServices)
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } catch { }
        setSaving(false)
    }

    const addService = () => {
        const newId = (services.length + 1).toString().padStart(2, "0")
        setServices([
            ...services, 
            { id: newId, title: "Yeni Hizmet", description: "Hizmet açıklaması..." }
        ])
    }

    const updateService = (index: number, field: keyof ServiceItem, value: string) => {
        const newServices = [...services]
        newServices[index] = { ...newServices[index], [field]: value }
        setServices(newServices)
    }

    const removeService = (index: number) => {
        setServices(services.filter((_, i) => i !== index))
    }

    const moveService = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return
        if (direction === 'down' && index === services.length - 1) return
        
        const newServices = [...services]
        const temp = newServices[index]
        newServices[index] = newServices[index + (direction === 'up' ? -1 : 1)]
        newServices[index + (direction === 'up' ? -1 : 1)] = temp
        setServices(newServices)
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
                    <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-black/40 mb-4">SERVİSLER</p>
                    <h1 className="text-[2.5rem] sm:text-[4rem] leading-[0.9] tracking-[-0.04em] font-medium text-black mb-6">
                        Hizmetlerimiz
                    </h1>
                    <p className="text-black/50 text-base max-w-lg">
                        Anasayfadaki akordeon servisler listesini düzenleyin. (Baştaki numaralar otomatik sıralanır)
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={addService}
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
            <div className="space-y-4">
                <AnimatePresence>
                    {services.map((service, index) => (
                        <motion.div
                            key={index} // Can't easily use ID if they swap, so keep index to allow smooth layout shifts or just accept re-renders
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white border border-black/10 hover:border-black/30 transition-colors p-6 rounded-3xl flex gap-6"
                        >
                            <div className="flex flex-col items-center justify-center gap-2 text-black/20">
                                <button 
                                    onClick={() => moveService(index, 'up')}
                                    disabled={index === 0}
                                    className="p-1 hover:text-black hover:bg-black/5 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                                </button>
                                <span className="font-bold text-sm text-black/40 w-6 text-center">
                                    {(index + 1).toString().padStart(2, '0')}
                                </span>
                                <button 
                                    onClick={() => moveService(index, 'down')}
                                    disabled={index === services.length - 1}
                                    className="p-1 hover:text-black hover:bg-black/5 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                </button>
                            </div>

                            <div className="flex-1 space-y-4">
                                <input
                                    type="text"
                                    value={service.title}
                                    onChange={e => updateService(index, "title", e.target.value)}
                                    className="w-full text-2xl md:text-3xl font-bold bg-transparent border-b border-black/5 focus:border-black/30 focus:outline-none pb-2 transition-colors placeholder:text-black/20"
                                    placeholder="Hizmet Başlığı"
                                />
                                <textarea
                                    value={service.description}
                                    onChange={e => updateService(index, "description", e.target.value)}
                                    className="w-full text-black/60 bg-transparent border border-transparent hover:border-black/5 focus:border-black/10 focus:bg-black/5 focus:outline-none p-3 rounded-xl transition-all resize-y min-h-[100px] placeholder:text-black/20"
                                    placeholder="Bu hizmetin detaylı açıklaması..."
                                />
                            </div>

                            <div className="flex items-start">
                                <button
                                    onClick={() => removeService(index)}
                                    className="p-2.5 text-black/30 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                    title="Sil"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {services.length === 0 && (
                    <div className="py-20 text-center border-2 border-dashed border-black/10 rounded-3xl">
                        <p className="text-black/40 font-medium">Hiç hizmet eklenmemiş.</p>
                        <button onClick={addService} className="mt-4 text-sm font-bold underline underline-offset-4 hover:text-black/60 transition-colors">
                            Hemen Ekleyin
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
