"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Header from "@/components/Header"
import ModernFooter from "@/components/ModernFooter"
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle2 } from "lucide-react"

export default function ContactPage() {
    const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setFormStatus('submitting')

        // Simüle edilmiş gönderim
        setTimeout(() => {
            setFormStatus('success')
        }, 1500)
    }

    return (
        <>
            <Header />
            <main className="bg-slate-950 min-h-screen pt-24 pb-20 overflow-hidden relative">

                {/* Background Blobs */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">

                    {/* Header Section */}
                    <div className="text-center mb-16">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-bold text-white mb-6"
                        >
                            Bizimle İletişime Geçin
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-slate-400 max-w-2xl mx-auto"
                        >
                            Projeniz için bir teklif almak veya sadece merhaba demek için bize yazın.
                        </motion.p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl"
                        >
                            {formStatus === 'success' ? (
                                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Mesajınız Alındı!</h3>
                                    <p className="text-slate-400">En kısa sürede size geri dönüş yapacağız.</p>
                                    <button
                                        onClick={() => setFormStatus('idle')}
                                        className="mt-8 text-emerald-500 hover:text-emerald-400 font-bold"
                                    >
                                        Yeni Mesaj Gönder
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-400 ml-1">Adınız</label>
                                            <input type="text" required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="Ahmet Yılmaz" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-400 ml-1">E-Posta</label>
                                            <input type="email" required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="ahmet@ornek.com" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400 ml-1">Konu</label>
                                        <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none cursor-pointer">
                                            <option>Genel Bilgi</option>
                                            <option>Web Tasarım Teklifi</option>
                                            <option>SEO Danışmanlığı</option>
                                            <option>Özel Yazılım Projesi</option>
                                            <option>Kariyer</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400 ml-1">Mesajınız</label>
                                        <textarea required rows={5} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none" placeholder="Projenizden bahsedin..."></textarea>
                                    </div>

                                    <button
                                        disabled={formStatus === 'submitting'}
                                        type="submit"
                                        className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-lg font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                                    >
                                        {formStatus === 'submitting' ? (
                                            <>Gönderiliyor...</>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" /> Mesajı Gönder
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </motion.div>

                        {/* Info & Cards */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-8 flex flex-col justify-center"
                        >
                            {/* Info Cards */}
                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-emerald-500/30 transition-colors group">
                                    <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-lg mb-1">E-Posta</h3>
                                        <p className="text-slate-400">info@vogoagency.com</p>
                                        <p className="text-slate-500 text-sm mt-1">7/24 bize yazabilirsiniz.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-emerald-500/30 transition-colors group">
                                    <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-lg mb-1">Telefon / WhatsApp</h3>
                                        <p className="text-slate-400">+90 507 734 75 21</p>
                                        <p className="text-slate-500 text-sm mt-1">Hafta içi 09:00 - 18:00</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-emerald-500/30 transition-colors group">
                                    <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-lg mb-1">Ofis</h3>
                                        <p className="text-slate-400">Maslak, İstanbul</p>
                                        <p className="text-slate-500 text-sm mt-1">Lütfen gelmeden önce randevu alınız.</p>
                                    </div>
                                </div>
                            </div>

                            {/* SSS Snippet */}
                            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5">
                                    <MessageSquare className="w-32 h-32" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-4 relative z-10">Sıkça Sorulan Sorular</h3>
                                <div className="space-y-4 relative z-10">
                                    <div>
                                        <h4 className="text-emerald-400 font-bold text-sm mb-1">Proje süreci ne kadar sürer?</h4>
                                        <p className="text-slate-400 text-sm">Projeye göre değişmekle birlikte ortalama kurumsal web sitesi 2-3 hafta sürmektedir.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-emerald-400 font-bold text-sm mb-1">Fiyatlandırma nasıl?</h4>
                                        <p className="text-slate-400 text-sm">İhtiyaç analizi sonrası size özel paket veya proje bazlı teklif sunuyoruz.</p>
                                    </div>
                                </div>
                            </div>

                        </motion.div>
                    </div>
                </div>
            </main>
            <ModernFooter />
        </>
    )
}
