"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export default function NewsletterLead() {
    const [email, setEmail] = useState("")
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if(email) {
            setSubmitted(true)
            // Firebase veya API kaydı buraya eklenebilir.
        }
    }

    return (
        <section className="bg-[#FAFAFA] text-black">
            <div className="w-full bg-black/10 h-[1px]" />
            <div className="container mx-auto px-4 md:px-8 max-w-[1500px] py-20 lg:py-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-[3rem] md:text-[4.5rem] lg:text-[5.5rem] leading-[0.9] tracking-[-0.04em] font-medium mb-6">
                            Sektörün<br />1 Adım<br />Önünde Olun.
                        </h2>
                        <p className="text-black/60 text-lg md:text-xl max-w-md font-medium">
                            E-ticaret dönüşüm taktikleri, yeni nesil reklam stratejileri ve SEO ipuçlarını her hafta mail kutunuza gönderiyoruz.
                        </p>
                    </div>

                    <div className="w-full lg:w-4/5 ml-auto">
                        {!submitted ? (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="E-posta adresiniz..." 
                                    required
                                    className="w-full px-6 py-5 rounded-none border border-black/20 bg-transparent focus:outline-none focus:border-black transition-colors text-black text-lg placeholder:text-black/40"
                                />
                                <button type="submit" className="w-full bg-black text-white px-8 py-5 text-lg font-medium tracking-wide hover:bg-black/80 transition-colors">
                                    Kaydol
                                </button>
                            </form>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-[#F4F4F4] border border-black/10 p-8 flex items-center gap-4"
                            >
                                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center shrink-0">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold tracking-tight">Aramıza Hoş Geldiniz</h3>
                                    <p className="text-black/60 font-medium">Harika içerikler yolda.</p>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
            <div className="w-full bg-black/10 h-[1px]" />
        </section>
    )
}
