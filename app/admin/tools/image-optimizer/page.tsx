"use client"

import { useState } from 'react'
import { Upload, Download, Image as ImageIcon, Zap, CheckCircle, Loader2 } from 'lucide-react'

interface OptimizedResult {
    original: string
    originalSize: number
    optimized: string
    optimizedSize: number
    savings: string
    width: number
    height: number
}

export default function ImageOptimizerPage() {
    const [files, setFiles] = useState<File[]>([])
    const [optimized, setOptimized] = useState<OptimizedResult[]>([])
    const [processing, setProcessing] = useState(false)
    const [currentFile, setCurrentFile] = useState<string>('')

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files))
            setOptimized([]) // Clear previous results
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        if (e.dataTransfer.files) {
            setFiles(Array.from(e.dataTransfer.files))
            setOptimized([])
        }
    }

    const optimizeImages = async () => {
        setProcessing(true)
        const results: OptimizedResult[] = []

        for (const file of files) {
            setCurrentFile(file.name)

            const formData = new FormData()
            formData.append('file', file)

            try {
                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                })

                const data = await res.json()

                if (data.success) {
                    results.push({
                        original: file.name,
                        originalSize: file.size,
                        optimized: data.url,
                        optimizedSize: data.metadata.optimizedSize,
                        savings: data.metadata.savings,
                        width: data.metadata.width,
                        height: data.metadata.height
                    })
                }
            } catch (error) {
                console.error('Optimization error:', error)
            }
        }

        setOptimized(results)
        setProcessing(false)
        setCurrentFile('')
    }

    const totalSavings = optimized.reduce((acc, r) => {
        return acc + (r.originalSize - r.optimizedSize)
    }, 0)

    return (
        <div className="p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3 text-foreground">
                    <Zap className="w-8 h-8 text-emerald-500" />
                    Image Optimizer
                </h1>
                <p className="text-muted-foreground mt-2">
                    Görselleri otomatik olarak WebP formatına çevir ve optimize et
                </p>
            </div>

            {/* Upload Area */}
            <div
                className="border-2 border-dashed border-border rounded-xl p-12 text-center mb-8 hover:border-emerald-500 transition-colors"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
            >
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer block">
                    <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-semibold mb-2 text-foreground">
                        Görselleri sürükle veya seç
                    </p>
                    <p className="text-sm text-muted-foreground">
                        PNG, JPEG, WebP - Toplu yükleme desteklenir
                    </p>
                </label>
            </div>

            {/* Selected Files */}
            {files.length > 0 && optimized.length === 0 && (
                <div className="mb-8">
                    <h3 className="font-semibold mb-4 text-foreground">
                        Seçilen Görseller ({files.length})
                    </h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {files.map((file, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                                <div className="flex items-center gap-3">
                                    <ImageIcon className="w-5 h-5 text-emerald-500" />
                                    <span className="text-sm text-foreground">{file.name}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {(file.size / 1024).toFixed(1)} KB
                                </span>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={optimizeImages}
                        disabled={processing}
                        className="mt-4 w-full py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                    >
                        {processing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                İşleniyor: {currentFile}
                            </>
                        ) : (
                            <>
                                <Zap className="w-5 h-5" />
                                Optimize Et
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Results */}
            {optimized.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-foreground">Sonuçlar</h3>
                        <div className="text-sm">
                            <span className="text-muted-foreground">Toplam Tasarruf: </span>
                            <span className="font-bold text-emerald-500">
                                {(totalSavings / 1024).toFixed(1)} KB
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {optimized.map((result, i) => (
                            <div key={i} className="p-4 bg-card rounded-lg border border-border hover:border-emerald-500 transition-colors">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                                            <span className="font-medium text-foreground">{result.original}</span>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {result.width} × {result.height}px
                                        </div>
                                    </div>
                                    <span className="text-emerald-500 font-bold text-lg">
                                        {result.savings}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-muted-foreground">
                                        {(result.originalSize / 1024).toFixed(1)} KB → {(result.optimizedSize / 1024).toFixed(1)} KB
                                    </div>
                                    <a
                                        href={result.optimized}
                                        download
                                        className="flex items-center gap-2 text-emerald-500 hover:text-emerald-600 text-sm font-medium transition-colors"
                                    >
                                        <Download className="w-4 h-4" />
                                        İndir
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => {
                            setFiles([])
                            setOptimized([])
                        }}
                        className="mt-4 w-full py-2 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
                    >
                        Yeni Görseller Yükle
                    </button>
                </div>
            )}
        </div>
    )
}
