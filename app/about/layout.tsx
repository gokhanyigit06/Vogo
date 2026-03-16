import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Hakkımızda | Vogo Agency - Dijital Çözüm Ortağınız",
    description: "Vogo Agency'nin vizyonu, misyonu ve uzman ekibiyle tanışın. 2026 yılından beri markalara değer katıyoruz.",
}

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
