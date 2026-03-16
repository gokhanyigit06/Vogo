"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Phone, ArrowUpRight, Instagram, Linkedin, Loader2, CheckCircle, AlertCircle, Plus, Minus, Youtube } from "lucide-react"

interface FaqItem {
    q: string
    a: string
}

interface SocialLink {
    label: string
    href: string
    iconType: string
}

interface ContactPageSettings {
    heroTitle: string
    heroSubtitle: string
    email: string
    phone: string
    locationText: string
    socialLinks: SocialLink[]
    faqTitle: string
    faqSubtitle: string
    faqItems: FaqItem[]
}

const defaultData: ContactPageSettings = {
    heroTitle: "Birlikte\nçalışalım.",
    heroSubtitle: "Yeni bir projen mi var? Fikirlerini duymak isteriz. Hemen iletişime geç, 24 saat içinde geri döneceğiz.",
    email: "info@vogolab.com",
    phone: "+90 (555) 000 00 00",
    locationText: "İstanbul, TR — GMT+3",
    socialLinks: [
        { label: "Instagram", href: "https://instagram.com/vogolab", iconType: "instagram" },
        { label: "LinkedIn", href: "https://linkedin.com/company/vogolab", iconType: "linkedin" },
        { label: "YouTube", href: "https://youtube.com/@vogolab", iconType: "youtube" },
    ],
    faqTitle: "Sık sorulan\nsorular",
    faqSubtitle: "Aklına takılan başka bir soru varsa formu kullanarak bize ulaşabilirsin.",
    faqItems: [
        {
            q: "Çalışma süreciniz nasıl işliyor?",
            a: "Önce keşif görüşmesi yapıyoruz, ardından strateji ve konsept geliştiriyoruz. Tasarım ve geliştirme aşamalarını paralel yürütüp lansmanla tamamlıyoruz."
        },
        {
            q: "Bir proje ne kadar sürer?",
            a: "Projeye göre değişir. Basit bir landing page 2–3 haftada, kurumsal bir web sitesi 6–10 haftada, tam kapsamlı bir ürün ise 3–6 ayda teslim edilir."
        },
        {
            q: "Fiyatlandırma nasıl yapılıyor?",
            a: "Her proje için özel teklif hazırlıyoruz. Kapsam, süre ve kaynak ihtiyacına göre sabit proje bedeli ya da aylık retainer seçenekleri sunuyoruz."
        },
        {
            q: "Başlangıç için ne yapmam gerekiyor?",
            a: "Formu doldurmak yeterli. 24 saat içinde sizi arayıp ihtiyaçlarınızı dinliyoruz. Sonrasında teklif ve zaman çizelgesi hazırlıyoruz."
        }
    ]
}

