import AdminSidebar from "@/components/admin/AdminSidebar"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-slate-950 flex">
            <AdminSidebar />
            <main className="flex-1 lg:ml-64">
                {children}
            </main>
        </div>
    )
}
