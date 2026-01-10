"use client"

import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown, DollarSign, Briefcase, Users, Calendar, ArrowRight, Zap, Target, Activity, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/ThemeToggle"
import { createClient } from "@/lib/supabase-client"

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
    const [userName, setUserName] = useState("Volkan Bey")
    const [hideSensitiveData, setHideSensitiveData] = useState(false)

    const supabase = createClient()

    useEffect(() => {
        // 1. Dashboard verilerini çek
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

        // 2. Kullanıcı adını çek
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                // Metadata varsa oradan, yoksa email'den isim türet
                const name = user.user_metadata?.full_name || user.email?.split('@')[0]
                if (name) setUserName(name)
            }
        }
        getUser()
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
                    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <p className="text-muted-foreground animate-pulse">Veriler Analiz Ediliyor...</p>
                </div>
            </div>
        )
    }

    const formatCurrency = (amount: number) => {
        if (hideSensitiveData) return '₺ ••••••••'
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(amount)
    }

    // Mock Chart Data (Veri gelene kadar görsel şölen)
    const chartData = [35, 60, 45, 80, 55, 90, 70]
    const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-10">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold flex items-center gap-2 flex-wrap">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
                            {getGreeting()}, {userName}
                        </span>
                        <span>👋</span>
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Bugün ajansın performansı <span className="text-primary font-bold">Harika</span> görünüyor.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <ThemeToggle />

                    {/* Privacy Toggle Button */}
                    <button
                        onClick={() => setHideSensitiveData(!hideSensitiveData)}
                        className="px-4 py-2 bg-card border border-border rounded-full text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all flex items-center gap-2 shadow-sm"
                        title={hideSensitiveData ? "Verileri Göster" : "Verileri Gizle"}
                    >
                        {hideSensitiveData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        <span className="text-xs font-bold">{hideSensitiveData ? "Gizli" : "Açık"}</span>
                    </button>

                    <div className="px-4 py-2 bg-card border border-border rounded-full text-muted-foreground text-sm flex items-center gap-2 shadow-sm">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        Sistem Online
                    </div>
                    <div className="hidden md:block px-4 py-2 bg-card border border-border rounded-full text-muted-foreground text-sm shadow-sm">
                        {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                    </div>
                </div>
            </div>

            {/* Premium KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Gelir Kartı */}
                <div className="relative group overflow-hidden bg-card border border-border rounded-notebook card-light-shadow p-6 transition-all hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 dark:hover:shadow-emerald-500/10 hover:bg-card/80">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-emerald-500/20" />
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-3 bg-emerald-500/10 rounded-notebook">
                            <TrendingUp className="w-6 h-6 text-emerald-500" />
                        </div>
                        <span className="text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-xl text-xs font-bold">+12%</span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-muted-foreground text-sm font-medium mb-1">Toplam Gelir</p>
                        <h3 className="text-3xl font-bold text-foreground tracking-tight">{formatCurrency(stats?.totalIncome || 0)}</h3>
                    </div>
                </div>

                {/* Gider Kartı */}
                <div className="relative group overflow-hidden bg-card border border-border rounded-notebook card-light-shadow p-6 transition-all hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-500/10 dark:hover:shadow-red-500/10 hover:bg-card/80">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-red-500/20" />
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-3 bg-red-500/10 rounded-xl">
                            <TrendingDown className="w-6 h-6 text-red-500" />
                        </div>
                        <span className="text-red-500 bg-red-500/10 px-2 py-1 rounded-lg text-xs font-bold">+5%</span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-muted-foreground text-sm font-medium mb-1">Toplam Gider</p>
                        <h3 className="text-3xl font-bold text-foreground tracking-tight">{formatCurrency(stats?.totalExpenses || 0)}</h3>
                    </div>
                </div>

                {/* Kar Kartı */}
                <div className="relative group overflow-hidden bg-card border border-border rounded-notebook card-light-shadow p-6 transition-all hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/10 hover:bg-card/80">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-blue-500/20" />
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-3 bg-blue-500/10 rounded-xl">
                            <DollarSign className="w-6 h-6 text-blue-500" />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <p className="text-muted-foreground text-sm font-medium mb-1">Net Kar</p>
                        <h3 className="text-3xl font-bold text-foreground tracking-tight">{formatCurrency(stats?.profit || 0)}</h3>
                    </div>
                </div>

                {/* Proje Kartı */}
                <div className="relative group overflow-hidden bg-card border border-border rounded-notebook card-light-shadow p-6 transition-all hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 dark:hover:shadow-purple-500/10 hover:bg-card/80">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-purple-500/20" />
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-3 bg-purple-500/10 rounded-xl">
                            <Briefcase className="w-6 h-6 text-purple-500" />
                        </div>
                        <span className="text-purple-500 bg-purple-500/10 px-2 py-1 rounded-lg text-xs font-bold">{stats?.totalClients} Müşteri</span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-muted-foreground text-sm font-medium mb-1">Aktif Proje</p>
                        <h3 className="text-3xl font-bold text-foreground tracking-tight">{stats?.activeProjects || 0}</h3>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">

                {/* Sol Büyük Alan: Chart & Activity */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Weekly Performance Chart (CSS Based) */}
                    <div className="bg-card border border-border rounded-3xl p-8 relative overflow-hidden shadow-sm">
                        <div className="flex justify-between items-end mb-8 relative z-10">
                            <div>
                                <h3 className="text-xl font-bold text-foreground">Haftalık Performans</h3>
                                <p className="text-muted-foreground text-sm">Son 7 günlük aktivite özeti</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="block w-3 h-3 bg-primary rounded-full" />
                                <span className="text-xs text-muted-foreground">Tamamlanan</span>
                            </div>
                        </div>

                        {/* Chart Bars */}
                        <div className="flex items-end justify-between h-48 gap-4 px-2 relative z-10">
                            {chartData.map((height, i) => (
                                <div key={i} className="flex flex-col items-center gap-3 w-full group cursor-pointer">
                                    <div className="w-full bg-secondary/50 rounded-t-xl relative h-full overflow-hidden">
                                        <div
                                            className="absolute bottom-0 w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-xl transition-all duration-500 group-hover:opacity-90"
                                            style={{ height: `${height}%` }}
                                        >
                                            <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs font-bold px-2 py-1 rounded transition-opacity shadow-md">
                                                {height}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">{days[i]}</span>
                                </div>
                            ))}
                        </div>

                        {/* Background Decoration */}
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
                    </div>

                    {/* Recent Transactions Table */}
                    <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-border flex justify-between items-center">
                            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                <Activity className="w-5 h-5 text-blue-500" />
                                Son İşlemler
                            </h3>
                            <Link href="/admin/finance/income" className="text-sm text-blue-500 hover:text-blue-400 font-medium">Tümünü Gör</Link>
                        </div>
                        <div className="divide-y divide-border">
                            {stats?.recentTransactions?.slice(0, 5).map((t: any) => (
                                <div key={t.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg">
                                            💰
                                        </div>
                                        <div>
                                            <p className="text-foreground font-medium">{t.description || 'İşlem'}</p>
                                            <p className="text-muted-foreground text-xs">{new Date(t.date).toLocaleDateString('tr-TR')}</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-emerald-500">
                                        +{formatCurrency(t.amount)}
                                    </span>
                                </div>
                            ))}
                            {(!stats?.recentTransactions || stats.recentTransactions.length === 0) && (
                                <div className="p-8 text-center text-muted-foreground">Henüz finansal işlem yok.</div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Sağ Kolon: Quick Actions & Deadlines */}
                <div className="space-y-8">

                    {/* Hızlı Ekleme Butonları */}
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/admin/projects/new" className="bg-emerald-600 hover:bg-emerald-500 p-4 rounded-notebook transition-all shadow-lg shadow-emerald-500/20 text-center group">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                <Briefcase className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-white font-bold text-sm">Proje Ekle</span>
                        </Link>
                        <Link href="/admin/tasks" className="bg-blue-600 hover:bg-blue-500 p-4 rounded-notebook transition-all shadow-lg shadow-blue-500/20 text-center group">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                <Target className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-white font-bold text-sm">Görev Ata</span>
                        </Link>
                        <Link href="/admin/finance/income" className="bg-purple-600 hover:bg-purple-500 p-4 rounded-notebook transition-all shadow-lg shadow-purple-500/20 text-center group">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                <DollarSign className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-white font-bold text-sm">Gelir Gir</span>
                        </Link>
                        <Link href="/admin/clients/new" className="bg-orange-600 hover:bg-orange-500 p-4 rounded-notebook transition-all shadow-lg shadow-orange-500/20 text-center group">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-white font-bold text-sm">Müşteri</span>
                        </Link>
                    </div>

                    {/* Yaklaşan Teslimler */}
                    <div className="bg-card border border-border rounded-3xl overflow-hidden h-fit shadow-sm">
                        <div className="p-6 border-b border-border">
                            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                <Zap className="w-5 h-5 text-yellow-500" />
                                Yaklaşan Teslimler
                            </h3>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2">
                            {stats?.upcomingDeadlines && stats.upcomingDeadlines.length > 0 ? (
                                stats.upcomingDeadlines.map((p: any) => (
                                    <div key={p.id} className="p-4 mb-2 bg-secondary/30 rounded-xl border border-border hover:border-yellow-500/30 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-foreground text-sm">{p.name}</h4>
                                            <span className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded">
                                                {Math.ceil((new Date(p.end_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24))} gün kaldı
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
