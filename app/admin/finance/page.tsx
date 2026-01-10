"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown, DollarSign, Calendar, Plus } from "lucide-react"
import Link from "next/link"
import IncomeTrendChart from "@/components/admin/charts/IncomeTrendChart"
import ExpensePieChart from "@/components/admin/charts/ExpensePieChart"

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
        return <div className="p-8"><div className="text-muted-foreground">Yükleniyor...</div></div>
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                    <DollarSign className="w-8 h-8 text-emerald-500" />
                    Finans Yönetimi
                </h1>
                <p className="text-muted-foreground mt-1">Gelir, gider ve kar takibi</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-card border border-emerald-500/20 p-6 rounded-notebook card-light-shadow">
                    <TrendingUp className="w-8 h-8 text-emerald-500 mb-3" />
                    <p className="text-muted-foreground text-sm">Toplam Gelir</p>
                    <h3 className="text-2xl font-bold text-foreground mt-1">{formatCurrency(totalIncome)}</h3>
                </div>

                <div className="bg-card border border-red-500/20 p-6 rounded-notebook card-light-shadow">
                    <TrendingDown className="w-8 h-8 text-red-500 mb-3" />
                    <p className="text-muted-foreground text-sm">Toplam Gider</p>
                    <h3 className="text-2xl font-bold text-foreground mt-1">{formatCurrency(totalExpenses)}</h3>
                </div>

                <div className="bg-card border border-blue-500/20 p-6 rounded-notebook card-light-shadow">
                    <DollarSign className="w-8 h-8 text-blue-500 mb-3" />
                    <p className="text-muted-foreground text-sm">Net Kar</p>
                    <h3 className={`text-2xl font-bold mt-1 ${profit >= 0 ? 'text-blue-500' : 'text-red-500'}`}>
                        {formatCurrency(profit)}
                    </h3>
                </div>

                <div className="bg-card border border-purple-500/20 p-6 rounded-notebook card-light-shadow">
                    <Calendar className="w-8 h-8 text-purple-500 mb-3" />
                    <p className="text-muted-foreground text-sm">Aylık Düzenli Net</p>
                    <h3 className="text-2xl font-bold text-purple-500 mt-1">
                        {formatCurrency(monthlyRecurringIncome - monthlyRecurringExpenses)}
                    </h3>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <IncomeTrendChart income={income} expenses={expenses} />
                </div>
                <div>
                    <ExpensePieChart expenses={expenses} />
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
                <Link
                    href="/admin/finance/income"
                    className="bg-card border border-border hover:border-emerald-500/50 p-6 rounded-notebook transition-all group"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-2">Gelir Yönetimi</h3>
                            <p className="text-muted-foreground text-sm">
                                Müşteri ödemeleri ve düzenli gelirleri kaydet
                            </p>
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    <span className="text-muted-foreground">{income.length} kayıt</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                    <span className="text-muted-foreground">{recurringIncome.length} düzenli gelir</span>
                                </div>
                            </div>
                        </div>
                        <Plus className="w-12 h-12 text-emerald-400 group-hover:scale-110 transition-transform" />
                    </div>
                </Link>

                <Link
                    href="/admin/finance/expenses"
                    className="bg-card border border-border hover:border-red-500/50 p-6 rounded-notebook transition-all group"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-2">Gider Yönetimi</h3>
                            <p className="text-muted-foreground text-sm">
                                Masraflar ve düzenli ödemeleri kaydet
                            </p>
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    <span className="text-muted-foreground">{expenses.length} kayıt</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                    <span className="text-muted-foreground">{recurringExpenses.length} düzenli gider</span>
                                </div>
                            </div>
                        </div>
                        <Plus className="w-12 h-12 text-red-400 group-hover:scale-110 transition-transform" />
                    </div>
                </Link>

                <Link
                    href="/admin/finance/receivables"
                    className="bg-card border border-border hover:border-blue-500/50 p-6 rounded-notebook transition-all group md:col-span-2 lg:col-span-1"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-2">Alacak Takibi</h3>
                            <p className="text-muted-foreground text-sm">
                                Müşterilerden beklenen ödemeler
                            </p>
                            <div className="mt-4 flex items-center gap-2 text-sm">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                <span className="text-muted-foreground">Borçlu müşterileri listele</span>
                            </div>
                        </div>
                        <DollarSign className="w-12 h-12 text-blue-400 group-hover:scale-110 transition-transform" />
                    </div>
                </Link>
            </div>

            {/* Recurring Info */}
            {(recurringIncome.length > 0 || recurringExpenses.length > 0) && (
                <div className="bg-purple-500/10 border border-purple-500/20 p-6 rounded-notebook">
                    <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-purple-400" />
                        Düzenli Ödemeler
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

            {/* Partner Balances (Cari Hesaplar) */}
            {expenses.some(e => e.paid_by) && (
                <div className="bg-card border border-border p-6 rounded-notebook">
                    <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-blue-400" />
                        Ortak Cari Hesapları
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Gruplama ve Hesaplama */}
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
