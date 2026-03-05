import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Blog | Vogo Lab - Dijital Öngörüler",
    description: "Web tasarım trendleri, SEO ipuçları, dijital pazarlama stratejileri ve teknoloji dünyasından en güncel haberler.",
}

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
