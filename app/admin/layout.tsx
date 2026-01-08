import AdminSidebar from "@/components/admin/Sidebar"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
            {/* Sidebar (Fixed Width) */}
            <AdminSidebar />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 bg-slate-950/50">
                {/* Global Admin Header */}
                <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/50 backdrop-blur-md sticky top-0 z-30">
                    <h2 className="text-sm font-medium text-slate-400">Yönetim Paneli</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-white">Admin User</p>
                                <p className="text-xs text-slate-500">Süper Yönetici</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-[2px]">
                                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-bold text-emerald-400 text-sm">
                                    AU
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
