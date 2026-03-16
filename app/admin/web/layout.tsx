import { ReactNode } from "react"
import Link from "next/link"
import WebPanelNav from "@/components/admin/WebPanelNav"

export default function WebPanelLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-[#F4F4F4]">
            <WebPanelNav />
            <main className="pt-20">
                {children}
            </main>
        </div>
    )
}
