"use client"

import { useState, useEffect } from "react"
import { Layers, Edit, Eye, MoreVertical } from "lucide-react"
import Link from "next/link"

export default function ServicesAdminPage() {
    const [services, setServices] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/services')
            .then(res => res.json())
            .then(data => {
                setServices(data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-transparent">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                        <Layers className="w-8 h-8 text-emerald-500" />
                        Hizmet Yönetimi
                    </h1>
                    <p className="text-slate-400 mt-1">Sitede listelenen hizmetleri buradan yönetebilirsiniz.</p>
                </div>
                <button className="px-6 py-2.5 bg-muted text-slate-300 rounded-xl hover:bg-muted transition-colors font-bold border border-border">
                    Sıralamayı Düzenle
                </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                    <div key={service.id} className="bg-card border border-border rounded-notebook p-6 hover:border-emerald-500/30 transition-all group relative overflow-hidden">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center text-emerald-500 font-bold text-lg">
                                {service.title ? service.title.charAt(0) : '?'}
                            </div>
                            <button className="p-2 hover:bg-muted rounded-lg text-slate-500 hover:text-foreground">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>

                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-emerald-400 transition-colors">{service.title}</h3>

                        <div className="flex items-center gap-4 text-sm text-slate-400 mb-6">
                            <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" /> {service.views || 0}
                            </span>
                            <span>•</span>
                            <span>{service.projects || 0} Proje</span>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-border">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${service.status === 'Aktif' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                service.status === 'Beta' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                    'bg-muted text-slate-500 border-border'
                                }`}>
                                {service.status || 'Pasif'}
                            </span>
                            <Link href={`/admin/services/edit/${service.id}`}>
                                <button className="flex items-center gap-2 text-sm font-bold text-foreground hover:text-emerald-400 transition-colors">
                                    <Edit className="w-4 h-4" /> Düzenle
                                </button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
