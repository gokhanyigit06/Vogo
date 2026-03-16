"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Save, RefreshCw, CheckCircle, Plus, Trash2, GripVertical, Code } from "lucide-react"

interface Category {
    id: string
    label: string
}

interface Technology {
    name: string
    isPartner: boolean
}

const defaultCategories: Category[] = [
    { id: "headless", label: "Headless CMS" },
    { id: "ecommerce", label: "eCommerce" },
    { id: "tech", label: "Technologies" },
    { id: "hosting", label: "Hosting Platforms" },
]

const defaultTechnologies: Record<string, Technology[]> = {
    headless: [
        { name: "Sanity", isPartner: true },
        { name: "Storyblok", isPartner: true },
        { name: "Payload", isPartner: true },
        { name: "DatoCMS", isPartner: true },
        { name: "Contentful", isPartner: true },
        { name: "Directus", isPartner: true },
        { name: "Hygraph", isPartner: true }
    ],
    ecommerce: [
        { name: "Swell", isPartner: true },
        { name: "Shopify Plus", isPartner: true },
        { name: "Crystallize", isPartner: true },
        { name: "Commerce Layer", isPartner: true },
        { name: "BigCommerce", isPartner: false },
        { name: "WooCommerce", isPartner: false },
    ],
    tech: [
        { name: "Next.js", isPartner: true },
        { name: "Hydrogen", isPartner: true },
        { name: "React", isPartner: false },
        { name: "Remix", isPartner: false },
        { name: "Node.js", isPartner: false },
        { name: "Cloudflare", isPartner: false },
        { name: "TypeScript", isPartner: false },
        { name: "GraphQL", isPartner: false },
        { name: "Serverless", isPartner: false },
        { name: "Prisma", isPartner: false },
        { name: "Blitz", isPartner: true }
    ],
    hosting: [
        { name: "Vercel", isPartner: true },
        { name: "Netlify", isPartner: true },
        { name: "AWS", isPartner: false },
        { name: "Google Cloud", isPartner: false }
    ]
}

