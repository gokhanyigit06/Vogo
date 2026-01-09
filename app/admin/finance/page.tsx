"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown, DollarSign, Calendar, Plus } from "lucide-react"
import Link from "next/link"

export default function FinancePage() {
    const [income, setIncome] = useState<any[]>([])
    const [expenses, setExpenses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            fetch('/api/finance/income').then(r => r.json()),
            fetch('/api/finance/expenses').then(r => r.json())
        ]).then(([incomeData, expensesData]) => {
            setIncome(incomeData)
            setExpenses(expensesData)
            setLoading(false)
        })
    }, [])

    const totalIncome = income.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0)
    const totalExpenses = expenses.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0)
    const profit = totalIncome - totalExpenses

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(amount)
    }

    const recurringIncome = income.filter(i => i.is_recurring)
    const recurringExpenses = expenses.filter(e => e.is_recurring)
    const monthlyRecurringIncome = recurringIncome.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0)
    const monthlyRecurringExpenses = recurringExpenses.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0)

    if (loading) {
        return <div className="p-8"><div className="text-slate-400">Yükleniyor...</div></div>
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <DollarSign className="w-8 h-8 text-emerald-500" />
                    Finans Yönetimi
                </h1>
                <p className="text-slate-400 mt-1">Gelir, gider ve kar takibi</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-emerald-500/10 to-slate-900 border border-emerald-500/20 p-6 rounded-2xl">
                    <TrendingUp className="w-8 h-8 text-emerald-400 mb-3" />
                    <p className="text-slate-400 text-sm">Toplam Gelir</p>
                    <h3 className="text-2xl font-bold text-white mt-1">{formatCurrency(totalIncome)}</h3>
                </div>

                <div className="bg-gradient-to-br from-red-500/10 to-slate-900 border border-red-500/20 p-6 rounded-2xl">
                    <TrendingDown className="w-8 h-8 text-red-400 mb-3" />
                    <p className="text-slate-400 text-sm">Toplam Gider</p>
                    <h3 className="text-2xl font-bold text-white mt-1">{formatCurrency(totalExpenses)}</h3>
                </div>

                <div className="bg-gradient-to-br from-blue-500/10 to-slate-900 border border-blue-500/20 p-6 rounded-2xl">
                    <DollarSign className="w-8 h-8 text-blue-400 mb-3" />
                    <p className="text-slate-400 text-sm">Net Kar</p>
                    <h3 className={`text-2xl font-bold mt-1 ${profit >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                        {formatCurrency(profit)}
                    </h3>
                </div>

                <div className="bg-gradient-to-br from-purple-500/10 to-slate-900 border border-purple-500/20 p-6 rounded-2xl">
                    <Calendar className="w-8 h-8 text-purple-400 mb-3" />
                    <p className="text-slate-400 text-sm">Aylık Düzenli Net</p>
                    <h3 className="text-2xl font-bold text-purple-400 mt-1">
                        {formatCurrency(monthlyRecurringIncome - monthlyRecurringExpenses)}
                    </h3>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
                <Link
                    href="/admin/finance/income"
                    className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-6 rounded-2xl transition-all group"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Gelir Yönetimi</h3>
                            <p className="text-slate-400 text-sm">
                                Müşteri ödemeleri ve düzenli gelirleri kaydet
                            </p>
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    <span className="text-slate-300">{income.length} kayıt</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                    <span className="text-slate-300">{recurringIncome.length} düzenli gelir</span>
                                </div>
                            </div>
                        </div>
                        <Plus className="w-12 h-12 text-emerald-400 group-hover:scale-110 transition-transform" />
                    </div>
                </Link>

                <Link
                    href="/admin/finance/expenses"
                    className="bg-slate-900 border border-slate-800 hover:border-red-500/50 p-6 rounded-2xl transition-all group"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Gider Yönetimi</h3>
                            <p className="text-slate-400 text-sm">
                                Masraflar ve düzenli ödemeleri kaydet
                            </p>
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    <span className="text-slate-300">{expenses.length} kayıt</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                    <span className="text-slate-300">{recurringExpenses.length} düzenli gider</span>
                                </div>
                            </div>
                        </div>
                        <Plus className="w-12 h-12 text-red-400 group-hover:scale-110 transition-transform" />
                    </div>
                </Link>
            </div>

            {/* Recurring Info */}
            {(recurringIncome.length > 0 || recurringExpenses.length > 0) && (
                <div className="bg-purple-500/10 border border-purple-500/20 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-purple-400" />
                        Düzenli Ödemeler
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-slate-400 text-sm mb-2">Düzenli Gelirler</p>
                            <p className="text-emerald-400 text-xl font-bold">{formatCurrency(monthlyRecurringIncome)}/ay</p>
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm mb-2">Düzenli Giderler</p>
                            <p className="text-red-400 text-xl font-bold">{formatCurrency(monthlyRecurringExpenses)}/ay</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
