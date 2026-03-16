"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Save, RefreshCw, CheckCircle, Plus, Trash2, Settings, List, Layers, Type } from "lucide-react"

interface Subsection {
    subtitle: string
    description: string
    items: string[]
}

interface ServiceSection {
    id: string
    title: string
    subsections: Subsection[]
}

interface GridBox {
    title: string
    link: string
    iconType: string
}

interface ServicesPageSettings {
    heroTitle: string
    gridBoxes: GridBox[]
    sections: ServiceSection[]
}

const defaultData: ServicesPageSettings = {
    heroTitle: "UZMANLIĞIMIZ",
    gridBoxes: [
        { title: "Headless CMS\nGeliştirme", link: "#headless-cms", iconType: "cms" },
        { title: "Headless E-Ticaret\nGeliştirme", link: "#headless-ecommerce", iconType: "ecommerce" },
        { title: "Yapay Zeka &\nEntegrasyonlar", link: "#ai-integrations", iconType: "ai" },
        { title: "Tasarım", link: "#design", iconType: "design" }
    ],
    sections: [
        {
            id: "headless-cms",
            title: "Headless CMS\nGeliştirme",
            subsections: [
                {
                    subtitle: "CMS Entegrasyonu",
                    description: "Dinamik içerik dağıtımı için uzman CMS entegrasyonları",
                    items: ["Payload", "Storyblok", "Sanity", "Directus", "Contentful", "Dato CMS"]
                }
            ]
        },
        {
            id: "headless-ecommerce",
            title: "Headless\nE-Ticaret\nGeliştirme",
            subsections: [
                {
                    subtitle: "E-Ticaret Mimarisi",
                    description: "En yeni çevrimiçi perakende deneyimleri için özel  E-Ticaret sistemleri",
                    items: ["Shopify Hydrogen", "Swell", "Crystallize", "Medusa", "Commerce Layer"]
                }
            ]
        },
        {
            id: "modern-web",
            title: "Modern Web &\nJamstack Geliştirme",
            subsections: [
                {
                    subtitle: "Modern Web Geliştirme",
                    description: "Modern Çevik yaklaşımla\nöncü Web çözümleri",
                    items: ["Jamstack Mimarisi", "Next.JS Geliştirme", "Self-Hosted Next.JS", "Next.JS App Router"]
                },
                {
                    subtitle: "Next.JS Denetimleri",
                    description: "Next.JS web sitesinin performansı\nve mimari denetim hizmetleri",
                    items: ["Next.JS Yapay Zeka SEO Denetimi", "Next.JS Performans Denetimi"]
                }
            ]
        },
        {
            id: "ai-integrations",
            title: "Yapay Zeka &\nGelişmiş Entegrasyonlar",
            subsections: [
                {
                    subtitle: "Yapay Zeka Entegrasyon Hizmetleri",
                    description: "Yapay Zeka araçları ve çerçevelerini kullanarak\ngelişmiş entegrasyonlar geliştirme",
                    items: ["ChatGPT & Yapay Zeka Entegrasyonları", "Yapay Zeka KIT", "E-Ticaret için Özel ChatGPT Uygulamaları", "MedusaJS ChatGPT Uygulaması"]
                }
            ]
        },
        {
            id: "design",
            title: "Tasarım",
            subsections: [
                {
                    subtitle: "Dijital Tasarım",
                    description: "Tüm yaratıcı işler ilk taslaktan son arayüze kadar FocusReactive tarafından sunulur.",
                    items: ["UI/UX Tasarım", "Markalaşma", "Hareketli Grafikler ve Animasyonlar"]
                }
            ]
        }
    ]
}

