"use client"

import { motion } from "framer-motion"

const clients = [
    {
        name: "HUAWEI",
        description: "App icons of EMUI 10, animated clock skins for P50 Pocket, design and graphics for OS"
    },
    {
        name: "designmodo",
        description: "Homepage design for a webpage and email template builder"
    },
    {
        name: "HEINEKEN",
        description: "Branding and product design for a delivery app"
    },
    {
        name: "United Nations",
        description: "Illustrations for social awareness campaigns"
    },
    {
        name: "Opera",
        description: "Animated promos, UX expertise, and graphic design support for the marketing department"
    },
    {
        name: "awwwards.",
        description: "User experience and interaction design for annual awwwards website"
    },
    {
        name: "uMake",
        description: "Branding and web design for a 3D editor"
    },
    {
        name: "LUMEN",
        description: "Web design and development for a museum website"
    },
    {
        name: "NOVA POST",
        description: "Redesign for the user interfaces and graphic content across the company's products"
    }
]

export default function ClientsSection() {
    return (
        <section className="w-full py-14 sm:py-16 md:py-20 bg-white">
            <div className="w-full px-4 md:px-8">
                {/* Header */}
                <div className="mb-10 sm:mb-12 md:mb-16">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-none tracking-tight text-black mb-2">
                        Clients
                    </h2>
                </div>

                {/* Clients Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                    {clients.map((client, index) => (
                        <motion.div
                            key={client.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            className="bg-white border border-black/10 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 hover:border-black/30 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                        >
                            {/* Logo/Name */}
                            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-black mb-2 sm:mb-3 md:mb-4 group-hover:text-black/80 transition-colors">
                                {client.name}
                            </h3>

                            {/* Description */}
                            <p className="text-xs sm:text-sm text-black/60 leading-relaxed">
                                {client.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
