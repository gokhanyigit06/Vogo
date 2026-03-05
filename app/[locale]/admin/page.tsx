"use client"

import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown, DollarSign, Briefcase, Users, Calendar, Zap, Target, Activity, Eye, EyeOff, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/ThemeToggle"
import { useSession } from "next-auth/react"

interface DashboardStats {
    totalIncome: number
    totalExpenses: number
    profit: number
    activeProjects: number
    totalClients: number
    monthlyIncome: number
    upcomingDeadlines: { id: number; name: string; end_date: string }[]
    recentTransactions: { id: number; description: string; date: string; amount: number }[]
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [hideSensitiveData, setHideSensitiveData] = useState(false)
    const { data: session } = useSession()

    const userName = session?.user?.name || 'Admin'

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

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return "Günaydın"
        if (hour < 18) return "Tünaydın"
        return "İyi Akşamlar"
    }

    if (loading) {
        return (
            <div className="p-8 max-w-7xl mx-auto flex items-center justify-center h-[80vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-14 h-14 border-4 border-vogo-aqua/30 border-t-vogo-aqua rounded-full animate-spin" />
                    <p className="text-muted-foreground animate-pulse font-medium">Veriler Analiz Ediliyor...</p>
                </div>
            </div>
        )
    }

    const formatCurrency = (amount: number) => {
        if (hideSensitiveData) return '₺ ••••••••'
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(amount)
    }

    const chartData = [35, 60, 45, 80, 55, 90, 70]
    const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-10 gradient-mesh">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                <div>
                    <h1 className="text-4xl font-bold flex items-center gap-2 flex-wrap">
                        <span className="text-gradient-vogo">
                            {getGreeting()}, {userName}
                        </span>
                        <span>👋</span>
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Bugün ajansın performansı <span className="text-vogo-orange font-bold">Harika</span> görünüyor.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <ThemeToggle />

                    <button
                        onClick={() => setHideSensitiveData(!hideSensitiveData)}
                        className="px-4 py-2 glass-card rounded-full text-muted-foreground hover:text-foreground flex items-center gap-2 cursor-pointer"
                        title={hideSensitiveData ? "Verileri Göster" : "Verileri Gizle"}
                    >
                        {hideSensitiveData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        <span className="text-xs font-bold">{hideSensitiveData ? "Gizli" : "Açık"}</span>
                    </button>

                    <div className="px-4 py-2 glass-card rounded-full text-muted-foreground text-sm flex items-center gap-2">
                        <div className="w-2 h-2 bg-vogo-aqua rounded-full animate-pulse" />
                        Sistem Online
                    </div>
                    <div className="hidden md:block px-4 py-2 glass-card rounded-full text-muted-foreground text-sm">
                        {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                    </div>
                </div>
            </div>

            {/* Premium KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">

                {/* Gelir */}
                <div className="kpi-card group" style={{ '--kpi-gradient': 'linear-gradient(135deg, #0099DD, #00ABBD)' } as React.CSSProperties}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-vogo-blue/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-vogo-blue/20 group-hover:scale-150" />
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-3 bg-gradient-to-br from-vogo-blue/20 to-vogo-aqua/10 rounded-xl">
                            <TrendingUp className="w-6 h-6 text-vogo-blue" />
                        </div>
                        <span className="text-vogo-aqua bg-vogo-aqua/10 px-2.5 py-1 rounded-lg text-xs font-bold border border-vogo-aqua/20">+12%</span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-muted-foreground text-sm font-medium mb-1">Toplam Gelir</p>
                        <h3 className="text-3xl font-bold text-foreground tracking-tight">{formatCurrency(stats?.totalIncome || 0)}</h3>
                    </div>
                </div>

                {/* Gider */}
                <div className="kpi-card group" style={{ '--kpi-gradient': 'linear-gradient(135deg, #ef4444, #f87171)' } as React.CSSProperties}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-red-500/20 group-hover:scale-150" />
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-3 bg-red-500/10 rounded-xl">
                            <TrendingDown className="w-6 h-6 text-red-500" />
                        </div>
                        <span className="text-red-500 bg-red-500/10 px-2.5 py-1 rounded-lg text-xs font-bold border border-red-500/20">+5%</span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-muted-foreground text-sm font-medium mb-1">Toplam Gider</p>
                        <h3 className="text-3xl font-bold text-foreground tracking-tight">{formatCurrency(stats?.totalExpenses || 0)}</h3>
                    </div>
                </div>

                {/* Kar */}
                <div className="kpi-card group" style={{ '--kpi-gradient': 'linear-gradient(135deg, #026E81, #00ABBD)' } as React.CSSProperties}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-vogo-teal/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-vogo-teal/20 group-hover:scale-150" />
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-3 bg-gradient-to-br from-vogo-teal/20 to-vogo-aqua/10 rounded-xl">
                            <DollarSign className="w-6 h-6 text-vogo-teal dark:text-vogo-aqua" />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <p className="text-muted-foreground text-sm font-medium mb-1">Net Kar</p>
                        <h3 className="text-3xl font-bold text-foreground tracking-tight">{formatCurrency(stats?.profit || 0)}</h3>
                    </div>
                </div>

                {/* Proje */}
                <div className="kpi-card group" style={{ '--kpi-gradient': 'linear-gradient(135deg, #FF9933, #FF7733)' } as React.CSSProperties}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-vogo-orange/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-vogo-orange/20 group-hover:scale-150" />
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-3 bg-vogo-orange/10 rounded-xl">
                            <Briefcase className="w-6 h-6 text-vogo-orange" />
                        </div>
                        <span className="text-vogo-orange bg-vogo-orange/10 px-2.5 py-1 rounded-lg text-xs font-bold border border-vogo-orange/20">{stats?.totalClients} Müşteri</span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-muted-foreground text-sm font-medium mb-1">Aktif Proje</p>
                        <h3 className="text-3xl font-bold text-foreground tracking-tight">{stats?.activeProjects || 0}</h3>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8 relative z-10">

                {/* Sol Büyük Alan */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Weekly Performance Chart */}
                    <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
                        <div className="flex justify-between items-end mb-8 relative z-10">
                            <div>
                                <h3 className="text-xl font-bold text-foreground">Haftalık Performans</h3>
                                <p className="text-muted-foreground text-sm">Son 7 günlük aktivite özeti</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="block w-3 h-3 bg-gradient-to-r from-vogo-blue to-vogo-aqua rounded-full" />
                                <span className="text-xs text-muted-foreground">Tamamlanan</span>
                            </div>
                        </div>

                        <div className="flex items-end justify-between h-48 gap-4 px-2 relative z-10">
                            {chartData.map((height, i) => (
                                <div key={i} className="flex flex-col items-center gap-3 w-full group cursor-pointer">
                                    <div className="w-full bg-secondary/50 rounded-t-xl relative h-full overflow-hidden">
                                        <div
                                            className="absolute bottom-0 w-full bg-gradient-to-t from-vogo-teal via-vogo-aqua to-vogo-blue rounded-t-xl transition-all duration-500 group-hover:opacity-80"
                                            style={{ height: `${height}%` }}
                                        >
                                            <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs font-bold px-2.5 py-1 rounded-lg transition-opacity shadow-md border border-border">
                                                {height}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium text-muted-foreground group-hover:text-vogo-blue transition-colors">{days[i]}</span>
                                </div>
                            ))}
                        </div>

                        {/* Background Decoration */}
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-vogo-blue/5 to-transparent pointer-events-none" />
                    </div>

                    {/* Recent Transactions Table */}
                    <div className="glass-card rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-border flex items-center justify-between">
                            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                <Activity className="w-5 h-5 text-vogo-blue" />
                                Son İşlemler
                            </h3>
                            <Link href="/admin/finance/income" className="text-sm text-vogo-blue hover:text-vogo-aqua font-medium flex items-center gap-1 transition-colors">
                                Tümünü Gör <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                        <div className="p-2">
                            {stats?.recentTransactions?.slice(0, 5).map((t) => (
                                <div key={t.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-accent/30 transition-all duration-200 group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-vogo-blue/10 to-vogo-aqua/10 flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
                                            💰
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground text-sm">{t.description || 'İşlem'}</p>
                                            <p className="text-xs text-muted-foreground">{new Date(t.date).toLocaleDateString('tr-TR')}</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-vogo-aqua dark:text-vogo-aqua">+{formatCurrency(t.amount)}</span>
                                </div>
                            ))}
                            {(!stats?.recentTransactions || stats.recentTransactions.length === 0) && (
                                <div className="p-8 text-center text-muted-foreground text-sm">
                                    Henüz finansal işlem yok.
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Sağ Kolon */}
                <div className="space-y-8">

                    {/* Hızlı Ekleme Butonları */}
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/admin/projects/new" className="btn-vogo p-4 rounded-xl text-center group">
                            <div className="relative z-10">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:bg-white/30 transition-all">
                                    <Briefcase className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-white font-bold text-sm">Proje Ekle</span>
                            </div>
                        </Link>
                        <Link href="/admin/tasks" className="group p-4 rounded-xl text-center bg-gradient-to-br from-vogo-teal to-vogo-aqua transition-all duration-300 hover:shadow-lg hover:shadow-vogo-teal/30 hover:-translate-y-1">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:bg-white/30 transition-all">
                                <Target className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-white font-bold text-sm">Görev Ata</span>
                        </Link>
                        <Link href="/admin/finance/income" className="group p-4 rounded-xl text-center bg-gradient-to-br from-vogo-ice to-vogo-blue transition-all duration-300 hover:shadow-lg hover:shadow-vogo-blue/30 hover:-translate-y-1">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:bg-white/30 transition-all">
                                <DollarSign className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-white font-bold text-sm">Gelir Gir</span>
                        </Link>
                        <Link href="/admin/clients/new" className="btn-orange p-4 rounded-xl text-center group">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:bg-white/30 transition-all">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-white font-bold text-sm">Müşteri</span>
                        </Link>
                    </div>

                    {/* Yaklaşan Teslimler */}
                    <div className="glass-card rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-border">
                            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                <Zap className="w-5 h-5 text-vogo-orange" />
                                Yaklaşan Teslimler
                            </h3>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2">
                            {stats?.upcomingDeadlines && stats.upcomingDeadlines.length > 0 ? (
                                stats.upcomingDeadlines.map((p) => (
                                    <div key={p.id} className="p-4 mb-2 rounded-xl border border-border hover:border-vogo-orange/30 hover:bg-vogo-orange/5 transition-all duration-300 group">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-foreground text-sm group-hover:text-vogo-orange transition-colors">{p.name}</h4>
                                            <span className="text-xs bg-vogo-orange/10 text-vogo-orange px-2.5 py-1 rounded-lg border border-vogo-orange/20 font-bold">
                                                {Math.ceil((new Date(p.end_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24))} gün
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(p.end_date).toLocaleDateString('tr-TR')}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="p-6 text-center text-muted-foreground text-sm">
                                    Yakın zamanda teslim edilecek proje yok.
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
