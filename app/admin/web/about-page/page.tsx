"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Save, RefreshCw, CheckCircle, Type, LayoutGrid, Rows } from "lucide-react"

interface DeliveryCard {
    title: string
    desc: string
    iconType: string
}

interface InfoRow {
    title: string
    description: string
    linkText: string
    linkHref: string
}

interface AboutPageSettings {
    heroTitleLine1: string
    heroTitleLine2: string
    heroSubtitle1: string
    heroSubtitle2: string
    deliverySectionTitle: string
    deliverySectionSubtitle: string
    deliveryCards: DeliveryCard[]
    whoWeBuildFor: InfoRow
    ourServices: InfoRow
}

const defaultData: AboutPageSettings = {
    heroTitleLine1: "Headless CMS ile",
    heroTitleLine2: "Gerçek Sonuçlar",
    heroSubtitle1: "Pazarlama ve geliştirme ekiplerinin kullanmayı sevdiği hızlı, esnek platformlar kuruyoruz.",
    heroSubtitle2: "Misyonumuz modern web'i ileriye taşımak — Next.js ve piyasadaki en iyi Headless araçlarını kullanarak teknik netlik, performans ve ölçeklenebilir mimariyi birleştirmek.",
    deliverySectionTitle: "Nasıl Çalışıyoruz?",
    deliverySectionSubtitle: "İlk görüşmeden son teslimata kadar —\nbirlikte nasıl çalışıyoruz?",
    deliveryCards: [
        {
            title: "İş İhtiyaçlarını Belirleme",
            desc: "Biz sadece hizmet süresine değil, çözüm sunmaya odaklanıyoruz. Hedeflerinizi inceleyip, eyleme dönüştürülebilir bir plan oluşturarak başlıyoruz.",
            iconType: "points"
        },
        {
            title: "Doğru Çözümleri Seçme",
            desc: "İşbirlikçi uzmanlığımızdan yararlanarak doğru araç setini seçiyor ve iş hedefleriyle uyumlu hale getiriyoruz.",
            iconType: "rectangles"
        },
        {
            title: "Uygulama Süreci",
            desc: "Süreçlerimizi sizin tercihlerinize göre hizalıyoruz. Şeffaf ve hızlı ilerleyen bir yapıda demolarla geri bildirim seansları düzenliyoruz.",
            iconType: "triangle"
        },
        {
            title: "Proje Sonrası Destek",
            desc: "İster teslimat sonrası molaya ihtiyacınız olsun ister sürekli bakım — çözümlerin sorunsuz çalışması için esnek paketler sunuyoruz.",
            iconType: "cube"
        }
    ],
    whoWeBuildFor: {
        title: "Kimin İçin Üretiyoruz",
        description: "Müşterilerimiz, gelişmiş içerik altyapısı, güçlü editör deneyimi ve performans odaklı bir yapı arayan büyüyen markalar ve kurumsal firmalardır.",
        linkText: "Projelerimiz",
        linkHref: "/portfolio"
    },
    ourServices: {
        title: "Hizmetlerimiz",
        description: "Ölçeklenebilir, UX odaklı pazarlama ve içerik platformları inşa etme konusunda uzmanız — her zaman verimli bütçelerle.",
        linkText: "Hizmetler",
        linkHref: "/services"
    }
}

