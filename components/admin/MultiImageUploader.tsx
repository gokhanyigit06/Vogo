"use client"

import { useState } from 'react'
import { Upload, X, Loader2, Image as ImageIcon, GripVertical } from 'lucide-react'

interface MultiImageUploaderProps {
    value: string[]
    onChange: (urls: string[]) => void
}

export default function MultiImageUploader({ value = [], onChange }: MultiImageUploaderProps) {
    const [uploading, setUploading] = useState(false)
    const [urlInput, setUrlInput] = useState("")

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!e.target.files || e.target.files.length === 0) return

            setUploading(true)
            const newUrls: string[] = []

            // Upload all selected files
            for (let i = 0; i < e.target.files.length; i++) {
                const file = e.target.files[i]
                const formData = new FormData()
                formData.append('file', file)

                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                })

                if (!res.ok) throw new Error(`${file.name} yüklenemedi`)

                const data = await res.json()
                newUrls.push(data.url)
            }

            onChange([...value, ...newUrls])

        } catch (error: any) {
            alert('Yükleme hatası: ' + error.message)
        } finally {
            setUploading(false)
            // Reset input
            e.target.value = ""
        }
    }

    const handleRemove = (indexToRemove: number) => {
        onChange(value.filter((_, index) => index !== indexToRemove))
    }

    const handleAddUrl = () => {
        if (!urlInput.trim()) return
        onChange([...value, urlInput.trim()])
        setUrlInput("")
    }

    return (
        <div className="space-y-4">
            {/* Image Grid */}
            {value.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {value.map((url, index) => (
                        <div key={index} className="group relative aspect-square bg-slate-900 rounded-xl overflow-hidden border border-border">
                            <img
                                src={url}
                                alt={`Gallery ${index}`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                    onClick={() => handleRemove(index)}
                                    type="button"
                                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-transform hover:scale-110"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full pointer-events-none">
                                {index + 1}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* File Upload */}
                <div className="relative h-32 border-2 border-dashed border-border rounded-xl hover:border-emerald-500/50 hover:bg-muted/50 transition-all group cursor-pointer flex flex-col items-center justify-center gap-2">
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleUpload}
                        disabled={uploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    {uploading ? (
                        <>
                            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                            <span className="text-sm text-muted-foreground">Yükleniyor...</span>
                        </>
                    ) : (
                        <>
                            <div className="p-3 bg-muted rounded-full group-hover:scale-110 transition-transform">
                                <Upload className="w-6 h-6 text-emerald-500" />
                            </div>
                            <span className="text-sm text-muted-foreground font-medium group-hover:text-emerald-400 transition-colors">Resim Seç (Çoklu)</span>
                        </>
                    )}
                </div>

                {/* URL Input */}
                <div className="h-32 border border-border rounded-xl p-4 flex flex-col justify-center gap-2 bg-card">
                    <span className="text-sm font-medium text-foreground flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        URL Ekle
                    </span>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            placeholder="https://..."
                            className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddUrl())}
                        />
                        <button
                            type="button"
                            onClick={handleAddUrl}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-bold disabled:opacity-50"
                            disabled={!urlInput.trim()}
                        >
                            Ekle
                        </button>
                    </div>
                </div>
            </div>

            <p className="text-xs text-muted-foreground">
                * İpucu: Birden fazla resim seçebilirsiniz. Yüklenen resimler otomatik olarak galeriye eklenir.
            </p>
        </div>
    )
}
