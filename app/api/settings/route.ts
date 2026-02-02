import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

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
        // Prisma'dan ayarları al
        const setting = await prisma.setting.findUnique({
            where: { key: 'site_settings' }
        })

        if (setting) {
            return NextResponse.json({ ...defaultSettings, ...(setting.value as object) })
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

        // Prisma'ya kaydet (upsert)
        await prisma.setting.upsert({
            where: { key: 'site_settings' },
            update: { value: newSettings },
            create: { key: 'site_settings', value: newSettings }
        })

        return NextResponse.json(newSettings)
    } catch (error: unknown) {
        console.error('Settings POST error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
