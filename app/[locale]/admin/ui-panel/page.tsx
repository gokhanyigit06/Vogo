"use client"

import { useState, useEffect } from "react"
import { Save, Globe, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function UIPanelPage() {
    const [locale, setLocale] = useState<"en" | "tr">("tr")
    const [messages, setMessages] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)

    useEffect(() => {
        fetchMessages()
    }, [locale])

    const fetchMessages = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/messages?locale=${locale}`)
            const data = await res.json()
            setMessages(data)
        } catch (err) {
            console.error("Error fetching messages:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        setStatus(null)
        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ locale, messages })
            })

            if (res.ok) {
                setStatus({ type: 'success', message: `${locale.toUpperCase()} başarıyla kaydedildi!` })
            } else {
                throw new Error("Save failed")
            }
        } catch (err) {
            setStatus({ type: 'error', message: "Kaydedilirken bir hata oluştu." })
        } finally {
            setSaving(false)
        }
    }

    // Helper to edit nested property
    const updateNestedMessage = (path: string[], value: string) => {
        const newMessages = { ...messages }
        let current = newMessages
        for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]]
        }
        current[path[path.length - 1]] = value
        setMessages(newMessages)
    }

    // Recursive component to render keys
    const renderObject = (obj: any, path: string[] = []) => {
        if (!obj) return null
        return Object.entries(obj).map(([key, value]) => {
            const currentPath = [...path, key]
            if (typeof value === 'object' && !Array.isArray(value)) {
                return (
                    <div key={currentPath.join('.')} className="ml-4 border-l border-border pl-4 space-y-4 pt-4">
                        <h3 className="text-sm font-bold uppercase text-vogo-blue tracking-wider">{key}</h3>
                        {renderObject(value, currentPath)}
                    </div>
                )
            }
            return (
                <div key={currentPath.join('.')} className="flex flex-col gap-1.5 mb-4 max-w-2xl">
                    <label className="text-xs font-medium text-muted-foreground uppercase">{key}</label>
                    <Input
                        value={value as string}
                        onChange={(e) => updateNestedMessage(currentPath, e.target.value)}
                        className="bg-transparent border-border focus:border-vogo-blue text-sm"
                    />
                </div>
            )
        })
    }

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Globe className="w-8 h-8 text-vogo-blue" />
                        <span className="text-gradient-vogo text-3xl font-bold">UI Panel</span>
                    </h1>
                    <p className="text-muted-foreground mt-2">Sitedeki metinleri kolayca yönetin ve yerelleştirin.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex bg-muted p-1 rounded-xl border border-border">
                        <button
                            onClick={() => setLocale("tr")}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${locale === 'tr' ? 'bg-white text-vogo-blue shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Türkçe (TR)
                        </button>
                        <button
                            onClick={() => setLocale("en")}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${locale === 'en' ? 'bg-white text-vogo-blue shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            English (EN)
                        </button>
                    </div>

                    <Button
                        onClick={handleSave}
                        disabled={loading || saving}
                        className="btn-vogo text-white font-bold h-11 px-6 rounded-xl flex items-center gap-2"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Kaydet
                    </Button>
                </div>
            </div>

            {status && (
                <div className={`p-4 rounded-xl flex items-center gap-3 border ${status.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                    {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span className="font-medium">{status.message}</span>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-vogo-blue" />
                </div>
            ) : (
                <Card className="p-8 glass-card border-none shadow-xl overflow-y-auto max-h-[70vh] custom-scrollbar">
                    <div className="space-y-8">
                        {renderObject(messages)}
                    </div>
                </Card>
            )}

            <div className="text-xs text-muted-foreground italic opacity-50 text-center">
                * Bu değişiklikler doğrudan JSON dosyalarına kaydedilir.
            </div>
        </div>
    )
}
