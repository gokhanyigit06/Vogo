"use client"

import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Send } from "lucide-react"

export default function ModernCTA() {
    return (
        <section className="relative py-32 md:py-40 overflow-hidden bg-background transition-colors duration-300">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-background opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />

            {/* Animated Glows */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16 space-y-6"
                    >
                        <h2 className="text-5xl md:text-7xl font-bold text-foreground">
                            Bir Fikriniz mi Var?
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">
                                Hadi Konuşalım.
                            </span>
                        </h2>
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                            Hayalinizdeki dijital projeyi birlikte gerçekleştirelim.
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                        {/* Contact Info Cards */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="space-y-6"
                        >
                            {/* Email Card */}
                            <a href="mailto:info@vogoagency.com" className="group block p-6 rounded-2xl bg-card/50 border border-border hover:border-primary/50 hover:bg-card/80 transition-all duration-300 shadow-sm">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-teal-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                                        <Mail className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1 group-hover:text-primary transition-colors">Bize Yazın</p>
                                        <p className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">info@vogoagency.com</p>
                                    </div>
                                </div>
                            </a>

                            {/* Phone Card */}
                            <a href="tel:+905077347521" className="group block p-6 rounded-2xl bg-card/50 border border-border hover:border-primary/50 hover:bg-card/80 transition-all duration-300 shadow-sm">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                                        <Phone className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1 group-hover:text-indigo-400 transition-colors">Bizi Arayın</p>
                                        <p className="text-xl font-semibold text-foreground group-hover:text-indigo-500 transition-colors">+90 507 734 75 21</p>
                                    </div>
                                </div>
                            </a>

                            {/* Address Card */}
                            <div className="group block p-6 rounded-2xl bg-card/50 border border-border hover:border-primary/50 hover:bg-card/80 transition-all duration-300 shadow-sm">
                                <div className="flex items-start gap-6">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                                        <MapPin className="w-6 h-6 text-orange-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1 group-hover:text-orange-400 transition-colors">Ziyaret Edin</p>
                                        <p className="text-lg font-semibold text-foreground leading-relaxed group-hover:text-orange-500 transition-colors">
                                            Zübeyde Hanım Mah. Fatih Caddesi<br />
                                            No:31/162 Altındağ / Ankara
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Modern Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="bg-card/80 backdrop-blur-md rounded-3xl p-8 lg:p-10 border border-border shadow-xl"
                        >
                            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                <div>
                                    <label className="block text-sm text-muted-foreground mb-2 font-medium">Adınız Soyadınız</label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full px-4 py-4 bg-background border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-muted-foreground mb-2 font-medium">E-posta Adresiniz</label>
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        className="w-full px-4 py-4 bg-background border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-muted-foreground mb-2 font-medium">Mesajınız</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Projenizden bahsedin..."
                                        className="w-full px-4 py-4 bg-background border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="group w-full py-4 bg-gradient-to-r from-primary to-teal-500 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98]"
                                >
                                    <span>Gönder</span>
                                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}
