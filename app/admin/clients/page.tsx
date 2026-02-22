"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { Users, Plus, Search, Mail, Phone, Building2, ExternalLink, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

interface Client {
    id: number
    name: string
    company: string
    email: string
    phone: string
    status: string
    total_revenue: number
    created_at: string
}

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        fetchClients()
    }, [])

    const fetchClients = async () => {
        try {
            const res = await fetch('/api/clients')
            const data = await res.json()

            if (Array.isArray(data) && data.length > 0) {
                setClients(data)
            } else if (process.env.NODE_ENV === 'development') {
                console.log("⚠️ Dev Mode: Using Mock Clients")
                const mockData = await import('@/lib/mock-data')
                setClients(mockData.MOCK_CLIENTS as unknown as Client[])
            } else {
                setClients([])
            }
        } catch (error) {
            console.error('Fetch error:', error)
            if (process.env.NODE_ENV === 'development') {
                const mockData = await import('@/lib/mock-data')
                setClients(mockData.MOCK_CLIENTS as unknown as Client[])
            } else {
                setClients([])
            }
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Bu müşteriyi silmek istediğinize emin misiniz?')) return

        try {
            const res = await fetch(`/api/clients?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                setClients(clients.filter(c => c.id !== id))
                alert('Müşteri silindi')
            }
        } catch (error) {
            alert('Silme hatası')
        }
    }

    const filteredClients = clients.filter(client =>
        client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            case 'potential': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
            case 'inactive': return 'bg-slate-700/50 text-muted-foreground border-border'
            default: return 'bg-slate-700/50 text-muted-foreground'
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'active': return 'Aktif'
            case 'potential': return 'Potansiyel'
            case 'inactive': return 'Pasif'
            default: return status
        }
    }

    if (loading) {
        return (
            <div className="p-8">
                <div className="text-muted-foreground">Yükleniyor...</div>
            </div>
        )
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Users className="w-8 h-8 text-vogo-blue" />
                        <span className="text-gradient-vogo">Müşteriler</span>
                    </h1>
                    <p className="text-muted-foreground mt-1">Müşteri ilişkilerinizi yönetin</p>
                </div>
                <Link href="/admin/clients/new">
                    <button className="btn-vogo px-6 py-3 rounded-xl font-bold flex items-center gap-2">
                        <Plus className="w-5 h-5 relative z-10" />
                        <span className="relative z-10">Yeni Müşteri</span>
                    </button>
                </Link>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Müşteri ara (isim, şirket, email)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 py-6 text-base rounded-xl glass-card border-vogo-blue/10 focus:border-vogo-blue/30"
                />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="kpi-card group" style={{ '--kpi-gradient': 'linear-gradient(135deg, #026E81, #00ABBD)' } as React.CSSProperties}>
                    <p className="text-muted-foreground text-sm">Toplam Müşteri</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{clients.length}</p>
                </div>
                <div className="kpi-card group" style={{ '--kpi-gradient': 'linear-gradient(135deg, #00ABBD, #0099DD)' } as React.CSSProperties}>
                    <p className="text-muted-foreground text-sm">Aktif Müşteri</p>
                    <p className="text-2xl font-bold text-vogo-aqua mt-1">
                        {clients.filter(c => c.status === 'active').length}
                    </p>
                </div>
                <div className="kpi-card group" style={{ '--kpi-gradient': 'linear-gradient(135deg, #FF9933, #FF7733)' } as React.CSSProperties}>
                    <p className="text-muted-foreground text-sm">Potansiyel</p>
                    <p className="text-2xl font-bold text-vogo-orange mt-1">
                        {clients.filter(c => c.status === 'potential').length}
                    </p>
                </div>
            </div>

            {/* Clients List */}
            <div className="glass-card rounded-2xl overflow-hidden">
                {filteredClients.length === 0 ? (
                    <div className="p-12 text-center">
                        <Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground">
                            {searchTerm ? 'Müşteri bulunamadı' : 'Henüz müşteri eklenmemiş'}
                        </p>
                        {!searchTerm && (
                            <Link href="/admin/clients/new">
                                <button className="btn-vogo mt-4 px-6 py-3 rounded-xl font-bold">
                                    <span className="relative z-10">İlk Müşteriyi Ekle</span>
                                </button>
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {filteredClients.map((client) => (
                            <div key={client.id} className="p-6 hover:bg-accent/30 transition-all duration-300 group">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-foreground group-hover:text-vogo-blue transition-colors">{client.name}</h3>
                                            <span className={`text-xs px-2.5 py-1 rounded-lg font-medium border ${getStatusColor(client.status)}`}>
                                                {getStatusText(client.status)}
                                            </span>
                                        </div>
                                        {client.company && (
                                            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                                                <Building2 className="w-4 h-4" />
                                                {client.company}
                                            </div>
                                        )}
                                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm text-muted-foreground">
                                            {client.email && (
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4" />
                                                    {client.email}
                                                </div>
                                            )}
                                            {client.phone && (
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4" />
                                                    {client.phone}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link href={`/admin/clients/${client.id}`}>
                                            <button className="p-2 rounded-lg text-muted-foreground hover:text-vogo-blue hover:bg-vogo-blue/10 transition-all duration-200" title="Düzenle">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(client.id)}
                                            className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all duration-200"
                                            title="Sil"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