const getSocialIcon = (type: string) => {
    switch (type) {
        case 'instagram': return <Instagram className="w-4 h-4" />
        case 'linkedin': return <Linkedin className="w-4 h-4" />
        case 'youtube': return <Youtube className="w-4 h-4" />
        default: return <ArrowUpRight className="w-4 h-4" />
    }
}

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    })
    const [loadingForm, setLoadingForm] = useState(false)
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
    const [openFaq, setOpenFaq] = useState<number | null>(0)

    const [data, setData] = useState<ContactPageSettings>(defaultData)
    const [loadingSettings, setLoadingSettings] = useState(true)

    useEffect(() => {
        fetch("/api/settings")
            .then(r => r.json())
            .then(res => {
                if (res.contactPageSettings) setData(res.contactPageSettings)
            })
            .catch(() => setData(defaultData))
            .finally(() => setLoadingSettings(false))
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoadingForm(true)
        setResult(null)
        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            if (res.ok) {
                setResult({ success: true, message: "Mesajınız başarıyla gönderildi." })
                setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
            } else {
                setResult({ success: false, message: "Mesaj gönderilirken bir hata oluştu." })
            }
        } catch {
            setResult({ success: false, message: "Sunucu hatası oluştu." })
        } finally {
            setLoadingForm(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    if (loadingSettings) {
        return (
            <div className="bg-[#F4F4F4] min-h-[80vh] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="bg-[#F4F4F4] min-h-screen text-black">

            {/* ── HERO ── */}
            <section className="pt-36 pb-20 md:pt-44 md:pb-28 max-w-[1400px] mx-auto px-6 md:px-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                >
                    <p className="text-[10px] font-bold tracking-[0.28em] uppercase text-black/35 mb-7">
                        İLETİŞİM
                    </p>
                    <h1 className="text-[3.5rem] sm:text-[5.5rem] md:text-[7.5rem] lg:text-[9rem] xl:text-[10.5rem] leading-[0.85] tracking-[-0.04em] font-medium text-black max-w-5xl whitespace-pre-line">
                        {data.heroTitle}
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-10 text-black/50 text-lg md:text-xl max-w-xl leading-relaxed whitespace-pre-line"
                >
                    {data.heroSubtitle}
                </motion.p>
            </section>

            {/* ── DIVIDER ── */}
            <div className="border-t border-black/10 max-w-[1400px] mx-auto px-6 md:px-10" />

            {/* ── MAIN GRID ── */}
            <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 md:py-28">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">

                    {/* ── FORM ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                        className="lg:col-span-7"
                    >
                        <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-black/35 mb-10">
                            FORM
                        </p>

                        {/* Result message */}
                        <AnimatePresence>
                            {result && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className={`mb-10 px-6 py-4 rounded-2xl flex items-center gap-3 text-sm font-medium ${result.success
                                        ? "bg-black text-white"
                                        : "bg-red-50 border border-red-100 text-red-600"
                                        }`}
                                >
                                    {result.success
                                        ? <CheckCircle className="w-4 h-4 shrink-0" />
                                        : <AlertCircle className="w-4 h-4 shrink-0" />}
                                    {result.message}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="space-y-0">
                            {/* Name + Email */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                                <FormField
                                    label="Ad Soyad"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Ad Soyad"
                                    required
                                />
                                <FormField
                                    label="E-Posta"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="ornek@email.com"
                                    required
                                />
                            </div>

                            {/* Phone + Subject */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                                <FormField
                                    label="Telefon"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+90 555 000 00 00"
                                />
                                <FormField
                                    label="Konu"
                                    name="subject"
                                    type="text"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="Web Tasarım"
                                    required
                                />
                            </div>

                            {/* Message */}
                            <div className="pt-8 pb-2 border-b border-black/15 group focus-within:border-black transition-colors">
                                <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-black/35 mb-3 group-focus-within:text-black/70 transition-colors">
                                    Mesaj
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Projen hakkında kısaca anlat..."
                                    rows={5}
                                    required
                                    className="w-full bg-transparent text-black text-lg font-medium placeholder:text-black/25 focus:outline-none resize-none leading-relaxed"
                                />
                            </div>

                            {/* Submit */}
                            <div className="pt-12">
                                <button
                                    type="submit"
                                    disabled={loadingForm}
                                    className="group flex items-center gap-4 px-8 py-4 bg-black text-white rounded-full font-bold text-base hover:bg-black/80 disabled:opacity-50 transition-all"
                                >
                                    {loadingForm ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            Gönder
                                            <div className="w-8 h-8 border border-white/30 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                                                <ArrowUpRight className="w-4 h-4" />
                                            </div>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>

                    {/* ── INFO PANEL ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="lg:col-span-5 space-y-14"
                    >
                        {/* Contact Details */}
                        <div>
                            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-black/35 mb-8">
                                İLETİŞİM BİLGİLERİ
                            </p>
                            <div className="space-y-6">
                                <ContactRow
                                    icon={<Mail className="w-4 h-4" />}
                                    label="E-posta"
                                    value={data.email}
                                    href={`mailto:${data.email}`}
                                />
                                <ContactRow
                                    icon={<Phone className="w-4 h-4" />}
                                    label="Telefon"
                                    value={data.phone}
                                    href={`tel:${data.phone.replace(/[^0-9+]/g, '')}`}
                                />
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-black/10" />

                        {/* Social */}
                        <div>
                            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-black/35 mb-8">
                                SOSYAL MEDYA
                            </p>
                            <div className="flex flex-col gap-4">
                                {data.socialLinks.map((s, idx) => (
                                    <a
                                        key={idx}
                                        href={s.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center justify-between py-3 border-b border-black/10 hover:border-black/30 transition-colors"
                                    >
                                        <div className="flex items-center gap-3 text-black/60 group-hover:text-black transition-colors">
                                            {getSocialIcon(s.iconType)}
                                            <span className="font-medium text-sm">{s.label}</span>
                                        </div>
                                        <ArrowUpRight className="w-4 h-4 text-black/20 group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Location tag */}
                        <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-full text-xs font-bold tracking-wider uppercase">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                            {data.locationText}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── DIVIDER ── */}
            <div className="border-t border-black/10 max-w-[1400px] mx-auto px-6 md:px-10" />

            {/* ── FAQ ── */}
            <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 md:py-28">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col md:flex-row md:items-end gap-10 md:gap-20 mb-16"
                >
                    <div>
                        <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-black/35 mb-5">SSS</p>
                        <h2 className="text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] leading-[0.88] tracking-[-0.04em] font-medium text-black whitespace-pre-line">
                            {data.faqTitle}
                        </h2>
                    </div>
                    <p className="text-black/50 text-base md:text-lg max-w-xs leading-relaxed md:mb-3 whitespace-pre-line">
                        {data.faqSubtitle}
                    </p>
                </motion.div>

                <div className="space-y-0">
                    {data.faqItems.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <button
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                className="w-full flex items-center justify-between py-7 border-t border-black/10 text-left group hover:border-black/25 transition-colors"
                            >
                                <div className="flex items-center gap-6 flex-1 pr-8">
                                    <span className="text-xs font-bold tracking-widest text-black/25 flex-shrink-0 w-6">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <span className={`text-lg md:text-xl font-medium transition-colors ${openFaq === i ? "text-black" : "text-black/70 group-hover:text-black"}`}>
                                        {item.q}
                                    </span>
                                </div>
                                <div className={`w-9 h-9 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${openFaq === i ? "bg-black border-black text-white" : "border-black/15 text-black/40 group-hover:border-black/30"}`}>
                                    {openFaq === i
                                        ? <Minus className="w-4 h-4" />
                                        : <Plus className="w-4 h-4" />}
                                </div>
                            </button>

                            <AnimatePresence>
                                {openFaq === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pb-8 pl-[3.75rem] pr-14">
                                            <p className="text-black/55 text-base md:text-lg leading-relaxed font-medium whitespace-pre-line">
                                                {item.a}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                    {/* Last border */}
                    <div className="border-t border-black/10" />
                </div>
            </section>
        </div>
    )
}

/* ── Sub-components ── */

function FormField({
    label, name, type, value, onChange, placeholder, required
}: {
    label: string
    name: string
    type: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder: string
    required?: boolean
}) {
    return (
        <div className="pt-8 pb-2 border-b border-black/15 group focus-within:border-black transition-colors">
            <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-black/35 mb-3 group-focus-within:text-black/70 transition-colors">
                {label}
                {required && <span className="ml-1 text-black/40">*</span>}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="w-full bg-transparent text-black text-lg font-medium placeholder:text-black/25 focus:outline-none pb-1 leading-relaxed"
            />
        </div>
    )
}

function ContactRow({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href: string }) {
    return (
        <a
            href={href}
            className="group flex items-center gap-4"
        >
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black/50 group-hover:bg-black group-hover:text-white transition-all shrink-0 shadow-sm">
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-black/35 mb-0.5">{label}</p>
                <p className="text-base font-bold text-black group-hover:text-black/70 transition-colors">{value}</p>
            </div>
        </a>
    )
}
