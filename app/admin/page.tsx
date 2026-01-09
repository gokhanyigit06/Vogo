"use client"

import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown, DollarSign, Briefcase, Users, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"

interface DashboardStats {
    totalIncome: number
    totalExpenses: number
    profit: number
    activeProjects: number
    totalClients: number
    monthlyIncome: number
    upcomingDeadlines: any[]
    recentTransactions: any[]
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/dashboard')
            .then(res => res.json())
            .then(data => {
                setStats(data)
                setLoading(false)
            })
            .catch(err => {
                console.error('Dashboard fetch error:', err)
                setLoading(false)
            })
    }, [])

    if (loading) {
        return (
            <div className="p-8 max-w-7xl mx-auto">
                <div className="flex items-center justify-center h-64">
                    <div className="text-slate-400">Yükleniyor...</div>
                </div>
            </div>
        )
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(amount)
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">

            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">İş Merkezi</h1>
                <p className="text-slate-400 mt-1">Ajansınızın tüm operasyonlarını buradan yönetin.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Toplam Gelir */}
                <div className="bg-gradient-to-br from-emerald-500/10 to-slate-900 border border-emerald-500/20 p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-emerald-400" />
                        </div>
                    </div>
                    <p className="text-slate-400 text-sm font-medium">Toplam Gelir</p>
                    <h3 className="text-2xl font-bold text-white mt-1">{formatCurrency(stats?.totalIncome || 0)}</h3>
                    <p className="text-emerald-400 text-xs mt-2">Bu ay: {formatCurrency(stats?.monthlyIncome || 0)}</p>
                </div>

                {/* Toplam Gider */}
                <div className="bg-gradient-to-br from-red-500/10 to-slate-900 border border-red-500/20 p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                            <TrendingDown className="w-6 h-6 text-red-400" />
                        </div>
                    </div>
                    <p className="text-slate-400 text-sm font-medium">Toplam Gider</p>
                    <h3 className="text-2xl font-bold text-white mt-1">{formatCurrency(stats?.totalExpenses || 0)}</h3>
                    <p className="text-red-400 text-xs mt-2">Operasyonel maliyetler</p>
                </div>

                {/* Net Kar */}
                <div className="bg-gradient-to-br from-blue-500/10 to-slate-900 border border-blue-500/20 p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-blue-400" />
                        </div>
                    </div>
                    <p className="text-slate-400 text-sm font-medium">Net Kar</p>
                    <h3 className="text-2xl font-bold text-white mt-1">{formatCurrency(stats?.profit || 0)}</h3>
                    <p className={`text-xs mt-2 ${(stats?.profit || 0) >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                        {(stats?.profit || 0) >= 0 ? 'Karlı' : 'Zararda'}
                    </p>
                </div>

                {/* Aktif Projeler */}
                <div className="bg-gradient-to-br from-purple-500/10 to-slate-900 border border-purple-500/20 p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                            <Briefcase className="w-6 h-6 text-purple-400" />
                        </div>
                    </div>
                    <p className="text-slate-400 text-sm font-medium">Aktif Projeler</p>
                    <h3 className="text-2xl font-bold text-white mt-1">{stats?.activeProjects || 0}</h3>
                    <p className="text-purple-400 text-xs mt-2">{stats?.totalClients || 0} toplam müşteri</p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">

                {/* Yaklaşan Deadline'lar */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-emerald-500" />
                            Yaklaşan Deadline'lar
                        </h3>
                        <Link href="/admin/projects" className="text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                            Tümünü Gör
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-800">
                        {stats?.upcomingDeadlines && stats.upcomingDeadlines.length > 0 ? (
                            stats.upcomingDeadlines.map((project: any) => (
                                <div key={project.id} className="p-4 hover:bg-slate-800/50 transition-colors flex items-center justify-between group">
                                    <div>
                                        <p className="text-white font-medium group-hover:text-emerald-400 transition-colors">{project.name}</p>
                                        <p className="text-slate-400 text-xs mt-1">Bitiş: {new Date(project.end_date).toLocaleDateString('tr-TR')}</p>
                                    </div>
                                    <Link
                                        href={`/admin/projects/${project.id}`}
                                        className="text-slate-400 hover:text-white transition-colors"
                                    >
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-slate-400">
                                Yaklaşan deadline'ı olan proje yok
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                    <Link
                        href="/admin/clients/new"
                        className="block bg-emerald-500 hover:bg-emerald-600 p-6 rounded-2xl transition-all group shadow-lg shadow-emerald-500/20"
                    >
                        <Users className="w-8 h-8 text-white mb-3" />
                        <h4 className="text-white font-bold text-lg">Yeni Müşteri</h4>
                        <p className="text-emerald-100 text-sm mt-1">CRM'e müşteri ekle</p>
                    </Link>

                    <Link
                        href="/admin/projects/new"
                        className="block bg-slate-800 hover:bg-slate-700 border border-slate-700 p-6 rounded-2xl transition-all group"
                    >
                        <Briefcase className="w-8 h-8 text-emerald-400 mb-3" />
                        <h4 className="text-white font-bold text-lg">Yeni Proje</h4>
                        <p className="text-slate-400 text-sm mt-1">Proje oluştur ve takip et</p>
                    </Link>

                    <Link
                        href="/admin/finance/income"
                        className="block bg-slate-800 hover:bg-slate-700 border border-slate-700 p-6 rounded-2xl transition-all group"
                    >
                        <DollarSign className="w-8 h-8 text-blue-400 mb-3" />
                        <h4 className="text-white font-bold text-lg">Gelir Kaydet</h4>
                        <p className="text-slate-400 text-sm mt-1">Ödeme kaydı oluştur</p>
                    </Link>
                </div>
            </div>
        </div>
    )
}
