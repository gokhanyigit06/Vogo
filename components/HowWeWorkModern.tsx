"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const defaultSteps = [
    {
        id: "01",
        title: "Hızlı Teslimat",
        subtitle: "Yeniden kullanılabilir, test edilmiş mimari",
        description: "Temel altyapımız, sayfa oluşturucular, navigasyon, çoklu dil, içerik modelleri ve SEO yapılandırmaları ile onlarca projede iyileştirildi. Projeniz, bir öncekinin bittiği yerden başlar.",
        icon: (
            <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 md:w-12 md:h-12">
                <path d="M16 40 L16 20 L0 20 Z" fill="black" fillOpacity="0.2" />
                <path d="M28 28 L28 10 L10 10 Z" fill="black" fillOpacity="0.6" />
                <path d="M40 16 L40 0 L24 0 Z" fill="black" />
            </svg>
        )
    },
    {
        id: "02",
        title: "Varsayılan Olarak Performans",
        subtitle: "İlk günden itibaren SEO ve performans",
        description: "Her proje standart olarak sıkı bir performans denetimi içerir — İçeriğinizin hem geleneksel hem de yapay zeka destekli aramalarda öne çıkması için Temel Web Verileri, yapılandırılmış veri, render stratejisi ve GEO yapılandırması.",
        icon: (
            <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 md:w-12 md:h-12">
                <rect x="0" y="26" width="11" height="14" fill="black" fillOpacity="0.2" />
                <rect x="14" y="14" width="11" height="26" fill="black" fillOpacity="0.6" />
                <rect x="28" y="0" width="11" height="40" fill="black" />
            </svg>
        )
    },
    {
        id: "03",
        title: "Kesin Tahminler",
        subtitle: "Kesin tahminler, öngörülebilir teslimat",
        description: "Projelerimizin %90'ı başlangıç kapsamı içinde kalır. Başlangıçta zaman yatırımını yaparak tahminin, inşa edeceğimiz şeyi yansıtmasını sağlarız ve yolda sürprizlerle karşılaşmamanızı garanti ederiz.",
        icon: (
            <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 md:w-12 md:h-12">
                <path d="M20 0 L40 10 L20 20 L0 10 Z" fill="black" fillOpacity="0.2" />
                <path d="M0 10 L20 20 L20 40 L0 30 Z" fill="black" fillOpacity="0.6" />
                <path d="M40 10 L40 30 L20 40 L20 20 Z" fill="black" />
            </svg>
        )
    }
]

export default function HowWeWorkModern() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [steps, setSteps] = useState(defaultSteps)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("/api/settings")
            .then(r => r.json())
            .then(data => {
                if (data.howWeWorkSettings && Array.isArray(data.howWeWorkSettings)) {
                    // Merge fetched data with default icons
                    const mergedSteps = defaultSteps.map((defaultStep, index) => {
                        const fetchedStep = data.howWeWorkSettings[index];
                        if (fetchedStep) {
                            return { ...defaultStep, ...fetchedStep };
                        }
                        return defaultStep;
                    });
                    setSteps(mergedSteps);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    // Map the scroll progress to transform Y values
    // As the user scrolls down, the boxes will slide down at different rates
    const y1 = useTransform(scrollYProgress, [0.1, 0.8], [0, 0])
    const y2 = useTransform(scrollYProgress, [0.1, 0.8], [0, 60])
    const y3 = useTransform(scrollYProgress, [0.1, 0.8], [0, 120])

    const transforms = [y1, y2, y3]

    return (
        <section ref={containerRef} className="bg-white py-20 lg:py-32 text-black overflow-hidden relative min-h-[600px]">
            {loading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
                    <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                </div>
            )}
            <div className={`container mx-auto px-4 md:px-8 max-w-[1500px] transition-opacity duration-500 delay-100 ${loading ? "opacity-0" : "opacity-100"}`}>
                {/* Header */}
                <div className="mb-16 lg:mb-24 flex justify-center">
                    <h2 className="text-[4rem] md:text-[6rem] lg:text-[8rem] leading-[0.9] tracking-[-0.04em] font-medium text-center">
                        Nasıl Çalışıyoruz?
                    </h2>
                </div>

                {/* Cards Container */}
                <div className="flex flex-col md:flex-row gap-6 lg:gap-8 justify-center items-stretch md:items-start pb-20 md:pb-32">
                    {steps.map((step: any, index: number) => (
                        <motion.div
                            key={step.id || index}
                            style={{ y: transforms[index] || 0 }}
                            className="flex-1 bg-[#FAFAFA] border border-black/5 p-8 lg:p-12 flex flex-col justify-between min-h-[400px] lg:min-h-[450px]"
                        >
                            <div>
                                <h3 className="text-3xl lg:text-4xl font-medium tracking-tight mb-4">
                                    {step.title}
                                </h3>
                                <p className="text-xs md:text-sm font-bold tracking-wide text-black/40 mb-8 lg:mb-12">
                                    {step.subtitle}
                                </p>
                                <p className="text-base lg:text-lg text-black/70 leading-relaxed font-medium">
                                    {step.description}
                                </p>
                            </div>

                            {/* Abstract decorative icon bottom right */}
                            <div className="mt-12 lg:mt-16 self-end">
                                {step.icon}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
