"use client"

import { Check, Plus } from 'lucide-react'
import { useState } from 'react'

interface CategorySelectProps {
    value: string[]
    onChange: (categories: string[]) => void
}

const PREDEFINED_CATEGORIES = [
    "Web Tasarım",
    "E-Ticaret",
    "Mobil Uygulama",
    "Branding",
    "SEO",
    "Dijital Pazarlama",
    "Sosyal Medya",
    "Kurumsal Kimlik",
    "Prodüksiyon",
    "Yazılım Geliştirme"
]

export default function CategorySelect({ value = [], onChange }: CategorySelectProps) {
    const [customCategory, setCustomCategory] = useState("")

    const toggleCategory = (category: string) => {
        if (value.includes(category)) {
            onChange(value.filter(c => c !== category))
        } else {
            onChange([...value, category])
        }
    }

    const addCustomCategory = () => {
        const trimmed = customCategory.trim()
        if (trimmed && !value.includes(trimmed)) {
            onChange([...value, trimmed])
            setCustomCategory("")
        }
    }

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
                {PREDEFINED_CATEGORIES.map((cat) => {
                    const isSelected = value.includes(cat)
                    return (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => toggleCategory(cat)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all flex items-center gap-1.5
                                ${isSelected
                                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600'
                                    : 'bg-background border-border text-muted-foreground hover:border-emerald-500/50 hover:text-foreground'
                                }`}
                        >
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                            {cat}
                        </button>
                    )
                })}
            </div>

            <div className="flex gap-2 items-center">
                <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Başka bir kategori ekle..."
                    className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomCategory())}
                />
                <button
                    type="button"
                    onClick={addCustomCategory}
                    disabled={!customCategory.trim()}
                    className="bg-muted hover:bg-muted/80 text-foreground px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            {/* Selected but not in predefined (Custom ones) */}
            {value.some(cat => !PREDEFINED_CATEGORIES.includes(cat)) && (
                <div className="border-t border-border pt-3 mt-2">
                    <p className="text-xs text-muted-foreground mb-2">Diğer Seçilenler:</p>
                    <div className="flex flex-wrap gap-2">
                        {value.filter(cat => !PREDEFINED_CATEGORIES.includes(cat)).map(cat => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => toggleCategory(cat)}
                                className="bg-emerald-500/10 text-emerald-600 border border-emerald-500 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5"
                            >
                                <Check className="w-3.5 h-3.5" />
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
