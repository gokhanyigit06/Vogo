"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Save, RefreshCw, CheckCircle, Instagram, Twitter, Linkedin, Youtube, Facebook } from "lucide-react"

interface FooterSettings {
    tagline: string
    subtext: string
    email: string
    phone: string
    address: string
    instagram: string
    twitter: string
    linkedin: string
    facebook: string
    youtube: string
    footerLinks: { label: string; href: string }[]
}

const defaultSettings: FooterSettings = {
    tagline: "We build Composable Content Systems.",
    subtext: "Fast and Scalable.",
    email: "info@vogolab.com",
    phone: "+90 555 123 45 67",
    address: "İstanbul, Türkiye",
    instagram: "",
    twitter: "",
    linkedin: "",
    facebook: "",
    youtube: "",
    footerLinks: [
        { label: "About", href: "/about" },
        { label: "Services", href: "/services" },
        { label: "Work", href: "/work" },
        { label: "Contact", href: "/contact" },
    ]
}

const SOCIAL_FIELDS = [
    { key: "instagram", label: "Instagram", icon: Instagram, placeholder: "https://instagram.com/vogolab" },
    { key: "twitter", label: "Twitter / X", icon: Twitter, placeholder: "https://twitter.com/vogolab" },
    { key: "linkedin", label: "LinkedIn", icon: Linkedin, placeholder: "https://linkedin.com/company/vogolab" },
    { key: "facebook", label: "Facebook", icon: Facebook, placeholder: "https://facebook.com/vogolab" },
    { key: "youtube", label: "YouTube", icon: Youtube, placeholder: "https://youtube.com/@vogolab" },
] as const

