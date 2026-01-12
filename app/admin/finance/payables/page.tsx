"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { DollarSign, Plus, Trash2, Calendar, FileText, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PayablesPage() {
    const [payables, setPayables] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        vendor_name: "",
        amount: "",
        due_date: "",
        category: "supplier",
        description: "",
        status: "pending"
    })

    useEffect(() => {
        fetchPayables()
    }, [])

    const fetchPayables = async () => {
        try {
            const res = await fetch('/api/finance/payables')
            const data = await res.json()
            setPayables(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Fetch error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/finance/payables', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            if (res.ok) {
                setShowForm(false)
                setFormData({ vendor_name: "", amount: "", due_date: "", category: "supplier", description: "", status: "pending" })
                fetchPayables()
            }
        } catch (error) {
            alert('Hata oluştu')
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Silmek istediğinize emin misiniz?')) return
        try {
            await fetch(`/api/finance/payables?id=${id}`, { method: 'DELETE' })
            setPayables(payables.filter(p => p.id !== id))
        } catch (error) {
            alert('Silinemedi')
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount)
    }

    const getStatusBadge = (status: string, date: string) => {
        const isOverdue = new Date(date) < new Date() && status === 'pending'

        if (status === 'paid') return <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-bold border border-emerald-500/20">Ödendi</span>
        if (isOverdue) return <span className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-bold border border-red-500/20">Gecikmiş</span>
        return <span className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-bold border border-amber-500/20">Bekliyor</span>
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Link href="/admin/finance" className="text-muted-foreground hover:text-foreground flex items-center gap-2 mb-2 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Finans Paneline Dön
                    </Link>
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                        <FileText className="w-8 h-8 text-red-500" />
                        Borçlar & Ödemeler
                    </h1>
                    <p className="text-muted-foreground mt-1">Tedarikçi ve diğer borçları yönetin</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-500/20 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Yeni Borç Ekle
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-card border border-border rounded-notebook p-6 space-y-6 animate-in slide-in-from-top-4">
                    <h2 className="text-lg font-bold text-foreground border-b border-border pb-3">Yeni Borç/Ödeme Kaydı</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-muted-foreground text-sm font-medium mb-2">Tedarikçi / Kişi</label>
                            <input
                                required
                                type="text"
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-red-500"
                                value={formData.vendor_name}
                                onChange={e => setFormData({ ...formData, vendor_name: e.target.value })}
                                placeholder="Örn: Google Ads, Ahmet Yılmaz"
                            />
                        </div>
                        <div>
                            <label className="block text-muted-foreground text-sm font-medium mb-2">Tutar</label>
                            <input
                                required
                                type="number"
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-red-500"
                                value={formData.amount}
                                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-muted-foreground text-sm font-medium mb-2">Vade Tarihi</label>
                            <input
                                required
                                type="date"
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-red-500"
                                value={formData.due_date}
                                onChange={e => setFormData({ ...formData, due_date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-muted-foreground text-sm font-medium mb-2">Kategori</label>
                            <select
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-red-500"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="supplier">Tedarikçi</option>
                                <option value="salary">Maaş/Personel</option>
                                <option value="tax">Vergi</option>
                                <option value="software">Yazılım/Lisans</option>
                                <option value="other">Diğer</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-muted-foreground text-sm font-medium mb-2">Açıklama</label>
                            <input
                                type="text"
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-red-500"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Ödeme detayı..."
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-foreground rounded-xl font-bold transition-all"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all"
                        >
                            Kaydet
                        </button>
                    </div>
                </form>
            )}

            {/* List */}
            <div className="bg-card border border-border rounded-notebook overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-800/50 border-b border-border text-left">
                            <th className="p-4 text-muted-foreground font-medium pl-6">Tedarikçi</th>
                            <th className="p-4 text-muted-foreground font-medium">Kategori</th>
                            <th className="p-4 text-muted-foreground font-medium">Vade</th>
                            <th className="p-4 text-muted-foreground font-medium">Tutar</th>
                            <th className="p-4 text-muted-foreground font-medium">Durum</th>
                            <th className="p-4 text-muted-foreground font-medium text-right pr-6">İşlem</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Yükleniyor...</td></tr>
                        ) : payables.length === 0 ? (
                            <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Kayıt bulunamadı.</td></tr>
                        ) : (
                            payables.map((payable) => (
                                <tr key={payable.id} className="border-b border-border last:border-0 hover:bg-slate-800/30 transition-colors">
                                    <td className="p-4 pl-6">
                                        <div className="font-bold text-foreground">{payable.vendor_name}</div>
                                        <div className="text-xs text-muted-foreground">{payable.description}</div>
                                    </td>
                                    <td className="p-4 text-sm text-foreground capitalize">{payable.category}</td>
                                    <td className="p-4 text-sm text-foreground">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                            {new Date(payable.due_date).toLocaleDateString('tr-TR')}
                                        </div>
                                    </td>
                                    <td className="p-4 font-bold text-foreground">{formatCurrency(payable.amount)}</td>
                                    <td className="p-4">{getStatusBadge(payable.status, payable.due_date)}</td>
                                    <td className="p-4 text-right pr-6">
                                        <div className="flex items-center justify-end gap-2">
                                            {payable.status !== 'paid' && (
                                                <button
                                                    onClick={() => {/* Ödeme yapıldı işaretle logic */ }}
                                                    className="p-2 hover:bg-emerald-500/10 text-emerald-500 rounded-lg transition-colors"
                                                    title="Ödendi İşaretle"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(payable.id)}
                                                className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
