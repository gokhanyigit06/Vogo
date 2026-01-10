"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Save, ArrowLeft, Layout, Type, Image as ImageIcon, Link as LinkIcon, Loader2, FileText } from "lucide-react"
import Link from "next/link"

export default function PageEditor() {
    const params = useParams()
    const router = useRouter()
    const slug = params?.slug as string

    const [content, setContent] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (!slug) return

        // Fetch current content
        fetch(`/api/pages?slug=${slug}`)
            .then(res => res.json())
            .then(data => {
                setContent(data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [slug])

    const handleSave = async () => {
        setSaving(true)
        try {
            const res = await fetch('/api/pages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug, content })
            })

            if (res.ok) alert('Sayfa içeriği güncellendi!')
            else throw new Error('Update failed')

        } catch (error) {
            alert('Kaydetme başarısız.')
        } finally {
            setSaving(false)
        }
    }

    const updateField = (section: string, field: string, value: string) => {
        setContent((prev: any) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }))
    }

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-emerald-500 w-8 h-8" /></div>

    // Sayfa Tiplerine Göre Form Renderlama
    const renderForm = () => {
        if (!content) return <div>İçerik bulunamadı.</div>

        // --- HOME PAGE EDIT FORM ---
        if (slug === 'home') {
            return (
                <div className="space-y-8">
                    {/* Hero Section */}
                    <div className="bg-card border border-border rounded-xl p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-border pb-2">
                            <Layout className="w-5 h-5 text-emerald-500" /> Hero Alanı (Giriş)
                        </h2>

                        <div className="grid gap-6">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                    <Type className="w-4 h-4" /> Ana Başlık
                                </label>
                                <textarea
                                    value={content.hero?.title || ''}
                                    onChange={(e) => updateField('hero', 'title', e.target.value)}
                                    rows={2}
                                    className="w-full bg-background border border-border rounded-lg p-3 focus:border-emerald-500 outline-none"
                                />
                                <p className="text-xs text-muted-foreground mt-1">Satır kırmak için Enter kullanın.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                    <Type className="w-4 h-4" /> Alt Başlık / Açıklama
                                </label>
                                <textarea
                                    value={content.hero?.subtitle || ''}
                                    onChange={(e) => updateField('hero', 'subtitle', e.target.value)}
                                    rows={3}
                                    className="w-full bg-background border border-border rounded-lg p-3 focus:border-emerald-500 outline-none"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                        <LinkIcon className="w-4 h-4" /> Buton Metni
                                    </label>
                                    <input
                                        type="text"
                                        value={content.hero?.buttonText || ''}
                                        onChange={(e) => updateField('hero', 'buttonText', e.target.value)}
                                        className="w-full bg-background border border-border rounded-lg p-3 focus:border-emerald-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                        <LinkIcon className="w-4 h-4" /> Buton Linki
                                    </label>
                                    <input
                                        type="text"
                                        value={content.hero?.buttonLink || ''}
                                        onChange={(e) => updateField('hero', 'buttonLink', e.target.value)}
                                        className="w-full bg-background border border-border rounded-lg p-3 focus:border-emerald-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4" /> Kapak Görseli URL
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={content.hero?.imageUrl || ''}
                                        onChange={(e) => updateField('hero', 'imageUrl', e.target.value)}
                                        placeholder="https://..."
                                        className="w-full bg-background border border-border rounded-lg p-3 focus:border-emerald-500 outline-none"
                                    />
                                </div>
                                {content.hero?.imageUrl && (
                                    <div className="mt-2 w-full h-40 rounded-lg overflow-hidden border border-border bg-slate-900/50">
                                        <img src={content.hero.imageUrl} alt="Önizleme" className="w-full h-full object-cover opacity-70" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="bg-card border border-border rounded-xl p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-border pb-2">
                            <Layout className="w-5 h-5 text-emerald-500" /> İstatistikler
                        </h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">Mutlu Müşteri</label>
                                <input
                                    type="text"
                                    value={content.stats?.happyClients || ''}
                                    onChange={(e) => updateField('stats', 'happyClients', e.target.value)}
                                    className="w-full bg-background border border-border rounded-lg p-3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">Proje Sayısı</label>
                                <input
                                    type="text"
                                    value={content.stats?.projects || ''}
                                    onChange={(e) => updateField('stats', 'projects', e.target.value)}
                                    className="w-full bg-background border border-border rounded-lg p-3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">Deneyim Yılı</label>
                                <input
                                    type="text"
                                    value={content.stats?.years || ''}
                                    onChange={(e) => updateField('stats', 'years', e.target.value)}
                                    className="w-full bg-background border border-border rounded-lg p-3"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        // --- SERVICES PAGE EDIT FORM ---
        if (slug === 'services') {
            const servicesList = content.servicesList || []

            const handleAddService = () => {
                const newService = { title: "Yeni Hizmet", description: "Hizmet açıklaması...", icon: "Code" }
                setContent((prev: any) => ({ ...prev, servicesList: [...servicesList, newService] }))
            }

            const handleRemoveService = (index: number) => {
                if (!confirm('Bu hizmeti silmek istediğinize emin misiniz?')) return
                const newList = [...servicesList]
                newList.splice(index, 1)
                setContent((prev: any) => ({ ...prev, servicesList: newList }))
            }

            const updateService = (index: number, field: string, value: string) => {
                const newList = [...servicesList]
                newList[index] = { ...newList[index], [field]: value }
                setContent((prev: any) => ({ ...prev, servicesList: newList }))
            }

            return (
                <div className="space-y-8">
                    {/* Hero Section */}
                    <div className="bg-card border border-border rounded-xl p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Layout className="w-5 h-5 text-emerald-500" /> Hizmetler Başlık Alanı
                        </h2>
                        <div className="grid gap-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">Sayfa Başlığı</label>
                                <input
                                    type="text"
                                    value={content.hero?.title || ''}
                                    onChange={(e) => updateField('hero', 'title', e.target.value)}
                                    className="w-full bg-background border border-border rounded-lg p-3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">Açıklama Metni</label>
                                <textarea
                                    value={content.hero?.subtitle || ''}
                                    onChange={(e) => updateField('hero', 'subtitle', e.target.value)}
                                    rows={3}
                                    className="w-full bg-background border border-border rounded-lg p-3"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Services List Management */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Layout className="w-5 h-5 text-emerald-500" /> Hizmet Kartları
                            </h2>
                            <button
                                onClick={handleAddService}
                                className="px-4 py-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-lg font-bold text-sm transition-colors"
                            >
                                + Yeni Hizmet Ekle
                            </button>
                        </div>

                        <div className="grid gap-4">
                            {servicesList.map((service: any, index: number) => (
                                <div key={index} className="bg-card border border-border rounded-xl p-6 relative group">
                                    <button
                                        onClick={() => handleRemoveService(index)}
                                        className="absolute top-4 right-4 text-slate-500 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        Sil
                                    </button>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-muted-foreground mb-1">Hizmet Adı</label>
                                            <input
                                                type="text"
                                                value={service.title}
                                                onChange={(e) => updateService(index, 'title', e.target.value)}
                                                className="w-full bg-background border border-border rounded-lg p-2 text-sm font-bold"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-muted-foreground mb-1">İkon (Lucide Adı)</label>
                                            <input
                                                type="text"
                                                value={service.icon}
                                                onChange={(e) => updateService(index, 'icon', e.target.value)}
                                                placeholder="Örn: Smartphone"
                                                className="w-full bg-background border border-border rounded-lg p-2 text-sm font-mono"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-medium text-muted-foreground mb-1">Kısa Açıklama</label>
                                            <textarea
                                                value={service.description}
                                                onChange={(e) => updateService(index, 'description', e.target.value)}
                                                rows={2}
                                                className="w-full bg-background border border-border rounded-lg p-2 text-sm"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-medium text-muted-foreground mb-1">Detay Linki (Opsiyonel)</label>
                                            <input
                                                type="text"
                                                value={service.link || ''}
                                                onChange={(e) => updateService(index, 'link', e.target.value)}
                                                placeholder="/services/..."
                                                className="w-full bg-background border border-border rounded-lg p-2 text-sm text-slate-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {servicesList.length === 0 && (
                                <div className="text-center p-8 border border-dashed border-border rounded-xl text-muted-foreground text-sm">
                                    Henüz eklenmiş hizmet yok.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )
        }

        // --- ABOUT PAGE EDIT FORM ---
        if (slug === 'about') {
            return (
                <div className="space-y-8">
                    {/* Hero Section */}
                    <div className="bg-card border border-border rounded-xl p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Layout className="w-5 h-5 text-emerald-500" /> Hakkımızda Başlık
                        </h2>
                        <div className="grid gap-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">Başlık</label>
                                <input
                                    type="text"
                                    value={content.hero?.title || ''}
                                    onChange={(e) => updateField('hero', 'title', e.target.value)}
                                    className="w-full bg-background border border-border rounded-lg p-3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">Alt Metin</label>
                                <textarea
                                    value={content.hero?.subtitle || ''}
                                    onChange={(e) => updateField('hero', 'subtitle', e.target.value)}
                                    rows={3}
                                    className="w-full bg-background border border-border rounded-lg p-3"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Detailed Content */}
                    <div className="bg-card border border-border rounded-xl p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-emerald-500" /> Detaylı İçerik
                        </h2>
                        <div className="grid gap-6">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">Biz Kimiz? (Ana Metin)</label>
                                <textarea
                                    value={content.mainContent || ''}
                                    onChange={(e) => setContent((prev: any) => ({ ...prev, mainContent: e.target.value }))}
                                    rows={6}
                                    className="w-full bg-background border border-border rounded-lg p-3"
                                />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-2">Misyonumuz</label>
                                    <textarea
                                        value={content.mission || ''}
                                        onChange={(e) => setContent((prev: any) => ({ ...prev, mission: e.target.value }))}
                                        rows={4}
                                        className="w-full bg-background border border-border rounded-lg p-3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-2">Vizyonumuz</label>
                                    <textarea
                                        value={content.vision || ''}
                                        onChange={(e) => setContent((prev: any) => ({ ...prev, vision: e.target.value }))}
                                        rows={4}
                                        className="w-full bg-background border border-border rounded-lg p-3"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        // --- GENERIC / OTHER PAGES ---
        return (
            <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4">Genel İçerik Düzenleyici</h2>
                <div className="space-y-4">
                    {/* Generic Hero Fields if exist */}
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Başlık</label>
                        <input
                            type="text"
                            value={content.hero?.title || ''}
                            onChange={(e) => updateField('hero', 'title', e.target.value)}
                            className="w-full bg-background border border-border rounded-lg p-3"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Alt Başlık</label>
                        <textarea
                            value={content.hero?.subtitle || ''}
                            onChange={(e) => updateField('hero', 'subtitle', e.target.value)}
                            rows={3}
                            className="w-full bg-background border border-border rounded-lg p-3"
                        />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/pages" className="p-2 hover:bg-muted rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground capitalize">
                            {slug === 'home' ? 'Anasayfa' : slug} Düzenle
                        </h1>
                        <p className="text-muted-foreground text-sm">Sayfa içeriğini buradan yönetebilirsiniz.</p>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-70"
                >
                    {saving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                    {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
            </div>

            {renderForm()}
        </div>
    )
}
