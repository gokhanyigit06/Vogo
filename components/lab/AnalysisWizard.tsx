"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Loader2, Search, CheckCircle2, AlertTriangle, Sparkles, BarChart3, FileText, Send } from "lucide-react"
import MagneticButton from "@/components/ui/MagneticButton"

type AnalysisResult = {
    scores: {
        design: number
        ux: number
        seo: number
        content: number
    }
    summary: string
    critical_issues: string[]
    improvements: string[]
    positive_points: string[]
}

export default function AnalysisWizard() {
    const [step, setStep] = useState<"input" | "analyzing" | "results">("input")
    const [url, setUrl] = useState("")
    const [result, setResult] = useState<AnalysisResult | null>(null)
    const [loadingStep, setLoadingStep] = useState(0)

    const loadingMessages = [
        "Web sitesi taranıyor...",
        "Ekran görüntüsü alınıyor...",
        "Görsel analiz ediliyor (Gemini Vision)...",
        "UX ve Tasarım skorlanıyor...",
        "Rapor hazırlanıyor..."
    ]

    const handleAnalyze = async () => {
        if (!url) return

        setStep("analyzing")

        // Simulate loading steps progress
        const interval = setInterval(() => {
            setLoadingStep(prev => (prev < loadingMessages.length - 1 ? prev + 1 : prev))
        }, 1500)

        try {
            const res = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            })

            if (!res.ok) throw new Error("Analiz hatası")

            const data = await res.json()
            setResult(data)
            setStep("results")
        } catch (error) {
            console.error(error)
            alert("Bir hata oluştu. Lütfen tekrar deneyin.")
            setStep("input")
        } finally {
            clearInterval(interval)
            setLoadingStep(0)
        }
    }

    return (
        <div className="w-full max-w-5xl mx-auto min-h-[600px] flex flex-col items-center justify-center p-6">
            <AnimatePresence mode="wait">

                {/* STEP 1: INPUT */}
                {step === "input" && (
                    <motion.div
                        key="input"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full max-w-2xl text-center"
                    >
                        <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            <Sparkles className="w-10 h-10" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
                            Web Sitenizi Yapay Zeka ile Analiz Edin
                        </h2>
                        <p className="text-xl text-muted-foreground mb-10">
                            Google Gemini destekli multimodal analiz ile tasarım, UX ve SEO hatalarınızı saniyeler içinde keşfedin.
                        </p>

                        <div className="relative group max-w-xl mx-auto">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                            <div className="relative flex items-center bg-zinc-900 border border-white/10 rounded-2xl p-2 shadow-2xl">
                                <Search className="w-6 h-6 text-muted-foreground ml-4" />
                                <input
                                    type="url"
                                    placeholder="https://example.com"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="flex-1 bg-transparent border-none text-white px-4 py-4 focus:ring-0 focus:outline-none placeholder:text-zinc-600 text-lg"
                                    onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                                />
                                <MagneticButton>
                                    <button
                                        onClick={handleAnalyze}
                                        disabled={!url}
                                        className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        Analiz Et
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </MagneticButton>
                            </div>
                        </div>

                        <p className="mt-6 text-sm text-zinc-500">
                            Trendyol, Etsy ve E-ticaret siteleri için özel analiz modu otomatik devreye girer.
                        </p>
                    </motion.div>
                )}

                {/* STEP 2: ANALYZING */}
                {step === "analyzing" && (
                    <motion.div
                        key="analyzing"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="flex flex-col items-center text-center"
                    >
                        <div className="relative w-32 h-32 mb-8">
                            <div className="absolute inset-0 border-t-4 border-emerald-500 rounded-full animate-spin"></div>
                            <div className="absolute inset-4 border-r-4 border-cyan-500 rounded-full animate-spin animation-delay-200"></div>
                            <div className="absolute inset-8 border-b-4 border-purple-500 rounded-full animate-spin animation-delay-500"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="w-10 h-10 text-emerald-500 animate-pulse" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Vogo AI Analiz Yapıyor</h3>
                        <p className="text-muted-foreground min-h-[24px] transition-all">
                            {loadingMessages[loadingStep]}
                        </p>
                    </motion.div>
                )}

                {/* STEP 3: RESULTS */}
                {step === "results" && result && (
                    <AnalysisReport result={result} onRetry={() => setStep("input")} />
                )}

            </AnimatePresence>
        </div>
    )
}

