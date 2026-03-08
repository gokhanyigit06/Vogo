"use client"

import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"

export default function ModernFooter() {
    const t = useTranslations("ModernFooter")
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-black text-white selection:bg-white selection:text-black pt-16 lg:pt-20 pb-8 overflow-hidden">
            <div className="container mx-auto px-4 md:px-8 max-w-[1500px]">

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-12 lg:mb-16">

                    {/* Left Column: Giant Typography & Subtext */}
                    <div className="lg:col-span-7 flex flex-col justify-between">
                        <h2 className="text-[4rem] sm:text-[6rem] md:text-[7.5rem] lg:text-[9rem] leading-[0.85] font-bold tracking-tighter uppercase mb-12 lg:mb-0">
                            VOGO<br />
                            LAB.
                        </h2>

                        <div className="mt-8 lg:mt-12">
                            <p className="max-w-sm text-sm md:text-base font-medium text-white/80 leading-relaxed">
                                {t("tagline")}<br />
                                {t("subtext")}
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Links */}
                    <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-8 lg:pt-[1rem]">

                        {/* Company Links */}
                        <div className="flex flex-col gap-3 lg:gap-4">
                            <h3 className="text-white/40 text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-2">{t("company")}</h3>
                            <Link href="/about" className="text-base md:text-lg font-medium tracking-tight text-white/90 hover:text-white transition-colors relative group w-fit">
                                {t("about")}
                                <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                            <Link href="/portfolio" className="text-base md:text-lg font-medium tracking-tight text-white/90 hover:text-white transition-colors relative group w-fit">
                                {t("portfolio")}
                                <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                            <Link href="/contact" className="text-base md:text-lg font-medium tracking-tight text-white/90 hover:text-white transition-colors relative group w-fit">
                                {t("contact")}
                                <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        </div>

                        {/* Services Links */}
                        <div className="flex flex-col gap-3 lg:gap-4">
                            <h3 className="text-white/40 text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-2">{t("services")}</h3>
                            <Link href="/services" className="text-base md:text-lg font-medium tracking-tight text-white/90 hover:text-white transition-colors relative group w-fit">
                                Headless CMS
                                <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                            <Link href="/services" className="text-base md:text-lg font-medium tracking-tight text-white/90 hover:text-white transition-colors relative group w-fit">
                                Headless eCommerce
                                <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                            <Link href="/services" className="text-base md:text-lg font-medium tracking-tight text-white/90 hover:text-white transition-colors relative group w-fit">
                                Next.JS
                                <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        </div>

                    </div>
                </div>

                {/* Bottom Row: Copyright + Socials */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end pt-8 border-t border-white/10">

                    {/* Left Bottom */}
                    <div className="lg:col-span-7 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 text-white/40 text-[10px] md:text-xs font-medium">
                        <p>© {currentYear} VOGOLAB</p>
                        <p className="hidden sm:block">•</p>
                        <p>{t("locations")}</p>
                    </div>

                    {/* Right Bottom: Socials (X, LI, etc) */}
                    <div className="lg:col-span-5 flex items-center justify-start lg:justify-start gap-2">
                        <a href="#" aria-label="X / Twitter" className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/20 flex items-center justify-center text-[9px] md:text-[10px] font-bold tracking-widest hover:bg-white hover:text-black transition-colors duration-300">
                            X
                        </a>
                        <a href="#" aria-label="LinkedIn" className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/20 flex items-center justify-center text-[9px] md:text-[10px] font-bold tracking-widest hover:bg-white hover:text-black transition-colors duration-300">
                            LI
                        </a>
                        <a href="#" aria-label="Instagram" className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/20 flex items-center justify-center text-[9px] md:text-[10px] font-bold tracking-widest hover:bg-white hover:text-black transition-colors duration-300">
                            IN
                        </a>
                    </div>

                </div>

            </div>
        </footer>
    )
}
