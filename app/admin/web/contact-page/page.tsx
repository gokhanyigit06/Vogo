"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Save, RefreshCw, CheckCircle, Type, Users, MapPin, Link as LinkIcon, HelpCircle, Plus, Trash2, GripVertical } from "lucide-react"

interface FaqItem {
    q: string
    a: string
}

interface SocialLink {
    label: string
    href: string
    iconType: string
}

interface ContactPageSettings {
    heroTitle: string
    heroSubtitle: string
    email: string
    phone: string
    locationText: string
    socialLinks: SocialLink[]
    faqTitle: string
    faqSubtitle: string
    faqItems: FaqItem[]
}

const defaultData: ContactPageSettings = {
    heroTitle: "Birlikte\nçalışalım.",
    heroSubtitle: "Yeni bir projen mi var? Fikirlerini duymak isteriz. Hemen iletişime geç, 24 saat içinde geri döneceğiz.",
    email: "info@vogolab.com",
    phone: "+90 (555) 000 00 00",
    locationText: "İstanbul, TR — GMT+3",
    socialLinks: [
        { label: "Instagram", href: "https://instagram.com/vogolab", iconType: "instagram" },
        { label: "LinkedIn", href: "https://linkedin.com/company/vogolab", iconType: "linkedin" },
        { label: "YouTube", href: "https://youtube.com/@vogolab", iconType: "youtube" },
    ],
    faqTitle: "Sık sorulan\nsorular",
    faqSubtitle: "Aklına takılan başka bir soru varsa formu kullanarak bize ulaşabilirsin.",
    faqItems: [
        {
            q: "Çalışma süreciniz nasıl işliyor?",
            a: "Önce keşif görüşmesi yapıyoruz, ardından strateji ve konsept geliştiriyoruz. Tasarım ve geliştirme aşamalarını paralel yürütüp lansmanla tamamlıyoruz."
        },
        {
            q: "Bir proje ne kadar sürer?",
            a: "Projeye göre değişir. Basit bir landing page 2–3 haftada, kurumsal bir web sitesi 6–10 haftada, tam kapsamlı bir ürün ise 3–6 ayda teslim edilir."
        },
        {
            q: "Fiyatlandırma nasıl yapılıyor?",
            a: "Her proje için özel teklif hazırlıyoruz. Kapsam, süre ve kaynak ihtiyacına göre sabit proje bedeli ya da aylık retainer seçenekleri sunuyoruz."
        },
        {
            q: "Başlangıç için ne yapmam gerekiyor?",
            a: "Formu doldurmak yeterli. 24 saat içinde sizi arayıp ihtiyaçlarınızı dinliyoruz. Sonrasında teklif ve zaman çizelgesi hazırlıyoruz."
        }
    ]
}

