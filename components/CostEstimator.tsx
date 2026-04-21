"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const steps = [
    {
        title: "Projenizin Türü Nedir?",
        options: [
            { id: "web", label: "Web Sitesi / E-Ticaret", basePrice: 25000 },
            { id: "ads", label: "Google & Meta Reklamları", basePrice: 15000 },
            { id: "seo", label: "SEO Hizmeti", basePrice: 12000 },
            { id: "qr", label: "QR Menü Sistemi", basePrice: 5000 },
        ]
    },
    {
        title: "İşletmenizin Ölçeği Nedir?",
        options: [
            { id: "startup", label: "Yeni Girişim (Startup)", multiplier: 1 },
            { id: "sme", label: "KOBİ", multiplier: 1.5 },
            { id: "enterprise", label: "Genel Kurumsal", multiplier: 2.5 },
        ]
    },
    {
        title: "Hangi Hızda Teslimat İstiyorsunuz?",
        options: [
            { id: "standard", label: "Standart Planlama", multiplier: 1 },
            { id: "fast", label: "Öncelikli Başlangıç", multiplier: 1.3 },
        ]
    }
]

export default function CostEstimator() {
    const [currentStep, setCurrentStep] = useState(0)
    const [selections, setSelections] = useState<any>({ 0: null, 1: null, 2: null })
    const [showResult, setShowResult] = useState(false)

    const handleSelect = (option: any) => {
        setSelections({ ...selections, [currentStep]: option })
    }

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            setShowResult(true)
        }
    }

    const reset = () => {
        setCurrentStep(0)
        setSelections({ 0: null, 1: null, 2: null })
        setShowResult(false)
    }

    const calculateTotal = () => {
        if (!selections[0] || !selections[1] || !selections[2]) return 0
        const base = selections[0].basePrice
        const m1 = selections[1].multiplier
        const m2 = selections[2].multiplier
        return Math.floor(base * m1 * m2)
    }

    return (
        <section className="bg-[#F4F4F4] py-20 lg:py-32 text-black">
            <div className="container mx-auto px-4 md:px-8 max-w-[1500px]">
                
                {/* Header */}
                <div className="mb-16 lg:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-black/10 pb-8">
                    <h2 className="text-[3rem] md:text-[4.5rem] lg:text-[5.5rem] leading-[0.9] tracking-[-0.04em] font-medium max-w-3xl">
                        Projeniz İçin<br/>Hızlı Bütçe Alın.
                    </h2>
                    <p className="text-black/50 font-medium max-w-xs text-sm md:text-base">
                        Sürpriz maliyetler yok. İhtiyacınızı seçin, algoritma tahmini bütçenizi anında çıkarsın.
                    </p>
                </div>

                <div className="bg-white p-8 md:p-16 border border-black/10 relative min-h-[500px] flex flex-col justify-center max-w-5xl mx-auto shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
                    <AnimatePresence mode="wait">
                        {!showResult ? (
                            <motion.div
                                key={`step-${currentStep}`}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="w-full"
                            >
                                <div className="flex items-center justify-between mb-12">
                                    <span className="text-xs md:text-sm font-bold tracking-[0.2em] text-black/50 uppercase">
                                        Adım O{currentStep + 1} / O3
                                    </span>
                                    <div className="flex gap-2">
                                        {[0, 1, 2].map((i) => (
                                            <div key={i} className={`h-[2px] w-12 transition-colors duration-500 ${i <= currentStep ? 'bg-black' : 'bg-black/10'}`} />
                                        ))}
                                    </div>
                                </div>
                                
                                <h3 className="text-[2rem] md:text-[3rem] font-medium leading-[1.1] tracking-tight mb-12 text-black">
                                    {steps[currentStep].title}
                                </h3>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {steps[currentStep].options.map((opt) => {
                                        const isSelected = selections[currentStep]?.id === opt.id;
                                        return (
                                            <button 
                                                key={opt.id}
                                                onClick={() => handleSelect(opt)}
                                                className={`text-left p-6 md:p-8 border transition-all duration-300 flex justify-between items-center group
                                                    ${isSelected 
                                                    ? 'border-black bg-[#FAFAFA]' 
                                                    : 'border-black/10 hover:border-black/50 bg-white'
                                                }`}
                                            >
                                                <span className={`text-lg md:text-xl font-medium tracking-tight ${isSelected ? 'text-black' : 'text-black/70 group-hover:text-black'}`}>
                                                    {opt.label}
                                                </span>
                                                <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors
                                                    ${isSelected ? 'border-black bg-black' : 'border-black/20 group-hover:border-black/50'}
                                                `}>
                                                    {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>

                                <div className="mt-16 flex justify-end">
                                    <button 
                                        onClick={nextStep}
                                        disabled={!selections[currentStep]}
                                        className="bg-black text-white px-10 py-5 text-lg font-medium tracking-wide transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/80"
                                    >
                                        {currentStep === 2 ? 'Sonucu Gör' : 'Sonraki'}
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col h-full justify-center"
                            >
                                <div className="border-b border-black/10 pb-8 mb-8">
                                    <span className="text-xs md:text-sm font-bold tracking-[0.2em] text-black/50 uppercase block mb-4">
                                        Tahmini Toplam Bütçe
                                    </span>
                                    <div className="flex items-baseline gap-2">
                                        <div className="text-[4rem] sm:text-[5rem] md:text-[7rem] leading-none font-medium tracking-tighter text-black">
                                            ₺{calculateTotal().toLocaleString('tr-TR')}
                                        </div>
                                        <span className="text-xl md:text-2xl text-black/40 font-medium">+ KDV</span>
                                    </div>
                                </div>
                                
                                <p className="text-black/60 font-medium text-lg leading-relaxed max-w-xl mb-12">
                                    Bu rakam seçtiğiniz kriterlere göre oluşturulmuş tahmini bir taban bütçedir. Projenizin net kapsamını belirlemek için detaylı bir analiz yapmamız gerekir.
                                </p>
                                
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button className="bg-black text-white px-10 py-5 text-lg font-medium tracking-wide transition-all hover:bg-black/80 text-center">
                                        Detaylı Teklif Al
                                    </button>
                                    <button onClick={reset} className="bg-[#FAFAFA] border border-black/10 text-black px-10 py-5 text-lg font-medium tracking-wide transition-all hover:bg-black/5 hover:border-black/30 text-center">
                                        Yeniden Hesapla
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    )
}
