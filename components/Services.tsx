
import { LayoutGrid, LineChart, Megaphone, QrCode, Code2 } from "lucide-react"

const services = [
    {
        title: "Web Çözümleri",
        description: "Modern, hızlı ve SEO uyumlu web siteleri.",
        icon: LayoutGrid,
    },
    {
        title: "SEO Optimizasyonu",
        description: "Arama motorlarında üst sıralara çıkın.",
        icon: LineChart,
    },
    {
        title: "Reklam Yönetimi",
        description: "Meta ve Google reklamları ile hedef kitlenize ulaşın.",
        icon: Megaphone,
    },
    {
        title: "QR Menü Sistemleri",
        description: "AI destekli, temassız ve hızlı menü çözümleri.",
        icon: QrCode,
    },
    {
        title: "Özel Yazılım",
        description: "İhtiyacınıza yönelik butik yazılım geliştirme.",
        icon: Code2,
    },
]

export default function Services() {
    return (
        <section id="services" className="py-24 relative">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold">
                        <span className="text-white">Hizmet</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">lerimiz</span>
                    </h2>
                    <p className="text-slate-400 max-w-[600px] mx-auto text-lg">
                        İşletmenizi dijital dünyada büyütmek için ihtiyacınız olan tüm çözümler tek bir çatı altında.
                    </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <div key={index} className="glass-card p-8 rounded-xl group cursor-pointer">
                            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <service.icon className="h-7 w-7 text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white group-hover:text-emerald-400 transition-colors">{service.title}</h3>
                            <p className="text-slate-400 leading-relaxed">{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
