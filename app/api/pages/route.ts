import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Varsayılan Sayfa İçerikleri (Fallback)
const defaultPages: Record<string, unknown> = {
    home: {
        hero: {
            title: "Dijital Dünyada\nFark Yaratın",
            subtitle: "Modern tasarım, güçlü altyapı ve sonuç odaklı stratejiler ile markanızı geleceğe taşıyoruz.",
            buttonText: "Hemen Başlayın",
            buttonLink: "/contact",
            imageUrl: ""
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

// GET - Tüm sayfaları veya tek bir sayfayı getir (?slug=home)
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    const pagesData: Record<string, unknown> = { ...defaultPages }

    try {
        if (slug) {
            // Tek sayfa
            const page = await prisma.page.findUnique({
                where: { slug }
            })

            if (page && page.content) {
                try {
                    const content = JSON.parse(page.content)
                    return NextResponse.json({ ...(defaultPages[slug] as object || {}), ...content })
                } catch {
                    return NextResponse.json(defaultPages[slug] || {})
                }
            }

            return NextResponse.json(defaultPages[slug] || {})
        }

        // Tüm sayfalar
        const pages = await prisma.page.findMany()

        pages.forEach((page: { slug: string; content: string | null }) => {
            if (page.content) {
                try {
                    const content = JSON.parse(page.content)
                    pagesData[page.slug] = { ...(defaultPages[page.slug] as object || {}), ...content }
                } catch {
                    // JSON parse hatası, varsayılanı kullan
                }
            }
        })

        return NextResponse.json(pagesData)
    } catch (error: unknown) {
        console.error('Pages GET error:', error)
        return NextResponse.json(slug ? (defaultPages[slug] || {}) : pagesData)
    }
}

// POST - Sayfa içeriğini güncelle
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { slug, content } = body

        if (!slug || !content) {
            return NextResponse.json({ error: 'Slug ve Content gerekli' }, { status: 400 })
        }

        // Prisma'ya kaydet (upsert)
        await prisma.page.upsert({
            where: { slug },
            update: {
                content: JSON.stringify(content),
            },
            create: {
                slug,
                title: slug.charAt(0).toUpperCase() + slug.slice(1),
                content: JSON.stringify(content),
            }
        })

        return NextResponse.json({ success: true, data: content })
    } catch (error: unknown) {
        console.error('Page Update Error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: 'Sayfa kaydedilemedi: ' + message }, { status: 500 })
    }
}
