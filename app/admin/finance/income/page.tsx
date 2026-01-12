"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { ArrowLeft, Save, TrendingUp, Trash2, Calendar, Clock, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function IncomePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [clients, setClients] = useState<any[]>([])
    const [income, setIncome] = useState<any[]>([])
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        client_id: "",
        amount: "",
        date: new Date().toISOString().split('T')[0],
        category: "payment",
        payment_method: "bank_transfer",
        invoice_number: "",
        description: "",
        status: "paid", // varsayılan ödendi
        is_recurring: false,
        recurrence_frequency: "monthly",
        recurrence_day: new Date().getDate(),
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [clientsRes, incomeRes] = await Promise.all([
                fetch('/api/clients'),
                fetch('/api/finance/income')
            ])
            setClients(await clientsRes.json())
            setIncome(await incomeRes.json())
        } catch (error) {
            console.error('Fetch error:', error)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const payload = {
                ...formData,
                client_id: formData.client_id ? parseInt(formData.client_id) : null,
                amount: parseFloat(formData.amount),
                is_paid: formData.status === 'paid' // status'a göre is_paid'i ayarla
            }

            const res = await fetch('/api/finance/income', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (!res.ok) throw new Error('Eklenemedi')

            alert('Gelir başarıyla eklendi!')
            setShowForm(false)
            setFormData({
                client_id: "",
                amount: "",
                date: new Date().toISOString().split('T')[0],
                category: "payment",
                payment_method: "bank_transfer",
                invoice_number: "",
                description: "",
                status: "paid",
                is_recurring: false,
                recurrence_frequency: "monthly",
                recurrence_day: new Date().getDate(),
            })
            fetchData()
        } catch (error) {
            alert('Bir hata oluştu!')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Bu gelir kaydını silmek istediğinize emin misiniz?')) return

        try {
            const res = await fetch(`/api/finance/income?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                setIncome(income.filter(i => i.id !== id))
                alert('Gelir silindi')
            }
        } catch (error) {
            alert('Silme hatası')
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(amount)
    }

    // Sadece ödenmiş (tahsil edilmiş) gelirleri topla
    const totalCollectedIncome = income
        .filter(i => i.status === 'paid' || i.is_paid === true)
        .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0)

    const pendingIncome = income
        .filter(i => i.status === 'pending' || i.is_paid === false)
        .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0)

    const recurringIncome = income.filter(i => i.is_recurring)

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Link
                        href="/admin/finance"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-foreground transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Finans'a Dön
                    </Link>
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                        <TrendingUp className="w-8 h-8 text-emerald-500" />
                        Gelir Yönetimi
                    </h1>
                    <p className="text-slate-400 mt-1">Müşteri ödemeleri ve düzenli gelirleri kaydedin</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"
                >
                    {showForm ? 'Formu Gizle' : '+ Yeni Gelir'}
                </button>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-card border border-border p-4 rounded-xl">
                    <p className="text-slate-400 text-sm">Tahsil Edilen</p>
                    <p className="text-2xl font-bold text-emerald-400 mt-1">{formatCurrency(totalCollectedIncome)}</p>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl">
                    <p className="text-slate-400 text-sm">Bekleyen (Alacak)</p>
                    <p className="text-2xl font-bold text-amber-500 mt-1">{formatCurrency(pendingIncome)}</p>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl">
                    <p className="text-slate-400 text-sm">Kayıt Sayısı</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{income.length}</p>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl">
                    <p className="text-slate-400 text-sm">Düzenli Gelir</p>
                    <p className="text-2xl font-bold text-purple-400 mt-1">{recurringIncome.length} kayıt</p>
                </div>
            </div>

            {/* Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-card border border-border rounded-notebook p-6 space-y-6">
                    <h2 className="text-lg font-bold text-foreground border-b border-border pb-3">Yeni Gelir Kaydı</h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">Müşteri</label>
                            <select
                                value={formData.client_id}
                                onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
                            >
                                <option value="">Seçiniz (Opsiyonel)</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>
                                        {client.name} {client.company ? `(${client.company})` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">Tutar *</label>
                            <input
                                type="number"
                                required
                                step="0.01"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">Tarih *</label>
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">Durum</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
                            >
                                <option value="paid">Tahsil Edildi (Kasa)</option>
                                <option value="pending">Bekliyor (Alacak)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">Ödeme Yöntemi</label>
                            <select
                                value={formData.payment_method}
                                onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
                            >
                                <option value="bank_transfer">Havale/EFT</option>
                                <option value="cash">Nakit</option>
                                <option value="card">Kredi Kartı</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">Fatura No</label>
                            <input
                                type="text"
                                value={formData.invoice_number}
                                onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
                                placeholder="FA-2024-001"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-slate-400 text-sm font-medium mb-2">Açıklama</label>
                            <input
                                type="text"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
                                placeholder="Web tasarım projesi ödemesi"
                            />
                        </div>
                    </div>

                    {/* Recurring Section */}
                    <div className="border-t border-border pt-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.is_recurring}
                                onChange={(e) => setFormData({ ...formData, is_recurring: e.target.checked })}
                                className="w-5 h-5 bg-background border-border rounded text-emerald-500 focus:ring-emerald-500"
                            />
                            <div>
                                <span className="text-foreground font-medium flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-purple-400" />
                                    Düzenli Gelir (Aylık tekrar eden)
                                </span>
                                <p className="text-slate-400 text-xs mt-1">Bu gelir her ay otomatik olarak tekrarlanacak</p>
                            </div>
                        </label>

                        {formData.is_recurring && (
                            <div className="mt-4 grid md:grid-cols-2 gap-4 pl-8">
                                <div>
                                    <label className="block text-slate-400 text-sm font-medium mb-2">Tekrar Sıklığı</label>
                                    <select
                                        value={formData.recurrence_frequency}
                                        onChange={(e) => setFormData({ ...formData, recurrence_frequency: e.target.value })}
                                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
                                    >
                                        <option value="monthly">Aylık</option>
                                        <option value="quarterly">3 Ayda Bir</option>
                                        <option value="yearly">Yıllık</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm font-medium mb-2">Ayın Hangi Günü</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="31"
                                        value={formData.recurrence_day}
                                        onChange={(e) => setFormData({ ...formData, recurrence_day: parseInt(e.target.value) })}
                                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                        >
                            <Save className="w-5 h-5" />
                            {loading ? 'Kaydediliyor...' : 'Geliri Kaydet'}
                        </button>
                    </div>
                </form>
            )}

            {/* Income List */}
            <div className="bg-card border border-border rounded-notebook overflow-hidden">
                <div className="p-4 border-b border-border">
                    <h3 className="text-lg font-bold text-foreground">Gelir Kayıtları</h3>
                </div>
                {income.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">
                        Henüz gelir kaydı yok
                    </div>
                ) : (
                    <div className="divide-y divide-slate-800">
                        {income.map((item) => (
                            <div key={item.id} className="p-4 hover:bg-slate-800/50 transition-colors flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h4 className="text-foreground font-medium">
                                            {item.description || 'Ödeme'}
                                        </h4>
                                        {item.status === 'pending' || item.is_paid === false ? (
                                            <span className="text-xs px-2 py-1 bg-amber-500/10 text-amber-500 rounded-md border border-amber-500/20 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                Bekliyor
                                            </span>
                                        ) : (
                                            <span className="text-xs px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-md border border-emerald-500/20 flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3" />
                                                Tahsil Edildi
                                            </span>
                                        )}
                                        {item.is_recurring && (
                                            <span className="text-xs px-2 py-1 bg-purple-500/10 text-purple-400 rounded-md border border-purple-500/20 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                Düzenli
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-slate-400 text-sm">
                                        {item.clients?.name || 'Müşteri belirtilmemiş'} • {new Date(item.date).toLocaleDateString('tr-TR')}
                                        {item.invoice_number && ` • ${item.invoice_number}`}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className={`font-bold text-lg ${item.status === 'pending' || item.is_paid === false ? 'text-amber-500' : 'text-emerald-400'}`}>
                                        {formatCurrency(item.amount)}
                                    </p>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
