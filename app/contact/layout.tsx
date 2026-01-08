import { Metadata } from "next"

export const metadata: Metadata = {
    title: "İletişim | Vogo Agency - Bize Ulaşın",
    description: "Projenizi konuşmak ve teklif almak için hemen bizimle iletişime geçin. Ankara ofisimiz ve online kanallarımızla hizmetinizdeyiz.",
}

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