export default function ContactPageAdmin() {
    const [data, setData] = useState<ContactPageSettings>(defaultData)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    const [activeTab, setActiveTab] = useState<"hero" | "info" | "social" | "faq">("hero")

    useEffect(() => {
        fetch("/api/settings")
            .then(r => r.json())
            .then(res => {
                if (res.contactPageSettings) setData(res.contactPageSettings)
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
                body: JSON.stringify({ contactPageSettings: data })
            })
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } catch { }
        setSaving(false)
    }

    const updateField = (field: keyof ContactPageSettings, value: any) => {
        setData(prev => ({ ...prev, [field]: value }))
    }

    const updateSocialLink = (index: number, key: keyof SocialLink, value: string) => {
        const newData = { ...data }
        newData.socialLinks[index] = { ...newData.socialLinks[index], [key]: value }
        setData(newData)
    }

    const addSocialLink = () => {
        setData(prev => ({
            ...prev,
            socialLinks: [...prev.socialLinks, { label: "Yeni Sosyal Medya", href: "https://", iconType: "linkedin" }]
        }))
    }

    const removeSocialLink = (index: number) => {
        setData(prev => ({
            ...prev,
            socialLinks: prev.socialLinks.filter((_, i) => i !== index)
        }))
    }

    const updateFaqItem = (index: number, key: keyof FaqItem, value: string) => {
        const newData = { ...data }
        newData.faqItems[index] = { ...newData.faqItems[index], [key]: value }
        setData(newData)
    }

    const addFaqItem = () => {
        setData(prev => ({
            ...prev,
            faqItems: [...prev.faqItems, { q: "Yeni Soru", a: "Yeni Cevap" }]
        }))
    }

    const removeFaqItem = (index: number) => {
        setData(prev => ({
            ...prev,
            faqItems: prev.faqItems.filter((_, i) => i !== index)
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
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-16 md:py-20 text-black">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-black/40 mb-4">CONTACT PAGE</p>
                    <h1 className="text-[2.5rem] sm:text-[4rem] leading-[0.9] tracking-[-0.04em] font-medium text-black mb-6">
                        İletişim Sayfası
                    </h1>
                    <p className="text-black/50 text-base max-w-lg">
                        "/contact" sayfasının metinlerini, iletişim bilgilerini, sosyal medya bağlantılarını ve Sık Sorulan Sorularını yönet.
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
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === "hero" ? "bg-black text-white" : "bg-black/5 hover:bg-black/10 text-black/70"}`}
                >
                    <Type className="w-4 h-4" /> Ana Başlık (Hero)
                </button>
                <button
                    onClick={() => setActiveTab("info")}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === "info" ? "bg-black text-white" : "bg-black/5 hover:bg-black/10 text-black/70"}`}
                >
                    <MapPin className="w-4 h-4" /> İletişim Bilgileri
                </button>
                <button
                    onClick={() => setActiveTab("social")}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === "social" ? "bg-black text-white" : "bg-black/5 hover:bg-black/10 text-black/70"}`}
                >
                    <LinkIcon className="w-4 h-4" /> Sosyal Medya
                </button>
                <button
                    onClick={() => setActiveTab("faq")}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === "faq" ? "bg-black text-white" : "bg-black/5 hover:bg-black/10 text-black/70"}`}
                >
                    <HelpCircle className="w-4 h-4" /> SSS (FAQ)
                </button>
            </div>

            {/* TAB CONTENT: HERO */}
            {activeTab === "hero" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="p-8 bg-white border border-black/10 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-black/40 mb-3 block">Büyük Başlık</label>
                            <textarea 
                                value={data.heroTitle} 
                                onChange={e => updateField("heroTitle", e.target.value)}
                                className="w-full text-xl font-bold p-4 bg-[#FAFAFA] border border-black/5 rounded-2xl focus:outline-none focus:border-black/30 placeholder:text-black/20 min-h-[120px]"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-black/40 mb-3 block">Açıklama</label>
                            <textarea 
                                value={data.heroSubtitle} 
                                onChange={e => updateField("heroSubtitle", e.target.value)}
                                className="w-full text-base font-medium p-4 bg-[#FAFAFA] border border-black/5 rounded-2xl min-h-[120px] focus:outline-none focus:border-black/30 placeholder:text-black/20 resize-none"
                            />
                        </div>
                    </div>
                </motion.div>
            )}

            {/* TAB CONTENT: INFO */}
            {activeTab === "info" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="p-8 bg-white border border-black/10 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-black/40 mb-3 block">E-posta</label>
                            <input 
                                type="text"
                                value={data.email} 
                                onChange={e => updateField("email", e.target.value)}
                                className="w-full text-lg font-bold p-4 bg-[#FAFAFA] border border-black/5 rounded-2xl focus:outline-none focus:border-black/30"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-black/40 mb-3 block">Telefon</label>
                            <input 
                                type="text"
                                value={data.phone} 
                                onChange={e => updateField("phone", e.target.value)}
                                className="w-full text-lg font-bold p-4 bg-[#FAFAFA] border border-black/5 rounded-2xl focus:outline-none focus:border-black/30"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-black/40 mb-3 block">Konum (Yeşil Işıklı Etiket)</label>
                            <input 
                                type="text"
                                value={data.locationText} 
                                onChange={e => updateField("locationText", e.target.value)}
                                className="w-full text-lg font-bold p-4 bg-[#FAFAFA] border border-black/5 rounded-2xl focus:outline-none focus:border-black/30"
                            />
                        </div>
                    </div>
                </motion.div>
            )}

            {/* TAB CONTENT: SOCIAL */}
            {activeTab === "social" && (
                <div className="space-y-6">
                    <AnimatePresence>
                        {data.socialLinks.map((link, idx) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                exit={{ opacity: 0, height: 0 }}
                                key={idx} 
                                className="p-6 bg-white border border-black/10 rounded-2xl flex flex-col md:flex-row gap-4 items-center"
                            >
                                <div className="p-3 bg-black/5 rounded-full cursor-grab">
                                    <GripVertical className="w-5 h-5 text-black/40" />
                                </div>
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1.5 block">Platform Adı</label>
                                        <input
                                            type="text"
                                            value={link.label}
                                            onChange={e => updateSocialLink(idx, "label", e.target.value)}
                                            className="w-full text-sm font-bold bg-[#FAFAFA] border border-black/5 focus:border-black/30 focus:outline-none p-3 rounded-xl"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1.5 block">URL</label>
                                        <input
                                            type="text"
                                            value={link.href}
                                            onChange={e => updateSocialLink(idx, "href", e.target.value)}
                                            className="w-full text-sm font-mono bg-[#FAFAFA] border border-black/5 focus:border-black/30 focus:outline-none p-3 rounded-xl"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1.5 block">İkon</label>
                                        <select
                                            value={link.iconType}
                                            onChange={e => updateSocialLink(idx, "iconType", e.target.value)}
                                            className="w-full text-sm font-bold bg-[#FAFAFA] border border-black/5 focus:border-black/30 focus:outline-none p-3 rounded-xl appearance-none"
                                        >
                                            <option value="instagram">Instagram</option>
                                            <option value="linkedin">LinkedIn</option>
                                            <option value="youtube">YouTube</option>
                                        </select>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeSocialLink(idx)}
                                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    
                    <button
                        onClick={addSocialLink}
                        className="w-full py-6 border-2 border-dashed border-black/10 rounded-2xl flex items-center justify-center gap-2 text-black/50 hover:bg-black/5 hover:text-black hover:border-black/30 font-bold transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Yeni Sosyal Medya Ekle
                    </button>
            </div>
            )}

            {/* TAB CONTENT: FAQ */}
            {activeTab === "faq" && (
                <div className="space-y-8">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-8 bg-white border border-black/10 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-black/40 mb-3 block">SSS Başlığı</label>
                            <textarea
                                value={data.faqTitle}
                                onChange={e => updateField("faqTitle", e.target.value)}
                                className="w-full text-xl font-bold p-4 bg-[#FAFAFA] border border-black/5 rounded-2xl focus:outline-none focus:border-black/30 min-h-[100px]"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-black/40 mb-3 block">SSS Açıklaması</label>
                            <textarea
                                value={data.faqSubtitle}
                                onChange={e => updateField("faqSubtitle", e.target.value)}
                                className="w-full text-sm font-medium p-4 bg-[#FAFAFA] border border-black/5 rounded-2xl min-h-[100px] focus:outline-none focus:border-black/30 text-black/60"
                            />
                        </div>
                    </motion.div>

                    <div className="space-y-6">
                        <AnimatePresence>
                            {data.faqItems.map((item, idx) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    exit={{ opacity: 0, height: 0 }}
                                    key={idx} 
                                    className="p-6 bg-white border border-black/10 rounded-2xl flex flex-col md:flex-row gap-4 items-start"
                                >
                                    <div className="p-3 bg-black/5 rounded-full cursor-grab mt-2">
                                        <GripVertical className="w-5 h-5 text-black/40" />
                                    </div>
                                    <div className="flex-1 space-y-4 w-full">
                                        <div>
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1.5 block">Soru</label>
                                            <input
                                                type="text"
                                                value={item.q}
                                                onChange={e => updateFaqItem(idx, "q", e.target.value)}
                                                className="w-full text-lg font-bold bg-[#FAFAFA] border border-black/5 focus:border-black/30 focus:outline-none p-4 rounded-xl"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1.5 block">Cevap</label>
                                            <textarea
                                                value={item.a}
                                                onChange={e => updateFaqItem(idx, "a", e.target.value)}
                                                className="w-full text-sm font-medium bg-[#FAFAFA] border border-black/5 focus:border-black/30 focus:outline-none p-4 rounded-xl min-h-[80px] text-black/70 resize-y"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFaqItem(idx)}
                                        className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0 mt-2"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        <button
                            onClick={addFaqItem}
                            className="w-full py-8 border-2 border-dashed border-black/10 rounded-2xl flex items-center justify-center gap-2 text-black/50 hover:bg-black/5 hover:text-black hover:border-black/30 font-bold transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            Yeni Soru Ekle
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
