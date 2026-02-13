"use client"

import { motion } from "framer-motion"
import Header from "@/components/Header"
import ModernFooter from "@/components/ModernFooter"
import Link from "next/link"
import { Award, Lightbulb, MessageSquare, TrendingUp, Instagram, Twitter, Linkedin, ExternalLink } from "lucide-react"

const stats = [
    { value: "500+", label: "Happy clients", color: "text-blue-600" },
    { value: "200+", label: "Amazing projects", color: "text-orange-600" },
    { value: "30+", label: "Team members", color: "text-yellow-500" },
    { value: "100%", label: "Client satisfaction", color: "text-blue-700" },
]

const avatars = [
    { src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix", pos: "top-[10%] left-[10%]", color: "bg-[#FF7324]" },
    { src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anya", pos: "top-[15%] right-[15%]", color: "bg-[#4D45FF]" },
    { src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jake", pos: "bottom-[20%] left-[5%]", color: "bg-[#4D45FF]" },
    { src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi", pos: "bottom-[15%] right-[10%]", color: "bg-[#FFD600]" },
]

export default function AboutPage() {
    return (
        <>
            <Header />
            <main className="bg-white min-h-screen pt-32 pb-20 overflow-hidden relative">

                {/* Floating Avatars */}
                {avatars.map((avatar, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: idx * 0.2 }}
                        className={`absolute ${avatar.pos} w-24 h-24 md:w-32 md:h-32 rounded-full ${avatar.color} p-2 hidden md:block z-0 shadow-lg`}
                    >
                        <img src={avatar.src} alt="Avatar" className="w-full h-full" />
                    </motion.div>
                ))}

                <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">

                    {/* Header Section */}
                    <div className="text-center space-y-10 max-w-4xl mx-auto py-20">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-8"
                        >
                            <h1 className="text-6xl md:text-8xl font-serif font-medium text-black leading-tight tracking-tight">
                                More <span className="relative inline-block">
                                    <span className="absolute -inset-2 bg-[#4D45FF] rounded-2xl transform -rotate-3 -z-10 shadow-xl" />
                                    <span className="relative text-white px-4">about</span>
                                </span> <br />
                                our agency
                            </h1>

                            <p className="text-xl md:text-2xl text-black/60 max-w-3xl mx-auto leading-relaxed font-medium">
                                Discover our agency's story, our dedicated team, core values, and the expertise we bring to every design project we undertake for you.
                            </p>
                        </motion.div>

                        {/* Stats Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pt-10"
                        >
                            {stats.map((stat, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="text-5xl md:text-6xl font-bold text-black tracking-tighter">
                                        {stat.value.replace('+', '')}
                                        <span className={stat.color}>+</span>
                                        {stat.value.includes('%') && <span className="text-blue-600">%</span>}
                                    </div>
                                    <div className="text-black/60 text-lg font-medium">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>

                        {/* CTA Button */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="pt-10"
                        >
                            <Link
                                href="/contact"
                                className="px-12 py-5 bg-black text-white rounded-full text-xl font-bold hover:scale-105 transition-transform shadow-xl inline-block"
                            >
                                Get in touch
                            </Link>
                        </motion.div>
                    </div>

                    {/* Skills & Software Section */}
                    <div className="py-24 space-y-16">
                        <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                            <h2 className="text-5xl md:text-7xl font-serif font-medium text-black leading-tight max-w-2xl">
                                A glimpse at the skills <br />
                                & <span className="relative inline-block mt-2">
                                    <span className="absolute -inset-3 bg-[#FF5C35] rounded-2xl transform rotate-2 shadow-lg" />
                                    <span className="relative text-white px-4">expertise</span>
                                </span> we offer
                            </h2>
                            <p className="text-lg md:text-xl text-black/60 max-w-sm leading-relaxed font-medium">
                                Explore our team's diverse design skills and the cutting-edge tech we leverage daily to bring your creative visions powerfully to life.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "Web Design",
                                    desc: "Kullanıcı deneyimi odaklı, estetik ve işlevsel web arayüzleri tasarlıyoruz.",
                                    items: ["UI/UX Tasarımı", "Responsive Tasarım", "Branding", "Prototipleme"],
                                    icon: (
                                        <div className="relative w-24 h-24 mx-auto mb-8">
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <svg viewBox="0 0 100 100" className="w-20 h-20">
                                                    <path d="M30 20 L70 20 L70 80 L30 80 Z" fill="#FFD600" className="rotate-[-10deg] origin-center" />
                                                    <path d="M40 25 L80 25 L80 85 L40 85 Z" fill="#000000" className="rotate-[10deg] origin-center" />
                                                    <circle cx="20" cy="20" r="3" fill="black" />
                                                    <path d="M80 15 L85 10 M85 20 L92 18 M75 10 L78 5" stroke="black" strokeWidth="2" strokeLinecap="round" />
                                                    <circle cx="85" cy="85" r="4" fill="black" />
                                                </svg>
                                            </div>
                                        </div>
                                    )
                                },
                                {
                                    title: "Yazılım",
                                    desc: "En güncel teknolojileri kullanarak hızlı, güvenli ve ölçeklenebilir sistemler geliştiriyoruz.",
                                    items: ["Next.js & React", "Node.js", "PostgreSQL", "API Geliştirme"],
                                    icon: (
                                        <div className="relative w-24 h-24 mx-auto mb-8">
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <svg viewBox="0 0 100 100" className="w-20 h-20">
                                                    <rect x="20" y="30" width="60" height="40" rx="4" stroke="black" strokeWidth="3" fill="none" />
                                                    <rect x="25" y="35" width="50" height="25" fill="#F3F4F6" />
                                                    <circle cx="50" cy="50" r="10" fill="#FF5C35" />
                                                    <path d="M40 70 L60 70 M50 70 L50 75" stroke="black" strokeWidth="3" strokeLinecap="round" />
                                                    <circle cx="90" cy="40" r="3" fill="black" />
                                                    <path d="M10 20 L15 25 M20 15 L25 20" stroke="black" strokeWidth="2" strokeLinecap="round" />
                                                </svg>
                                            </div>
                                        </div>
                                    )
                                },
                                {
                                    title: "SaaS",
                                    desc: "Dijital ürünlerinizi sıfırdan kuruyor, büyüme odaklı yapılar inşa ediyoruz.",
                                    items: ["Product Design", "Ölçeklenebilirlik", "Analitik Entegrasyon", "Cloud Altyapı"],
                                    icon: (
                                        <div className="relative w-24 h-24 mx-auto mb-8">
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <svg viewBox="0 0 100 100" className="w-20 h-20">
                                                    <path d="M40 30 L50 20 L60 30 L65 45 L50 60 L35 45 Z" fill="#4D45FF" />
                                                    <path d="M50 45 L65 45 L75 60 L65 75 L50 75 L35 60 L45 45 Z" fill="black" />
                                                    <circle cx="55" cy="55" r="8" fill="white" />
                                                    <path d="M15 25 L20 15 M25 30 L35 25" stroke="black" strokeWidth="2" strokeLinecap="round" />
                                                    <circle cx="85" cy="30" r="4" fill="black" />
                                                </svg>
                                            </div>
                                        </div>
                                    )
                                }
                            ].map((skill, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="border-2 border-black rounded-[2.5rem] p-12 space-y-4 hover:shadow-xl transition-all duration-500"
                                >
                                    {skill.icon}
                                    <div className="space-y-4 text-center">
                                        <h3 className="text-3xl font-bold text-black">{skill.title}</h3>
                                        <p className="text-black/60 leading-relaxed font-medium">
                                            {skill.desc}
                                        </p>
                                    </div>
                                    <div className="space-y-4 pt-6 text-center border-t border-black/5">
                                        {skill.items.map((item, i) => (
                                            <div key={i} className="text-xl font-bold text-black opacity-80">{item}</div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Core Values Section */}
                    <div className="py-24 border-t border-black/5">
                        <div className="text-center space-y-4 mb-20">
                            <h2 className="text-5xl md:text-7xl font-serif font-medium text-black leading-tight">
                                The core <span className="relative inline-block">
                                    <span className="absolute -inset-2 bg-[#FFD600] rounded-xl transform -rotate-2 -z-10 shadow-lg" />
                                    <span className="relative text-white px-4">values</span>
                                </span> <br />
                                that drive our work
                            </h2>
                            <p className="text-lg md:text-xl text-black/60 max-w-2xl mx-auto leading-relaxed font-medium">
                                Our agency is built on core values guiding every decision, project, and interaction. This foundation ensures we consistently deliver exceptional results.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                {
                                    title: "Customer first",
                                    desc: "We prioritize understanding your needs to deliver solutions that truly resonate.",
                                    icon: (
                                        <svg viewBox="0 0 100 100" className="w-24 h-24">
                                            {/* Scalloped badge circle */}
                                            <path d="M50 20 L55 22 L60 20 L64 24 L69 24 L71 29 L76 31 L75 36 L79 41 L76 46 L79 51 L76 56 L77 61 L72 64 L71 69 L66 69 L63 73 L58 71 L53 73 L48 71 L43 73 L38 71 L35 75 L30 70 L25 70 L23 65 L18 63 L19 58 L15 53 L19 48 L16 43 L20 38 L19 33 L24 30 L26 25 L31 25 L34 21 L39 23 Z" fill="none" stroke="black" strokeWidth="2.5" />
                                            {/* Inner circle */}
                                            <circle cx="50" cy="48" r="18" fill="white" stroke="black" strokeWidth="2" />
                                            {/* Star */}
                                            <path d="M50 38 L53 44 L60 44 L55 48 L57 55 L50 51 L43 55 L45 48 L40 44 L47 44 Z" fill="#FFD600" />
                                            {/* Accents */}
                                            <line x1="28" y1="35" x2="33" y2="40" stroke="black" strokeWidth="1.5" />
                                            <line x1="33" y1="35" x2="28" y2="40" stroke="black" strokeWidth="1.5" />
                                            <circle cx="75" cy="45" r="2" fill="black" />
                                            <path d="M25 45 L20 42 M20 48 L15 45" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    )
                                },
                                {
                                    title: "Creativity",
                                    desc: "Our team drives innovation to deliver unique and impactful designs.",
                                    icon: (
                                        <svg viewBox="0 0 100 100" className="w-24 h-24">
                                            {/* Gear behind */}
                                            <circle cx="70" cy="55" r="12" fill="none" stroke="black" strokeWidth="2" />
                                            <path d="M70 40 L70 43 M85 55 L82 55 M70 70 L70 67 M55 55 L58 55" stroke="black" strokeWidth="3" />
                                            {/* Lightbulb */}
                                            <path d="M50 30 C40 30 35 38 35 45 C35 52 42 55 42 62 L58 62 C58 55 65 52 65 45 C65 38 60 30 50 30" fill="#4D45FF" stroke="black" strokeWidth="2" />
                                            <rect x="44" y="62" width="12" height="4" fill="white" stroke="black" strokeWidth="2" />
                                            <path d="M46 66 L54 66 L52 70 L48 70 Z" fill="black" />
                                            {/* Accents */}
                                            <path d="M30 35 L35 40 M35 35 L30 40" stroke="black" strokeWidth="1.5" />
                                            <path d="M75 35 L80 30 M80 35 L85 30" stroke="black" strokeWidth="1.5" />
                                        </svg>
                                    )
                                },
                                {
                                    title: "Communication",
                                    desc: "We believe in clear, open communication to ensure project success and alignment.",
                                    icon: (
                                        <svg viewBox="0 0 100 100" className="w-24 h-24">
                                            {/* Black bubble */}
                                            <path d="M45 40 H75 C80 40 85 45 85 50 V65 C85 70 80 75 75 75 H55 L40 85 V75 C35 75 30 70 30 65 V50 C30 45 35 40 45 40" fill="black" />
                                            <path d="M45 55 H70 M45 65 H60" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                            {/* White bubble with check */}
                                            <path d="M25 50 H55 C60 50 65 55 65 60 V75 C65 80 60 85 55 85 H40 L25 95 V85 C20 85 15 80 15 75 V60 C15 55 20 50 25 50" fill="white" stroke="black" strokeWidth="2" />
                                            <circle cx="55" cy="75" r="10" fill="#FF5C35" stroke="black" strokeWidth="1.5" />
                                            <path d="M51 75 L54 78 L59 72" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
                                            {/* Accents */}
                                            <path d="M30 40 L35 45 M35 40 L30 45" stroke="black" strokeWidth="1.5" />
                                            <circle cx="80" cy="85" r="2" fill="black" />
                                        </svg>
                                    )
                                },
                                {
                                    title: "Growth",
                                    desc: "Continuous learning and improvement drive us to achieve greater results for clients.",
                                    icon: (
                                        <svg viewBox="0 0 100 100" className="w-24 h-24">
                                            {/* Bars */}
                                            <rect x="30" y="65" width="10" height="15" rx="2" fill="black" />
                                            <rect x="45" y="55" width="10" height="25" rx="2" fill="white" stroke="black" strokeWidth="2" />
                                            <rect x="60" y="45" width="10" height="35" rx="2" fill="#FFD600" stroke="black" strokeWidth="2" />
                                            {/* Arrow */}
                                            <path d="M30 60 L45 50 L60 40 L75 30" fill="none" stroke="black" strokeWidth="2" strokeDasharray="4 4" />
                                            <path d="M68 30 L75 30 L75 37" fill="none" stroke="black" strokeWidth="2" />
                                            {/* Accents */}
                                            <circle cx="85" cy="75" r="2" fill="black" />
                                            <path d="M75 45 L85 35 M85 45 L75 35" stroke="black" strokeWidth="1.5" />
                                            <path d="M20 75 L15 72 M20 80 L15 83" stroke="black" strokeWidth="1.5" />
                                        </svg>
                                    )
                                }
                            ].map((value, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-8 rounded-[2rem] border border-black/5 flex flex-col items-center text-center space-y-6 hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="w-32 h-32 flex items-center justify-center">
                                        {value.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-black">{value.title}</h3>
                                    <p className="text-black/60 leading-relaxed font-medium px-4">
                                        {value.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Social Media Section */}
                    <div className="py-24 border-t border-black/5">
                        <div className="flex flex-col lg:flex-row justify-between items-center gap-12 mb-20">
                            <h2 className="text-5xl md:text-7xl font-serif font-medium text-black leading-tight">
                                Follow our work <br />
                                on <span className="relative inline-block mt-2">
                                    <span className="absolute -inset-2 bg-[#FFD600] rounded-xl transform rotate-2 -z-10 shadow-lg" />
                                    <span className="relative text-black px-4">social media</span>
                                </span>
                            </h2>
                            <p className="text-lg md:text-xl text-black/60 max-w-md leading-relaxed font-medium lg:text-right">
                                Stay connected and see our latest projects, design tips, and behind-the-scenes content by following us on your favorite social platforms.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 h-[400px] md:h-[600px]">
                            {/* Visual Grid as seen in the screenshot */}
                            <div className="col-span-1 row-span-1 rounded-[2rem] overflow-hidden bg-white border border-black/5 shadow-sm relative group">
                                <img src="/portfolio/corporate.png" alt="Social 1" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                            </div>
                            <div className="col-span-1 row-span-2 rounded-[2rem] overflow-hidden bg-white border border-black/5 shadow-sm relative group">
                                <img src="/portfolio/ecommerce.png" alt="Social 2" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all" />
                            </div>
                            <div className="col-span-1 row-span-1 rounded-[2rem] overflow-hidden bg-white border border-black/5 shadow-sm relative group">
                                <img src="/portfolio/restaurant.png" alt="Social 3" className="w-full h-full object-cover group-hover:rotate-3 transition-transform duration-700" />
                            </div>
                            <div className="col-span-1 row-span-1 rounded-[2rem] overflow-hidden bg-blue-600 shadow-sm p-8 flex flex-col justify-between text-white">
                                <Instagram className="w-8 h-8" />
                                <div className="space-y-4">
                                    <div className="text-4xl font-bold">200+</div>
                                    <div className="text-sm font-medium opacity-80 uppercase tracking-wider">Posts</div>
                                </div>
                            </div>
                            <div className="col-span-1 row-span-1 rounded-[2rem] overflow-hidden bg-white border border-black/5 shadow-sm relative group">
                                <img src="/portfolio/tech-startup.png" alt="Social 4" className="w-full h-full object-cover" />
                            </div>
                            <div className="col-span-2 row-span-1 rounded-[2rem] overflow-hidden bg-black shadow-sm p-12 flex items-center justify-between group cursor-pointer">
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-bold text-white">View more</h3>
                                    <p className="text-white/40 font-medium">On our Instagram profile</p>
                                </div>
                                <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                                    <ExternalLink className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
            <ModernFooter />
        </>
    )
}
