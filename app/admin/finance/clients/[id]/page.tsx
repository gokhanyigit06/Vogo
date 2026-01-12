"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect, use } from "react"
import { ArrowLeft, Building2, Mail, Phone, MapPin, Calendar, Clock, DollarSign, Wallet } from "lucide-react"
import Link from "next/link"

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/finance/clients/${id}`)
                const json = await res.json()
                setData(json)
            } catch (error) {
                console.error('Error:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [id])

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount || 0)
    }

    if (loading) return <div className="p-12 text-center text-muted-foreground">Yükleniyor...</div>
    if (!data?.client) return <div className="p-12 text-center text-muted-foreground">Müşteri bulunamadı.</div>

    const { client, projects, incomes, transactions } = data

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <Link href="/admin/finance/clients" className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Cari Listesine Dön
            </Link>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Sol Kolon: Müşteri Bilgisi */}
                <div className="space-y-6">
                    <div className="bg-card border border-border p-6 rounded-notebook">
                        <div className="w-20 h-20 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-3xl font-bold mb-4">
                            {client.name?.[0]?.toUpperCase()}
                        </div>
                        <h1 className="text-2xl font-bold text-foreground mb-2">{client.name}</h1>
                        <div className="space-y-3 text-sm text-muted-foreground">
                            {client.email && (
                                <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4" /> {client.email}
                                </div>
                            )}
                            {client.phone && (
                                <div className="flex items-center gap-3">
                                    <Phone className="w-4 h-4" /> {client.phone}
                                </div>
                            )}
                            {client.address && (
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-4 h-4" /> {client.address}
                                </div>
                            )}
                            {client.company && (
                                <div className="flex items-center gap-3">
                                    <Building2 className="w-4 h-4" /> {client.company}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-card border border-border p-6 rounded-notebook">
                        <h3 className="font-bold text-foreground mb-4">Finansal Özet</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                                <span className="text-sm text-muted-foreground">Toplam Borç</span>
                                <span className="font-bold text-foreground">{formatCurrency(client.total_revenue)}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                                <span className="text-sm text-muted-foreground">Toplam Ödenen</span>
                                <span className="font-bold text-emerald-500">{formatCurrency(client.total_paid)}</span>
                            </div>
                            <div className="pt-2 border-t border-border mt-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-foreground">Güncel Bakiye</span>
                                    <span className={`text-xl font-bold ${(client.balance || 0) > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                        {formatCurrency(client.balance)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sağ Kolon: Detaylar */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Transactions / Timeline */}
                    <div className="bg-card border border-border p-6 rounded-notebook">
                        <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-500" />
                            İşlem Geçmişi
                        </h2>

                        <div className="space-y-6 relative pl-6 border-l-2 border-border ml-2">
                            {/* Eğer Transaction tablosu boşsa projelere ve ödemelere göre sanal bir timeline oluştur */}
                            {incomes?.map((inc: any) => (
                                <div key={inc.id} className="relative">
                                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-card"></div>
                                    <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-bold text-emerald-500">Tahsilat / Ödeme Alındı</span>
                                            <span className="text-xs text-muted-foreground">{new Date(inc.date).toLocaleDateString('tr-TR')}</span>
                                        </div>
                                        <p className="text-foreground font-medium">{inc.description}</p>
                                        <p className="text-lg font-bold text-foreground mt-1">{formatCurrency(inc.amount)}</p>
                                    </div>
                                </div>
                            ))}

                            {projects?.map((proj: any) => (
                                <div key={proj.id} className="relative">
                                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-card"></div>
                                    <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-bold text-blue-500">Proje / Hizmet</span>
                                            <span className="text-xs text-muted-foreground">{new Date(proj.created_at).toLocaleDateString('tr-TR')}</span>
                                        </div>
                                        <p className="text-foreground font-medium">{proj.name}</p>
                                        <p className="text-sm text-muted-foreground mt-1">Durum: {proj.status}</p>
                                    </div>
                                </div>
                            ))}

                            {(!incomes?.length && !projects?.length) && (
                                <p className="text-muted-foreground italic">Henüz bir işlem kaydı yok.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
