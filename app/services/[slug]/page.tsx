"use client"

import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import Header from "@/components/Header"
import ModernFooter from "@/components/ModernFooter"
import Link from "next/link"
import Image from "next/image"
import {
    Search, QrCode, ArrowRight, Zap, Smartphone, Globe, ChevronDown, Rocket, Layers,
    AppWindow, TrendingUp, Activity, SplitSquareHorizontal, Maximize2, Repeat, Share2,
    Video, MessageCircle, Film, Camera, AlertTriangle, BarChart, Radio, Eye, Settings,
    Clock, Database, BrainCircuit, ShieldCheck, Cloud, Webhook, GitGraph, LayoutDashboard,
    PieChart, Bell, CreditCard, Users, MapPin, Code, Languages, Palette, RefreshCw, Bot
} from "lucide-react"

const servicesData = [
    {
        id: "ads",
        title: "Performans Pazarlaması (Ads)",
        hero: {
            title: "Bütçenizi Gidere Değil, Satış Garantili Bir Yatırıma Dönüştürün",
            subtitle: "Sadece beğeni ve tıklama değil. Google, Meta ve TikTok mecralarında, doğrudan ciro artışı ve ROI hedefli profesyonel performans reklamcılığı.",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
            gradient: "from-black via-black/80 to-transparent"
        },
        bentoGrid: [
            {
                title: "Meta (Instagram & Facebook) Ads",
                desc: "Görsel gücün ve hedeflemenin zirvesi. Potansiyel müşterilerinize tam da ilgi duydukları anda ulaşıyoruz.",
                icon: AppWindow,
                colSpan: "md:col-span-1",
                bgImage: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80"
            },
            {
                title: "Google Ads (Arama & Alışveriş)",
                desc: "Satın alma niyeti en yüksek kullanıcıları yakalıyoruz. Arama Ağı ve PMAX kampanyalarıyla satışları katlayın.",
                icon: Search,
                colSpan: "md:col-span-1",
                bgImage: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80"
            }
        ],
        technicalGrid: [
            { title: "Ciro Odaklılık", desc: "ROAS (Reklam Harcaması Getirisi) odaklı yönetimle kârlılığınızı maksimize ediyoruz.", icon: TrendingUp },
            { title: "Kusursuz Takip", desc: "Meta Pixel, CAPI ve GA4 kurulumlarıyla her tıklamayı ölçümlüyoruz.", icon: Activity },
            { title: "Sürekli A/B Testi", desc: "Kreatif, metin ve hedef kitle kombinasyonlarını durmadan test ediyoruz.", icon: SplitSquareHorizontal },
            { title: "Guvenli Ölçekleme", desc: "Başarılı kampanyaları bütçe bazında güvenle büyüterek işletmenizi ölçekliyoruz.", icon: Maximize2 }
        ],
        process: [
            { step: 1, title: "Sektör ve Rakip Analizi", desc: "Bulunduğunuz sektördeki boşlukları ve fırsatları belirliyoruz." },
            { step: 2, title: "Kampanya Kurgusu", desc: "Doğru kitle, doğru görsel ve ikna edici metinlerle kurulum yapıyoruz." },
            { step: 3, title: "Optimizasyon", desc: "Akan veriyi anlık analiz ederek bütçeyi en verimli kanala kaydırıyoruz." },
            { step: 4, title: "Şeffaf Raporlama", desc: "Ne harcadınız, ne kazandınız? Rakamlarla net rapor sunuyoruz." }
        ],
        cta: {
            title: "Reklam Hesaplarınızın\nRöntgenini Çekelim.",
            buttonText: "Ücretsiz Hesap Analizi Al"
        }
    },
    {
        id: "web",
        title: "Web Tasarım & E-Ticaret",
        hero: {
            title: "Tasarımı Kusursuz, Altyapısı Hızlı: Satış Getiren Siteler",
            subtitle: "Sadece güzel görünen bir vitrin değil; mobil cihazlarda kusursuz çalışan, 1 saniyenin altında açılan satış ve dönüşüm odaklı dijital mağazalar.",
            image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&q=80",
            gradient: "from-black via-black/80 to-transparent"
        },
        bentoGrid: [
            {
                title: "Satış Odaklı E-Ticaret",
                desc: "Shopify ve özel yazılım çözümleriyle global düzeyde satış yapabileceğiniz, ödeme altyapısı hazır platformlar.",
                icon: ShoppingBagIcon,
                colSpan: "md:col-span-2",
                bgImage: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?w=800&q=80"
            },
            {
                title: "Kurumsal Portfolyo / Landing Page",
                desc: "Markanızı elit bir şekilde konumlandıran yüksek dönüşümlü tanıtım siteleri.",
                icon: BuildingIcon,
                colSpan: "md:col-span-1",
                bgImage: "https://images.unsplash.com/photo-1481487484168-9b930d5b7d9f?w=800&q=80"
            }
        ],
        technicalGrid: [
            { title: "Core Web Vitals", desc: "Sayfa yüklenme hızını minimize ederek müşterinin kaçmasını engelliyoruz.", icon: Zap },
            { title: "Kusursuz Mobil UI/UX", desc: "Trafiğin %80'inin geldiği mobil cihazlarda kesintisiz alışveriş deneyimi.", icon: Smartphone },
            { title: "SEO Uyumlu Mimari", desc: "Arama motorlarının ilk günden okuyabildiği teknik optimizasyona sahip kod yapısı.", icon: Search },
            { title: "Ciro Odaklı Sepet Akışı", desc: "Karmaşık checkout süreçlerini iptal edip, tek sayfada hızlı ödeme pratikleri.", icon: Layers }
        ],
        process: [
            { step: 1, title: "Proje Tanımlama & UI UX", desc: "Marka kimliği ve müşteri profiline uygun prototip hazırlığı." },
            { step: 2, title: "Modern Teknolojilerle Geliştirme", desc: "Sektör standardı araçlarla frontend ve backend yazılım sürecinin inşası." },
            { step: 3, title: "Performans & QA Testi", desc: "Entegrasyonlar ve hız testleri ile kusursuz teslimat." }
        ],
        cta: {
            title: "Ziyaretçileri Müşteriye\nDönüştürmeye Başlayın.",
            buttonText: "Projeni Fiyatlandır"
        }
    },
    {
        id: "seo",
        title: "Garantili SEO",
        hero: {
            title: "Arama Motorunda Çıkmıyorsanız Rakibiniz Satış Yapıyor Demektir",
            subtitle: "Google ve diğer arama motorlarında kalıcı hakimiyet kurmak için teknik kusursuzluk, otorite inşası ve sektörel rakip analizinizi bir araya getiriyoruz.",
            image: "https://images.unsplash.com/photo-1572410979265-56253e2b9f4a?w=1200&q=80",
            gradient: "from-black via-black/80 to-transparent"
        },
        bentoGrid: [
            {
                title: "Kapsamlı Teknik Denetim",
                desc: "Site içi bozuk linkler, yönlendirme hataları ve indekslenme problemlerinin kalıcı çözümü.",
                icon: Settings,
                colSpan: "md:col-span-1",
                bgImage: "https://images.unsplash.com/photo-1504868584819-f8e8b716656f?w=800&q=80"
            },
            {
                title: "Semantik İçerik Ağı",
                desc: "Arama amacına uygun, değer yaratan ve otoriteyi destekleyen organik içerik planlaması.",
                icon: FileTextIcon,
                colSpan: "md:col-span-2",
                bgImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80"
            }
        ],
        technicalGrid: [
            { title: "Kelime Araştırması", desc: "Ciro getirecek ticari niyetli kelimeleri belirliyoruz.", icon: Search },
            { title: "Site Hızı Optimizasyonu", desc: "Sıralama faktörü olan organik hız puanlarını artırıyoruz.", icon: Zap },
            { title: "Harita & Yerel SEO", desc: "Sizi arayan civardaki müşteriyi kapınıza getiriyoruz.", icon: MapPin },
            { title: "Kaliteli Backlink", desc: "Sektörel otorite sitelerinden güven verici bağlantılar alıyoruz.", icon: Layers }
        ],
        process: [
            { step: 1, title: "Detaylı Check-up", desc: "Sitenizin neden trafik almadığının teknik raporunun çıkarılması." },
            { step: 2, title: "Sıralama Stratejisi", desc: "Kolay kelimelerden zorlara doğru ilerleyen hızlı kazanım (Quick Win) stratejisi." },
            { step: 3, title: "Düzenli Uygulama & Rapor", desc: "Otorite artışı ve sıralama takiplerinin aylık olarak markaya sunulması." }
        ],
        cta: {
            title: "Ücretsiz Organik\nTrafik Akışı Başlasın.",
            buttonText: "SEO Analizi Al"
        }
    },
    {
        id: "qr",
        title: "VogoPOS & QR Menü",
        hero: {
            title: "İşletmenizin Kazancını QR Menü ile Yeniden Tanımlayın",
            subtitle: "Horeca sektörü için tasarlandı. Sipariş süreçlerini dijitalleştirin, garson maliyetini düşürün ve ürünlerinizi daha çarpıcı sergileyin.",
            image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80",
            gradient: "from-black via-black/80 to-transparent"
        },
        bentoGrid: [
            {
                title: "Anında Menü Düzenle",
                desc: "Tükenen ürünü gizleyin, fiyatı değiştirin ve baskı maliyetine girmeden saniyesinde güncelleyin.",
                icon: RefreshCw,
                colSpan: "md:col-span-1",
                bgImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
            },
            {
                title: "Markanıza Özel UI Tasarım",
                desc: "Sıkıcı siyah beyaz liste menülerini unutun. Ziyaretçilerin iştahını açacak elit mekan arayüzleri.",
                icon: Palette,
                colSpan: "md:col-span-1",
                bgImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80"
            }
        ],
        technicalGrid: [
            { title: "Dil Seçenekleri", desc: "Turizm odaklı mekanlar için menüyü anında farklı dillere çevirin.", icon: Languages },
            { title: "Hızlı Yüklenme", desc: "PDF menülerin yavaş indirme derdine son. Anında açılır.", icon: Zap },
            { title: "Sipariş Uyarıları", desc: "Mutfak veya bar noktasına düşen saniyelik bildirimler.", icon: Bell },
            { title: "Garson Destekli", desc: "Müşterinin uygulamadan sadece tıklamayla masa servisi istemesi.", icon: LayoutDashboard }
        ],
        process: [
            { step: 1, title: "Menü Aktarımı", desc: "Basılı menünüzün taranıp dijital sisteme fotoğraflı geçirilmesi." },
            { step: 2, title: "Kategori Düzeni", desc: "Çapraz satış stratejisi uygulayarak yan ürün satışlarının artırılması." },
            { step: 3, title: "Masa Kodlarının Basımı", desc: "Mekanın tasarımına uygun fiziksel QR plaketlerin teslimatı." }
        ],
        cta: {
            title: "Mekanınızı \n Dijitalleştirerek Hızlanın.",
            buttonText: "Sistemi Hemen İncele"
        }
    }
];

