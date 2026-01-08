"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const projects = [
    {
        id: 1,
        title: "E-Ticaret Platformu",
        category: "Web & E-Commerce",
        image: "https://images.unsplash.com/photo-1661956602116-aa6865609028?w=1200",
        description: "Modern ve kullanıcı dostu e-ticaret deneyimi",
    },
    {
        id: 2,
        title: "Kurumsal Web Sitesi",
        category: "Web & Branding",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200",
        description: "Profesyonel kurumsal kimlik ve dijital varlık",
    },
    {
        id: 3,
        title: "QR Menü Sistemi",
        category: "QR & Hospitality",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200",
        description: "AI destekli temassız menü çözümü",
    },
    {
        id: 4,
        title: "Dijital Pazarlama",
        category: "Ads & Marketing",
        image: "https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=1200",
        description: "Veri odaklı reklam kampanyaları",
    },
]

export default function PortfolioSlider() {
    const [currentIndex, setCurrentIndex] = useState(0)

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % projects.length)
    }

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length)
    }

    return (
        <section className="py-24 md:py-32 bg-slate-950 relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 space-y-4"
                >
                    <h2 className="text-4xl md:text-6xl font-bold">
                        <span className="text-white">Güzel ve </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                            Pratik İşler
                        </span>
                        <span className="text-white"> Yaratıyoruz</span>
                    </h2>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Başarılı projelerimize göz atın ve siz de bu hikayenin bir parçası olun.
                    </p>
                </motion.div>

                <div className="relative max-w-6xl mx-auto">
                    {/* Slider Container */}
                    <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0"
                            >
                                <img
                                    src={projects[currentIndex].image}
                                    alt={projects[currentIndex].title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

                                {/* Project Info */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    className="absolute bottom-0 left-0 right-0 p-8 md:p-12"
                                >
                                    <div className="inline-block px-4 py-2 bg-emerald-500/20 backdrop-blur-sm rounded-full border border-emerald-500/30 text-emerald-400 text-sm font-semibold mb-4">
                                        {projects[currentIndex].category}
                                    </div>
                                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
                                        {projects[currentIndex].title}
                                    </h3>
                                    <p className="text-lg text-slate-300 max-w-2xl">
                                        {projects[currentIndex].description}
                                    </p>
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <button
                            onClick={prevSlide}
                            className="group w-14 h-14 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:border-transparent transition-all duration-300"
                        >
                            <ChevronLeft className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
                        </button>

                        {/* Dots Indicator */}
                        <div className="flex gap-2">
                            {projects.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                        ? "w-8 bg-gradient-to-r from-emerald-500 to-teal-500"
                                        : "w-2 bg-slate-700 hover:bg-slate-600"
                                        }`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextSlide}
                            className="group w-14 h-14 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:border-transparent transition-all duration-300"
                        >
                            <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}