export default function TechnologiesAdminPage() {
    const [categories, setCategories] = useState<Category[]>(defaultCategories)
    const [technologies, setTechnologies] = useState<Record<string, Technology[]>>(defaultTechnologies)
    const [activeTab, setActiveTab] = useState<string>("headless")

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        fetch("/api/settings")
            .then(r => r.json())
            .then(data => {
                if (data.technologiesSettings) {
                    setCategories(data.technologiesSettings.categories || defaultCategories)
                    setTechnologies(data.technologiesSettings.technologies || defaultTechnologies)
                    if (data.technologiesSettings.categories?.[0]) {
                        setActiveTab(data.technologiesSettings.categories[0].id)
                    }
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
                    technologiesSettings: {
                        categories,
                        technologies
                    }
                })
            })
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } catch { }
        setSaving(false)
    }

    const addCategory = () => {
        const id = "cat_" + Date.now()
        setCategories([...categories, { id, label: "Yeni Kategori" }])
        setTechnologies({ ...technologies, [id]: [] })
        setActiveTab(id)
    }

    const updateCategory = (id: string, label: string) => {
        setCategories(categories.map(c => c.id === id ? { ...c, label } : c))
    }

    const removeCategory = (id: string) => {
        setCategories(categories.filter(c => c.id !== id))
        const newTechs = { ...technologies }
        delete newTechs[id]
        setTechnologies(newTechs)
        if (activeTab === id) {
            setActiveTab(categories.filter(c => c.id !== id)[0]?.id || "")
        }
    }

    const addTech = (catId: string) => {
        const newTechs = { ...technologies }
        if (!newTechs[catId]) newTechs[catId] = []
        newTechs[catId] = [...newTechs[catId], { name: "Yeni Teknoloji", isPartner: false }]
        setTechnologies(newTechs)
    }

    const updateTech = (catId: string, index: number, field: keyof Technology, value: any) => {
        const newTechs = { ...technologies }
        newTechs[catId] = newTechs[catId].map((t, i) => i === index ? { ...t, [field]: value } : t)
        setTechnologies(newTechs)
    }

    const removeTech = (catId: string, index: number) => {
        const newTechs = { ...technologies }
        newTechs[catId] = newTechs[catId].filter((_, i) => i !== index)
        setTechnologies(newTechs)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            </div>
        )
    }

    const activeTechs = technologies[activeTab] || []

    return (
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-16 md:py-20 text-black">

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-black/40 mb-4">TEKNOLOJİLER</p>
                    <h1 className="text-[2.5rem] sm:text-[4rem] leading-[0.9] tracking-[-0.04em] font-medium text-black mb-6">
                        Teknolojiler
                    </h1>
                    <p className="text-black/50 text-base max-w-lg">
                        Sekmeleri (Kategoriler) ve içindeki teknolojileri yönet.
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

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                
                {/* Left: Categories */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="w-full lg:w-[350px] flex-shrink-0 bg-white border border-black/10 rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <Code className="w-5 h-5 text-black/40" />
                            Kategoriler
                        </h2>
                        <button onClick={addCategory} className="p-2 bg-black/5 hover:bg-black/10 rounded-full transition-colors text-black">
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {categories.map((cat, i) => (
                            <div 
                                key={cat.id} 
                                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${activeTab === cat.id ? "border-black bg-black/5" : "border-black/5 hover:border-black/20"}`}
                            >
                                <div className="cursor-pointer flex-1" onClick={() => setActiveTab(cat.id)}>
                                    <input
                                        type="text"
                                        value={cat.label}
                                        onChange={e => updateCategory(cat.id, e.target.value)}
                                        className="w-full bg-transparent font-semibold focus:outline-none text-sm"
                                        placeholder="Kategori adı"
                                    />
                                </div>
                                <button 
                                    onClick={() => removeCategory(cat.id)}
                                    className="p-1.5 text-black/30 hover:text-red-500 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        {categories.length === 0 && (
                            <p className="text-sm text-black/40 italic">Henüz kategori yok.</p>
                        )}
                    </div>
                </motion.div>

                {/* Right: Technologies in active category */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 w-full bg-white border border-black/10 rounded-3xl p-6 lg:p-10">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-1">
                                {categories.find(c => c.id === activeTab)?.label || "Seçili Kategori Yok"}
                            </h2>
                            <p className="text-sm text-black/40">Bu kategorideki girdiler düzenle.</p>
                        </div>
                        {activeTab && (
                            <button onClick={() => addTech(activeTab)} className="flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-bold rounded-full hover:bg-black/80 transition-all">
                                <Plus className="w-4 h-4" /> Yeni Ekle
                            </button>
                        )}
                    </div>

                    {!activeTab ? (
                        <div className="py-20 text-center text-black/30 text-sm font-medium">Soldan bir kategori seçin.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AnimatePresence>
                                {activeTechs.map((tech, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-[#FAFAFA] border border-black/10 rounded-2xl p-5 flex flex-col gap-4 group relative"
                                    >
                                        <button 
                                            onClick={() => removeTech(activeTab, index)}
                                            className="absolute top-4 right-4 p-1.5 text-black/20 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors bg-white shadow-sm opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>

                                        <div>
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-black/30 mb-1.5 block">Teknoloji Adı</label>
                                            <input 
                                                type="text" 
                                                value={tech.name} 
                                                onChange={e => updateTech(activeTab, index, "name", e.target.value)}
                                                className="w-full bg-transparent border-b border-black/10 focus:border-black py-1.5 text-lg font-bold focus:outline-none transition-colors"
                                                placeholder="Örn: Sanity"
                                            />
                                        </div>

                                        <label className="flex items-center gap-3 cursor-pointer mt-1">
                                            <div className="relative">
                                                <input 
                                                    type="checkbox" 
                                                    checked={tech.isPartner}
                                                    onChange={e => updateTech(activeTab, index, "isPartner", e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-10 h-6 bg-black/10 rounded-full peer peer-checked:bg-black transition-colors"></div>
                                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4 shadow-sm"></div>
                                            </div>
                                            <span className="text-xs font-semibold select-none">Partner Etiketi Göster</span>
                                        </label>

                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            
                            {activeTechs.length === 0 && (
                                <div className="col-span-full py-12 text-center border-2 border-dashed border-black/10 rounded-2xl">
                                    <p className="text-black/40 text-sm font-medium">Bu kategoriye eklenmiş teknoloji yok.</p>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>

            </div>
        </div>
    )
}
