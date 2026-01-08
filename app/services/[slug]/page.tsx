"use client"

import { useParams } from "next/navigation"
import { motion, useScroll, useSpring } from "framer-motion"
import Header from "@/components/Header"
import ModernFooter from "@/components/ModernFooter"
import ModernCTA from "@/components/ModernCTA"
import Link from "next/link"
import Image from "next/image"
import {
    Code, Search, Megaphone, QrCode, Settings, Instagram,
    ArrowRight, Check, Zap, Shield, BarChart, Users,
    Smartphone, Globe, ChevronDown, Rocket, Layers, Layout,
    AppWindow, TrendingUp, Activity, SplitSquareHorizontal, Maximize2,
    Bot, RefreshCw, Languages, Palette, LayoutDashboard, PieChart,
    Webhook, Cloud, ShieldCheck, Server, GitGraph, Database,
    BrainCircuit, Radio,
    Video, MessageCircle, Film, Camera, AlertTriangle,
    Eye, Repeat, Share2, MapPin, Image as ImageIcon, Bell, CreditCard
} from "lucide-react"

// Mock Service Data (Genişletilmiş ve Detaylandırılmış)
const servicesData = [
    {
        id: "web-cozumleri",
        title: "Web Çözümleri",
        hero: {
            title: "Dijitaldeki Yüzünüz: Modern ve Performans Odaklı Web Çözümleri",
            subtitle: "Sadece bir web sitesi değil; marka itibarınızı artıran, SEO uyumlu ve satış odaklı bir dijital ekosistem inşa ediyoruz.",
            image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&q=80", // Modern Office/Tech
            gradient: "from-blue-600 via-cyan-500 to-emerald-400"
        },
        bentoGrid: [
            {
                title: "E-Ticaret Çözümleri",
                desc: "Global pazarda (Etsy, Shopify) ve yerel mecralarda satışlarınızı artıran, yüksek performanslı e-ticaret altyapıları.",
                icon: ShoppingBagIcon,
                colSpan: "md:col-span-2",
                bgImage: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?w=800&q=80"
            },
            {
                title: "Kurumsal Portfolyo",
                desc: "Markanızın prestijini yansıtan, modern ve özgün tasarımlı kurumsal web kimliği.",
                icon: BuildingIcon,
                colSpan: "md:col-span-1",
                bgImage: "https://images.unsplash.com/photo-1481487484168-9b930d5b7d9f?w=800&q=80"
            }
        ],
        technicalGrid: [
            {
                title: "Hız ve Performans",
                desc: "Next.js ve Vercel altyapısıyla 100/100 Lighthouse skorlu web siteleri.",
                icon: Zap
            },
            {
                title: "Mobil Uyumluluk",
                desc: "Tüm cihazlarda (Desktop, Tablet, Mobile) kusursuz kullanıcı deneyimi.",
                icon: Smartphone
            },
            {
                title: "SEO Dostu Mimari",
                desc: "Google botlarının sevdiği, semantik HTML ve hızlı indekslenen yapılar.",
                icon: Search
            },
            {
                title: "PWA Teknolojisi",
                desc: "Uygulama indirmeden mobil uygulama deneyimi sunan ilerici web teknolojileri.",
                icon: Smartphone
            },
            {
                title: "Güçlü Hosting",
                desc: "Kesintisiz ve güvenli barındırma hizmetiyle siteniz her zaman yayında.",
                icon: Server
            }
        ],
        process: [
            { step: 1, title: "Keşif ve Analiz", desc: "İşletme ihtiyaçlarını ve hedef kitleyi derinlemesine analiz ediyoruz." },
            { step: 2, title: "UI/UX Tasarım", desc: "Kullanıcı deneyimini ön planda tutan, modern arayüzler tasarlıyoruz." },
            { step: 3, title: "Geliştirme", desc: "En güncel teknolojilerle (Next.js, Tailwind) kodlama sürecini başlatıyoruz." },
            { step: 4, title: "Test ve Yayın", desc: "Performans, güvenlik ve uyumluluk testlerinden sonra yayına alıyoruz." }
        ],
        cta: {
            title: "Hayalinizdeki Web Sitesini \n Bugün Başlatalım.",
            buttonText: "Ücretsiz Analiz İstiyorum"
        }
    },
    {
        id: "dijital-reklam",
        title: "Dijital Reklam",
        hero: {
            title: "Bütçenizi Gidere Değil, Ölçülebilir Bir Yatırıma Dönüştürün",
            subtitle: "Meta ve Google mecralarında, e-ticaret odaklı satış stratejilerinden kurumsal marka bilinirliğine kadar her kuruşun hesabını veren profesyonel reklam yönetimi.",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80", // Data Dashboard
            gradient: "from-orange-600 via-red-500 to-pink-500"
        },
        bentoGrid: [
            {
                title: "Meta (Facebook & Instagram) Ads",
                desc: "Görsel gücün ve hedeflemenin zirvesi. Potansiyel müşterilerinize tam da ilgi duydukları anda ulaşıyoruz.",
                icon: AppWindow, // Instagram/FB UI metaphor
                colSpan: "md:col-span-1",
                bgImage: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80"
            },
            {
                title: "Google Ads (Arama & Alışveriş)",
                desc: "Satın alma niyeti en yüksek kullanıcıları yakalıyoruz. Google Shopping ve Arama ağıyla satışlarınızı katlıyoruz.",
                icon: Search, // Google Search metaphor
                colSpan: "md:col-span-1",
                bgImage: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80"
            }
        ],
        technicalGrid: [
            {
                title: "E-Ticaret Odaklılık",
                desc: "ROAS ve CPA odaklı yönetimle reklam harcamalarınızın kârlılığını maksimize ediyoruz.",
                icon: TrendingUp
            },
            {
                title: "Veri ve İzleme",
                desc: "Meta Pixel, Conversion API ve Google Analytics 4 kurulumlarıyla her adımı takip ediyoruz.",
                icon: Activity
            },
            {
                title: "A/B Testleri",
                desc: "Sürekli kreatif ve metin testleri yaparak en iyi performans gösteren reklamı buluyoruz.",
                icon: SplitSquareHorizontal
            },
            {
                title: "Ölçekleme (Scaling)",
                desc: "Başarılı kampanyaları bütçe ve hedef kitle bazında güvenle büyüterek işletmenizi ölçekliyoruz.",
                icon: Maximize2
            },
            {
                title: "Retargeting",
                desc: "Sitenizi ziyaret edip almadan çıkanları nokta atışı reklamlarla geri kazanıyoruz.",
                icon: Repeat
            },
            {
                title: "360° Strateji",
                desc: "Tüm mecraları (TikTok, YouTube, Pinterest) entegre kullanan bütüncül kurgu.",
                icon: Share2
            }
        ],
        process: [
            { step: 1, title: "Analiz", desc: "Sektör ve rakip analizi." },
            { step: 2, title: "Kurulum", desc: "Teknik altyapı ve kampanya kurgusu." },
            { step: 3, title: "Optimizasyon", desc: "Veri toplama ve iyileştirme." },
            { step: 4, title: "Raporlama", desc: "Şeffaf ve anlaşılır sonuç paylaşımı." }
        ],
        cta: {
            title: "Reklam Hesaplarınızın \n Ücretsiz Röntgenini Çekelim.",
            buttonText: "Ücretsiz Hesap Analizi Al"
        }
    },
    {
        id: "sosyal-medya-yonetimi",
        title: "Sosyal Medya Yönetimi",
        hero: {
            title: "Markanızın Sesi, Milyonların Yankısı Olsun",
            subtitle: "Sıradan paylaşımlar değil, etkileşim rekorları kıran stratejiler. İçerik üretiminden topluluk yönetimine, markanızı sosyal medyanın yıldızı yapıyoruz.",
            image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=1200&q=80", // iPhone recording
            gradient: "from-pink-600 via-rose-500 to-orange-400"
        },
        bentoGrid: [
            {
                title: "Kreatif İçerik Üretimi",
                desc: "Reels, TikTok ve Story formatlarında, izleyiciyi ilk 3 saniyede yakalayan, algoritma dostu video ve görsel içerikler.",
                icon: Video,
                colSpan: "md:col-span-1",
                bgImage: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80"
            },
            {
                title: "Influencer Pazarlama",
                desc: "Markanızla en uyumlu fenomenleri buluyor, yüksek dönüşümlü ve güven odaklı işbirlikleri kurguluyoruz.",
                icon: Users,
                colSpan: "md:col-span-1",
                bgImage: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=800&q=80"
            },
            {
                title: "Topluluk Yönetimi",
                desc: "Takipçilerinizle DM ve yorumlarda kurduğumuz samimi iletişimle sadık bir müşteri kitlesi yaratıyoruz.",
                icon: MessageCircle,
                colSpan: "md:col-span-1",
                bgImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80"
            },
            {
                title: "Viral Stratejiler",
                desc: "Gündemi ve trendleri anlık takip ederek markanızı konuşulanlar arasına sokacak 'Real-Time Marketing' çalışmaları.",
                icon: TrendingUp,
                colSpan: "md:col-span-1",
                bgImage: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80"
            }
        ],
        technicalGrid: [
            {
                title: "Video Prodüksiyon",
                desc: "Profesyonel ekipmanlarla çekilen, kurgusu ve efektleriyle büyüleyen tanıtım filmleri.",
                icon: Film
            },
            {
                title: "Profesyonel Çekim",
                desc: "Ürün ve mekan çekimleriyle markanızın görsel kalitesini ve algısını zirveye taşıyoruz.",
                icon: Camera
            },
            {
                title: "Kriz Yönetimi",
                desc: "Olası linç veya negatif durumlarda markanızı koruyan, soğukkanlı ve profesyonel iletişim yönetimi.",
                icon: AlertTriangle
            },
            {
                title: "İleri Seviye Analitik",
                desc: "Hangi içeriğin neden tuttuğunu analiz eden, veriye dayalı büyüme raporları.",
                icon: BarChart
            },
            {
                title: "Canlı Yayın Yönetimi",
                desc: "Etkinlik ve lansmanlarınız için profesyonel reji ve canlı yayın kurgusu.",
                icon: Radio
            },
            {
                title: "Rakip Analizi",
                desc: "Rakiplerinizin stratejilerini deşifre edip sizi bir adım öne taşıyan raporlar.",
                icon: Eye
            }
        ],
        process: [
            { step: 1, title: "Persona & Strateji", desc: "Hedef kitlenizi tanıyor ve onlara hitap eden marka dilini oluşturuyoruz." },
            { step: 2, title: "İçerik Takvimi", desc: "Bir aylık paylaşımları önceden planlayarak tutarlı bir akış sağlıyoruz." },
            { step: 3, title: "Prodüksiyon", desc: "Senaryo, çekim ve kurgu aşamalarıyla içerikleri hayata geçiriyoruz." },
            { step: 4, title: "Yayılım & Etkileşim", desc: "Doğru saatte paylaşım ve aktif etkileşimle erişimi maksimize ediyoruz." }
        ],
        cta: {
            title: "Markanız Sosyal Medyada \n Konuşulmaya Başlasın.",
            buttonText: "Sosyal Medya Analizi Al"
        }
    },
    {
        id: "seo-optimizasyonu",
        title: "SEO Optimizasyonu",
        hero: {
            title: "Arama Motorlarında Zirveye Çıkın, Trafiğinizi Katlayın",
            subtitle: "Google algoritmalarına tam uyumlu, teknik altyapısı sağlam ve içerik stratejisiyle fark yaratan profesyonel SEO hizmeti.",
            image: "https://images.unsplash.com/photo-1572410979265-56253e2b9f4a?w=1200&q=80",
            gradient: "from-indigo-600 via-purple-500 to-pink-500"
        },
        bentoGrid: [
            {
                title: "Teknik SEO",
                desc: "Site hızı, mobil uyumluluk ve tarama hatalarını düzelterek sağlam bir temel atıyoruz.",
                icon: Settings,
                colSpan: "md:col-span-1",
                bgImage: "https://images.unsplash.com/photo-1504868584819-f8e8b716656f?w=800&q=80"
            },
            {
                title: "İçerik Stratejisi",
                desc: "Kullanıcı niyetini yakalayan, özgün ve katma değerli içeriklerle otoritenizi artırıyoruz.",
                icon: FileTextIcon,
                colSpan: "md:col-span-1",
                bgImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80"
            },
            {
                title: "Backlink Otoritesi",
                desc: "Kaliteli ve güvenilir kaynaklardan alınan referanslarla site puanınızı yükseltiyoruz.",
                icon: LinkIcon,
                colSpan: "md:col-span-2",
                bgImage: "https://images.unsplash.com/photo-1524178232363-1fb2b075b955?w=800&q=80"
            }
        ],
        technicalGrid: [
            {
                title: "Site Hızı (Core Web Vitals)",
                desc: "Google'ın en önem verdiği metriklerde yeşil ışığı yakıyoruz.",
                icon: Zap
            },
            {
                title: "Mobil Öncelikli İndeksleme",
                desc: "Mobil uyumluluk sorunlarını gidererek sıralama kaybını önlüyoruz.",
                icon: Smartphone
            },
            {
                title: "Schema Yapılandırması",
                desc: "Arama sonuçlarında zengin snippet'lerle (yıldız, fiyat vb.) dikkat çekin.",
                icon: Code
            },
            {
                title: "Kapsamlı Rakip Analizi",
                desc: "Rakiplerinizin trafik kaynaklarını ve iyi yaptıkları işleri analiz ediyoruz.",
                icon: BarChart
            },
            {
                title: "Yerel (Local) SEO",
                desc: "Haritalarda ve bölgesel aramalarda işletmenizi zirveye taşıyoruz.",
                icon: MapPin
            },
            {
                title: "Görsel SEO",
                desc: "Görsel aramalarda ve YouTube'da görünürlüğünüzü artıracak optimizasyonlar.",
                icon: ImageIcon
            }
        ],
        process: [
            { step: 1, title: "Audit (Denetim)", desc: "Mevcut durumunuzu ve potansiyel hataları raporluyoruz." },
            { step: 2, title: "Anahtar Kelime", desc: "Sektörünüzde en çok aranan ve dönüşüm getiren kelimeleri belirliyoruz." },
            { step: 3, title: "On-Page Optimizasyon", desc: "Başlıklar, meta açıklamalar ve içerik düzenlemelerini yapıyoruz." },
            { step: 4, title: "Off-Page Çalışma", desc: "Tanıtım yazıları ve sosyal sinyallerle dışarıdan güçlendiriyoruz." }
        ],
        cta: {
            title: "Google'da 1. Sayfaya \n Çıkmaya Hazır mısınız?",
            buttonText: "Ücretsiz SEO Analizi"
        }
    },
    {
        id: "qr-menu-sistemleri",
        title: "QR Menü Sistemleri",
        hero: {
            title: "Restoran ve Oteller İçin Yeni Nesil Dijital Deneyim: AI Destekli QR Menü",
            subtitle: "Basılı menülerin maliyetinden ve hantallığından kurtulun. Yapay zeka destekli, her dile anında çevrilen ve markanıza özel tasarlanan interaktif menü çözümlerimizle tanışın.",
            image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80",
            gradient: "from-emerald-600 via-teal-500 to-cyan-400"
        },
        bentoGrid: [
            {
                title: "Yapay Zeka (AI) Desteği",
                desc: "Müşterilerin tercihlerine göre akıllı ürün önerileri sunan ve sipariş sürecini hızlandıran AI entegrasyonu.",
                icon: Bot,
                colSpan: "md:col-span-1",
                bgImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80"
            },
            {
                title: "Anında Güncelleme",
                desc: "Fiyatları ve ürünleri saniyeler içinde güncelleyin; baskı maliyetlerini ve zaman kaybını sıfıra indirin.",
                icon: RefreshCw,
                colSpan: "md:col-span-1",
                bgImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
            },
            {
                title: "Çoklu Dil Desteği",
                desc: "Turistler için otomatik dil çevirisi özelliğiyle sınırları ortadan kaldırın ve müşteri memnuniyetini artırın.",
                icon: Languages,
                colSpan: "md:col-span-1",
                bgImage: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=80"
            },
            {
                title: "Özel Tasarım",
                desc: "Hazır şablonlar değil, restoranınızın veya otelinizin kurumsal kimliğine %100 uyumlu, premium arayüz tasarımı.",
                icon: Palette,
                colSpan: "md:col-span-1",
                bgImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80"
            }
        ],
        technicalGrid: [
            {
                title: "Yüksek Hız",
                desc: "En zayıf internette bile saniyeler içinde açılan optimize edilmiş altyapı.",
                icon: Zap
            },
            {
                title: "Yönetim Paneli",
                desc: "İşletme sahipleri için ürün ve stok yönetimini kolaylaştıran basit arayüz.",
                icon: LayoutDashboard
            },
            {
                title: "Analiz ve Raporlama",
                desc: "Hangi ürünün ne kadar görüntülendiğini takip eden veri analitiği.",
                icon: PieChart
            },
            {
                title: "Garson Çağırma",
                desc: "Tek tıkla garson çağırma ve hesap isteme özelliği.",
                icon: Bell
            },
            {
                title: "Online Ödeme",
                desc: "Masadan kalkmadan güvenli ve hızlı ödeme altyapısı.",
                icon: CreditCard
            },
            {
                title: "CRM Entegrasyonu",
                desc: "Müşteri verilerini toplayıp sadakat programları oluşturun.",
                icon: Users
            }
        ],
        process: [
            { step: 1, title: "Tarama", desc: "Müşteri masadaki QR kodu telefon kamerasıyla saniyeler içinde tarar." },
            { step: 2, title: "Keşif", desc: "AI destekli, kategorize edilmiş menüyü iştah açıcı görsellerle inceler." },
            { step: 3, title: "Etkileşim", desc: "Garson çağırma veya hızlı sipariş özelliklerini kullanarak servisi başlatır." }
        ],
        cta: {
            title: "İşletmenizi Dijital Çağa \n Taşımaya Hazır mısınız?",
            buttonText: "Canlı Demoyu İncele"
        }
    },
    {
        id: "ozel-yazilim",
        title: "Özel Yazılım",
        hero: {
            title: "Standart Çözümler Sizi Sınırlandırmasın: Sınırsız Özelleştirme",
            subtitle: "İşletmenizin benzersiz ihtiyaçlarına, hazır paketlerin yetmediği yerde kodun gücüyle cevap veriyoruz. Ölçeklenebilir, güvenli ve size özel yazılım mimarileri.",
            image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80",
            gradient: "from-yellow-600 via-amber-500 to-orange-500"
        },
        bentoGrid: [
            {
                title: "Full-Stack Mimari",
                desc: "Frontend'den Backend'e, veritabanından kullanıcı arayüzüne kadar bütüncül bir yaklaşımla sisteminizi inşa ediyoruz.",
                icon: Layers,
                colSpan: "md:col-span-1",
                bgImage: "https://images.unsplash.com/photo-1629904853716-6c29f46b4202?w=800&q=80"
            },
            {
                title: "API & Entegrasyon",
                desc: "Mevcut sistemlerinizle (CRM, ERP, Ödeme Sistemleri) kusursuz haberleşen entegrasyonlar geliştiriyoruz.",
                icon: Webhook,
                colSpan: "md:col-span-1",
                bgImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80"
            },
            {
                title: "Bulut (Cloud) Altyapı",
                desc: "AWS, Azure veya Google Cloud üzerinde, milyonlarca kullanıcıyı kaldırabilecek ölçeklenebilir sunucu yapıları.",
                icon: Cloud,
                colSpan: "md:col-span-1",
                bgImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80"
            },
            {
                title: "Kurumsal Güvenlik",
                desc: "Verilerinizi en güncel şifreleme standartlarıyla koruyor, sızma testleriyle (Pentest) sisteminizi güçlendiriyoruz.",
                icon: ShieldCheck,
                colSpan: "md:col-span-1",
                bgImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80"
            }
        ],
        technicalGrid: [
            {
                title: "Mikroservisler",
                desc: "Karmaşık sistemleri yönetilebilir küçük parçalara bölerek geliştiren modern mimari.",
                icon: Server
            },
            {
                title: "DevOps Süreçleri",
                desc: "CI/CD hatlarıyla otomatik test ve hızlı yayınlama (deployment) süreçleri.",
                icon: GitGraph
            },
            {
                title: "Yüksek Performans",
                desc: "Milisaniyelerle yarışan, optimize edilmiş kod yapıları ve veritabanı sorguları.",
                icon: Zap
            },
            {
                title: "Veri Tabanı Yönetimi",
                desc: "SQL ve NoSQL veritabanlarıyla büyük veriyi (Big Data) anlamlı ve hızlı işleme.",
                icon: Database
            },
            {
                title: "Yapay Zeka (AI) Entegrasyonu",
                desc: "GPT, Claude gibi LLM modellerini veya özel ML algoritmalarını süreçlerinize entegre ediyoruz.",
                icon: BrainCircuit
            },
            {
                title: "Gerçek Zamanlı Sistemler",
                desc: "WebSocket teknolojisiyle anlık veri akışı sağlayan, canlı ve dinamik uygulamalar.",
                icon: Radio
            }
        ],
        process: [
            { step: 1, title: "Mimari Tasarım", desc: "Projenin teknik iskeletini ve veritabanı şemasını kurguluyoruz." },
            { step: 2, title: "Kodlama", desc: "Agile metodolojisiyle, sprintler halinde kodlama sürecini yürütüyoruz." },
            { step: 3, title: "Test & QA", desc: "Birim testleri ve kullanıcı testleriyle hatasız bir ürün ortaya çıkarıyoruz." },
            { step: 4, title: "Deployment", desc: "Sistemi canlı sunuculara taşıyor ve 7/24 izlemeye (monitoring) alıyoruz." }
        ],
        cta: {
            title: "Fikriniz Profesyonel Bir \n Yazılıma Dönüşsün.",
            buttonText: "Projenizi Kodlayalım"
        }
    }
];

