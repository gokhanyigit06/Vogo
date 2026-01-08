"use client"

import { motion } from "framer-motion"
import { Quote, Star } from "lucide-react"

// Mock Client Logos (Using text for now, but ready for SVGs/Images)
const clients = [
    { name: "TechCorp", sector: "Technology" },
    { name: "GlobalFine", sector: "Finance" },
    { name: "EcoStyle", sector: "E-commerce" },
    { name: "TravelGo", sector: "Travel" },
    { name: "HealthPlus", sector: "Health" },
    { name: "EduSmart", sector: "Education" },
]

const testimonials = [
    {
        id: 1,
        content: "Vogo Agency ile çalışmak işimizin dijital dönüşümünde tam bir dönüm noktası oldu. Satışlarımız %200 arttı!",
        author: "Ahmet Yılmaz",
        role: "CEO, TechCorp",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
        rating: 5
    },
    {
        id: 2,
        content: "Profesyonel yaklaşımları ve yaratıcı çözümleri ile markamıza değer kattılar. Kesinlikle tavsiye ediyorum.",
        author: "Ayşe Kaya",
        role: "Marketing Director, GlobalFine",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
        rating: 5
    },
    {
        id: 3,
        content: "Özel yazılım çözümleri sayesinde operasyonel verimliliğimiz arttı. Ekip her zaman çok ilgiliydi.",
        author: "Mehmet Demir",
        role: "CTO, EcoStyle",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
        rating: 5
    }
]

export default function References() {
    return (
        <section className="py-24 md:py-32 bg-slate-950 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-3xl mx-auto mb-20"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        <span className="text-white">Bize Güvenen </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                            Markalar
                        </span>
                    </h2>
                    <p className="text-xl text-slate-400">
                        Sektör liderleri ile çalışarak başarı hikayeleri yazıyoruz.
                    </p>
                </motion.div>

                {/* Clients Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-24">
                    {clients.map((client, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="h-24 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/30 flex flex-col items-center justify-center p-4 transition-all group cursor-pointer"
                        >
                            <span className="text-lg font-bold text-slate-400 group-hover:text-white transition-colors">
                                {client.name}
                            </span>
                            <span className="text-xs text-slate-600 group-hover:text-emerald-400/80 transition-colors">
                                {client.sector}
                            </span>
                        </motion.div>
                    ))}
                </div>

                {/* Testimonials */}
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 + index * 0.2 }}
                            className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 p-8 rounded-3xl relative hover:bg-slate-900/60 transition-colors"
                        >
                            {/* Quote Icon */}
                            <div className="mb-6">
                                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                    <Quote className="w-5 h-5 text-emerald-400" />
                                </div>
                            </div>

                            {/* Stars */}
                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                ))}
                            </div>

                            {/* Content */}
                            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                                "{testimonial.content}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-4 mt-auto">
                                <img
                                    src={testimonial.avatar}
                                    alt={testimonial.author}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-slate-800"
                                />
                                <div>
                                    <h4 className="text-white font-semibold">
                                        {testimonial.author}
                                    </h4>
                                    <p className="text-sm text-emerald-400">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
