"use client"

import { useEffect, useState, use } from "react"
import { ArrowLeft, Users, Building2, Mail, Phone, Calendar, Briefcase, DollarSign, ExternalLink, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
    // Next.js 15+ params handling
    const { id } = use(params)

    const [client, setClient] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchClientDetail()
    }, [])

    const fetchClientDetail = async () => {
        try {
            const res = await fetch(`/api/clients/${id}`)
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            setClient(data)
        } catch (error) {
            console.error('Fetch error:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount)
    }

    if (loading) return <div className="p-8"><div className="text-muted-foreground">Yükleniyor...</div></div>
    if (!client) return <div className="p-8"><div className="text-red-400">Müşteri bulunamadı</div></div>

    // Hesaplamalar
    const totalProjectBudget = client.projects?.reduce((sum: number, p: any) => sum + parseFloat(p.budget || 0), 0) || 0
    const totalPaid = client.income?.reduce((sum: number, i: any) => sum + parseFloat(i.amount || 0), 0) || 0
    const remainingBalance = totalProjectBudget - totalPaid

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">

            {/* Navigation */}
            <Link
                href="/admin/clients"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Müşterilere Dön
            </Link>

            {/* Profile Header */}
            <div className="bg-card border border-border rounded-2xl p-8">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-emerald-500/20">
                        {client.name?.[0].toUpperCase()}
                    </div>

                    <div className="flex-1 space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground mb-2">{client.name}</h1>
                                {client.company && (
                                    <div className="flex items-center gap-2 text-muted-foreground text-lg">
                                        <Building2 className="w-5 h-5 text-slate-500" />
                                        {client.company}
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-3">
                                <Link
                                    href={`/admin/clients/${id}/edit`}
                                    className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-xl font-medium transition-colors"
                                >
                                    Profili Düzenle
                                </Link>
                                <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-emerald-500/20">
                                    Yeni Proje
                                </button>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-border">
                            {client.email && (
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                                        <Mail className="w-4 h-4 text-emerald-400" />
                                    </div>
                                    {client.email}
                                </div>
                            )}
                            {client.phone && (
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                                        <Phone className="w-4 h-4 text-blue-400" />
                                    </div>
                                    {client.phone}
                                </div>
                            )}
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                                    <Calendar className="w-4 h-4 text-purple-400" />
                                </div>
                                Kayıt: {new Date(client.created_at).toLocaleDateString('tr-TR')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Financial Summary */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-card border border-border p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform" />
                    <p className="text-muted-foreground text-sm mb-1">Toplam İş Hacmi</p>
                    <h3 className="text-3xl font-bold text-foreground">{formatCurrency(totalProjectBudget)}</h3>
                    <div className="mt-4 flex items-center gap-2 text-sm text-emerald-400">
                        <Briefcase className="w-4 h-4" />
                        {client.projects?.length} Proje
                    </div>
                </div>

                <div className="bg-card border border-border p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform" />
                    <p className="text-muted-foreground text-sm mb-1">Tahsil Edilen</p>
                    <h3 className="text-3xl font-bold text-blue-400">{formatCurrency(totalPaid)}</h3>
                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4" />
                        {Math.round((totalPaid / (totalProjectBudget || 1)) * 100)}% Tahsilat Oranı
                    </div>
                </div>

                <div className="bg-card border border-border p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform" />
                    <p className="text-muted-foreground text-sm mb-1">Kalan Bakiye (Alacak)</p>
                    <h3 className={`text-3xl font-bold ${remainingBalance > 0 ? 'text-red-400' : 'text-foreground'}`}>
                        {formatCurrency(remainingBalance)}
                    </h3>
                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                        {remainingBalance > 0 ? 'Ödeme Bekleniyor' : 'Borcu Yok'}
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Projects List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-emerald-500" />
                            Projeler
                        </h2>
                    </div>
                    <div className="bg-card border border-border rounded-2xl overflow-hidden">
                        {client.projects?.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">Proje bulunamadı</div>
                        ) : (
                            <div className="divide-y divide-border">
                                {client.projects?.map((project: any) => (
                                    <div key={project.id} className="p-4 hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-bold text-foreground">{project.name}</h4>
                                            <span className={`text-xs px-2 py-1 rounded-full ${project.status === 'done' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                                                }`}>
                                                {project.status === 'done' ? 'Tamamlandı' : 'Devam Ediyor'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                                        <div className="mt-3 flex items-center justify-between text-sm">
                                            <span className="text-emerald-400 font-mono">{formatCurrency(project.budget || 0)}</span>
                                            <span className="text-muted-foreground">{new Date(project.created_at).toLocaleDateString('tr-TR')}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Income History */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-blue-500" />
                            Ödeme Geçmişi
                        </h2>
                    </div>
                    <div className="bg-card border border-border rounded-2xl overflow-hidden">
                        {client.income?.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">Ödeme kaydı yok</div>
                        ) : (
                            <div className="divide-y divide-border">
                                {client.income?.map((inc: any) => (
                                    <div key={inc.id} className="p-4 hover:bg-muted/50 transition-colors flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-foreground">{inc.description || 'Ödeme'}</p>
                                            <p className="text-xs text-muted-foreground">{new Date(inc.date).toLocaleDateString('tr-TR')}</p>
                                        </div>
                                        <span className="text-blue-400 font-bold font-mono">
                                            {formatCurrency(inc.amount)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    )
}
