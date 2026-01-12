"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { Users, Search, ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ClientsFinancePage() {
    const [clients, setClients] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const res = await fetch('/api/finance/clients')
                const data = await res.json()
                setClients(Array.isArray(data) ? data : [])
            } catch (error) {
                console.error('Fetch error:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchClients()
    }, [])

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount || 0)
    }

    const filteredClients = clients.filter(c =>
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <Link href="/admin/finance" className="text-muted-foreground hover:text-foreground flex items-center gap-2 mb-2 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Finans Paneline Dön
                    </Link>
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                        <Users className="w-8 h-8 text-blue-500" />
                        Müşteri Cari Hesapları
                    </h1>
                    <p className="text-muted-foreground mt-1">Müşteri bakiyeleri ve finansal özetler</p>
                </div>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Müşteri ara..."
                        className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-foreground focus:outline-none focus:border-blue-500"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full p-12 text-center text-muted-foreground">Yükleniyor...</div>
                ) : filteredClients.length === 0 ? (
                    <div className="col-span-full p-12 text-center text-muted-foreground">Kayıt bulunamadı.</div>
                ) : (
                    filteredClients.map(client => (
                        <Link href={`/admin/finance/clients/${client.id}`} key={client.id}>
                            <div className="bg-card border border-border hover:border-blue-500/50 p-6 rounded-notebook transition-all group h-full flex flex-col justify-between">
                                <div>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-lg font-bold">
                                            {client.name?.[0]?.toUpperCase()}
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${(client.balance || 0) > 0 ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                            }`}>
                                            {(client.balance || 0) > 0 ? 'Borçlu' : 'Dengede'}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-1">{client.name}</h3>
                                    <p className="text-sm text-muted-foreground mb-4">{client.email}</p>
                                </div>

                                <div className="pt-4 border-t border-border mt-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm text-muted-foreground">Şu anki Bakiye</span>
                                        <span className={`font-bold text-lg ${(client.balance || 0) > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                            {formatCurrency(client.balance)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-blue-500 group-hover:gap-3 transition-all mt-2">
                                        Detayları Gör <ArrowRight className="w-3 h-3" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    )
}
