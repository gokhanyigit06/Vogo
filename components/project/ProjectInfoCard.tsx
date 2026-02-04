interface ProjectInfoCardProps {
    description?: string
    client?: string
    services?: string[]
    year?: string
    category?: string
    market?: string
    clientType?: string
    websiteUrl?: string
}

export default function ProjectInfoCard({
    description,
    client,
    services = [],
    year,
    category,
    market,
    clientType,
    websiteUrl
}: ProjectInfoCardProps) {
    return (
        <section className="py-20 px-6 lg:px-12 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-5 gap-12">
                    {/* Left: Description */}
                    <div className="md:col-span-3 space-y-6">
                        <h2 className="text-4xl md:text-5xl font-bold text-stone-900 leading-tight">
                            Proje Hakkında
                        </h2>
                        {description && (
                            <p className="text-xl text-stone-600 leading-relaxed">
                                {description}
                            </p>
                        )}
                    </div>

                    {/* Right: Metadata */}
                    <div className="md:col-span-2 space-y-8">
                        {client && (
                            <div className="border-l-4 border-stone-900 pl-6">
                                <div className="text-sm font-bold uppercase tracking-wider text-stone-400 mb-2">
                                    Müşteri
                                </div>
                                <div className="text-2xl font-bold text-stone-900">
                                    {client}
                                </div>
                            </div>
                        )}

                        {services.length > 0 && (
                            <div className="border-l-4 border-stone-900 pl-6">
                                <div className="text-sm font-bold uppercase tracking-wider text-stone-400 mb-2">
                                    Hizmetler
                                </div>
                                <div className="text-lg text-stone-900">
                                    {services.join(', ')}
                                </div>
                            </div>
                        )}

                        {year && (
                            <div className="border-l-4 border-stone-900 pl-6">
                                <div className="text-sm font-bold uppercase tracking-wider text-stone-400 mb-2">
                                    Yıl
                                </div>
                                <div className="text-2xl font-bold text-stone-900">
                                    {year}
                                </div>
                            </div>
                        )}

                        {category && (
                            <div className="border-l-4 border-stone-900 pl-6">
                                <div className="text-sm font-bold uppercase tracking-wider text-stone-400 mb-2">
                                    Kategori
                                </div>
                                <div className="text-lg text-stone-900">
                                    {category}
                                </div>
                            </div>
                        )}

                        {market && (
                            <div className="border-l-4 border-stone-900 pl-6">
                                <div className="text-sm font-bold uppercase tracking-wider text-stone-400 mb-2">
                                    Market
                                </div>
                                <div className="text-lg text-stone-900">
                                    {market}
                                </div>
                            </div>
                        )}

                        {clientType && (
                            <div className="border-l-4 border-stone-900 pl-6">
                                <div className="text-sm font-bold uppercase tracking-wider text-stone-400 mb-2">
                                    Client Type
                                </div>
                                <div className="text-lg text-stone-900">
                                    {clientType}
                                </div>
                            </div>
                        )}

                        {websiteUrl && (
                            <div className="border-l-4 border-stone-900 pl-6">
                                <div className="text-sm font-bold uppercase tracking-wider text-stone-400 mb-2">
                                    Website
                                </div>
                                <a
                                    href={websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-lg text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
                                >
                                    {websiteUrl.replace(/^https?:\/\//, '')}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
