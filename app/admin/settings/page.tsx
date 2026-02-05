"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
    Settings, Save, Globe, Smartphone, Share2, BarChart,
    FileText, Instagram, Twitter, Linkedin, Facebook, Youtube,
    MapPin, Phone, Mail, MessageCircle, Code, LayoutTemplate
} from "lucide-react"
import ImageUpload from "@/components/ImageUpload"

type SettingsData = {
    // Genel
    siteTitle: string
    siteDescription: string
    logo: string
    favicon: string

    // İletişim
    email: string
    phone: string
    whatsapp: string
    address: string
    mapUrl: string

    // Sosyal
    instagram: string
    twitter: string
    linkedin: string
    facebook: string
    youtube: string

    // Marketing & SEO
    googleAnalytics: string
    googleVerification: string // Search Console
    facebookPixel: string
    googleTagManager: string
    customHeadScripts: string
    customBodyScripts: string

    maintenanceMode: boolean
}

const initialSettings: SettingsData = {
    siteTitle: "", siteDescription: "", logo: "", favicon: "",
    email: "", phone: "", whatsapp: "", address: "", mapUrl: "",
    instagram: "", twitter: "", linkedin: "", facebook: "", youtube: "",
    googleAnalytics: "", googleVerification: "", facebookPixel: "", googleTagManager: "",
    customHeadScripts: "", customBodyScripts: "",
    maintenanceMode: false
}

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("general")
    const [settings, setSettings] = useState<SettingsData>(initialSettings)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                setSettings({ ...initialSettings, ...data })
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    const handleSave = async () => {
        setSaving(true)
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            })
            if (res.ok) alert('Ayarlar güncellendi!')
            else alert('Bir hata oluştu.')
        } catch (error) {
            console.error(error)
            alert('Bağlantı hatası.')
        } finally {
            setSaving(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setSettings(prev => ({ ...prev, [name]: value }))
    }

    const toggleMaintenance = () => {
        setSettings(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }))
    }

    if (loading) return <div className="p-8 text-center text-muted-foreground">Ayarlar yükleniyor...</div>

    const tabs = [
        { id: "general", label: "Genel", icon: Globe },
        { id: "contact", label: "İletişim", icon: Smartphone },
        { id: "social", label: "Sosyal Medya", icon: Share2 },
        { id: "marketing", label: "SEO & Pazarlama", icon: BarChart }
    ]

    return (
        <div className="p-8 max-w-5xl mx-auto min-h-screen">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                        <Settings className="w-8 h-8 text-emerald-500" />
                        Kaptan Köşkü
                    </h1>
                    <p className="text-muted-foreground mt-1">Sitenizin tüm global ayarlarını buradan yönetin.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {saving ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Save className="w-5 h-5" />}
                    {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">

                {/* Sidebar / Tabs */}
                <div className="w-full lg:w-64 flex-shrink-0">
                    <div className="bg-card border border-border rounded-2xl p-2 flex lg:flex-col gap-1 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-emerald-500 text-white shadow-md'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Maintenance Mode Toggle */}
                    <div className="mt-6 bg-card border border-border rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-foreground">Bakım Modu</span>
                            <div
                                onClick={toggleMaintenance}
                                className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${settings.maintenanceMode ? 'bg-amber-500' : 'bg-slate-700'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${settings.maintenanceMode ? 'translate-x-4' : 'translate-x-0'}`} />
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Aktifken site ziyaretçilere kapanır. Sadece adminler görebilir.
                        </p>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-card border border-border rounded-3xl p-6 lg:p-8 shadow-sm">

                    {/* --- GENERAL TAB --- */}
                    {activeTab === "general" && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-emerald-500" /> Genel Ayarlar
                            </h2>

                            <div className="grid gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-2">Site Başlığı (Title)</label>
                                    <input
                                        type="text" name="siteTitle" value={settings.siteTitle} onChange={handleChange}
                                        className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-2">Site Açıklaması (Description)</label>
                                    <textarea
                                        name="siteDescription" value={settings.siteDescription} onChange={handleChange} rows={3}
                                        className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-none"
                                    />
                                    <p className="text-xs text-muted-foreground mt-2">SEO için 160 karakteri geçmemeye özen gösterin.</p>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <ImageUpload
                                            label="Site Logosu"
                                            value={settings.logo}
                                            onChange={(url) => setSettings(prev => ({ ...prev, logo: url }))}
                                        />
                                    </div>
                                    <div>
                                        <ImageUpload
                                            label="Site Faviconu"
                                            value={settings.favicon}
                                            onChange={(url) => setSettings(prev => ({ ...prev, favicon: url }))}
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* --- CONTACT TAB --- */}
                    {activeTab === "contact" && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                                <Smartphone className="w-5 h-5 text-emerald-500" /> İletişim Bilgileri
                            </h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2"><Mail className="w-4 h-4" /> E-Posta</label>
                                    <input
                                        type="email" name="email" value={settings.email} onChange={handleChange}
                                        className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2"><Phone className="w-4 h-4" /> Telefon</label>
                                    <input
                                        type="text" name="phone" value={settings.phone} onChange={handleChange}
                                        className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2"><MessageCircle className="w-4 h-4 text-emerald-500" /> WhatsApp</label>
                                    <input
                                        type="text" name="whatsapp" value={settings.whatsapp} onChange={handleChange} placeholder="+90..."
                                        className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2"><MapPin className="w-4 h-4" /> Adres</label>
                                    <input
                                        type="text" name="address" value={settings.address} onChange={handleChange}
                                        className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-muted-foreground mb-2">Google Maps Embed Linki</label>
                                    <input
                                        type="text" name="mapUrl" value={settings.mapUrl} onChange={handleChange} placeholder="https://www.google.com/maps/embed?..."
                                        className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-xs font-mono"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* --- SOCIAL TAB --- */}
                    {activeTab === "social" && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                                <Share2 className="w-5 h-5 text-emerald-500" /> Sosyal Medya Hesapları
                            </h2>

                            <div className="grid gap-4">
                                <div className="relative">
                                    <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-500" />
                                    <input
                                        type="text" name="instagram" value={settings.instagram} onChange={handleChange} placeholder="Instagram URL"
                                        className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="relative">
                                    <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-500" />
                                    <input
                                        type="text" name="twitter" value={settings.twitter} onChange={handleChange} placeholder="Twitter (X) URL"
                                        className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="relative">
                                    <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600" />
                                    <input
                                        type="text" name="linkedin" value={settings.linkedin} onChange={handleChange} placeholder="LinkedIn URL"
                                        className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all"
                                    />
                                </div>
                                <div className="relative">
                                    <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-700" />
                                    <input
                                        type="text" name="facebook" value={settings.facebook} onChange={handleChange} placeholder="Facebook URL"
                                        className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 outline-none transition-all"
                                    />
                                </div>
                                <div className="relative">
                                    <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                                    <input
                                        type="text" name="youtube" value={settings.youtube} onChange={handleChange} placeholder="YouTube URL"
                                        className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-red-600/20 focus:border-red-600 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* --- MARKETING TAB --- */}
                    {activeTab === "marketing" && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                                <BarChart className="w-5 h-5 text-emerald-500" /> Pazarlama & Takip Kodları
                            </h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-2">Google Analytics ID</label>
                                    <input
                                        type="text" name="googleAnalytics" value={settings.googleAnalytics} onChange={handleChange} placeholder="G-XXXXXXXXXX"
                                        className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-mono text-sm"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">Örn: G-1234567890</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-2">Google Search Console (Doğrulama Kodu)</label>
                                    <input
                                        type="text" name="googleVerification" value={settings.googleVerification} onChange={handleChange} placeholder="Verfication Code (HTML Tag content)"
                                        className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-mono text-sm"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">Meta tag içindeki 'content' değerini giriniz.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-2">Facebook Pixel ID</label>
                                    <input
                                        type="text" name="facebookPixel" value={settings.facebookPixel} onChange={handleChange} placeholder="1234567890123456"
                                        className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-mono text-sm"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-muted-foreground mb-2">Google Tag Manager ID</label>
                                    <input
                                        type="text" name="googleTagManager" value={settings.googleTagManager} onChange={handleChange} placeholder="GTM-XXXXXX"
                                        className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-mono text-sm"
                                    />
                                </div>
                            </div>

                            <hr className="border-border my-6" />

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                        <Code className="w-4 h-4" /> Özel Head Kodu (Scripts)
                                    </label>
                                    <textarea
                                        name="customHeadScripts" value={settings.customHeadScripts} onChange={handleChange} rows={5} placeholder="<script>...</script>"
                                        className="w-full bg-slate-950 text-emerald-400 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-mono text-xs"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">Bu kodlar {`<head>`} etiketinin içine eklenir.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                        <LayoutTemplate className="w-4 h-4" /> Özel Body Kodu (Scripts)
                                    </label>
                                    <textarea
                                        name="customBodyScripts" value={settings.customBodyScripts} onChange={handleChange} rows={3} placeholder="<script>...</script>"
                                        className="w-full bg-slate-950 text-emerald-400 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-mono text-xs"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">Bu kodlar {`<body>`} etiketinin sonuna eklenir.</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                </div>
            </div>
        </div>
    )
}
