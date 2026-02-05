"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { submitContactForm, type ContactFormData } from "@/app/contact/actions"

export default function Contact() {
    const [formData, setFormData] = useState<ContactFormData>({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    })
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log("🚀 Form submit başladı")
        console.log("📋 Form data:", formData)

        setLoading(true)
        setResult(null)

        try {
            console.log("📤 Server action çağrılıyor...")
            const response = await submitContactForm(formData)
            console.log("📥 Server response:", response)

            setResult({
                success: response.success,
                message: response.success ? response.message! : response.error!
            })

            if (response.success) {
                console.log("✅ Form başarıyla gönderildi!")
                // Reset form on success
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    subject: "",
                    message: ""
                })
            } else {
                console.error("❌ Error:", response.error)
            }
        } catch (error) {
            console.error("💥 Catch bloğu:", error)
            setResult({
                success: false,
                message: "Bir hata oluştu. Lütfen tekrar deneyin."
            })
        } finally {
            setLoading(false)
            console.log("✅ Form submit tamamlandı")
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    return (
        <section id="contact" className="py-24 md:py-32 bg-background relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-bold mb-4">
                        Hadi <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Projenizi</span> Konuşalım
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        İşinizi bir üst seviyeye taşımak için bugün iletişime geçin.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div>
                            <h3 className="text-2xl font-bold mb-6">İletişim Bilgileri</h3>
                            <p className="text-muted-foreground mb-8">
                                Uzman ekibimiz size en uygun çözümleri sunmak için hazır.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border hover:border-emerald-500/30 transition-colors group">
                                <div className="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                    <Mail className="h-6 w-6 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                                    <a href="mailto:info@vogoagency.com" className="font-medium text-lg hover:text-emerald-500 transition-colors">
                                        info@vogoagency.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border hover:border-cyan-500/30 transition-colors group">
                                <div className="h-12 w-12 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                    <Phone className="h-6 w-6 text-cyan-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Telefon</p>
                                    <a href="tel:+905551234567" className="font-medium text-lg hover:text-cyan-500 transition-colors">
                                        +90 555 123 45 67
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border hover:border-purple-500/30 transition-colors group">
                                <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                    <MapPin className="h-6 w-6 text-purple-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Adres</p>
                                    <p className="font-medium text-lg">İstanbul, Türkiye</p>
                                </div>
                            </div>
                        </div>

                        {/* Çalışma Saatleri */}
                        <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
                            <h4 className="font-bold mb-3">Çalışma Saatlerimiz</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Pazartesi - Cuma</span>
                                    <span className="font-medium">09:00 - 18:00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Cumartesi</span>
                                    <span className="font-medium">10:00 - 15:00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Pazar</span>
                                    <span className="font-medium">Kapalı</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-card border border-border rounded-2xl p-8 shadow-xl"
                    >
                        <h3 className="text-2xl font-bold mb-6">Mesaj Gönderin</h3>

                        {/* Success/Error Message */}
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${result.success
                                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600'
                                    : 'bg-red-500/10 border border-red-500/20 text-red-600'
                                    }`}
                            >
                                {result.success ? (
                                    <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                )}
                                <p className="text-sm">{result.message}</p>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-2">
                                    Adınız Soyadınız *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                    placeholder="Ahmet Yılmaz"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                                        E-posta *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                        placeholder="ornek@email.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                                        Telefon
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                        placeholder="+90 555 123 45 67"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                                    Konu *
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                    placeholder="Web Sitesi Geliştirme"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium mb-2">
                                    Mesajınız *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                                    placeholder="Projeniz hakkında bize bilgi verin..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Gönderiliyor...
                                    </>
                                ) : (
                                    <>
                                        Mesajı Gönder
                                        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
