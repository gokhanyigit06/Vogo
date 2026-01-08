"use client"

import { motion } from "framer-motion"
import Header from "@/components/Header"
import ModernFooter from "@/components/ModernFooter"
import ModernCTA from "@/components/ModernCTA"
import Image from "next/image"
import { Users, Target, Zap, Shield, Trophy, Globe } from "lucide-react"

export default function AboutPage() {
    return (
        <>
            <Header />
            <main className="bg-slate-950 min-h-screen pt-24 pb-20 overflow-hidden">

                {/* 1. Hero Section */}
                <section className="container mx-auto px-4 md:px-8 max-w-7xl mb-24 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto"
                    >
                        <span className="text-emerald-500 font-bold tracking-widest uppercase text-sm mb-4 block">Hikayemiz</span>
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
                            Dijital Dünyanın <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Mimarlarıyız.</span>
                        </h1>
                        <p className="text-xl text-slate-400 leading-relaxed font-light">
                            Vogo Agency olarak, markaların dijital potansiyelini açığa çıkarıyoruz.
                            Kodun gücünü, tasarımın estetiğiyle birleştirerek sadece çalışan değil,
                            <b className="text-white"> yaşayan projeler</b> üretiyoruz.
                        </p>
                    </motion.div>
                </section>

                {/* 2. Stats Grid */}
                <section className="container mx-auto px-4 md:px-8 max-w-7xl mb-32 relative z-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                        {[
                            { value: "50+", label: "Mutlu Müşteri", icon: Users },
                            { value: "120+", label: "Tamamlanan Proje", icon: Trophy },
                            { value: "5", label: "Yıllık Deneyim", icon: Target },
                            { value: "24/7", label: "Destek", icon: Zap },
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl text-center group hover:border-emerald-500/30 transition-colors"
                            >
                                <div className="w-12 h-12 mx-auto bg-slate-800 rounded-xl flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition-transform">
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-4xl font-bold text-white mb-2">{stat.value}</h3>
                                <p className="text-slate-400 font-medium">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* 3. Image & Values Split */}
                <section className="container mx-auto px-4 md:px-8 max-w-7xl mb-32 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Image */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-blue-500 rounded-3xl rotate-6 opacity-20 blur-lg" />
                            <div className="relative h-[500px] rounded-3xl overflow-hidden border border-slate-800">
                                <Image
                                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80"
                                    alt="Team working"
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                                <div className="absolute bottom-0 left-0 p-8">
                                    <p className="text-white font-bold text-xl">Global Vizyon</p>
                                    <p className="text-slate-400">Sınırları aşan projeler üretiyoruz.</p>
                                </div>
                            </div>
                        </div>

                        {/* Text & Values */}
                        <div className="space-y-8">
                            <h2 className="text-3xl md:text-5xl font-bold text-white">
                                Neden Vogo?
                            </h2>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                Sektördeki standart kalıpların dışına çıkıyoruz. Hazır şablonlar yerine,
                                her markanın DNA'sına uygun, butik ve performans odaklı çözümler geliştiriyoruz.
                            </p>

                            <div className="space-y-6">
                                {[
                                    { title: "İleri Teknoloji", desc: "Next.js, React ve Modern CSS mimarisiyle geleceğe hazır siteler." },
                                    { title: "Kullanıcı Odaklı (UX)", desc: "Sadece güzel görünen değil, satışı ve etkileşimi artıran tasarımlar." },
                                    { title: "Şeffaf Süreç", desc: "Projenin her adımında sizi bilgilendiriyor, sürprizlere yer vermiyoruz." },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center mt-1 flex-shrink-0">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-lg">{item.title}</h4>
                                            <p className="text-slate-400">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <ModernCTA />
            </main>
            <ModernFooter />
        </>
    )
}
