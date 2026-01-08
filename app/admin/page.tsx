"use client"

import { Plus, ArrowUpRight, Users, Eye, FileText, Activity } from "lucide-react"

export default function AdminDashboard() {
    // Mock Data
    const leads = [
        { id: 1, name: "Ahmet Yılmaz", email: "ahmet@firma.com", service: "Web Tasarım", date: "Bugün, 14:20", status: "Yeni" },
        { id: 2, name: "Ayşe Kaya", email: "ayse@startup.io", service: "SEO", date: "Dün, 09:15", status: "Okundu" },
        { id: 3, name: "Mehmet Demir", email: "mehmet@holding.com.tr", service: "Özel Yazılım", date: "12 Ocak", status: "Cevaplandı" },
    ]

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">

            {/* Page Title */}
            <div>
                <h1 className="text-3xl font-bold text-white">Genel Bakış</h1>
                <p className="text-slate-400 mt-1">Sitenizin performansını ve gelen talepleri buradan takip edebilirsiniz.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Toplam Ziyaretçi", value: "12,450", change: "+%12", color: "emerald", icon: Users },
                    { label: "Okunmamış Mesaj", value: "3", change: "Yeni", color: "blue", icon: Activity },
                    { label: "Yayınlanan Blog", value: "24", change: "+2 bu ay", color: "purple", icon: FileText },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-colors">
                        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-${stat.color}-500`}>
                            <stat.icon className="w-16 h-16" />
                        </div>
                        <p className="text-slate-400 text-sm font-medium mb-2">{stat.label}</p>
                        <div className="flex items-end justify-between relative z-10">
                            <h3 className="text-3xl font-bold text-white tracking-tight">{stat.value}</h3>
                            <span className={`text-xs font-bold text-${stat.color}-400 bg-${stat.color}-500/10 px-2 py-1 rounded-lg flex items-center gap-1`}>
                                {stat.change} <ArrowUpRight className="w-3 h-3" />
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid lg:grid-cols-3 gap-8">

                {/* Son Başvurular (Leads) - 2/3 Width */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Users className="w-5 h-5 text-emerald-500" />
                            Son Başvurular
                        </h3>
                        <button className="text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors">Tümünü Gör</button>
                    </div>
                    <div className="flex-1 divide-y divide-slate-800">
                        {leads.map((lead) => (
                            <div key={lead.id} className="p-4 hover:bg-slate-800/50 transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-sm group-hover:bg-slate-700 group-hover:text-white transition-colors">
                                        {lead.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium group-hover:text-emerald-400 transition-colors">{lead.name}</p>
                                        <p className="text-slate-400 text-xs">{lead.service} • {lead.date}</p>
                                    </div>
                                </div>
                                <div className={`text-xs px-2.5 py-1 rounded-md font-medium ${lead.status === 'Yeni' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                        'bg-slate-800 text-slate-400'
                                    }`}>
                                    {lead.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions - 1/3 Width */}
                <div className="bg-gradient-to-br from-emerald-900/10 to-slate-900 border border-slate-800/60 rounded-2xl p-6 flex flex-col justify-center items-center text-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]">
                        <Plus className="w-10 h-10 text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Hızlı İçerik Ekle</h3>
                        <p className="text-slate-400 text-sm mt-2 max-w-[200px] mx-auto leading-relaxed">
                            Blog yazısı veya yeni proje ekleyerek siteni güncel tut.
                        </p>
                    </div>
                    <div className="flex flex-col w-full gap-3">
                        <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2">
                            <FileText className="w-4 h-4" /> Yeni Yazı Ekle
                        </button>
                        <button className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-bold transition-all border border-slate-700 hover:border-slate-600">
                            Proje Ekle
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
