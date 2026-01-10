"use client"

import { useState, useEffect } from "react"
import { Settings, Save, Globe, Lock, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SettingsAdminPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState<any>({
        siteTitle: "",
        siteDescription: "",
        email: "",
        phone: "",
        address: "",
        instagram: "",
        twitter: "",
        linkedin: "",
        maintenanceMode: false
    })

    // Verileri Çek
    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                setFormData(data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    // Kaydet
    const handleSave = async () => {
        setSaving(true)
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })
            if (!res.ok) throw new Error('Hata')

            alert("Ayarlar başarıyla kaydedildi! 🎉")
            router.refresh()
        } catch (error) {
            alert("Kaydedilirken bir hata oluştu.")
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="p-12 flex justify-center text-emerald-500"><Loader2 className="animate-spin w-8 h-8" /></div>

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                        <Settings className="w-8 h-8 text-emerald-500" />
                        Ayarlar
                    </h1>
                    <p className="text-muted-foreground mt-1">Genel site yapılandırması ve tercihleri.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-foreground px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 active:scale-95"
                >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Sol Menü (Şimdilik Statik Görünümlü, İleride ScrollSpy yapılabilir) */}
                <div className="space-y-2 hidden lg:block">
                    <div className="bg-card/50 p-4 rounded-xl border border-border">
                        <p className="text-xs font-bold text-slate-500 uppercase mb-3">Hızlı Erişim</p>
                        {['Genel Bilgiler', 'İletişim', 'Sosyal Medya'].map((item, i) => (
                            <div key={item} className={`px-4 py-2 rounded-lg text-sm font-medium ${i === 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-muted-foreground'}`}>
                                {item}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Alanı */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Genel Bilgiler */}
                    <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
                        <h3 className="text-xl font-bold text-foreground flex items-center gap-2 border-b border-border pb-4">
                            <Globe className="w-5 h-5 text-emerald-500" /> Genel Bilgiler
                        </h3>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-muted-foreground">Site Başlığı</label>
                                <input
                                    type="text"
                                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
                                    value={formData.siteTitle}
                                    onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-muted-foreground">Site Açıklaması</label>
                            <textarea
                                rows={3}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500 resize-none"
                                value={formData.siteDescription}
                                onChange={(e) => setFormData({ ...formData, siteDescription: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* İletişim Bilgileri */}
                    <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
                        <h3 className="text-xl font-bold text-foreground flex items-center gap-2 border-b border-border pb-4">
                            <Mail className="w-5 h-5 text-blue-500" /> İletişim Bilgileri
                        </h3>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-muted-foreground flex items-center gap-2"><Mail className="w-3 h-3" /> E-Posta</label>
                                <input
                                    type="email"
                                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-muted-foreground flex items-center gap-2"><Phone className="w-3 h-3" /> Telefon</label>
                                <input
                                    type="text"
                                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-muted-foreground flex items-center gap-2"><MapPin className="w-3 h-3" /> Adres</label>
                            <input
                                type="text"
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Sosyal Medya */}
                    <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
                        <h3 className="text-xl font-bold text-foreground flex items-center gap-2 border-b border-border pb-4">
                            <Instagram className="w-5 h-5 text-pink-500" /> Sosyal Medya
                        </h3>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Instagram className="w-5 h-5 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Instagram URL"
                                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
                                    value={formData.instagram}
                                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center gap-4">
                                <Twitter className="w-5 h-5 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Twitter URL"
                                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
                                    value={formData.twitter}
                                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center gap-4">
                                <Linkedin className="w-5 h-5 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="LinkedIn URL"
                                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
                                    value={formData.linkedin}
                                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bakım Modu */}
                    <div className="bg-card border border-border rounded-2xl p-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                <Lock className={`w-5 h-5 ${formData.maintenanceMode ? 'text-red-500' : 'text-slate-500'}`} /> Bakım Modu
                            </h3>
                            <p className="text-muted-foreground text-sm mt-1">Aktif edildiğinde site ziyaretçilere kapanır.</p>
                        </div>
                        <button
                            onClick={() => setFormData({ ...formData, maintenanceMode: !formData.maintenanceMode })}
                            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${formData.maintenanceMode ? 'bg-emerald-500' : 'bg-slate-700'}`}
                        >
                            <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${formData.maintenanceMode ? 'translate-x-7' : 'translate-x-1'}`} />
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}
