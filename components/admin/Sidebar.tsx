"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, FileText, Briefcase, Mail, Settings, LogOut, Layers, MessageSquare } from "lucide-react"

const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { id: "services", icon: Layers, label: "Hizmetler", href: "/admin/services" },
    { id: "blog", icon: FileText, label: "Blog Yönetimi", href: "/admin/blog" },
    { id: "portfolio", icon: Briefcase, label: "Portfolyo", href: "/admin/portfolio" },
    { id: "messages", icon: Mail, label: "Gelen Kutusu", href: "/admin/messages", badge: 3 },
    { id: "settings", icon: Settings, label: "Ayarlar", href: "/admin/settings" },
]

export default function AdminSidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0">
            {/* Logo Area */}
            <div className="p-6 border-b border-slate-800">
                <Link href="/admin" className="block">
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
                        Vogo Admin
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href

                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive
                                    ? "bg-emerald-500/10 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-white"}`} />
                            <span className="font-medium">{item.label}</span>
                            {item.badge && (
                                <span className="ml-auto bg-emerald-500 text-slate-950 text-xs font-bold px-2 py-0.5 rounded-full">
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer Actions */}
            <div className="p-4 border-t border-slate-800">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Çıkış Yap</span>
                </button>
                <div className="mt-4 px-4 text-xs text-slate-600 flex justify-between items-center">
                    <span>v2.1.0</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
            </div>
        </aside>
    )
}
