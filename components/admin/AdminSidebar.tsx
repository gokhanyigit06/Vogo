"use client"

import { LayoutDashboard, Users, Briefcase, DollarSign, FileText, MessageSquare, Settings, Menu, X, FolderKanban, CheckCircle2, LogOut, FlaskConical } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"

export default function AdminSidebar() {
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { data: session } = useSession()

    const userProfile = {
        name: session?.user?.name || 'Loading...',
        role: session?.user?.role || 'admin',
        email: session?.user?.email || ''
    }

    const handleSignOut = async () => {
        try {
            await signOut({ callbackUrl: '/login' })
        } catch (error) {
            console.error('SignOut Exception:', error)
            window.location.href = '/login'
        }
    }

    const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({})

    const toggleSubmenu = (label: string) => {
        setOpenSubmenus(prev => ({ ...prev, [label]: !prev[label] }))
    }

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
        {
            icon: Users,
            label: "Müşteriler",
            href: "/admin/clients",
            children: [
                { label: "Listele", href: "/admin/clients" },
                { label: "Sıralama", href: "/admin/clients/order" },
            ]
        },
        { icon: FolderKanban, label: "Projeler", href: "/admin/projects" },
        { icon: CheckCircle2, label: "Görevler", href: "/admin/tasks" },
        { icon: DollarSign, label: "Finans", href: "/admin/finance" },
        { icon: Users, label: "Ekip", href: "/admin/team" },
        { icon: FileText, label: "Blog", href: "/admin/blog" },
        { icon: Briefcase, label: "Portfolio", href: "/admin/portfolio" },
        { icon: FlaskConical, label: "Vogo Labs", href: "/admin/laboratuvar" },
        { icon: MessageSquare, label: "Mesajlar", href: "/admin/messages" },
        { icon: Settings, label: "Ayarlar", href: "/admin/settings" },
    ]

    const isActive = (href: string) => {
        if (href === "/admin") {
            return pathname === "/admin"
        }
        return pathname.startsWith(href)
    }

    const renderMenuItem = (item: any) => {
        const hasChildren = item.children && item.children.length > 0
        const isParentActive = isActive(item.href)
        const isOpen = openSubmenus[item.label] || isParentActive

        if (hasChildren) {
            return (
                <div key={item.href} className="flex flex-col gap-1">
                    <button
                        onClick={() => toggleSubmenu(item.label)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all w-full text-left ${isParentActive
                            ? 'bg-sidebar-accent/50 text-sidebar-primary'
                            : 'text-foreground hover:text-sidebar-primary hover:bg-sidebar-accent/50'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </div>
                        {/* Chevron Icon could go here */}
                    </button>

                    {isOpen && (
                        <div className="flex flex-col gap-1 pl-11 pr-2">
                            {item.children.map((child: any) => (
                                <Link
                                    key={child.href}
                                    href={child.href}
                                    className={`py-2 px-3 rounded-lg text-sm transition-all ${pathname === child.href
                                        ? 'bg-sidebar-accent text-sidebar-primary font-medium'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/30'
                                        }`}
                                >
                                    {child.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )
        }

        return (
            <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(item.href)
                    ? 'bg-sidebar-accent text-sidebar-primary border border-sidebar-border shadow-sm'
                    : 'text-foreground hover:text-sidebar-primary hover:bg-sidebar-accent/50'
                    }`}
            >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
            </Link>
        )
    }

    return (
        <>
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:flex flex-col w-64 bg-sidebar border-r border-sidebar-border fixed h-screen transition-colors duration-300">
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

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
                    {menuItems.map(renderMenuItem)}
                </nav>

                {/* User Profile Section */}
                <div className="p-4 border-t border-sidebar-border">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-sidebar-accent/30 border border-sidebar-border/50">
                        <div className="w-10 h-10 rounded-full bg-sidebar-accent border border-sidebar-border flex items-center justify-center overflow-hidden shrink-0">
                            <span className="text-lg font-bold text-sidebar-primary">
                                {userProfile.name?.charAt(0).toUpperCase() || '?'}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-foreground truncate">{userProfile.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{userProfile.role?.toUpperCase() === 'ADMIN' ? 'Yönetici' : 'Üye'}</p>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Çıkış Yap"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
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
                            {menuItems.map((item) => {
                                const hasChildren = item.children && item.children.length > 0
                                const isParentActive = isActive(item.href)
                                const isOpen = openSubmenus[item.label] || isParentActive

                                if (hasChildren) {
                                    return (
                                        <div key={item.href} className="flex flex-col gap-1">
                                            <button
                                                onClick={() => toggleSubmenu(item.label)}
                                                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all w-full text-left ${isParentActive
                                                    ? 'bg-sidebar-accent/50 text-sidebar-primary'
                                                    : 'text-foreground hover:text-sidebar-primary hover:bg-sidebar-accent/50'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <item.icon className="w-5 h-5" />
                                                    <span className="font-medium">{item.label}</span>
                                                </div>
                                            </button>

                                            {isOpen && (
                                                <div className="flex flex-col gap-1 pl-11 pr-2">
                                                    {item.children.map((child: any) => (
                                                        <Link
                                                            key={child.href}
                                                            href={child.href}
                                                            onClick={() => setSidebarOpen(false)}
                                                            className={`py-2 px-3 rounded-lg text-sm transition-all ${pathname === child.href
                                                                ? 'bg-sidebar-accent text-sidebar-primary font-medium'
                                                                : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/30'
                                                                }`}
                                                        >
                                                            {child.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )
                                }

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(item.href)
                                            ? 'bg-sidebar-accent text-sidebar-primary border border-sidebar-border'
                                            : 'text-foreground hover:text-sidebar-primary hover:bg-sidebar-accent/50'
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                )
                            })}
                        </nav>
                    </aside>
                </div>
            )}
        </>
    )
}
