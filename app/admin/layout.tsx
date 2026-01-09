"use client"

import { LayoutDashboard, Users, Briefcase, DollarSign, FileText, MessageSquare, Settings, Menu, X, FolderKanban } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

export const dynamic = 'force-dynamic'
export const dynamicParams = true

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
        { icon: Users, label: "Müşteriler", href: "/admin/clients" },
        { icon: FolderKanban, label: "Projeler", href: "/admin/projects" },
        { icon: DollarSign, label: "Finans", href: "/admin/finance" },
        { icon: FileText, label: "Blog", href: "/admin/blog" },
        { icon: Briefcase, label: "Portfolio", href: "/admin/portfolio" },
        { icon: MessageSquare, label: "Mesajlar", href: "/admin/messages" },
        { icon: Settings, label: "Ayarlar", href: "/admin/settings" },
    ]

    const isActive = (href: string) => {
        if (href === "/admin") {
            return pathname === "/admin"
        }
        return pathname.startsWith(href)
    }

    return (
        <div className="min-h-screen bg-slate-950 flex">

            {/* Sidebar - Desktop */}
            <aside className="hidden lg:block w-64 bg-slate-900 border-r border-slate-800 fixed h-screen">
                <div className="p-6 border-b border-slate-800">
                    <Link href="/admin" className="text-xl font-bold flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">V</span>
                        </div>
                        <div>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Vogo</span>
                            <span className="text-white"> Admin</span>
                        </div>
                    </Link>
                </div>

                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(item.href)
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
                    >
                        ← Siteye Dön
                    </Link>
                </div>
            </aside>

            {/* Mobile Menu Button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-slate-900 border border-slate-800 rounded-xl text-white"
            >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Sidebar - Mobile */}
            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setSidebarOpen(false)}
                >
                    <aside
                        className="w-64 bg-slate-900 h-screen border-r border-slate-800"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-slate-800">
                            <Link href="/admin" className="text-xl font-bold flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">V</span>
                                </div>
                                <div>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Vogo</span>
                                    <span className="text-white"> Admin</span>
                                </div>
                            </Link>
                        </div>

                        <nav className="p-4 space-y-2">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(item.href)
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            ))}
                        </nav>
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 lg:ml-64">
                {children}
            </main>
        </div>
    )
}
