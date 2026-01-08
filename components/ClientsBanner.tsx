"use client"

import { motion } from "framer-motion"

const clients = [
    { name: "Paladora", logo: "https://via.placeholder.com/120x40/1a1a1a/666666?text=Paladora" },
    { name: "WeiboTV", logo: "https://via.placeholder.com/120x40/1a1a1a/666666?text=WeiboTV" },
    { name: "Homne", logo: "https://via.placeholder.com/120x40/1a1a1a/666666?text=Homne" },
    { name: "HuranTV", logo: "https://via.placeholder.com/120x40/1a1a1a/666666?text=HuranTV" },
    { name: "Matsuri", logo: "https://via.placeholder.com/120x40/1a1a1a/666666?text=Matsuri" },
    { name: "Radical", logo: "https://via.placeholder.com/120x40/1a1a1a/666666?text=Radical" },
]

export default function ClientsBanner() {
    return (
        <section className="py-12 bg-slate-950 border-y border-slate-800">
            <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center text-slate-400 text-sm mb-8"
                >
                    More than 1 million people across 200+ companies choose Vogo Agency
                </motion.p>

                {/* Clients Grid */}
                <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap">
                    {clients.map((client, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex items-center gap-3 group cursor-pointer"
                        >
                            {/* Logo Icon/Circle */}
                            <div className="w-10 h-10 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center group-hover:border-emerald-500/50 transition-colors">
                                <span className="text-slate-500 text-xs font-bold group-hover:text-emerald-400 transition-colors">
                                    {client.name.substring(0, 2)}
                                </span>
                            </div>

                            {/* Company Name */}
                            <span className="text-slate-400 font-medium text-sm group-hover:text-slate-300 transition-colors">
                                {client.name}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