export default function FooterAdminPage() {
    const [settings, setSettings] = useState<FooterSettings>(defaultSettings)
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        fetch("/api/settings")
            .then(r => r.json())
            .then(data => {
                setSettings({
                    tagline: data.tagline || defaultSettings.tagline,
                    subtext: data.subtext || defaultSettings.subtext,
                    email: data.email || defaultSettings.email,
                    phone: data.phone || defaultSettings.phone,
                    address: data.address || defaultSettings.address,
                    instagram: data.instagram || "",
                    twitter: data.twitter || "",
                    linkedin: data.linkedin || "",
                    facebook: data.facebook || "",
                    youtube: data.youtube || "",
                    footerLinks: data.footerLinks || defaultSettings.footerLinks,
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
                body: JSON.stringify(settings)
            })
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } catch { }
        setSaving(false)
    }

    const updateFooterLink = (i: number, field: string, value: string) => {
        const updated = [...settings.footerLinks]
        updated[i] = { ...updated[i], [field]: value }
        setSettings(s => ({ ...s, footerLinks: updated }))
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="max-w-[900px] mx-auto px-6 md:px-10 py-16 md:py-20">

            {/* Page Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
                <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-black/40 mb-4">FOOTER</p>
                <h1 className="text-[2.5rem] sm:text-[4rem] md:text-[5.5rem] leading-[0.9] tracking-[-0.04em] font-medium text-black mb-6">
                    Footer<br />Düzenleme
                </h1>
                <p className="text-black/50 text-base max-w-lg">
                    Sitenin alt bölümünü, iletişim bilgilerini ve sosyal medya linklerini yönet.
                </p>
            </motion.div>

            <div className="space-y-8">

                {/* Tagline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-3xl p-8 border border-black/5"
                >
                    <h2 className="text-lg font-bold text-black mb-6">Slogan</h2>
                    <div className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold tracking-widest uppercase text-black/40 mb-2.5">
                                Ana Tagline
                            </label>
                            <input
                                type="text"
                                value={settings.tagline}
                                onChange={e => setSettings(s => ({ ...s, tagline: e.target.value }))}
                                placeholder="We build Composable Content Systems."
                                className="w-full bg-[#F4F4F4] border border-black/10 rounded-xl px-4 py-3.5 text-black font-medium focus:outline-none focus:border-black/30 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold tracking-widets uppercase text-black/40 mb-2.5">
                                Alt Metin
                            </label>
                            <input
                                type="text"
                                value={settings.subtext}
                                onChange={e => setSettings(s => ({ ...s, subtext: e.target.value }))}
                                placeholder="Fast and Scalable."
                                className="w-full bg-[#F4F4F4] border border-black/10 rounded-xl px-4 py-3.5 text-black font-medium focus:outline-none focus:border-black/30 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="mt-6 p-6 bg-black rounded-2xl">
                        <p className="text-white/30 text-xs font-bold tracking-widets uppercase mb-3">Önizleme</p>
                        <p className="text-white text-xl font-medium">{settings.tagline || "—"}</p>
                        <p className="text-white/50 text-sm mt-1">{settings.subtext || "—"}</p>
                    </div>
                </motion.div>

                {/* Contact Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-white rounded-3xl p-8 border border-black/5"
                >
                    <h2 className="text-lg font-bold text-black mb-6">İletişim Bilgileri</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-bold tracking-widets uppercase text-black/40 mb-2.5">E-posta</label>
                            <input
                                type="email"
                                value={settings.email}
                                onChange={e => setSettings(s => ({ ...s, email: e.target.value }))}
                                placeholder="info@vogolab.com"
                                className="w-full bg-[#F4F4F4] border border-black/10 rounded-xl px-4 py-3.5 text-black font-medium focus:outline-none focus:border-black/30 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold tracking-widets uppercase text-black/40 mb-2.5">Telefon</label>
                            <input
                                type="text"
                                value={settings.phone}
                                onChange={e => setSettings(s => ({ ...s, phone: e.target.value }))}
                                placeholder="+90 555 000 0000"
                                className="w-full bg-[#F4F4F4] border border-black/10 rounded-xl px-4 py-3.5 text-black font-medium focus:outline-none focus:border-black/30 transition-colors"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold tracking-widets uppercase text-black/40 mb-2.5">Adres</label>
                            <input
                                type="text"
                                value={settings.address}
                                onChange={e => setSettings(s => ({ ...s, address: e.target.value }))}
                                placeholder="İstanbul, Türkiye"
                                className="w-full bg-[#F4F4F4] border border-black/10 rounded-xl px-4 py-3.5 text-black font-medium focus:outline-none focus:border-black/30 transition-colors"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Social Media */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-3xl p-8 border border-black/5"
                >
                    <h2 className="text-lg font-bold text-black mb-6">Sosyal Medya</h2>
                    <div className="space-y-4">
                        {SOCIAL_FIELDS.map(({ key, label, icon: Icon, placeholder }) => (
                            <div key={key} className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-[#F4F4F4] rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-4 h-4 text-black/50" />
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={settings[key as keyof FooterSettings] as string}
                                        onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))}
                                        placeholder={placeholder}
                                        className="w-full bg-[#F4F4F4] border border-black/10 rounded-xl px-4 py-3 text-black font-medium placeholder:text-black/25 focus:outline-none focus:border-black/30 transition-colors text-sm"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Footer Links */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-white rounded-3xl p-8 border border-black/5"
                >
                    <h2 className="text-lg font-bold text-black mb-6">Footer Linkleri</h2>
                    <div className="space-y-3">
                        {settings.footerLinks.map((link, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <input
                                    type="text"
                                    value={link.label}
                                    onChange={e => updateFooterLink(i, "label", e.target.value)}
                                    placeholder="Label"
                                    className="w-36 bg-[#F4F4F4] border border-black/10 rounded-xl px-4 py-3 text-black font-medium focus:outline-none focus:border-black/30 text-sm"
                                />
                                <input
                                    type="text"
                                    value={link.href}
                                    onChange={e => updateFooterLink(i, "href", e.target.value)}
                                    placeholder="/path"
                                    className="flex-1 bg-[#F4F4F4] border border-black/10 rounded-xl px-4 py-3 text-black font-medium focus:outline-none focus:border-black/30 text-sm"
                                />
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Save */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="flex items-center justify-between pt-4 border-t border-black/10"
                >
                    <p className="text-xs text-black/30 font-medium">
                        Değişiklikler kaydedilince site üzerinde aktif olur.
                    </p>
                    <button
                        onClick={handleSave}
                        disabled={saving}
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
        </div>
    )
}
