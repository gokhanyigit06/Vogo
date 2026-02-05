
import { Github, Twitter, Linkedin, Instagram } from "lucide-react"

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="border-t border-border bg-slate-900/50">
            <div className="container px-4 md:px-6 py-12">
                <div className="grid md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <div className="text-xl font-bold">
                            <span className="text-primary">Vogo</span> Lab
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Dijital dünyada fark yaratan çözümler üretiyoruz.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Hizmetler</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Web Tasarım</a></li>
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">SEO</a></li>
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Reklam Yönetimi</a></li>
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">QR Menü</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Kurumsal</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Hakkımızda</a></li>
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Referanslar</a></li>
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Kariyer</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Sosyal Medya</h3>
                        <div className="flex gap-3">
                            <a href="#" className="h-9 w-9 rounded-md border border-border bg-background hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors">
                                <Github className="h-4 w-4" />
                            </a>
                            <a href="#" className="h-9 w-9 rounded-md border border-border bg-background hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors">
                                <Twitter className="h-4 w-4" />
                            </a>
                            <a href="#" className="h-9 w-9 rounded-md border border-border bg-background hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors">
                                <Linkedin className="h-4 w-4" />
                            </a>
                            <a href="#" className="h-9 w-9 rounded-md border border-border bg-background hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors">
                                <Instagram className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
                    <p>&copy; {currentYear} Vogo Lab. Tüm hakları saklıdır.</p>
                </div>
            </div>
        </footer>
    )
}
