"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { ArrowLeft, Wallet, Send, Phone, Mail } from "lucide-react"
import Link from "next/link"

export default function ReceivablesPage() {
    const [receivables, setReceivables] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchReceivables()
    }, [])

    const fetchReceivables = async () => {
        try {
            const res = await fetch('/api/finance/receivables')
            const data = await res.json()
            setReceivables(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(amount)
    }

    // WhatsApp Linki Oluşturucu
    const getWhatsAppLink = (phone: string, name: string, amount: number, project: string) => {
        if (!phone) return "#"
        const message = `Merhaba ${name}, ${project} projesi için kalan ${formatCurrency(amount)} ödemenizi hatırlatmak istedik. İyi çalışmalar.`
        return `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
    }

    const totalReceivable = receivables.reduce((sum, item) => sum + item.remaining, 0)

    if (loading) return <div className="p-8"><div className="text-slate-400">Yükleniyor...</div></div>

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Link
                        href="/admin/finance"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Finans'a Dön
                    </Link>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Wallet className="w-8 h-8 text-blue-500" />
                        Alacak Takibi
                    </h1>
                    <p className="text-slate-400 mt-1">Projelerden beklenen tahsilatlar</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-right">
                    <p className="text-slate-400 text-sm">Toplam Alacak</p>
                    <p className="text-2xl font-bold text-blue-400">{formatCurrency(totalReceivable)}</p>
                </div>
            </div>

            {/* List */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                {receivables.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">
                        Harika! Tahsil edilmemiş alacak bulunmuyor.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-950 text-slate-400">
                                <tr>
                                    <th className="p-4 font-medium">Müşteri</th>
                                    <th className="p-4 font-medium">Proje</th>
                                    <th className="p-4 font-medium text-right">Proje Bedeli</th>
                                    <th className="p-4 font-medium text-right bg-emerald-500/5 text-emerald-400">Ödenen</th>
                                    <th className="p-4 font-medium text-right bg-red-500/5 text-red-400">Kalan (Alacak)</th>
                                    <th className="p-4 font-medium text-center">Aksiyon</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {receivables.map((item, index) => (
                                    <tr key={index} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-medium text-white">{item.clientName}</div>
                                            <div className="text-sm text-slate-500">{item.companyName}</div>
                                        </td>
                                        <td className="p-4 text-slate-300">{item.projectName}</td>
                                        <td className="p-4 text-right text-slate-300 font-mono">{formatCurrency(item.budget)}</td>
                                        <td className="p-4 text-right text-emerald-400 font-mono bg-emerald-500/5">{formatCurrency(item.paid)}</td>
                                        <td className="p-4 text-right text-red-400 font-bold font-mono bg-red-500/5">{formatCurrency(item.remaining)}</td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-center gap-2">
                                                {item.clientPhone && (
                                                    <a
                                                        href={getWhatsAppLink(item.clientPhone, item.clientName, item.remaining, item.projectName)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-lg transition-colors"
                                                        title="WhatsApp ile Hatırlat"
                                                    >
                                                        <Send className="w-4 h-4" />
                                                    </a>
                                                )}
                                                {item.clientPhone && (
                                                    <a href={`tel:${item.clientPhone}`} className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-lg transition-colors">
                                                        <Phone className="w-4 h-4" />
                                                    </a>
                                                )}
                                                {item.clientEmail && (
                                                    <a href={`mailto:${item.clientEmail}`} className="p-2 bg-slate-500/10 hover:bg-slate-500/20 text-slate-400 rounded-lg transition-colors">
                                                        <Mail className="w-4 h-4" />
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