function AnalysisReport({ result, onRetry }: { result: AnalysisResult, onRetry: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-8"
        >
            {/* Header Summary */}
            <div className="text-center mb-8">
                <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500 mb-4">
                    Analiz Tamamlandı
                </h3>
                <p className="text-lg text-zinc-300 max-w-3xl mx-auto">
                    {result.summary}
                </p>
            </div>

            {/* Scores Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <ScoreCard title="Tasarım" score={result.scores.design} icon={<Sparkles />} />
                <ScoreCard title="UX & Kullanım" score={result.scores.ux} icon={<CheckCircle2 />} delay={0.1} />
                <ScoreCard title="SEO" score={result.scores.seo} icon={<BarChart3 />} delay={0.2} />
                <ScoreCard title="İçerik" score={result.scores.content} icon={<FileText />} delay={0.3} />
            </div>

            {/* Detailed Lists */}
            <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div className="space-y-6">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
                        <h4 className="flex items-center gap-2 text-xl font-bold text-red-500 mb-4">
                            <AlertTriangle className="w-5 h-5" />
                            Kritik Hatalar
                        </h4>
                        <ul className="space-y-3">
                            {result.critical_issues.map((issue, i) => (
                                <li key={i} className="flex gap-3 text-red-200/80 text-sm">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                    {issue}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6">
                        <h4 className="flex items-center gap-2 text-xl font-bold text-emerald-500 mb-4">
                            <Sparkles className="w-5 h-5" />
                            Önerilen İyileştirmeler
                        </h4>
                        <ul className="space-y-3">
                            {result.improvements.map((item, i) => (
                                <li key={i} className="flex gap-3 text-emerald-200/80 text-sm">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Footer CTA */}
            <div className="mt-12 p-8 bg-zinc-900 border border-white/5 rounded-3xl text-center space-y-6 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-emerald-500/5 blur-3xl pointer-events-none" />

                <div className="max-w-xl mx-auto space-y-4 relative z-10">
                    <h4 className="text-xl font-bold">Detaylı raporu mailine gönderelim mi?</h4>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const btn = e.currentTarget.querySelector('button');
                        if (btn) {
                            btn.textContent = 'Gönderildi!';
                            btn.classList.add('bg-green-500', 'text-white');
                            setTimeout(() => {
                                btn.textContent = 'Gönder';
                                btn.classList.remove('bg-green-500', 'text-white');
                            }, 3000);
                        }
                        alert("Rapor talebiniz alındı. Kısa süre içinde PDF olarak iletilecektir.");
                    }} className="flex gap-2">
                        <input required type="email" placeholder="ornek@sirket.com" className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-2 focus:ring-1 focus:ring-emerald-500 outline-none transition-all" />
                        <button type="submit" className="bg-white text-black px-6 py-2 rounded-lg font-bold hover:bg-zinc-200 transition-all min-w-[100px]">Gönder</button>
                    </form>
                </div>

                <div className="pt-6 border-t border-white/5 flex flex-col items-center gap-4">
                    <p className="text-zinc-400 text-sm">
                        Vogo Lab bu hataları <span className="text-emerald-400 font-bold">48 saat içinde</span> düzeltebilir.
                    </p>
                    <div className="flex gap-4 items-center justify-center">
                        <button onClick={onRetry} className="text-zinc-500 hover:text-white transition underline text-sm">Yeni Analiz Yap</button>
                        <span className="text-zinc-700">|</span>
                        <a href="/contact" className="text-emerald-500 hover:text-emerald-400 transition font-medium flex items-center gap-2">
                            Vogo Lab Uzmanına Danış
                            <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

function ScoreCard({ title, score, icon, delay = 0 }: { title: string, score: number, icon: React.ReactNode, delay?: number }) {
    let color = "text-red-500"
    if (score >= 50) color = "text-yellow-500"
    if (score >= 80) color = "text-emerald-500"

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className="bg-card border border-border p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-4 hover:border-emerald-500/30 transition-colors"
        >
            <div className="p-3 rounded-full bg-muted/50 text-muted-foreground">
                {icon}
            </div>
            <div>
                <div className={`text-4xl font-black mb-1 ${color}`}>
                    {score}
                </div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    {title}
                </div>
            </div>
        </motion.div>
    )
}
