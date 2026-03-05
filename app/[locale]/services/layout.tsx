import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Hizmetlerimiz | Vogo Lab - Web Tasarım & SEO",
    description: "Web tasarım, SEO, dijital reklam ve özel yazılım hizmetlerimizle işinizi dijital dünyada büyütüyoruz.",
}

export default function ServicesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
