
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
            if (!error && data) return NextResponse.json(data)
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
            // Tek satır kuralı: Genelde ID=1 sabitlenir veya tek satır tutulur.
            // Biz burada ID'si 1 olan satırı güncelleyelim/ekleyelim.
            const { error } = await supabase
                .from('settings')
                .upsert({ id: 1, ...newSettings })

            if (error) console.error("Supabase Settings Error:", error.message)
        }

        // 2. Local Fallback
        await fs.writeFile(localDataPath, JSON.stringify(newSettings, null, 2), 'utf8')

        return NextResponse.json(newSettings)
    } catch (error) {
        return NextResponse.json({ error: 'Ayarlar kaydedilemedi' }, { status: 500 })
    }
}
