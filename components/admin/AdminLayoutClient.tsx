"use client"

import { usePathname } from "next/navigation"
import AdminSidebar from "@/components/admin/AdminSidebar"

export default function AdminLayoutClient({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const isWebPanel = pathname.includes("/admin/web")

    if (isWebPanel) {
        return <>{children}</>
    }

    return (
        <div className="min-h-screen gradient-bg notebook-grid flex transition-colors duration-300">
            <AdminSidebar />
            <main className="flex-1 lg:ml-64">
                {children}
            </main>
        </div>
    )
}
