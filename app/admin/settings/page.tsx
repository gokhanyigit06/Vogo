"use client"

import { Settings, Save, Globe, Lock, Bell, Mail } from "lucide-react"

export default function SettingsAdminPage() {
    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Settings className="w-8 h-8 text-emerald-500" />
                        Ayarlar
                    </h1>
                    <p className="text-slate-400 mt-1">Genel site yapılandırması ve tercihleri.</p>
                </div>
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 active:scale-95">
                    <Save className="w-5 h-5" /> Değişiklikleri Kaydet
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Navigation (Left) */}
                <div className="space-y-2">
                    {['Genel', 'SEO', 'Sosyal Medya', 'Bildirimler', 'Güvenlik'].map((item, i) => (
                        <button key={item} className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors ${i === 0 ? 'bg-slate-800 text-white border-l-4 border-emerald-500' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}>
                            {item} Ayarları
                        </button>
                    ))}
                </div>

                {/* Form Area (Right) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* General Settings */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
                            <Globe className="w-5 h-5 text-emerald-500" /> Genel Bilgiler
                        </h3>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-400">Site Başlığı</label>
                                <input type="text" defaultValue="Vogo Agency" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-400">E-Posta Adresi</label>
                                <input type="email" defaultValue="info@vogoagency.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-400">Site Açıklaması (Meta Description)</label>
                            <textarea rows={3} defaultValue="Vogo Agency, markanızı dijital dünyada öne çıkaran profesyonel web tasarım ve dijital pazarlama ajansıdır." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 resize-none" />
                        </div>
                    </div>

                    {/* Maintenance Mode */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Lock className="w-5 h-5 text-amber-500" /> Bakım Modu
                            </h3>
                            <p className="text-slate-400 text-sm mt-1">Aktif edildiğinde site ziyaretçilere kapanır.</p>
                        </div>
                        <div className="relative inline-flex h-8 w-14 items-center rounded-full bg-slate-800 cursor-pointer border border-slate-700">
                            <span className="inline-block h-6 w-6 transform rounded-full bg-slate-500 transition translate-x-1" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
