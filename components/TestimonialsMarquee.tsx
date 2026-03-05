"use client"

import { motion } from "framer-motion"
import { Quote } from "lucide-react"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"

export default function TestimonialsMarquee() {
    const t = useTranslations("TestimonialsMarquee")
    const commonT = useTranslations("Header") // For "contactUs" or similar if needed, but we'll use a direct label

    const testimonials = [
        {
            name: "Sophie Moore",
            location: "San Francisco, CA",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
            quoteColor: "text-amber-400"
        },
        {
            name: "Matt Cannon",
            location: "London, UK",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Matt",
            quoteColor: "text-blue-600"
        },
        {
            name: "John Carter",
            location: "New York, NY",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
            quoteColor: "text-rose-500"
        },
        {
            name: "Emily Chen",
            location: "Singapore",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
            quoteColor: "text-emerald-500"
        }
    ]

    // Duplicate for seamless loop
    const displayTestimonials = [...testimonials, ...testimonials, ...testimonials]

    return (
        <section className="py-16 md:py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-8 max-w-[95%] w-full mb-10 md:mb-16">
                <div className="text-center space-y-4 md:space-y-6">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif font-medium text-black leading-tight max-w-4xl mx-auto"
                    >
                        {t('titlePrefix')} <br className="hidden sm:block" />
                        {t('titleHighlight') === "clients" ? "our " : ""}
                        <span className="relative inline-block mx-1 sm:mx-2">
                            <span className="absolute -inset-1 sm:-inset-2 bg-[#FFD600] rounded-xl sm:rounded-2xl transform rotate-3 shadow-lg" />
                            <span className="relative text-white px-1 sm:px-2">{t('titleHighlight')}</span>
                        </span> {t('titleSuffix')}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-base sm:text-lg md:text-xl text-black/60 max-w-2xl mx-auto leading-relaxed font-medium px-2"
                    >
                        {t('description')}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="pt-2 md:pt-4"
                    >
                        <Link
                            href="/contact"
                            className="inline-block px-6 sm:px-10 py-3 sm:py-5 bg-black text-white rounded-xl sm:rounded-2xl text-base sm:text-xl font-bold hover:scale-[1.05] transition-all shadow-xl"
                        >
                            {commonT("contactUs")}
                        </Link>
                    </motion.div>
                </div>
            </div>


            {/* Infinite Marquee */}
            <div className="relative">
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        duration: 40,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="flex gap-4 sm:gap-8 whitespace-normal w-max px-4"
                >
                    {displayTestimonials.map((item, index) => (
                        <div
                            key={index}
                            className="w-[280px] sm:w-[340px] md:w-[450px] bg-white border-2 border-black rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-8 md:p-10 flex flex-col justify-between hover:shadow-xl transition-shadow duration-500"
                        >
                            <div className="space-y-3 sm:space-y-6">
                                <Quote className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 ${item.quoteColor} fill-current transform -rotate-12`} />
                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-black leading-tight">
                                    {t(`testimonials.${index % 4}.title`)}
                                </h3>
                                <p className="text-sm sm:text-base md:text-xl text-black/60 leading-relaxed font-medium">
                                    {t(`testimonials.${index % 4}.text`)}
                                </p>
                            </div>

                            <div className="flex items-center gap-3 sm:gap-4 mt-5 sm:mt-8">
                                <img
                                    src={item.avatar}
                                    className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white border-2 border-black/5"
                                    alt={item.name}
                                />
                                <div>
                                    <h4 className="text-sm sm:text-base md:text-lg font-bold text-black">{item.name}</h4>
                                    <p className="text-xs sm:text-sm text-black/40 font-medium">{item.location}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