export default function AboutPageAdmin() {
    const [data, setData] = useState<AboutPageSettings>(defaultData)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    const [activeTab, setActiveTab] = useState<"hero" | "delivery" | "rows">("hero")

    useEffect(() => {
        fetch("/api/settings")
            .then(r => r.json())
            .then(res => {
                if (res.aboutPageSettings) setData(res.aboutPageSettings)
            })
            .catch(() => setData(defaultData))
            .finally(() => setLoading(false))
    }, [])

    const handleSave = async () => {
        setSaving(true)
        try {
            await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ aboutPageSettings: data })
            })
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } catch { }
        setSaving(false)
    }

    const updateField = (field: keyof AboutPageSettings, value: any) => {
        setData(prev => ({ ...prev, [field]: value }))
    }

    const updateDeliveryCard = (index: number, key: keyof DeliveryCard, value: string) => {
        const newData = { ...data }
        newData.deliveryCards[index] = { ...newData.deliveryCards[index], [key]: value }
        setData(newData)
    }
    
    const updateInfoRow = (rowName: 'whoWeBuildFor' | 'ourServices', key: keyof InfoRow, value: string) => {
        const newData = { ...data }
        newData[rowName] = { ...newData[rowName], [key]: value }
        setData(newData)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-16 md:py-20 text-black">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-black/40 mb-4">ABOUT PAGE</p>
                    <h1 className="text-[2.5rem] sm:text-[4rem] leading-[0.9] tracking-[-0.04em] font-medium text-black mb-6">
                        Hakkımızda Sayfası
                    </h1>
                    <p className="text-black/50 text-base max-w-lg">
                        "/about" sayfasının kahraman yazısını, 4'lü işlem gridlerini ve en alttaki yönlendirme satırlarını düzenleyin. (Alttaki How We Work kısmı zaten kendi sayfasından alınır)
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

            {/* Sub-Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-black/10 mb-10 overflow-x-auto no-scrollbar pb-1">
                <button
                    onClick={() => setActiveTab("hero")}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${activeTab === "hero" ? "bg-black text-white" : "bg-black/5 hover:bg-black/10 text-black/70"}`}
                >
                    <Type className="w-4 h-4" /> Ana Başlık (Hero)
                </button>
                <button
                    onClick={() => setActiveTab("delivery")}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${activeTab === "delivery" ? "bg-black text-white" : "bg-black/5 hover:bg-black/10 text-black/70"}`}
                >
                    <LayoutGrid className="w-4 h-4" /> 4'lü Delivery Kutuları
                </button>
                <button
                    onClick={() => setActiveTab("rows")}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${activeTab === "rows" ? "bg-black text-white" : "bg-black/5 hover:bg-black/10 text-black/70"}`}
                >
                    <Rows className="w-4 h-4" /> Bilgi Satırları
                </button>
            </div>

            {/* TAB CONTENT: HERO */}
            {activeTab === "hero" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="p-8 bg-white border border-black/10 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-black/40 mb-3 block">Büyük Başlık (Siyah Kısım)</label>
                            <input 
                                type="text"
                                value={data.heroTitleLine1} 
                                onChange={e => updateField("heroTitleLine1", e.target.value)}
                                className="w-full text-xl font-bold p-4 bg-[#FAFAFA] border border-black/5 rounded-2xl focus:outline-none focus:border-black/30 placeholder:text-black/20"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-black/40 mb-3 block">Büyük Başlık (Gri Kısım)</label>
                            <input 
                                type="text"
                                value={data.heroTitleLine2} 
                                onChange={e => updateField("heroTitleLine2", e.target.value)}
                                className="w-full text-xl font-bold p-4 bg-[#FAFAFA] border border-black/5 rounded-2xl focus:outline-none focus:border-black/30 placeholder:text-black/20 text-black/50"
                            />
                        </div>
                    </div>

                    <div className="p-8 bg-white border border-black/10 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-black/40 mb-3 block">Sağ Üst Alt Başlık</label>
                            <textarea 
                                value={data.heroSubtitle1} 
                                onChange={e => updateField("heroSubtitle1", e.target.value)}
                                className="w-full text-base font-medium p-4 bg-[#FAFAFA] border border-black/5 rounded-2xl min-h-[120px] focus:outline-none focus:border-black/30 placeholder:text-black/20 resize-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-black/40 mb-3 block">Sağ Alt Uzun Açıklama</label>
                            <textarea 
                                value={data.heroSubtitle2} 
                                onChange={e => updateField("heroSubtitle2", e.target.value)}
                                className="w-full text-sm font-medium p-4 bg-[#FAFAFA] border border-black/5 rounded-2xl min-h-[120px] focus:outline-none focus:border-black/30 placeholder:text-black/20 text-black/60 resize-none"
                            />
                        </div>
                    </div>
                </motion.div>
            )}

            {/* TAB CONTENT: DELIVERY BOXES */}
            {activeTab === "delivery" && (
                <div className="space-y-8">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-8 bg-white border border-black/10 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-black/40 mb-3 block">Bölüm Başlığı</label>
                            <input 
                                type="text"
                                value={data.deliverySectionTitle} 
                                onChange={e => updateField("deliverySectionTitle", e.target.value)}
                                className="w-full text-xl font-bold p-4 bg-[#FAFAFA] border border-black/5 rounded-2xl focus:outline-none focus:border-black/30"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-black/40 mb-3 block">Bölüm Açıklaması</label>
                            <textarea 
                                value={data.deliverySectionSubtitle} 
                                onChange={e => updateField("deliverySectionSubtitle", e.target.value)}
                                className="w-full text-sm font-medium p-4 bg-[#FAFAFA] border border-black/5 rounded-2xl min-h-[80px] focus:outline-none focus:border-black/30 resize-y text-black/60"
                            />
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {data.deliveryCards.map((box, idx) => (
                            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }} key={idx} className="p-6 lg:p-8 bg-[#FAFAFA] border border-black/10 rounded-3xl flex flex-col gap-4">
                                <h3 className="text-sm font-bold text-black/40 tracking-widest uppercase border-b border-black/5 pb-2 mb-2">Kutu {idx + 1}</h3>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1.5 block">Kutu Başlığı</label>
                                    <input
                                        type="text"
                                        value={box.title}
                                        onChange={e => updateDeliveryCard(idx, "title", e.target.value)}
                                        className="w-full text-lg font-bold bg-white border border-black/5 focus:border-black/30 focus:outline-none p-4 rounded-xl"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1.5 block">Kutu Açıklaması</label>
                                    <textarea
                                        value={box.desc}
                                        onChange={e => updateDeliveryCard(idx, "desc", e.target.value)}
                                        className="w-full text-sm font-medium bg-white border border-black/5 focus:border-black/30 focus:outline-none p-4 rounded-xl min-h-[100px] resize-y text-black/60"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1.5 block">Tasarım İkonu</label>
                                    <select
                                        value={box.iconType}
                                        onChange={e => updateDeliveryCard(idx, "iconType", e.target.value)}
                                        className="w-full text-sm font-bold bg-white border border-black/5 focus:border-black/30 focus:outline-none p-3 rounded-xl appearance-none"
                                    >
                                        <option value="points">Çizgili Noktalar</option>
                                        <option value="rectangles">Kare Dizin (Sütunlar)</option>
                                        <option value="triangle">Üçgen (Oynat Tuşu gibi)</option>
                                        <option value="cube">Kutu / Küp</option>
                                    </select>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB CONTENT: ROWS */}
            {activeTab === "rows" && (
                <div className="space-y-8">
                    {/* Who We Build For Row */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-8 bg-white border border-black/10 rounded-3xl flex flex-col gap-6">
                        <h3 className="text-xl font-bold tracking-tight border-b border-black/5 pb-4">Üst Satır</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1.5 block">Dev Başlık</label>
                                <input
                                    type="text"
                                    value={data.whoWeBuildFor.title}
                                    onChange={e => updateInfoRow("whoWeBuildFor", "title", e.target.value)}
                                    className="w-full text-lg font-bold bg-[#FAFAFA] border border-black/5 focus:border-black/30 focus:outline-none p-4 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1.5 block">Puntolu Açıklama</label>
                                <textarea
                                    value={data.whoWeBuildFor.description}
                                    onChange={e => updateInfoRow("whoWeBuildFor", "description", e.target.value)}
                                    className="w-full text-sm font-medium bg-[#FAFAFA] border border-black/5 focus:border-black/30 focus:outline-none p-4 rounded-xl min-h-[80px] resize-y"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1.5 block">Bağlantı Metni</label>
                                <input
                                    type="text"
                                    value={data.whoWeBuildFor.linkText}
                                    onChange={e => updateInfoRow("whoWeBuildFor", "linkText", e.target.value)}
                                    className="w-full text-sm font-bold bg-[#FAFAFA] border border-black/5 focus:border-black/30 focus:outline-none p-3 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1.5 block">Bağlantı URL'si</label>
                                <input
                                    type="text"
                                    value={data.whoWeBuildFor.linkHref}
                                    onChange={e => updateInfoRow("whoWeBuildFor", "linkHref", e.target.value)}
                                    className="w-full text-sm font-mono bg-[#FAFAFA] border border-black/5 focus:border-black/30 focus:outline-none p-3 rounded-xl"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Our Services Row */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-8 bg-white border border-black/10 rounded-3xl flex flex-col gap-6">
                        <h3 className="text-xl font-bold tracking-tight border-b border-black/5 pb-4">Alt Satır</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1.5 block">Dev Başlık</label>
                                <input
                                    type="text"
                                    value={data.ourServices.title}
                                    onChange={e => updateInfoRow("ourServices", "title", e.target.value)}
                                    className="w-full text-lg font-bold bg-[#FAFAFA] border border-black/5 focus:border-black/30 focus:outline-none p-4 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1.5 block">Puntolu Açıklama</label>
                                <textarea
                                    value={data.ourServices.description}
                                    onChange={e => updateInfoRow("ourServices", "description", e.target.value)}
                                    className="w-full text-sm font-medium bg-[#FAFAFA] border border-black/5 focus:border-black/30 focus:outline-none p-4 rounded-xl min-h-[80px] resize-y"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1.5 block">Bağlantı Metni</label>
                                <input
                                    type="text"
                                    value={data.ourServices.linkText}
                                    onChange={e => updateInfoRow("ourServices", "linkText", e.target.value)}
                                    className="w-full text-sm font-bold bg-[#FAFAFA] border border-black/5 focus:border-black/30 focus:outline-none p-3 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1.5 block">Bağlantı URL'si</label>
                                <input
                                    type="text"
                                    value={data.ourServices.linkHref}
                                    onChange={e => updateInfoRow("ourServices", "linkHref", e.target.value)}
                                    className="w-full text-sm font-mono bg-[#FAFAFA] border border-black/5 focus:border-black/30 focus:outline-none p-3 rounded-xl"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
