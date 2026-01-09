
import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { supabase } from '@/lib/supabase'

const localDataPath = path.resolve('./data/settings.json')

// Varsayılan Ayarlar (Dosya yoksa veya boşsa)
const defaultSettings = {
    siteTitle: "Vogo Agency",
    siteDescription: "Dijital Çözümler ve Web Tasarım Ajansı",
    email: "info@vogoagency.com",
    phone: "+90 555 123 45 67",
    address: "İstanbul, Türkiye",
    instagram: "https://instagram.com/vogoagency",
    twitter: "https://twitter.com/vogoagency",
    linkedin: "https://linkedin.com/company/vogoagency",
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
    // 1. Supabase (Tablo 'settings' varsayıyoruz)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        try {
            const { data, error } = await supabase.from('settings').select('*').single()
            if (!error && data) {
                // Convert snake_case to camelCase for frontend
                return NextResponse.json({
                    siteTitle: data.site_title,
                    siteDescription: data.site_description,
                    email: data.email,
                    phone: data.phone,
                    address: data.address,
                    instagram: data.instagram,
                    twitter: data.twitter,
                    linkedin: data.linkedin,
                    maintenanceMode: data.maintenance_mode
                })
            }
            // Eğer tablo var ama veri yoksa, varsayılanı döndürmeye çalışmayalım, local fallback'e geçelim
        } catch (err) { }
    }

    // 2. Local Fallback
    const localData = await getLocalSettings()
    return NextResponse.json(localData)
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const newSettings = { ...defaultSettings, ...body } // Eksik alanları tamamla

        // 1. Supabase (Upsert mantığı: Varsa güncelle, yoksa ekle)
        if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
            // Map to snake_case for Supabase
            const dbPayload = {
                id: 1,
                site_title: newSettings.siteTitle,
                site_description: newSettings.siteDescription,
                email: newSettings.email,
                phone: newSettings.phone,
                address: newSettings.address,
                instagram: newSettings.instagram,
                twitter: newSettings.twitter,
                linkedin: newSettings.linkedin,
                maintenance_mode: newSettings.maintenanceMode,
                updated_at: new Date().toISOString()
            }

            const { error } = await supabase
                .from('settings')
                .upsert(dbPayload)

            if (error) console.error("Supabase Settings Error:", error.message)
        }

        // 2. Local Fallback (Vercel'de readonly olabilir ama dev ortamında çalışsın)
        try {
            await fs.writeFile(localDataPath, JSON.stringify(newSettings, null, 2), 'utf8')
        } catch (e) {
            // Local write failed (expected in production Vercel)
        }

        return NextResponse.json(newSettings)
    } catch (error) {
        return NextResponse.json({ error: 'Ayarlar kaydedilemedi' }, { status: 500 })
    }
}