export default function ServicesPageAdmin() {
    const [data, setData] = useState<ServicesPageSettings>(defaultData)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    const [activeTab, setActiveTab] = useState<"hero" | "grid" | "sections">("hero")
    const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null)

    useEffect(() => {
        fetch("/api/settings")
            .then(r => r.json())
            .then(res => {
                if (res.servicesPageSettings) {
                    setData(res.servicesPageSettings)
                }
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
                body: JSON.stringify({ servicesPageSettings: data })
            })
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } catch { }
        setSaving(false)
    }

    // Grid Box functions
    const updateGridBox = (index: number, key: keyof GridBox, value: string) => {
        const newData = { ...data }
        newData.gridBoxes[index] = { ...newData.gridBoxes[index], [key]: value }
        setData(newData)
    }

    // Section Functions
    const addSection = () => {
        const newData = { ...data }
        newData.sections.push({
            id: `section-${Date.now()}`,
            title: "Yeni Bölüm",
            subsections: [
                { subtitle: "Alt Başlık", description: "Açıklama...", items: ["Madde 1"] }
            ]
        })
        setData(newData)
        setActiveSectionIndex(newData.sections.length - 1)
    }

    const removeSection = (index: number) => {
        const newData = { ...data }
        newData.sections.splice(index, 1)
        setData(newData)
        setActiveSectionIndex(null)
    }

    const updateSection = (index: number, key: keyof ServiceSection, value: any) => {
        const newData = { ...data }
        newData.sections[index] = { ...newData.sections[index], [key]: value }
        setData(newData)
    }

    // Subsection Functions
    const addSubsection = (secIndex: number) => {
        const newData = { ...data }
        newData.sections[secIndex].subsections.push({
            subtitle: "Yeni Alt Başlık", description: "", items: []
        })
        setData(newData)
    }

    const removeSubsection = (secIndex: number, subIndex: number) => {
        const newData = { ...data }
        newData.sections[secIndex].subsections.splice(subIndex, 1)
        setData(newData)
    }

    const updateSubsection = (secIndex: number, subIndex: number, key: keyof Subsection, value: any) => {
        const newData = { ...data }
        newData.sections[secIndex].subsections[subIndex] = { ...newData.sections[secIndex].subsections[subIndex], [key]: value }
        setData(newData)
    }

    // Item Functions (within Subsection)
    const addItem = (secIndex: number, subIndex: number) => {
        const newData = { ...data }
        newData.sections[secIndex].subsections[subIndex].items.push("Yeni Madde")
        setData(newData)
    }

    const removeItem = (secIndex: number, subIndex: number, itemIndex: number) => {
        const newData = { ...data }
        newData.sections[secIndex].subsections[subIndex].items.splice(itemIndex, 1)
        setData(newData)
    }

    const updateItem = (secIndex: number, subIndex: number, itemIndex: number, value: string) => {
        const newData = { ...data }
        newData.sections[secIndex].subsections[subIndex].items[itemIndex] = value
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
                    <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-black/40 mb-4">SERVICES PAGE</p>
                    <h1 className="text-[2.5rem] sm:text-[4rem] leading-[0.9] tracking-[-0.04em] font-medium text-black mb-6">
                        Hizmetler Sayfası
                    </h1>
                    <p className="text-black/50 text-base max-w-lg">
                        "/services" sayfasının kahraman yazısını (Our Expertise), 4'lü gezinme kutularını ve tüm detaylı madde bloklarını düzenleyin.
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
                    onClick={() => { setActiveTab("hero"); setActiveSectionIndex(null); }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${activeTab === "hero" ? "bg-black text-white" : "bg-black/5 hover:bg-black/10 text-black/70"}`}
                >
                    <Type className="w-4 h-4" /> Ana Başlık (Hero)
                </button>
                <button
                    onClick={() => { setActiveTab("grid"); setActiveSectionIndex(null); }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${activeTab === "grid" ? "bg-black text-white" : "bg-black/5 hover:bg-black/10 text-black/70"}`}
                >
                    <List className="w-4 h-4" /> 4'lü Grid Kutuları
                </button>
                <button
                    onClick={() => { setActiveTab("sections"); setActiveSectionIndex(null); }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${activeTab === "sections" ? "bg-black text-white" : "bg-black/5 hover:bg-black/10 text-black/70"}`}
                >
                    <Layers className="w-4 h-4" /> Detay Bölümleri ({data.sections.length})
                </button>
            </div>

            {/* TAB CONTENT: HERO */}
            {activeTab === "hero" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-8 bg-white border border-black/10 rounded-3xl">
                    <label className="text-xs font-bold uppercase tracking-widest text-black/40 mb-3 block">Hero Yazısı (Ana Başlık)</label>
                    <textarea 
                        value={data.heroTitle} 
                        onChange={e => setData(d => ({ ...d, heroTitle: e.target.value }))}
                        className="w-full text-3xl font-bold p-6 bg-[#FAFAFA] border border-black/5 rounded-2xl min-h-[150px] focus:outline-none focus:border-black/30 placeholder:text-black/20"
                        placeholder="Örn: OUR EXPERTISE"
                    />
                    <p className="text-xs text-black/40 mt-3 font-medium">\n (Alt satıra geçmek için Enter'a basın)</p>
                </motion.div>
            )}

            {/* TAB CONTENT: GRID BOXES */}
            {activeTab === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.gridBoxes.map((box, idx) => (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} key={idx} className="p-6 lg:p-8 bg-white border border-black/10 rounded-3xl flex flex-col gap-4">
                            <h3 className="text-sm font-bold text-black/40 tracking-widest uppercase border-b border-black/5 pb-2 mb-2">Kutu {idx + 1}</h3>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1.5 block">Kutu Başlığı</label>
                                <textarea
                                    value={box.title}
                                    onChange={e => updateGridBox(idx, "title", e.target.value)}
                                    className="w-full text-lg font-bold bg-[#FAFAFA] border border-black/5 focus:border-black/30 focus:outline-none p-4 rounded-xl resize-y min-h-[80px]"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1.5 block">HTML ID Linki</label>
                                    <input
                                        type="text"
                                        value={box.link}
                                        onChange={e => updateGridBox(idx, "link", e.target.value)}
                                        className="w-full text-sm font-mono bg-[#FAFAFA] border border-black/5 focus:border-black/30 focus:outline-none p-3 rounded-xl"
                                        placeholder="Örn: #headless-cms"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1.5 block">Tasarım İkonu</label>
                                    <select
                                        value={box.iconType}
                                        onChange={e => updateGridBox(idx, "iconType", e.target.value)}
                                        className="w-full text-sm font-bold bg-[#FAFAFA] border border-black/5 focus:border-black/30 focus:outline-none p-3 rounded-xl appearance-none"
                                    >
                                        <option value="cms">CMS</option>
                                        <option value="ecommerce">eCommerce</option>
                                        <option value="ai">AI</option>
                                        <option value="design">Design</option>
                                        <option value="web">Web</option>
                                    </select>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* TAB CONTENT: SECTIONS */}
            {activeTab === "sections" && (
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* Left: Section List */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-3 sticky top-24">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-black/50 tracking-widest uppercase">Bölümler</span>
                            <button onClick={addSection} className="text-xs font-bold bg-black text-white px-3 py-1.5 rounded-full hover:opacity-80 transition-opacity">
                                + Yeni Bölüm
                            </button>
                        </div>

                        {data.sections.map((sec, idx) => (
                            <button
                                key={sec.id}
                                onClick={() => setActiveSectionIndex(idx)}
                                className={`text-left p-4 rounded-2xl border transition-all ${activeSectionIndex === idx ? "bg-black text-white border-black" : "bg-white border-black/10 hover:border-black/30 text-black group"}`}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-sm whitespace-pre-line leading-tight">{sec.title || "İsimsiz Bölüm"}</span>
                                    {activeSectionIndex !== idx && (
                                        <span className="text-black/30 group-hover:text-black/60"><Settings className="w-4 h-4" /></span>
                                    )}
                                </div>
                                <div className={`text-xs mt-2 font-mono ${activeSectionIndex === idx ? "text-white/50" : "text-black/40"}`}>#{sec.id}</div>
                            </button>
                        ))}
                    </div>

                    {/* Right: Active Section Editor */}
                    <div className="w-full lg:w-2/3">
                        {activeSectionIndex !== null && data.sections[activeSectionIndex] ? (
                            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} key={data.sections[activeSectionIndex].id} className="bg-white border border-black/10 rounded-3xl p-6 lg:p-10">
                                
                                {/* Section Header Actions */}
                                <div className="flex justify-between items-center mb-8 border-b border-black/5 pb-6">
                                    <h2 className="text-2xl font-bold tracking-tight">Bölüm Ayarları</h2>
                                    <button onClick={() => removeSection(activeSectionIndex)} className="text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
                                        <Trash2 className="w-4 h-4" /> Bölümü Sil
                                    </button>
                                </div>

                                {/* Section Master Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1.5 block">HTML Bağlantı ID'si (Örn: #headless-cms)</label>
                                        <input
                                            type="text"
                                            value={data.sections[activeSectionIndex].id}
                                            onChange={e => updateSection(activeSectionIndex, "id", e.target.value)}
                                            className="w-full text-base font-mono bg-[#FAFAFA] border border-black/5 focus:border-black/30 focus:outline-none p-3.5 rounded-xl"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1.5 block">Sol Büyük Başlık</label>
                                        <textarea
                                            value={data.sections[activeSectionIndex].title}
                                            onChange={e => updateSection(activeSectionIndex, "title", e.target.value)}
                                            className="w-full text-lg font-bold bg-[#FAFAFA] border border-black/5 focus:border-black/30 focus:outline-none p-3.5 rounded-xl min-h-[50px] resize-y"
                                        />
                                    </div>
                                </div>

                                {/* Subsections Loop */}
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-lg font-bold tracking-tight">Listeler (Alt Başlıklar)</h3>
                                    <button onClick={() => addSubsection(activeSectionIndex)} className="text-xs font-bold border border-black/20 text-black px-4 py-2 rounded-full hover:bg-black/5 transition-colors">
                                        + Alt Başlık (Grup) Ekle
                                    </button>
                                </div>

                                <div className="space-y-8">
                                    {data.sections[activeSectionIndex].subsections.map((sub, sIdx) => (
                                        <div key={sIdx} className="p-6 bg-[#FAFAFA] border border-black/5 rounded-2xl relative">
                                            
                                            <button onClick={() => removeSubsection(activeSectionIndex, sIdx)} className="absolute top-4 right-4 p-2 text-black/30 hover:text-red-500 bg-white shadow-sm border border-black/5 rounded-full transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-12 mb-6 border-b border-black/5 pb-6">
                                                <div>
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1.5 block">Alt BaŞlIk</label>
                                                    <input
                                                        type="text"
                                                        value={sub.subtitle}
                                                        onChange={e => updateSubsection(activeSectionIndex, sIdx, "subtitle", e.target.value)}
                                                        className="w-full text-base font-bold bg-white border border-black/5 focus:border-black/30 focus:outline-none p-3 rounded-xl"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1.5 block">KISA AÇIKLAMA</label>
                                                    <textarea
                                                        value={sub.description}
                                                        onChange={e => updateSubsection(activeSectionIndex, sIdx, "description", e.target.value)}
                                                        className="w-full text-sm font-medium bg-white border border-black/5 focus:border-black/30 focus:outline-none p-3 rounded-xl resize-y min-h-[46px]"
                                                    />
                                                </div>
                                            </div>

                                            {/* Items inside subsection */}
                                            <div>
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-3 block">Maddeler (Sağdaki Liste)</label>
                                                <div className="space-y-3 mb-4">
                                                    {sub.items.map((item, iIdx) => (
                                                        <div key={iIdx} className="flex gap-3">
                                                            <div className="flex-1 relative">
                                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-mono text-black/20">{(iIdx + 1).toString().padStart(2, '0')}</span>
                                                                <input
                                                                    type="text"
                                                                    value={item}
                                                                    onChange={e => updateItem(activeSectionIndex, sIdx, iIdx, e.target.value)}
                                                                    className="w-full pl-10 pr-4 py-3 bg-white border border-black/5 rounded-xl text-sm font-bold focus:outline-none focus:border-black/30 transition-colors"
                                                                />
                                                            </div>
                                                            <button onClick={() => removeItem(activeSectionIndex, sIdx, iIdx)} className="px-4 bg-white border border-black/5 rounded-xl text-black/40 hover:text-red-500 transition-colors">
                                                                X
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                                <button onClick={() => addItem(activeSectionIndex, sIdx)} className="text-xs font-bold bg-white border border-black/10 text-black px-4 py-2 rounded-lg hover:border-black/30 transition-colors">
                                                    + Madde Ekle
                                                </button>
                                            </div>

                                        </div>
                                    ))}
                                    
                                    {data.sections[activeSectionIndex].subsections.length === 0 && (
                                        <p className="text-sm font-bold text-black/30 py-4 text-center">Bu bölüme ait hiç liste yok.</p>
                                    )}
                                </div>

                            </motion.div>
                        ) : (
                            <div className="h-full min-h-[400px] border-2 border-dashed border-black/10 rounded-3xl flex items-center justify-center text-center p-10">
                                <div>
                                    <Settings className="w-12 h-12 text-black/10 mx-auto mb-4" />
                                    <p className="text-black/40 font-bold tracking-tight">Detaylarını düzenlemek için<br/>soldan bir bölüm seçin veya yeni bir tane ekleyin.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
