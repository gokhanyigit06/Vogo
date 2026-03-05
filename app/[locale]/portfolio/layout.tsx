import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Portfolyo | Vogo Lab - Başarı Hikayeleri",
    description: "Web tasarım, e-ticaret ve dijital pazarlama alanındaki referanslarımız ve başarı hikayelerimizi inceleyin.",
}

export default function PortfolioLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
