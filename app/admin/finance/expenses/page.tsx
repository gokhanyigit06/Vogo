"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { ArrowLeft, Save, TrendingDown, Trash2, Calendar } from "lucide-react"
import Link from "next/link"

export default function ExpensesPage() {
    const [loading, setLoading] = useState(false)
    const [expenses, setExpenses] = useState<any[]>([])
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        amount: "",
        date: new Date().toISOString().split('T')[0],
        category: "office",
        description: "",
        invoice_number: "",
        vendor: "",
        is_recurring: false,
        recurrence_frequency: "monthly",
        recurrence_day: new Date().getDate(),
    })

    useEffect(() => {
        fetchExpenses()
    }, [])

    const fetchExpenses = async () => {
        try {
            const res = await fetch('/api/finance/expenses')
            const data = await res.json()
            setExpenses(data)
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
                amount: parseFloat(formData.amount),
            }

            const res = await fetch('/api/finance/expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (!res.ok) throw new Error('Eklenemedi')

            alert('Gider başarıyla eklendi!')
            setShowForm(false)
            setFormData({
                amount: "",
                date: new Date().toISOString().split('T')[0],
                category: "office",
                description: "",
                invoice_number: "",
                vendor: "",
                is_recurring: false,
                recurrence_frequency: "monthly",
                recurrence_day: new Date().getDate(),
            })
            fetchExpenses()
        } catch (error) {
            alert('Bir hata oluştu!')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Bu gider kaydını silmek istediğinize emin misiniz?')) return

        try {
            const res = await fetch(`/api/finance/expenses?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                setExpenses(expenses.filter(e => e.id !== id))
                alert('Gider silindi')
            }
        } catch (error) {
            alert('Silme hatası')
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(amount)
    }

    const totalExpenses = expenses.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0)
    const recurringExpenses = expenses.filter(e => e.is_recurring)

    const categoryLabels: any = {
        rent: 'Kira',
        salary: 'Maaş',
        software: 'Yazılım/Abonelik',
        ads: 'Reklam',
        office: 'Ofis Giderleri',
        other: 'Diğer'
    }

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
                        <TrendingDown className="w-8 h-8 text-red-500" />
                        Gider Yönetimi
                    </h1>
                    <p className="text-slate-400 mt-1">Masraflar ve düzenli ödemeleri kaydedin</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-500/20"
                >
                    {showForm ? 'Formu Gizle' : '+ Yeni Gider'}
                </button>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                    <p className="text-slate-400 text-sm">Toplam Gider</p>
                    <p className="text-2xl font-bold text-red-400 mt-1">{formatCurrency(totalExpenses)}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                    <p className="text-slate-400 text-sm">Kayıt Sayısı</p>
                    <p className="text-2xl font-bold text-white mt-1">{expenses.length}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                    <p className="text-slate-400 text-sm">Düzenli Gider</p>
                    <p className="text-2xl font-bold text-purple-400 mt-1">{recurringExpenses.length} kayıt</p>
                </div>
            </div>

            {/* Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                    <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Yeni Gider Kaydı</h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">Tutar *</label>
                            <input
                                type="number"
                                required
                                step="0.01"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500"
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
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">Kategori *</label>
                            <select
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500"
                            >
                                <option value="rent">Kira</option>
                                <option value="salary">Maaş</option>
                                <option value="software">Yazılım/Abonelik</option>
                                <option value="ads">Reklam</option>
                                <option value="office">Ofis Giderleri</option>
                                <option value="other">Diğer</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">Firma/Tedarikçi</label>
                            <input
                                type="text"
                                value={formData.vendor}
                                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500"
                                placeholder="Örneğin: AWS, Google Ads..."
                            />
                        </div>

                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">Fatura No</label>
                            <input
                                type="text"
                                value={formData.invoice_number}
                                onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500"
                                placeholder="FT-2024-001"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">Açıklama</label>
                            <input
                                type="text"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500"
                                placeholder="Ocak ayı ofis kirası"
                            />
                        </div>
                    </div>

                    {/* Recurring Section */}
                    <div className="border-t border-slate-800 pt-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.is_recurring}
                                onChange={(e) => setFormData({ ...formData, is_recurring: e.target.checked })}
                                className="w-5 h-5 bg-slate-950 border-slate-700 rounded text-red-500 focus:ring-red-500"
                            />
                            <div>
                                <span className="text-white font-medium flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-purple-400" />
                                    Düzenli Gider (Aylık tekrar eden)
                                </span>
                                <p className="text-slate-400 text-xs mt-1">Bu gider her ay otomatik olarak tekrarlanacak</p>
                            </div>
                        </label>

                        {formData.is_recurring && (
                            <div className="mt-4 grid md:grid-cols-2 gap-4 pl-8">
                                <div>
                                    <label className="block text-slate-400 text-sm font-medium mb-2">Tekrar Sıklığı</label>
                                    <select
                                        value={formData.recurrence_frequency}
                                        onChange={(e) => setFormData({ ...formData, recurrence_frequency: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500"
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
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
                        >
                            <Save className="w-5 h-5" />
                            {loading ? 'Kaydediliyor...' : 'Gideri Kaydet'}
                        </button>
                    </div>
                </form>
            )}

            {/* Expenses List */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-slate-800">
                    <h3 className="text-lg font-bold text-white">Gider Kayıtları</h3>
                </div>
                {expenses.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">
                        Henüz gider kaydı yok
                    </div>
                ) : (
                    <div className="divide-y divide-slate-800">
                        {expenses.map((item) => (
                            <div key={item.id} className="p-4 hover:bg-slate-800/50 transition-colors flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h4 className="text-white font-medium">
                                            {item.description || categoryLabels[item.category]}
                                        </h4>
                                        <span className="text-xs px-2 py-1 bg-slate-800 text-slate-400 rounded-md">
                                            {categoryLabels[item.category]}
                                        </span>
                                        {item.is_recurring && (
                                            <span className="text-xs px-2 py-1 bg-purple-500/10 text-purple-400 rounded-md border border-purple-500/20 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                Düzenli
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-slate-400 text-sm">
                                        {new Date(item.date).toLocaleDateString('tr-TR')}
                                        {item.vendor && ` • ${item.vendor}`}
                                        {item.invoice_number && ` • ${item.invoice_number}`}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="text-red-400 font-bold text-lg">{formatCurrency(item.amount)}</p>
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
