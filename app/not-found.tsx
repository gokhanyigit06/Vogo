
import { Metadata } from 'next'
import NotFoundContent from '@/components/NotFoundContent'

export const metadata: Metadata = {
    title: 'Sayfa Bulunamadı - Vogo Agency',
    description: 'Aradığınız sayfa bulunamadı. Vogo Agency ana sayfasına dönerek dijital yolculuğunuza devam edin.',
    robots: {
        index: false,
        follow: true,
    }
}

export default function NotFound() {
    return <NotFoundContent />
}
