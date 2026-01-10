"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { Users, Plus, Search, Mail, Phone, Building2, ExternalLink, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"

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
            setClients(data)
        } catch (error) {
            console.error('Fetch error:', error)
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
            case 'inactive': return 'bg-slate-700/50 text-muted-foreground border-slate-600'
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
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                        <Users className="w-8 h-8 text-emerald-500" />
                        Müşteriler
                    </h1>
                    <p className="text-muted-foreground mt-1">Müşteri ilişkilerinizi yönetin</p>
                </div>
                <Link
                    href="/admin/clients/new"
                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-foreground rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 w-fit"
                >
                    <Plus className="w-5 h-5" />
                    Yeni Müşteri
                </Link>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                    type="text"
                    placeholder="Müşteri ara (isim, şirket, email)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-card border border-border rounded-xl pl-12 pr-4 py-3 text-foreground focus:outline-none focus:border-emerald-500 transition-colors"
                />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card border border-border p-4 rounded-xl">
                    <p className="text-muted-foreground text-sm">Toplam Müşteri</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{clients.length}</p>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl">
                    <p className="text-muted-foreground text-sm">Aktif Müşteri</p>
                    <p className="text-2xl font-bold text-emerald-400 mt-1">
                        {clients.filter(c => c.status === 'active').length}
                    </p>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl">
                    <p className="text-muted-foreground text-sm">Potansiyel</p>
                    <p className="text-2xl font-bold text-blue-400 mt-1">
                        {clients.filter(c => c.status === 'potential').length}
                    </p>
                </div>
            </div>

            {/* Clients List */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
                {filteredClients.length === 0 ? (
                    <div className="p-12 text-center">
                        <Users className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                        <p className="text-muted-foreground">
                            {searchTerm ? 'Müşteri bulunamadı' : 'Henüz müşteri eklenmemiş'}
                        </p>
                        {!searchTerm && (
                            <Link
                                href="/admin/clients/new"
                                className="inline-block mt-4 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-foreground rounded-xl font-medium transition-all"
                            >
                                İlk Müşteriyi Ekle
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="divide-y divide-slate-800">
                        {filteredClients.map((client) => (
                            <div key={client.id} className="p-6 hover:bg-muted/50 transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-foreground">{client.name}</h3>
                                            <span className={`text-xs px-2.5 py-1 rounded-md font-medium border ${getStatusColor(client.status)}`}>
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
                                        <Link
                                            href={`/admin/clients/${client.id}`}
                                            className="p-2 bg-muted hover:bg-slate-700 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                                            title="Düzenle"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(client.id)}
                                            className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-colors"
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
