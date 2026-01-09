import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const { slug } = params

        // 1. Supabase'den slug ile ara
        if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('slug', slug)
                .single()

            if (!error && data) {
                return NextResponse.json(data)
            }
        }

        // 2. Local fallback - data/posts.json'dan bul
        const fs = await import('fs/promises')
        const path = await import('path')
        const localDataPath = path.resolve('./data/posts.json')
        
        try {
            const fileContents = await fs.readFile(localDataPath, 'utf8')
            const posts = JSON.parse(fileContents.replace(/^\uFEFF/, ''))
            const post = posts.find((p: any) => p.slug === slug || p.id.toString() === slug)
            
            if (post) {
                return NextResponse.json(post)
            }
        } catch (err) {
            console.error('Local file read error:', err)
        }

        return NextResponse.json(
            { error: 'Post bulunamadı' },
            { status: 404 }
        )

    } catch (error) {
        console.error('Error fetching post:', error)
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500 }
        )
    }
}