// Helper Icons
function ShoppingBagIcon(props: any) {
    return (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>)
}

function BuildingIcon(props: any) {
    return (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" /><path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" /></svg>)
}

function FileTextIcon(props: any) {
    return (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>)
}

function LinkIcon(props: any) {
    return (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>)
}

export default function ServiceDetailPage() {
    const params = useParams()
    const slug = params?.slug as string
    const service = servicesData.find(s => s.id === slug) || servicesData[0]

    return (
        <>
            <Header />
            <main className="bg-background min-h-screen text-foreground transition-colors duration-300">

                {/* 1. Hero Section */}
                <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-20">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={service.hero.image}
                            alt={service.hero.title}
                            fill
                            className="object-cover opacity-30 dark:opacity-40"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                        <div className={`absolute inset-0 bg-gradient-to-br ${service.hero.gradient} opacity-10 mix-blend-overlay`} />
                    </div>

                    <div className="container mx-auto px-4 relative z-10 text-center max-w-5xl">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-card/50 border border-border backdrop-blur-md mb-8 ring-1 ring-border shadow-sm">
                                <Rocket className="w-5 h-5 text-emerald-500" />
                                <span className="text-foreground font-bold uppercase tracking-widest text-xs">{service.title}</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-foreground mb-8 leading-tight tracking-tight">
                                {service.hero.title}
                            </h1>

                            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto font-light">
                                {service.hero.subtitle}
                            </p>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, y: [0, 10, 0] }}
                        transition={{ delay: 1, duration: 2, repeat: Infinity }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2"
                    >
                        <ChevronDown className="w-8 h-8 text-emerald-500/50" />
                    </motion.div>
                </section>

                {/* 2. Bento Grid */}
                {service.bentoGrid.length > 0 && (
                    <section className="py-32 bg-background relative overflow-hidden">
                        <div className="container mx-auto px-4 max-w-7xl relative z-10">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-center mb-16"
                            >
                                <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Çözüm Odaklı Yaklaşım</h2>
                                <p className="text-muted-foreground text-lg">İhtiyacınıza en uygun dijital yapıyı kuruyoruz.</p>
                            </motion.div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {service.bentoGrid.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`group relative overflow-hidden rounded-[2rem] h-[400px] border border-border bg-card shadow-sm hover:shadow-lg transition-all hover:border-emerald-500/30`}
                                    >
                                        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                                            <Image
                                                src={item.bgImage}
                                                alt={item.title}
                                                fill
                                                className="object-cover opacity-10 dark:opacity-30 group-hover:opacity-20 transition-opacity"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                                        </div>

                                        <div className="absolute inset-0 p-10 flex flex-col justify-end">
                                            <div className="w-16 h-16 rounded-2xl bg-background/80 backdrop-blur-md flex items-center justify-center mb-6 border border-border text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-sm">
                                                <item.icon className="w-8 h-8" />
                                            </div>
                                            <h3 className="text-3xl font-bold text-foreground mb-4">{item.title}</h3>
                                            <p className="text-muted-foreground text-lg leading-relaxed">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* 3. Icon Grid */}
                {service.technicalGrid.length > 0 && (
                    <section className="py-24 bg-muted/30 border-y border-border">
                        <div className="container mx-auto px-4 max-w-7xl">
                            <div className="grid md:grid-cols-3 gap-12">
                                {service.technicalGrid.map((tech, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="text-center group"
                                    >
                                        <div className="w-20 h-20 mx-auto rounded-[1.5rem] bg-card border border-border flex items-center justify-center mb-6 group-hover:border-emerald-500/50 group-hover:shadow-lg group-hover:shadow-emerald-500/10 transition-all duration-500">
                                            <tech.icon className="w-8 h-8 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground mb-3">{tech.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">{tech.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* 4. Process Timeline */}
                {service.process.length > 0 && (
                    <section className="py-32 bg-background relative">
                        <div className="container mx-auto px-4 max-w-4xl">
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="text-center mb-20"
                            >
                                <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Nasıl Çalışıyoruz?</h2>
                                <p className="text-muted-foreground">Başarıya giden şeffaf yol haritanız.</p>
                            </motion.div>

                            <div className="relative">
                                {/* Vertical Line */}
                                <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500/0 via-emerald-500/30 to-emerald-500/0" />

                                <div className="space-y-16">
                                    {service.process.map((step, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.6 }}
                                            className={`flex flex-col md:flex-row gap-8 md:gap-0 items-start md:items-center relative ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                                        >
                                            <div className={`flex-1 ${index % 2 === 0 ? 'md:pl-24 text-left' : 'md:pr-24 md:text-right'} pl-16 md:pl-0`}>
                                                <h3 className="text-2xl font-bold text-foreground mb-2">{step.title}</h3>
                                                <p className="text-muted-foreground">{step.desc}</p>
                                            </div>

                                            <div className="absolute left-[12px] md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-background border-4 border-emerald-500 shadow-sm z-10" />

                                            <div className="flex-1 hidden md:block" />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* 5. CTA */}
                <section className="py-32 relative overflow-hidden">
                    <div className="absolute inset-0 bg-emerald-500/5" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-background to-background" />

                    <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-6xl font-bold text-foreground mb-8 whitespace-pre-line"
                        >
                            {service.cta?.title || "Hayalinizdeki Projeyi \n Bugün Başlatalım."}
                        </motion.h2>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <Link href="/contact">
                                <button className="px-10 py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[1.5rem] font-bold text-xl shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto">
                                    <Rocket className="w-6 h-6" />
                                    {service.cta?.buttonText || "Hemen Teklif Al"}
                                </button>
                            </Link>
                            <p className="mt-6 text-muted-foreground text-sm">
                                * 24 saat içinde dönüş yapıyoruz. Kredi kartı gerekmez.
                            </p>
                        </motion.div>
                    </div>
                </section>

            </main>
            <ModernFooter />
        </>
    )
}
