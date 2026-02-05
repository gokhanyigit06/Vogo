
import { Metadata } from 'next'
import NotFoundContent from '@/components/NotFoundContent'

export const metadata: Metadata = {
    title: 'Sayfa Bulunamadı - Vogo Lab',
    description: 'Aradığınız sayfa bulunamadı. Vogo Lab ana sayfasına dönerek dijital yolculuğunuza devam edin.',
    robots: {
        index: false,
        follow: true,
    }
}

export default function NotFound() {
    return <NotFoundContent />
}
