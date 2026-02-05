
export default function Hero() {
    return (
        <section className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden gradient-bg">
            {/* Decorative Elements */}
            <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

            <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-8 relative z-10">
                <div className="space-y-6 animate-[fadeInUp_0.8s_ease-out]">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
                        <span className="text-white">Dijital Dünyada</span>
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600 animate-[float_3s_ease-in-out_infinite]">
                            İzinizi
                        </span>
                        <span className="text-white"> Bırakın</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-[700px] mx-auto leading-relaxed">
                        Vogo Lab ile markanızı yükseltin. Web tasarım, SEO ve dijital pazarlama çözümleriyle geleceği bugünden inşa ediyoruz.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 animate-[fadeInUp_1s_ease-out_0.2s_both]">
                    <button className="group relative bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 h-12 px-8 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/50 hover:scale-105 font-semibold">
                        <span className="relative z-10">Hemen Başla</span>
                        <div className="absolute inset-0 rounded-lg bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                    <button className="glass-card h-12 px-8 rounded-lg text-slate-100 hover:text-emerald-400 transition-all duration-300 font-semibold">
                        Hizmetlerimiz
                    </button>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-3 gap-8 mt-16 animate-[fadeInUp_1.2s_ease-out_0.4s_both]">
                    <div className="glass-card p-6 rounded-xl text-center">
                        <div className="text-3xl font-bold text-emerald-400">50+</div>
                        <div className="text-sm text-slate-400 mt-2">Proje</div>
                    </div>
                    <div className="glass-card p-6 rounded-xl text-center">
                        <div className="text-3xl font-bold text-emerald-400">100%</div>
                        <div className="text-sm text-slate-400 mt-2">Memnuniyet</div>
                    </div>
                    <div className="glass-card p-6 rounded-xl text-center">
                        <div className="text-3xl font-bold text-emerald-400">24/7</div>
                        <div className="text-sm text-slate-400 mt-2">Destek</div>
                    </div>
                </div>
            </div>
        </section>
    )
}
