"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"

export default function HeroModern() {
    const t = useTranslations("HeroModern")

    return (
        <section className="relative min-h-screen flex text-black items-center bg-[#F4F4F4] pt-24 pb-12 selection:bg-black selection:text-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-8 max-w-[1500px] w-full mt-10 md:mt-0 lg:mt-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center h-full">

                    {/* Left Side: Typography */}
                    <div className="lg:col-span-7 flex flex-col justify-center relative z-10 w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="flex items-center gap-4 mb-8 md:mb-12 lg:pl-2"
                        >
                            <p className="text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase text-black/60">
                                {t('subtitle')}
                            </p>
                        </motion.div>

                        <div className="flex flex-col space-y-[-0.1em] md:space-y-[-0.12em]">
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <h1 className="text-[3.5rem] sm:text-[5rem] md:text-[5.5rem] lg:text-[6.5rem] xl:text-[8rem] 2xl:text-[9rem] leading-[0.85] tracking-[-0.04em] font-medium text-black">
                                    {t('titleLine1')}
                                </h1>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <h1 className="text-[3.5rem] sm:text-[5rem] md:text-[5.5rem] lg:text-[6.5rem] xl:text-[8rem] 2xl:text-[9rem] leading-[0.85] tracking-[-0.04em] font-medium text-black">
                                    {t('titleLine2')}
                                </h1>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <h1 className="text-[3.5rem] sm:text-[5rem] md:text-[5.5rem] lg:text-[6.5rem] xl:text-[8rem] 2xl:text-[9rem] leading-[0.85] tracking-[-0.04em] font-medium text-black">
                                    {t('titleLine3')}
                                </h1>
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.6 }}
                            className="mt-12 sm:mt-16 lg:mt-24 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-12 lg:pl-2"
                        >
                            <p className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-black/80">
                                {t('practiceText')}
                            </p>
                            <div className="flex items-center gap-6 md:gap-10 text-black">
                                {/* Mock Logos representing awards */}
                                <div className="flex flex-col items-center">
                                    <div className="text-xl md:text-2xl font-black leading-none tracking-tighter">W.</div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-5 h-5 md:w-6 md:h-6 bg-black rounded-full flex items-center justify-center">
                                        <span className="text-white text-[10px] md:text-xs font-bold">A</span>
                                    </div>
                                    <div className="font-bold text-sm md:text-base tracking-tighter uppercase">Awwwards</div>
                                </div>
                                <div className="font-bold text-lg md:text-xl uppercase tracking-tighter">FWA</div>
                                <div className="hidden sm:block">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-15v6h6v2h-8V7h2z" />
                                    </svg>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Side: Visual */}
                    <div className="lg:col-span-5 relative mt-12 lg:mt-0 w-full flex justify-center lg:justify-end xl:pl-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="relative w-full aspect-square max-w-[700px] xl:max-w-[850px] 2xl:max-w-[950px] rounded-3xl md:rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.2)] bg-gradient-to-br from-[#D7CCF5] to-[#B6A6EB]"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop"
                                alt="Showreel preview graphic"
                                className="w-full h-full object-cover mix-blend-multiply opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-1000 ease-out"
                            />

                            {/* Play button circular sticker */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 bg-[#F4F4F4]/95 backdrop-blur-md rounded-full flex items-center justify-center text-black shadow-[0_8px_32px_rgba(0,0,0,0.12)] group-hover:scale-105 transition-all duration-500 z-10 cursor-pointer hover:bg-white">
                                <div className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center translate-x-1 text-black">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                                <svg className="absolute w-full h-full animate-[spin_12s_linear_infinite]" viewBox="0 0 100 100">
                                    <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
                                    <text fontSize="10.5" className="uppercase font-[700] tracking-[0.2em] text-black">
                                        <textPath href="#circlePath" startOffset="0%">Play Showreel • Play Showreel •</textPath>
                                    </text>
                                </svg>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>

        </section>
    )
}
