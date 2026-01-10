
import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { supabase } from '@/lib/supabase'

const localDataPath = path.resolve('./data/settings.json')

// Varsayılan Ayarlar (Dosya yoksa veya boşsa)
// Varsayılan Ayarlar
const defaultSettings = {
    // Genel
    siteTitle: "Vogo Agency",
    siteDescription: "Dijital Çözümler ve Web Tasarım Ajansı",
    logo: "",
    favicon: "",

    // İletişim & Sosyal
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

    // Marketing & SEO
    googleAnalytics: "",     // G-XXXXXX
    facebookPixel: "",       // Pixel ID
    googleTagManager: "",    // GTM-XXXXXX
    customHeadScripts: "",   // Raw <script> tags
    customBodyScripts: "",   // Raw <script> tags for body

    // System
    maintenanceMode: false
}

async function getLocalSettings() {
    try {
        const fileContents = await fs.readFile(localDataPath, 'utf8')
        return JSON.parse(fileContents.replace(/^\uFEFF/, ''))
    } catch {
        return defaultSettings
    }
}

export async function GET() {
    // 1. Supabase
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        try {
            const { data, error } = await supabase.from('settings').select('*').single()
            if (!error && data) {
                return NextResponse.json({
                    siteTitle: data.site_title,
                    siteDescription: data.site_description,
                    logo: data.logo,
                    favicon: data.favicon,

                    email: data.email,
                    phone: data.phone,
                    whatsapp: data.whatsapp,
                    address: data.address,
                    mapUrl: data.map_url,

                    instagram: data.instagram,
                    twitter: data.twitter,
                    linkedin: data.linkedin,
                    facebook: data.facebook,
                    youtube: data.youtube,

                    googleAnalytics: data.google_analytics,
                    facebookPixel: data.facebook_pixel,
                    googleTagManager: data.google_tag_manager,
                    customHeadScripts: data.custom_head_scripts,
                    customBodyScripts: data.custom_body_scripts,

                    maintenanceMode: data.maintenance_mode
                })
            }
        } catch (err) { }
    }

    // 2. Local Fallback
    const localData = await getLocalSettings()
    // Merge with defaults to ensure new fields form defaultSettings exist even if old file loaded
    return NextResponse.json({ ...defaultSettings, ...localData })
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const newSettings = { ...defaultSettings, ...body }

        // 1. Supabase
        if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
            const dbPayload = {
                id: 1,
                site_title: newSettings.siteTitle,
                site_description: newSettings.siteDescription,
                logo: newSettings.logo,
                favicon: newSettings.favicon,

                email: newSettings.email,
                phone: newSettings.phone,
                whatsapp: newSettings.whatsapp,
                address: newSettings.address,
                map_url: newSettings.mapUrl,

                instagram: newSettings.instagram,
                twitter: newSettings.twitter,
                linkedin: newSettings.linkedin,
                facebook: newSettings.facebook,
                youtube: newSettings.youtube,

                google_analytics: newSettings.googleAnalytics,
                facebook_pixel: newSettings.facebookPixel,
                google_tag_manager: newSettings.googleTagManager,
                custom_head_scripts: newSettings.customHeadScripts,
                custom_body_scripts: newSettings.customBodyScripts,

                maintenance_mode: newSettings.maintenanceMode,
                updated_at: new Date().toISOString()
            }

            const { error } = await supabase
                .from('settings')
                .upsert(dbPayload)

            if (error) console.error("Supabase Settings Error:", error.message)
        }

        // 2. Local Fallback
        try {
            await fs.writeFile(localDataPath, JSON.stringify(newSettings, null, 2), 'utf8')
        } catch (e) { }

        return NextResponse.json(newSettings)
    } catch (error) {
        return NextResponse.json({ error: 'Ayarlar kaydedilemedi' }, { status: 500 })
    }
}
