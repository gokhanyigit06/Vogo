import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { supabase } from '@/lib/supabase'

// Varsayılan Sayfa İçerikleri (Fallback)
const defaultPages: Record<string, any> = {
    home: {
        hero: {
            title: "Dijital Dünyada\nFark Yaratın",
            subtitle: "Modern tasarım, güçlü altyapı ve sonuç odaklı stratejiler ile markanızı geleceğe taşıyoruz.",
            buttonText: "Hemen Başlayın",
            buttonLink: "/contact",
            imageUrl: "" // Varsayılan görsel boşsa placeholder kullanılır
        },
        stats: {
            happyClients: "500+",
            projects: "1K+",
            years: "10+"
        }
    },
    about: {
        hero: {
            title: "Hakkımızda",
            subtitle: "Biz kimiz ve neler yapıyoruz?",
            content: "Vogo Agency, dijital çözüm ortağınız..."
        }
    },
    services: {
        hero: {
            title: "Hizmetlerimiz",
            subtitle: "Size nasıl yardımcı olabiliriz?"
        }
    }
}

const localDataPath = path.resolve('./data/pages.json')

// Local veriyi al
async function getLocalPages() {
    try {
        await fs.mkdir(path.dirname(localDataPath), { recursive: true })
        const fileContents = await fs.readFile(localDataPath, 'utf8')
        return JSON.parse(fileContents)
    } catch {
        return {}
    }
}

// GET - Tüm sayfaları veya tek bir sayfayı getir (?slug=home)
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    let pagesData = { ...defaultPages }

    // 1. Supabase
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        try {
            const query = supabase.from('pages').select('*')
            if (slug) query.eq('slug', slug)

            const { data, error } = await query

            if (!error && data) {
                // DB verisini state'e merge et
                data.forEach((page: any) => {
                    pagesData[page.slug] = { ...defaultPages[page.slug], ...page.content }
                })
            }
        } catch (err) { console.error(err) }
    } else {
        // 2. Local Fallback
        const localData = await getLocalPages()
        pagesData = { ...defaultPages, ...localData }
    }

    if (slug) {
        return NextResponse.json(pagesData[slug] || defaultPages[slug] || {})
    }

    return NextResponse.json(pagesData)
}

// POST - Sayfa içeriğini güncelle
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { slug, content } = body

        if (!slug || !content) {
            return NextResponse.json({ error: 'Slug ve Content gerekli' }, { status: 400 })
        }

        // 1. Supabase
        if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
            const { error } = await supabase
                .from('pages')
                .upsert({
                    slug,
                    content,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'slug' })

            if (error) throw error
        }

        // 2. Local Fallback
        const currentLocal = await getLocalPages()
        currentLocal[slug] = content
        await fs.writeFile(localDataPath, JSON.stringify(currentLocal, null, 2), 'utf8')

        return NextResponse.json({ success: true, data: content })
    } catch (error: any) {
        console.error('Page Update Error:', error)
        return NextResponse.json({ error: 'Sayfa kaydedilemedi: ' + error.message }, { status: 500 })
    }
}
