"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Quote, Star, Building2 } from "lucide-react"

// Types
interface Client {
    id: number
    name: string
    company?: string
    logo_url?: string
    status: string
    order?: number
}

interface Testimonial {
    id: number
    author: string
    role?: string
    company?: string
    content: string
    avatarUrl?: string
    rating: number
}

export default function References() {
    const [clients, setClients] = useState<Client[]>([])
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Clients and Testimonials in parallel
                const [clientsRes, testimonialsRes] = await Promise.all([
                    fetch('/api/clients'),
                    fetch('/api/testimonials')
                ])

                const clientsData = await clientsRes.json()
                const testimonialsData = await testimonialsRes.json()

                if (Array.isArray(clientsData)) {
                    // Filter active clients and sort by order
                    const activeClients = clientsData
                        .filter((c: Client) => c.status === 'active')
                        .sort((a, b) => (a.order || 0) - (b.order || 0))

                    setClients(activeClients)
                }

                if (Array.isArray(testimonialsData)) {
                    setTestimonials(testimonialsData)
                }

            } catch (error) {
                console.error("Error loading references data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    return (
        <section className="py-24 md:py-32 bg-background relative overflow-hidden transition-colors duration-300" id="references">
            {/* Background Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-3xl mx-auto mb-20"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        <span className="text-foreground">Bize Güvenen </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                            Markalar
                        </span>
                    </h2>
                    <p className="text-xl text-muted-foreground">
                        Sektör liderleri ile çalışarak başarı hikayeleri yazıyoruz.
                    </p>
                </motion.div>

                {/* Clients Grid - Dynamic Data */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-24">
                    {loading ? (
                        // Loading Skeletons
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="h-24 rounded-2xl bg-muted/50 animate-pulse border border-border" />
                        ))
                    ) : (
                        clients.map((client, index) => (
                            <motion.div
                                key={client.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="h-28 rounded-2xl bg-card border border-border hover:border-emerald-500/30 flex flex-col items-center justify-center p-4 transition-all group cursor-pointer shadow-sm hover:shadow-lg hover:shadow-emerald-500/5 relative grayscale hover:grayscale-0"
                            >
                                {client.logo_url ? (
                                    <img
                                        src={client.logo_url}
                                        alt={client.company || client.name}
                                        className="w-full h-full object-contain p-2"
                                    />
                                ) : (
                                    <>
                                        <Building2 className="w-8 h-8 text-emerald-500 mb-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                                        <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors text-center px-2 line-clamp-1">
                                            {client.company || client.name}
                                        </span>
                                    </>
                                )}
                            </motion.div>
                        ))
                    )}

                    {!loading && clients.length === 0 && (
                        <div className="col-span-full text-center text-muted-foreground py-8">
                            Henüz referans eklenmemiş.
                        </div>
                    )}
                </div>

                {/* Testimonials - Static for now but styled consistently */}
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 + index * 0.2 }}
                            className="bg-card border border-border p-8 rounded-[2rem] relative hover:border-emerald-500/30 transition-all shadow-sm group"
                        >
                            {/* Quote Icon */}
                            <div className="mb-6">
                                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                    <Quote className="w-5 h-5 text-emerald-500" />
                                </div>
                            </div>

                            {/* Stars */}
                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                ))}
                            </div>

                            {/* Content */}
                            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                                "{testimonial.content}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-4 mt-auto">
                                <img
                                    src={testimonial.avatarUrl || '/avatars/default-avatar.png'}
                                    alt={testimonial.author}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-background shadow-md"
                                />
                                <div>
                                    <h4 className="text-foreground font-bold">
                                        {testimonial.author}
                                    </h4>
                                    <p className="text-sm text-emerald-600 font-medium">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
