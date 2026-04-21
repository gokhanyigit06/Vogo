"use client"

import { useInView } from "react-intersection-observer"
import CountUp from "react-countup"
import { motion } from "framer-motion"

export default function PerformanceKpis() {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    })

    const kpis = [
        { title: "Performans Skoru", value: 99, suffix: "/100", desc: "Google Lighthouse Metrikleri" },
        { title: "Ortalama Site Hızı", value: 0.8, suffix: "sn", desc: "İlk yükleme süresi", decimals: 1 },
        { title: "Dönüşüm Artışı", value: 240, suffix: "%", desc: "Reklam kampanyaları ortalaması" },
        { title: "Aktif QR Menü", value: 150, suffix: "+", desc: "Horeca sektöründe kullanım" }
    ]

    return (
        <section className="bg-white py-20 lg:py-32 text-black">
            <div className="container mx-auto px-4 md:px-8 max-w-[1500px]">
                {/* Header */}
                <div className="mb-16 lg:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-black/10 pb-8">
                    <h2 className="text-[3rem] md:text-[4.5rem] lg:text-[5.5rem] leading-[0.9] tracking-[-0.04em] font-medium max-w-3xl">
                        Sadece Tasarım Değil, Rakamlarla Konuşuyoruz.
                    </h2>
                    <p className="text-black/50 font-medium max-w-xs text-sm md:text-base">
                        Ölçülebilir büyüme, organik trafik artışı ve kesintisiz performans. Somut verilerle çalışıyoruz.
                    </p>
                </div>

                <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {kpis.map((kpi, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="flex flex-col group relative"
                        >
                            <div className="text-[4rem] lg:text-[5.5rem] font-medium tracking-tighter leading-none mb-6 flex items-baseline">
                                {inView ? (
                                    <CountUp end={kpi.value} duration={2.5} decimals={kpi.decimals || 0} separator="." />
                                ) : "0"}
                                <span className="text-2xl lg:text-3xl ml-1 font-semibold text-black/40">{kpi.suffix}</span>
                            </div>
                            
                            <div className="w-full h-[1px] bg-black/10 group-hover:bg-black transition-colors duration-500 mb-6" />
                            
                            <h4 className="text-xl md:text-2xl font-bold tracking-tight mb-2">{kpi.title}</h4>
                            <p className="text-black/60 font-medium text-sm">{kpi.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
