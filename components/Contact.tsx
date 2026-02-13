"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, ArrowUpRight, Facebook, Instagram, Linkedin, Youtube, Loader2, CheckCircle, AlertCircle } from "lucide-react"

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    })
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setResult(null)

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                setResult({
                    success: true,
                    message: "Mesajınız başarıyla gönderildi!"
                })
                setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
            } else {
                setResult({
                    success: false,
                    message: "Bir hata oluştu. Lütfen tekrar deneyin."
                })
            }
        } catch (error) {
            setResult({
                success: false,
                message: "Sunucuya bağlanılamadı."
            })
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    return (
        <section id="contact" className="py-16 md:py-32 bg-[#F9F9F9] relative overflow-hidden text-black font-sans">
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Header Section */}
                <div className="text-center mb-10 md:mb-16 px-2 md:px-4">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold mb-5 md:mb-8 tracking-tight leading-tight">
                        Get in touch
                        <div className="relative inline-block ml-2 sm:ml-4 md:ml-6 mt-2 sm:mt-0">
                            <span className="relative z-10 text-white px-3 sm:px-6 py-1 sm:py-2 text-2xl sm:text-4xl md:text-5xl lg:text-7xl">with us today</span>
                            <div className="absolute inset-0 bg-[#4F46E5] -rotate-2 rounded-lg sm:rounded-xl z-0 scale-110"></div>
                        </div>
                    </h2>
                    <p className="max-w-2xl mx-auto text-gray-600 text-base sm:text-lg md:text-xl font-medium leading-relaxed">
                        Reach out to our team using the form below or explore other contact methods.
                        We're eager to discuss your project needs and provide tailored solutions.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-start mt-8 md:mt-12">
                    {/* Left Side: Dark Form Card */}
                    <div className="lg:col-span-7 bg-[#111111] rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-8 md:p-12 shadow-2xl">
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`mb-6 md:mb-8 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-center gap-3 ${result.success ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}
                            >
                                {result.success ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                                <p className="text-sm sm:text-base">{result.message}</p>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 text-white">
                                <div className="space-y-2 sm:space-y-3">
                                    <label className="text-xs sm:text-sm font-semibold tracking-wide uppercase opacity-80">Full name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Carter"
                                        className="w-full bg-transparent border-b border-gray-700 py-2.5 sm:py-3 focus:border-white outline-none transition-colors text-base sm:text-lg"
                                        required
                                    />
                                </div>
                                <div className="space-y-2 sm:space-y-3">
                                    <label className="text-xs sm:text-sm font-semibold tracking-wide uppercase opacity-80">Email address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="example@email.com"
                                        className="w-full bg-transparent border-b border-gray-700 py-2.5 sm:py-3 focus:border-white outline-none transition-colors text-base sm:text-lg"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 text-white">
                                <div className="space-y-2 sm:space-y-3">
                                    <label className="text-xs sm:text-sm font-semibold tracking-wide uppercase opacity-80">Phone number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="(123) 456 - 7890"
                                        className="w-full bg-transparent border-b border-gray-700 py-2.5 sm:py-3 focus:border-white outline-none transition-colors text-base sm:text-lg"
                                    />
                                </div>
                                <div className="space-y-2 sm:space-y-3">
                                    <label className="text-xs sm:text-sm font-semibold tracking-wide uppercase opacity-80">Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="ex. Web design"
                                        className="w-full bg-transparent border-b border-gray-700 py-2.5 sm:py-3 focus:border-white outline-none transition-colors text-base sm:text-lg"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 sm:space-y-3 text-white">
                                <label className="text-xs sm:text-sm font-semibold tracking-wide uppercase opacity-80">Tell us more about your project...</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Briefly describe your goals..."
                                    rows={4}
                                    className="w-full bg-transparent border-b border-gray-700 py-2.5 sm:py-3 focus:border-white outline-none transition-colors text-base sm:text-lg resize-none"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-white text-black font-bold py-4 sm:py-5 rounded-xl sm:rounded-2xl hover:bg-gray-100 transition-all flex items-center justify-center gap-3 text-base sm:text-lg"
                            >
                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Send message"}
                            </button>
                        </form>
                    </div>

                    {/* Right Side: Contact Info & Social */}
                    <div className="lg:col-span-5 space-y-8 md:space-y-12 pl-0 lg:pl-10">
                        {/* More Contact Info */}
                        <div className="space-y-6 md:space-y-8">
                            <div>
                                <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">More contact information</h3>
                                <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
                                    Find alternative ways to connect with us, including direct email and phone numbers for our offices.
                                </p>
                            </div>

                            <div className="space-y-3 sm:space-y-4">
                                <div className="group border border-gray-300 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex items-center justify-between hover:bg-white hover:border-black transition-all cursor-pointer">
                                    <div className="flex items-center gap-3 sm:gap-6 min-w-0">
                                        <div className="w-10 h-10 sm:w-14 sm:h-14 bg-yellow-100 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
                                            <Mail className="w-5 h-5 sm:w-7 sm:h-7 text-yellow-600" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wider mb-0.5 sm:mb-1">Send us an email</p>
                                            <p className="text-base sm:text-xl font-bold truncate">info@unlimited.com</p>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300 flex items-center justify-center group-hover:bg-black group-hover:text-white group-hover:border-black transition-all shrink-0 ml-2">
                                        <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                </div>

                                <div className="group border border-gray-300 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex items-center justify-between hover:bg-white hover:border-black transition-all cursor-pointer">
                                    <div className="flex items-center gap-3 sm:gap-6 min-w-0">
                                        <div className="w-10 h-10 sm:w-14 sm:h-14 bg-red-100 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
                                            <Phone className="w-5 h-5 sm:w-7 sm:h-7 text-red-600" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wider mb-0.5 sm:mb-1">Give us a call</p>
                                            <p className="text-base sm:text-xl font-bold truncate">(123) 456 - 7890</p>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300 flex items-center justify-center group-hover:bg-black group-hover:text-white group-hover:border-black transition-all shrink-0 ml-2">
                                        <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="space-y-4 sm:space-y-6">
                            <h3 className="text-xl sm:text-2xl font-bold">Follow us on social media</h3>
                            <p className="text-gray-500 text-base sm:text-lg">
                                Connect with us on your favorite platforms to see our latest work, company updates, and insights.
                            </p>
                            <div className="flex gap-4 sm:gap-6 mt-3 sm:mt-4">
                                <a href="#" className="hover:scale-110 transition-transform"><Facebook className="w-6 h-6 sm:w-8 sm:h-8" /></a>
                                <a href="#" className="hover:scale-110 transition-transform text-black"><span className="text-2xl sm:text-3xl font-bold font-sans">X</span></a>
                                <a href="#" className="hover:scale-110 transition-transform"><Instagram className="w-6 h-6 sm:w-8 sm:h-8" /></a>
                                <a href="#" className="hover:scale-110 transition-transform"><Linkedin className="w-6 h-6 sm:w-8 sm:h-8" /></a>
                                <a href="#" className="hover:scale-110 transition-transform"><Youtube className="w-6 h-6 sm:w-8 sm:h-8" /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="container mx-auto px-4 md:px-6 relative z-10 mt-20 md:mt-32 mb-16 md:mb-24">
                <div className="text-center mb-10 md:mb-16 px-2 md:px-4">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold mb-5 md:mb-8 tracking-tight leading-tight">
                        <div className="relative inline-block mr-2 sm:mr-4 md:mr-6">
                            <span className="relative z-10 text-white px-3 sm:px-6 py-1 sm:py-2 text-3xl sm:text-4xl md:text-5xl lg:text-7xl">Frequently</span>
                            <div className="absolute inset-0 bg-[#FFD600] -rotate-2 rounded-lg sm:rounded-xl z-0 scale-110"></div>
                        </div>
                        <span className="block sm:inline mt-2 sm:mt-0">asked questions</span>
                    </h2>
                    <p className="max-w-2xl mx-auto text-gray-600 text-base sm:text-lg md:text-xl font-medium leading-relaxed">
                        Find answers to common questions about our design Unlimited service,
                        workflow, and how we can help elevate your startup's brand identity.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
                    <FAQItem
                        number="01"
                        question="Are the requests really unlimited?"
                        answer="Yes! Submit as many design requests as you need. We'll work through them one by one (or two by two on Premium) based on your queue priority."
                        isOpen={true}
                    />
                    <FAQItem
                        number="02"
                        question="How does it work?"
                        answer="Subscribe to a plan, submit requests via our dashboard, provide feedback, and receive designs typically within 48 hours (24 for Premium). It's simple!"
                        isOpen={false}
                    />
                    <FAQItem
                        number="03"
                        question="How to submit a design request?"
                        answer="You can submit requests directly through our platform's dashboard using Trello, Slack, or our custom portal depending on your preference."
                        isOpen={false}
                    />
                    <FAQItem
                        number="04"
                        question="What software do you use?"
                        answer="We primarily use Figma for UI/UX design, Adobe Creative Cloud (Photoshop, Illustrator, After Effects) for branding and motion design."
                        isOpen={false}
                    />
                </div>
            </div>
        </section>
    )
}

function FAQItem({ number, question, answer, isOpen: initialOpen }: { number: string, question: string, answer: string, isOpen: boolean }) {
    const [isOpen, setIsOpen] = useState(initialOpen)

    return (
        <div
            className={`group relative bg-white border-2 border-black rounded-xl sm:rounded-[2rem] transition-all duration-300 ${isOpen ? 'pb-4 sm:pb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] translate-y-[-2px] sm:translate-y-[-4px]' : 'hover:translate-y-[-2px] sm:hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'}`}
        >
            <div
                className="flex items-center gap-3 sm:gap-6 p-4 sm:p-6 md:p-8 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="w-9 h-9 sm:w-12 sm:h-12 bg-black text-white shrink-0 rounded-full flex items-center justify-center font-bold text-sm sm:text-lg">
                    {number}
                </div>
                <h3 className="text-lg sm:text-2xl md:text-3xl font-bold flex-1 leading-tight">{question}</h3>
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-black flex items-center justify-center transition-all shrink-0 ${isOpen ? 'bg-black text-white rotate-180' : ''}`}>
                    <ArrowUpRight className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${isOpen ? 'rotate-90' : 'rotate-45'}`} />
                </div>
            </div>

            <motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                className="overflow-hidden"
            >
                <div className="px-6 sm:px-12 md:px-24 pb-2 sm:pb-4">
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 font-medium leading-relaxed max-w-3xl">
                        {answer}
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
