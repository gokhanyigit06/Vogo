import { useState } from 'react'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'

interface ImageUploaderProps {
    value?: string
    onChange: (url: string) => void
    bucket?: string
}

export default function ImageUploader({ value, onChange, bucket = 'images' }: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false)
    const [preview, setPreview] = useState<string | undefined>(value)

    const supabase = createClient()

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)

            if (!e.target.files || e.target.files.length === 0) {
                throw new Error('Bir resim seçmelisiniz.')
            }

            const file = e.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
            const filePath = `${fileName}`

            // Supabase Upload
            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            // Public URL Al
            const { data } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath)

            setPreview(data.publicUrl)
            onChange(data.publicUrl)

        } catch (error: any) {
            alert('Yükleme hatası: ' + error.message)
        } finally {
            setUploading(false)
        }
    }

    const handleRemove = () => {
        setPreview(undefined)
        onChange('')
    }

    return (
        <div className="space-y-4">
            {/* Önizleme Alanı */}
            {preview ? (
                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-border group">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                            onClick={handleRemove}
                            type="button"
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-transform hover:scale-110"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="relative aspect-video w-full border-2 border-dashed border-border rounded-xl hover:border-emerald-500/50 hover:bg-muted/50 transition-all group cursor-pointer flex flex-col items-center justify-center gap-2">
                    <input
                        type="file"
                        accept="image/*"
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
                            <span className="text-sm text-muted-foreground font-medium group-hover:text-emerald-400 transition-colors">Resim Yüklemek İçin Tıklayın</span>
                            <span className="text-xs text-muted-foreground/60">JPG, PNG, WEBP (Max 2MB)</span>
                        </>
                    )}
                </div>
            )}

            {/* Manuel URL Girişi (Opsiyonel) */}
            <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                    type="text"
                    value={value || ''}
                    onChange={(e) => {
                        setPreview(e.target.value)
                        onChange(e.target.value)
                    }}
                    placeholder="Veya harici bir URL yapıştırın..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-400 focus:text-white focus:outline-none focus:border-emerald-500"
                />
            </div>
        </div>
    )
}
