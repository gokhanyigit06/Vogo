
import { Mail, Phone, MapPin } from "lucide-react"

export default function Contact() {
    return (
        <section id="contact" className="py-24">
            <div className="container px-4 md:px-6">
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold">
                            Hadi <span className="text-primary">Projeni</span> Konuşalım
                        </h2>
                        <p className="text-muted-foreground">
                            İşinizi bir üst seviyeye taşımak için bugün iletişime geçin.
                            Uzman ekibimiz size en uygun çözümleri sunmak için hazır.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Mail className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium">info@vogoagency.com</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Phone className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Telefon</p>
                                    <p className="font-medium">+90 555 123 45 67</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <MapPin className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Adres</p>
                                    <p className="font-medium">İstanbul, Türkiye</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-6">
                        <form className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-2">
                                    Adınız Soyadınız
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    className="w-full px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                    placeholder="Adınız"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-2">
                                    E-posta
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                    placeholder="ornek@email.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium mb-2">
                                    Mesajınız
                                </label>
                                <textarea
                                    id="message"
                                    rows={4}
                                    className="w-full px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                    placeholder="Projeniz hakkında bize bilgi verin..."
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 rounded-md transition-colors"
                            >
                                Gönder
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
