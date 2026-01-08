
import { CheckCircle2 } from "lucide-react"

export default function About() {
    const benefits = [
        "Yenilikçi Tasarım Anlayışı",
        "Veri Odaklı Stratejiler",
        "7/24 Teknik Destek",
        "SEO Uyumlu Altyapı",
    ]

    return (
        <section id="about" className="py-24 bg-slate-900/50">
            <div className="container px-4 md:px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold">
                            Neden <span className="text-primary">Vogo?</span>
                        </h2>
                        <p className="text-muted-foreground">
                            Dijital ajans olarak vizyonumuz, işletmelerin potansiyelini en üst düzeye çıkarmaktır.
                            Modern teknolojileri estetik tasarımla buluşturarak, sürdürülebilir başarı hikayeleri yazıyoruz.
                        </p>
                        <ul className="space-y-4">
                            {benefits.map((item, index) => (
                                <li key={index} className="flex items-center gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-primary" />
                                    <span className="text-slate-200">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative aspect-square md:aspect-video bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
                        {/* Placeholder for About Image */}
                        <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                            Görsel Alanı
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
