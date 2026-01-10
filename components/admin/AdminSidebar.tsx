"use client"

import { LayoutDashboard, Users, Briefcase, DollarSign, FileText, MessageSquare, Settings, Menu, X, FolderKanban, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

export default function AdminSidebar() {
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
        { icon: Users, label: "Müşteriler", href: "/admin/clients" },
        { icon: FolderKanban, label: "Projeler", href: "/admin/projects" },
        { icon: CheckCircle2, label: "Görevler", href: "/admin/tasks" },
        { icon: DollarSign, label: "Finans", href: "/admin/finance" },
        { icon: Users, label: "Ekip", href: "/admin/team" },
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
        <>
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:block w-64 bg-sidebar border-r border-sidebar-border fixed h-screen transition-colors duration-300">
                <div className="p-6 border-b border-sidebar-border">
                    <Link href="/admin" className="text-xl font-bold flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-teal-500 rounded-lg flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-sm">V</span>
                        </div>
                        <div>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-400">Vogo</span>
                            <span className="text-foreground"> Admin</span>
                        </div>
                    </Link>
                </div>

                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(item.href)
                                ? 'bg-sidebar-accent text-sidebar-primary border border-sidebar-border shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                        ← Siteye Dön
                    </Link>
                </div>
            </aside>

            {/* Mobile Menu Button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-sidebar border border-sidebar-border rounded-xl text-foreground bg-opacity-90 backdrop-blur"
            >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Sidebar - Mobile */}
            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                >
                    <aside
                        className="w-64 bg-sidebar h-screen border-r border-sidebar-border"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-sidebar-border">
                            <Link href="/admin" className="text-xl font-bold flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-primary to-teal-500 rounded-lg flex items-center justify-center">
                                    <span className="text-primary-foreground font-bold text-sm">V</span>
                                </div>
                                <div>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-400">Vogo</span>
                                    <span className="text-foreground"> Admin</span>
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
                                        ? 'bg-sidebar-accent text-sidebar-primary border border-sidebar-border'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50'
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
        </>
    )
}
