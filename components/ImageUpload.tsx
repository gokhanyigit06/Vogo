"use client"

import { useState, useRef } from "react"
import { UploadCloud, X, Image as ImageIcon, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface ImageUploadProps {
    value?: string
    onChange: (url: string) => void
    label?: string
    className?: string
}

export default function ImageUpload({ value, onChange, label = "Görsel Yükle", className = "" }: ImageUploadProps) {
    const [loading, setLoading] = useState(false)
    const [dragActive, setDragActive] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleUpload = async (file: File) => {
        if (!file) return

        // 1. Validate Types
        if (!file.type.startsWith("image/")) {
            alert("Lütfen geçerli bir resim dosyası seçin (PNG, JPG, WEBP).")
            return
        }

        // 2. Validate Size (Max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert("Dosya boyutu 2MB'dan büyük olamaz.")
            return
        }

        setLoading(true)

        try {
            // Unique filename: timestamp-random-filename
            const fileExt = file.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
            const filePath = `${fileName}`

            // 3. Upload to Supabase 'images' bucket
            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            // 4. Get Public URL
            const { data } = supabase.storage
                .from('images')
                .getPublicUrl(filePath)

            onChange(data.publicUrl)

        } catch (error: any) {
            console.error("Upload hatası:", error)
            alert("Görsel yüklenirken bir sorun oluştu.")
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleUpload(e.target.files[0])
        }
    }

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleUpload(e.dataTransfer.files[0])
        }
    }

    const handleRemove = () => {
        onChange("")
        if (inputRef.current) inputRef.current.value = ""
    }

    return (
        <div className={`space-y-2 ${className}`}>
            <label className="block text-sm font-medium text-muted-foreground">{label}</label>

            {!value ? (
                <div
                    className={`relative border-2 border-dashed rounded-xl p-8 transition-all text-center cursor-pointer 
                        ${dragActive ? 'border-emerald-500 bg-emerald-500/5' : 'border-border hover:border-emerald-500/50 hover:bg-muted/50'}
                    `}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleChange}
                    />

                    <div className="flex flex-col items-center gap-2">
                        {loading ? (
                            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                <UploadCloud className="w-5 h-5 text-muted-foreground" />
                            </div>
                        )}
                        <p className="text-sm font-medium text-foreground">
                            {loading ? "Yükleniyor..." : "Görsel Seç veya Sürükle"}
                        </p>
                        <p className="text-xs text-muted-foreground">PNG, JPG, WEBP (Max 2MB)</p>
                    </div>
                </div>
            ) : (
                <div className="relative group rounded-xl overflow-hidden border border-border bg-slate-900/50 aspect-video md:aspect-[3/1] flex items-center justify-center">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px]" />

                    <img src={value} alt="Uploaded" className="max-h-full max-w-full object-contain relative z-10" />

                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20">
                        <button
                            onClick={() => window.open(value, '_blank')}
                            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                            title="Önizle"
                        >
                            <ImageIcon className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleRemove}
                            className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-colors"
                            title="Kaldır"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
