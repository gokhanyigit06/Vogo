import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

// Varsayılan Ayarlar
const defaultSettings = {
    siteTitle: "Vogo Agency",
    siteDescription: "Dijital Çözümler ve Web Tasarım Ajansı",
    logo: "",
    favicon: "",
    email: "info@vogoagency.com",
    phone: "+90 555 123 45 67",
    whatsapp: "+90 555 123 45 67",
    address: "İstanbul, Türkiye",
    mapUrl: "",
    instagram: "https://instagram.com/vogoagency",
    twitter: "https://twitter.com/vogoagency",
    linkedin: "https://linkedin.com/company/vogoagency",
    facebook: "",
    youtube: "",
    googleAnalytics: "",
    facebookPixel: "",
    googleTagManager: "",
    customHeadScripts: "",
    customBodyScripts: "",
    maintenanceMode: false
}

export async function GET() {
    try {
        // Firebase'den ayarları al
        const docRef = doc(db, "settings", "site_settings")
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            return NextResponse.json({ ...defaultSettings, ...docSnap.data() })
        }

        return NextResponse.json(defaultSettings)
    } catch (error: unknown) {
        console.error('Settings GET error:', error)
        return NextResponse.json(defaultSettings)
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const newSettings = { ...defaultSettings, ...body }

        // Firebase'e kaydet (setDoc with merge acts like upsert)
        const docRef = doc(db, "settings", "site_settings")
        await setDoc(docRef, { ...newSettings, updatedAt: new Date().toISOString() }, { merge: true })

        // Sitenin arayüzündeki tüm önbelleği (cache) temizle, böylece anasayfa ve layout (head) verisi güncellenir
        revalidatePath('/', 'layout')

        return NextResponse.json(newSettings)
    } catch (error: unknown) {
        console.error('Settings POST error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
