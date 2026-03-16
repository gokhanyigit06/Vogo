"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Save, RefreshCw, Eye, EyeOff, Plus, X, GripVertical, Link as LinkIcon, CheckCircle } from "lucide-react"

interface NavLink {
    label: string
    href: string
}

interface HeaderSettings {
    logoText: string
    logoUrl: string
    ctaText: string
    ctaHref: string
    navLinks: NavLink[]
}

const defaultSettings: HeaderSettings = {
    logoText: "Vogo",
    logoUrl: "/",
    ctaText: "İletişim",
    ctaHref: "/contact",
    navLinks: [
        { label: "Home", href: "/" },
        { label: "Work", href: "/work" },
        { label: "Services", href: "/services" },
        { label: "About", href: "/about" },
    ]
}

export default function HeaderAdminPage() {
    const [settings, setSettings] = useState<HeaderSettings>(defaultSettings)
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saved, setSaved] = useState(false)
    const [newLink, setNewLink] = useState<NavLink>({ label: "", href: "" })
    const [showAddLink, setShowAddLink] = useState(false)

    useEffect(() => {
        fetch("/api/settings")
            .then(r => r.json())
            .then(data => {
                setSettings({
                    logoText: data.logoText || defaultSettings.logoText,
                    logoUrl: data.logoUrl || defaultSettings.logoUrl,
                    ctaText: data.headerCtaText || defaultSettings.ctaText,
                    ctaHref: data.headerCtaHref || defaultSettings.ctaHref,
                    navLinks: data.navLinks || defaultSettings.navLinks,
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
                    logoText: settings.logoText,
                    logoUrl: settings.logoUrl,
                    headerCtaText: settings.ctaText,
                    headerCtaHref: settings.ctaHref,
                    navLinks: settings.navLinks,
                })
            })
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } catch { }
        setSaving(false)
    }

    const updateLink = (i: number, field: keyof NavLink, value: string) => {
        const updated = [...settings.navLinks]
        updated[i] = { ...updated[i], [field]: value }
        setSettings(s => ({ ...s, navLinks: updated }))
    }

    const removeLink = (i: number) => {
        setSettings(s => ({ ...s, navLinks: s.navLinks.filter((_, idx) => idx !== i) }))
    }

    const addLink = () => {
        if (!newLink.label.trim() || !newLink.href.trim()) return
        setSettings(s => ({ ...s, navLinks: [...s.navLinks, newLink] }))
        setNewLink({ label: "", href: "" })
        setShowAddLink(false)
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
                <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-black/40 mb-4">HEADER</p>
                <h1 className="text-[2.5rem] sm:text-[4rem] md:text-[5.5rem] leading-[0.9] tracking-[-0.04em] font-medium text-black mb-6">
                    Navigasyon<br />Düzenleme
                </h1>
                <p className="text-black/50 text-base max-w-lg">
                    Header logo, navigasyon linkleri ve CTA butonunu buradan düzenle.
                </p>
            </motion.div>

            <div className="space-y-10">

                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-3xl p-8 border border-black/5"
                >
                    <h2 className="text-lg font-bold text-black mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white text-xs font-black">V</span>
                        Logo
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-bold tracking-widest uppercase text-black/40 mb-2.5">
                                Logo Metni
                            </label>
                            <input
                                type="text"
                                value={settings.logoText}
                                onChange={e => setSettings(s => ({ ...s, logoText: e.target.value }))}
                                className="w-full bg-[#F4F4F4] border border-black/10 rounded-xl px-4 py-3.5 text-black font-medium focus:outline-none focus:border-black/30 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold tracking-widest uppercase text-black/40 mb-2.5">
                                Logo Link
                            </label>
                            <input
                                type="text"
                                value={settings.logoUrl}
                                onChange={e => setSettings(s => ({ ...s, logoUrl: e.target.value }))}
                                className="w-full bg-[#F4F4F4] border border-black/10 rounded-xl px-4 py-3.5 text-black font-medium focus:outline-none focus:border-black/30 transition-colors"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Nav Links */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-white rounded-3xl p-8 border border-black/5"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-black">Navigasyon Linkleri</h2>
                        <button
                            onClick={() => setShowAddLink(true)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-black text-white text-xs font-bold rounded-full hover:bg-black/80 transition-colors"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Link Ekle
                        </button>
                    </div>

                    <div className="space-y-3">
                        {settings.navLinks.map((link, i) => (
                            <div key={i} className="flex items-center gap-3 p-4 bg-[#F4F4F4] rounded-xl group">
                                <GripVertical className="w-4 h-4 text-black/20 cursor-grab flex-shrink-0" />
                                <input
                                    type="text"
                                    value={link.label}
                                    onChange={e => updateLink(i, "label", e.target.value)}
                                    placeholder="Label"
                                    className="w-32 bg-white border border-black/10 rounded-lg px-3 py-2 text-sm font-medium text-black focus:outline-none focus:border-black/30 transition-colors"
                                />
                                <div className="flex-1 flex items-center gap-2">
                                    <LinkIcon className="w-3.5 h-3.5 text-black/30 flex-shrink-0" />
                                    <input
                                        type="text"
                                        value={link.href}
                                        onChange={e => updateLink(i, "href", e.target.value)}
                                        placeholder="/path"
                                        className="flex-1 bg-white border border-black/10 rounded-lg px-3 py-2 text-sm font-medium text-black focus:outline-none focus:border-black/30 transition-colors"
                                    />
                                </div>
                                <button
                                    onClick={() => removeLink(i)}
                                    className="p-1.5 rounded-lg text-black/20 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Add new link form */}
                    {showAddLink && (
                        <div className="mt-4 flex items-center gap-3 p-4 bg-black/5 rounded-xl border-2 border-dashed border-black/10">
                            <input
                                type="text"
                                value={newLink.label}
                                onChange={e => setNewLink(n => ({ ...n, label: e.target.value }))}
                                placeholder="Label (örn: Blog)"
                                autoFocus
                                className="w-32 bg-white border border-black/10 rounded-lg px-3 py-2 text-sm font-medium text-black focus:outline-none"
                            />
                            <div className="flex-1 flex items-center gap-2">
                                <LinkIcon className="w-3.5 h-3.5 text-black/30" />
                                <input
                                    type="text"
                                    value={newLink.href}
                                    onChange={e => setNewLink(n => ({ ...n, href: e.target.value }))}
                                    onKeyDown={e => { if (e.key === "Enter") addLink() }}
                                    placeholder="/blog"
                                    className="flex-1 bg-white border border-black/10 rounded-lg px-3 py-2 text-sm font-medium text-black focus:outline-none"
                                />
                            </div>
                            <button onClick={addLink} className="px-3 py-2 bg-black text-white text-xs font-bold rounded-lg">Ekle</button>
                            <button onClick={() => setShowAddLink(false)} className="p-2 rounded-lg hover:bg-black/5">
                                <X className="w-4 h-4 text-black/40" />
                            </button>
                        </div>
                    )}
                </motion.div>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-3xl p-8 border border-black/5"
                >
                    <h2 className="text-lg font-bold text-black mb-6">CTA Butonu</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-bold tracking-widest uppercase text-black/40 mb-2.5">
                                Buton Metni
                            </label>
                            <input
                                type="text"
                                value={settings.ctaText}
                                onChange={e => setSettings(s => ({ ...s, ctaText: e.target.value }))}
                                placeholder="İletişim"
                                className="w-full bg-[#F4F4F4] border border-black/10 rounded-xl px-4 py-3.5 text-black font-medium focus:outline-none focus:border-black/30 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold tracking-widest uppercase text-black/40 mb-2.5">
                                Buton Linki
                            </label>
                            <input
                                type="text"
                                value={settings.ctaHref}
                                onChange={e => setSettings(s => ({ ...s, ctaHref: e.target.value }))}
                                placeholder="/contact"
                                className="w-full bg-[#F4F4F4] border border-black/10 rounded-xl px-4 py-3.5 text-black font-medium focus:outline-none focus:border-black/30 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="mt-6 p-5 bg-[#F4F4F4] rounded-2xl">
                        <p className="text-xs font-bold tracking-widest uppercase text-black/30 mb-4">Önizleme</p>
                        <div className="flex items-center justify-between bg-white rounded-xl px-5 py-3.5 border border-black/5">
                            <span className="font-black text-black text-sm">{settings.logoText || "Vogo"}</span>
                            <nav className="hidden sm:flex items-center gap-4">
                                {settings.navLinks.slice(0, 3).map((l, i) => (
                                    <span key={i} className="text-xs text-black/50 font-medium">{l.label}</span>
                                ))}
                            </nav>
                            <span className="px-3 py-1.5 bg-black text-white text-xs font-bold rounded-full">
                                {settings.ctaText || "Contact"}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Save Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
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
