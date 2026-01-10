"use client"

import { FileText, Edit, ArrowRight } from "lucide-react"
import Link from "next/link"

const editablePages = [
    {
        id: "home",
        title: "Anasayfa",
        description: "Hero alanı, istatistikler ve ana karşılama mesajlarını düzenleyin.",
        path: "/",
        lastEdited: "Bugün"
    },
    {
        id: "about",
        title: "Hakkımızda",
        description: "Biz kimiz, misyon ve vizyon yazılarını güncelleyin.",
        path: "/about",
        lastEdited: "Dün"
    },
    {
        id: "services",
        title: "Hizmetler",
        description: "Hizmetler sayfasındaki ana başlık ve giriş metinleri.",
        path: "/services",
        lastEdited: "Geçen Hafta"
    }
]

export default function PagesAdmin() {
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                        <FileText className="w-8 h-8 text-emerald-500" />
                        Sayfa İçerikleri
                    </h1>
                    <p className="text-muted-foreground mt-1">Sitenin statik içeriklerini kod yazmadan güncelleyin.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {editablePages.map((page) => (
                    <div key={page.id} className="bg-card border border-border rounded-2xl p-6 group hover:border-emerald-500/50 transition-all shadow-sm">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                <FileText className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-medium bg-muted px-2 py-1 rounded text-muted-foreground">
                                {page.path}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-emerald-500 transition-colors">
                            {page.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-6 line-clamp-2">
                            {page.description}
                        </p>

                        <Link href={`/admin/pages/${page.id}`}>
                            <button className="w-full py-3 rounded-xl bg-background border border-border font-medium text-foreground hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all flex items-center justify-center gap-2">
                                <Edit className="w-4 h-4" />
                                İçeriği Düzenle
                            </button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}
