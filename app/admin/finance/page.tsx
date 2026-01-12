"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown, DollarSign, Calendar, Plus, ArrowRight, FileText, Filter } from "lucide-react"
import Link from "next/link"
import IncomeTrendChart from "@/components/admin/charts/IncomeTrendChart"
import ExpensePieChart from "@/components/admin/charts/ExpensePieChart"

export default function FinancePage() {
    const [income, setIncome] = useState<any[]>([])
    const [expenses, setExpenses] = useState<any[]>([])
    const [payables, setPayables] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [dateFilter, setDateFilter] = useState('thisMonth') // Default: Bu Ay

    useEffect(() => {
        Promise.all([
            fetch('/api/finance/income').then(r => r.json()),
            fetch('/api/finance/expenses').then(r => r.json()),
            fetch('/api/finance/payables').then(r => r.json())
        ]).then(([incomeData, expensesData, payablesData]) => {
            setIncome(Array.isArray(incomeData) ? incomeData : [])
            setExpenses(Array.isArray(expensesData) ? expensesData : [])
            setPayables(Array.isArray(payablesData) ? payablesData : [])
            setLoading(false)
        }).catch(err => {
            console.error('Finance data error:', err)
            setIncome([])
            setExpenses([])
            setPayables([])
            setLoading(false)
        })
    }, [])

    // Tarih Filtreleme Fonksiyonu
    const filterByDate = (items: any[]) => {
        if (!items) return []
        const now = new Date()
        const currentMonth = now.getMonth()
        const currentYear = now.getFullYear()

        return items.filter(item => {
            // Tarih alanı kontrolü: income/expenses için 'date', diğerleri için 'created_at' fallback
            const d = new Date(item.date || item.due_date || item.created_at)
            const m = d.getMonth()
            const y = d.getFullYear()

            if (dateFilter === 'thisMonth') return m === currentMonth && y === currentYear
            if (dateFilter === 'lastMonth') {
                const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                return m === lastMonthDate.getMonth() && y === lastMonthDate.getFullYear()
            }
            if (dateFilter === 'thisYear') return y === currentYear
            return true // allTime
        })
    }

    // Filtrelenmiş Veriler (KPI ve Pasta Grafik için)
    const filteredIncome = filterByDate(income)
    const filteredExpenses = filterByDate(expenses)

    // KPI Hesaplamaları (Seçili Döneme Göre)
    // 1. Gerçekleşen Gelir: Seçili dönemde tahsil edilmiş gelirler
    const totalCollectedIncome = filteredIncome
        .filter(i => i.status !== 'pending' && i.is_paid !== false)
        .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0)

    // 2. Toplam Gider: Seçili dönemdeki giderler
    const totalPaidExpenses = filteredExpenses.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0)

    // 3. Net Kar: Seçili dönemin karı
    const profit = totalCollectedIncome - totalPaidExpenses

    // Bilanço Hesaplamaları (Filtreden Bağımsız - Her Zaman Güncel Bakiye)
    // Borç ve alacak bir stok verisidir, tarih filtresinden etkilenmemesi daha doğrudur.
    const totalReceivables = income
        .filter(i => i.status === 'pending' || i.is_paid === false)
        .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0)

    const totalPayables = payables
        .filter(p => p.status === 'pending')
        .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0)

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(amount)
    }

    // Recurring (Düzenli) - Sabit bilgi
    const recurringIncome = income.filter(i => i.is_recurring)
    const recurringExpenses = expenses.filter(e => e.is_recurring)
    const monthlyRecurringIncome = recurringIncome.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0)
    const monthlyRecurringExpenses = recurringExpenses.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0)

    if (loading) {
        return <div className="p-8 max-w-7xl mx-auto"><div className="text-muted-foreground">Yükleniyor...</div></div>
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header & Filter */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                        <DollarSign className="w-8 h-8 text-emerald-500" />
                        Finans Yönetimi
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {dateFilter === 'thisMonth' && 'Bu Ayın Finansal Özeti'}
                        {dateFilter === 'lastMonth' && 'Geçen Ayın Finansal Özeti'}
                        {dateFilter === 'thisYear' && 'Bu Yılın Finansal Özeti'}
                        {dateFilter === 'allTime' && 'Tüm Zamanların Özeti'}
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-card border border-border p-1 rounded-xl self-start overflow-x-auto max-w-full">
                    <button
                        onClick={() => setDateFilter('thisMonth')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${dateFilter === 'thisMonth' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-foreground hover:bg-slate-800/50'}`}
                    >
                        Bu Ay
                    </button>
                    <button
                        onClick={() => setDateFilter('lastMonth')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${dateFilter === 'lastMonth' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-foreground hover:bg-slate-800/50'}`}
                    >
                        Geçen Ay
                    </button>
                    <button
                        onClick={() => setDateFilter('thisYear')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${dateFilter === 'thisYear' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-foreground hover:bg-slate-800/50'}`}
                    >
                        Bu Yıl
                    </button>
                    <button
                        onClick={() => setDateFilter('allTime')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${dateFilter === 'allTime' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-foreground hover:bg-slate-800/50'}`}
                    >
                        Tümü
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="bg-card border border-emerald-500/20 p-6 rounded-notebook card-light-shadow">
                    <div className="flex justify-between items-start mb-3">
                        <TrendingUp className="w-8 h-8 text-emerald-500" />
                        <span className="text-xs font-mono text-emerald-500/50 bg-emerald-500/5 px-2 py-1 rounded">
                            {dateFilter === 'allTime' ? 'TÜMÜ' : 'DÖNEMSEL'}
                        </span>
                    </div>
                    <p className="text-muted-foreground text-sm">Gerçekleşen Gelir</p>
                    <h3 className="text-2xl font-bold text-foreground mt-1">{formatCurrency(totalCollectedIncome)}</h3>
                </div>

                <div className="bg-card border border-red-500/20 p-6 rounded-notebook card-light-shadow">
                    <div className="flex justify-between items-start mb-3">
                        <TrendingDown className="w-8 h-8 text-slate-500" />
                        <span className="text-xs font-mono text-slate-500/50 bg-slate-500/5 px-2 py-1 rounded">
                            {dateFilter === 'allTime' ? 'TÜMÜ' : 'DÖNEMSEL'}
                        </span>
                    </div>
                    <p className="text-muted-foreground text-sm">Toplam Gider</p>
                    <h3 className="text-2xl font-bold text-foreground mt-1">{formatCurrency(totalPaidExpenses)}</h3>
                </div>

                <div className="bg-card border border-blue-500/20 p-6 rounded-notebook card-light-shadow">
                    <div className="flex justify-between items-start mb-3">
                        <DollarSign className="w-8 h-8 text-blue-500" />
                        <span className="text-xs font-mono text-blue-500/50 bg-blue-500/5 px-2 py-1 rounded">
                            {dateFilter === 'allTime' ? 'TÜMÜ' : 'DÖNEMSEL'}
                        </span>
                    </div>
                    <p className="text-muted-foreground text-sm">Net Kâr</p>
                    <h3 className={`text-2xl font-bold mt-1 ${profit >= 0 ? 'text-blue-500' : 'text-red-500'}`}>
                        {formatCurrency(profit)}
                    </h3>
                </div>

                {/* Bilanço Kartları - Bunlar her zaman TOTAL gösterir */}
                <div className="bg-card border border-amber-500/20 p-6 rounded-notebook card-light-shadow">
                    <div className="flex justify-between items-start mb-3">
                        <Calendar className="w-8 h-8 text-amber-500" />
                        <span className="text-xs font-mono text-amber-500/50 bg-amber-500/5 px-2 py-1 rounded">TOPLAM</span>
                    </div>
                    <p className="text-muted-foreground text-sm">Bekleyen Alacaklar</p>
                    <h3 className="text-2xl font-bold text-amber-500 mt-1">
                        {formatCurrency(totalReceivables)}
                    </h3>
                </div>

                <div className="bg-card border border-red-500/20 p-6 rounded-notebook card-light-shadow">
                    <div className="flex justify-between items-start mb-3">
                        <Calendar className="w-8 h-8 text-red-500" />
                        <span className="text-xs font-mono text-red-500/50 bg-red-500/5 px-2 py-1 rounded">TOPLAM</span>
                    </div>
                    <p className="text-muted-foreground text-sm">Ödenecek Borçlar</p>
                    <h3 className="text-2xl font-bold text-red-500 mt-1">
                        {formatCurrency(totalPayables)}
                    </h3>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    {/* Trend her zaman geniş perspektif vermeli, o yüzden tüm veri gidiyor */}
                    <IncomeTrendChart income={income} expenses={expenses} />
                </div>
                <div>
                    {/* Pasta grafik seçili dönemin detayını vermeli, o yüzden filtrelenmiş veri gidiyor */}
                    <ExpensePieChart expenses={filteredExpenses} />
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link
                    href="/admin/finance/clients"
                    className="bg-card border border-border hover:border-blue-500/50 p-6 rounded-notebook transition-all group"
                >
                    <div className="flex flex-col h-full justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-foreground mb-2">Müşteri Carileri</h3>
                            <p className="text-muted-foreground text-xs">
                                Bakiye ve işlem geçmişi
                            </p>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <ArrowRight className="w-8 h-8 text-blue-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>

                <Link
                    href="/admin/finance/income"
                    className="bg-card border border-border hover:border-emerald-500/50 p-6 rounded-notebook transition-all group"
                >
                    <div className="flex flex-col h-full justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-foreground mb-2">Gelirler</h3>
                            <p className="text-muted-foreground text-xs">
                                Tahsilat ve fatura girişi
                            </p>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Plus className="w-8 h-8 text-emerald-400 group-hover:scale-110 transition-transform" />
                        </div>
                    </div>
                </Link>

                <Link
                    href="/admin/finance/expenses"
                    className="bg-card border border-border hover:border-red-500/50 p-6 rounded-notebook transition-all group"
                >
                    <div className="flex flex-col h-full justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-foreground mb-2">Giderler</h3>
                            <p className="text-muted-foreground text-xs">
                                Masraf girişi ve takibi
                            </p>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Plus className="w-8 h-8 text-red-500 group-hover:scale-110 transition-transform" />
                        </div>
                    </div>
                </Link>

                <Link
                    href="/admin/finance/payables"
                    className="bg-card border border-border hover:border-red-500/50 p-6 rounded-notebook transition-all group"
                >
                    <div className="flex flex-col h-full justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-foreground mb-2">Borçlar</h3>
                            <p className="text-muted-foreground text-xs">
                                Tedarikçi ve personel ödemeleri
                            </p>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <FileText className="w-8 h-8 text-red-500 group-hover:scale-110 transition-transform" />
                        </div>
                    </div>
                </Link>
            </div>

            {/* Recurring Info */}
            {(recurringIncome.length > 0 || recurringExpenses.length > 0) && (
                <div className="bg-purple-500/10 border border-purple-500/20 p-6 rounded-notebook">
                    <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-purple-400" />
                        Düzenli Ödemeler (Aylık)
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-muted-foreground text-sm mb-2">Düzenli Gelirler</p>
                            <p className="text-emerald-400 text-xl font-bold">{formatCurrency(monthlyRecurringIncome)}/ay</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground text-sm mb-2">Düzenli Giderler</p>
                            <p className="text-red-400 text-xl font-bold">{formatCurrency(monthlyRecurringExpenses)}/ay</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Ortak Cari Hesapları */}
            {expenses.some(e => e.paid_by) && (
                <div className="bg-card border border-border p-6 rounded-notebook">
                    <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-blue-400" />
                        Ortak Cari Hesapları
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.values(expenses.reduce((acc: any, item) => {
                            if (item.paid_by && item.team_members) {
                                if (!acc[item.paid_by]) {
                                    acc[item.paid_by] = {
                                        id: item.paid_by,
                                        name: item.team_members.name,
                                        amount: 0
                                    }
                                }
                                acc[item.paid_by].amount += parseFloat(item.amount || 0)
                            }
                            return acc
                        }, {})).map((partner: any) => (
                            <div key={partner.id} className="bg-background border border-border p-4 rounded-xl flex items-center justify-between">
                                <div>
                                    <p className="text-muted-foreground text-sm">Şirketin {partner.name}'a Borcu</p>
                                    <p className="text-xl font-bold text-foreground mt-1">{formatCurrency(partner.amount)}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                    <span className="text-blue-400 font-bold">{partner.name[0]}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