// Helper Icons
function ShoppingBagIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
    )
}

function BuildingIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" /><path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" /></svg>
    )
}

function FileTextIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>
    )
}

function LinkIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
    )
}

function FileCheckIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="m9 15 2 2 4-4" /></svg>
    )
}

function ShoppingCartIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
    )
}

export default function ServiceDetailPage() {
    const params = useParams()
    const slug = params?.slug as string

    // Varsayılan olarak web-cozumleri veya slug ile eşleşen servis
    const service = servicesData.find(s => s.id === slug) || servicesData[0]

    return (
        <>
            <Header />
            <main className="bg-slate-950 min-h-screen text-slate-200">

                {/* 1. Hero Section (Giriş) */}
                <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-20">
                    {/* Background Image & Overlay */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={service.hero.image}
                            alt={service.hero.title}
                            fill
                            className="object-cover opacity-40"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
                        <div className={`absolute inset-0 bg-gradient-to-br ${service.hero.gradient} opacity-10 mix-blend-overlay`} />
                    </div>

                    <div className="container mx-auto px-4 relative z-10 text-center max-w-5xl">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 ring-1 ring-white/20`}>
                                <Rocket className="w-5 h-5 text-emerald-400" />
                                <span className="text-white font-bold uppercase tracking-widest text-xs">{service.title}</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-tight tracking-tight">
                                {service.hero.title}
                            </h1>

                            <p className="text-xl md:text-2xl text-slate-300 leading-relaxed max-w-3xl mx-auto font-light">
                                {service.hero.subtitle}
                            </p>
                        </motion.div>
                    </div>

                    {/* Scroll Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, y: [0, 10, 0] }}
                        transition={{ delay: 1, duration: 2, repeat: Infinity }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2"
                    >
                        <ChevronDown className="w-8 h-8 text-emerald-500/50" />
                    </motion.div>
                </section>

                {/* 2. Çözüm Odaklı Yaklaşım (Bento Grid) */}
                {service.bentoGrid.length > 0 && (
                    <section className="py-32 bg-slate-950 relative overflow-hidden">
                        <div className="container mx-auto px-4 max-w-7xl relative z-10">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-center mb-16"
                            >
                                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Çözüm Odaklı Yaklaşım</h2>
                                <p className="text-slate-400 text-lg">İhtiyacınıza en uygun dijital yapıyı kuruyoruz.</p>
                            </motion.div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {service.bentoGrid.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`group relative overflow-hidden rounded-3xl h-[400px] border border-slate-800 bg-slate-900`}
                                    >
                                        {/* Background Image */}
                                        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                                            <Image
                                                src={item.bgImage}
                                                alt={item.title}
                                                fill
                                                className="object-cover opacity-40"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                                        </div>

                                        <div className="absolute inset-0 p-10 flex flex-col justify-end">
                                            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-6 border border-white/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                                                <item.icon className="w-8 h-8" />
                                            </div>
                                            <h3 className="text-3xl font-bold text-white mb-4">{item.title}</h3>
                                            <p className="text-slate-300 text-lg leading-relaxed">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* 3. Teknik Üstünlükler (Icon Grid) */}
                {service.technicalGrid.length > 0 && (
                    <section className="py-24 bg-slate-900/50 border-y border-slate-800/50">
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
                                        <div className="w-20 h-20 mx-auto rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 group-hover:border-emerald-500/50 group-hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)] transition-all duration-500">
                                            <tech.icon className="w-8 h-8 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-3">{tech.title}</h3>
                                        <p className="text-slate-400 leading-relaxed max-w-sm mx-auto">{tech.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* 4. İş Sürecimiz (Vertical Timeline) */}
                {service.process.length > 0 && (
                    <section className="py-32 bg-slate-950 relative">
                        <div className="container mx-auto px-4 max-w-4xl">
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="text-center mb-20"
                            >
                                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Nasıl Çalışıyoruz?</h2>
                                <p className="text-slate-400">Başarıya giden şeffaf yol haritanız.</p>
                            </motion.div>

                            <div className="relative">
                                {/* Vertical Line */}
                                <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500/0 via-emerald-500/50 to-emerald-500/0" />

                                <div className="space-y-16">
                                    {service.process.map((step, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }} // Animasyonun sadece bir kez çalışmasını sağlar
                                            transition={{ duration: 0.6 }} // Süreyi biraz daha uzattık
                                            className={`flex flex-col md:flex-row gap-8 md:gap-0 items-start md:items-center relative ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                                        >

                                            {/* Content */}
                                            <div className={`flex-1 ${index % 2 === 0 ? 'md:pl-16 text-left' : 'md:pr-16 md:text-right'} pl-16 md:pl-0`}>
                                                <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                                                <p className="text-slate-400">{step.desc}</p>
                                            </div>

                                            {/* Center Point */}
                                            <div className="absolute left-[12px] md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-slate-950 border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] z-10" />

                                            {/* Spacer for alignment */}
                                            <div className="flex-1 hidden md:block" />

                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* 5. Çağrı Merkezi (Final CTA) */}
                <section className="py-32 relative overflow-hidden">
                    <div className="absolute inset-0 bg-emerald-900/10" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-slate-950 to-slate-950" />

                    <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-6xl font-bold text-white mb-8 whitespace-pre-line"
                        >
                            {service.cta?.title || "Hayalinizdeki Projeyi \n Bugün Başlatalım."}
                        </motion.h2>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <Link href="/#contact">
                                <button className="px-10 py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto">
                                    <Rocket className="w-6 h-6" />
                                    {service.cta?.buttonText || "Hemen Teklif Al"}
                                </button>
                            </Link>
                            <p className="mt-6 text-slate-500 text-sm">
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
