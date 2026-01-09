import { MetadataRoute } from 'next'

async function getBlogPosts() {
    try {
        // Try Supabase first
        if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
            const { createClient } = await import('@supabase/supabase-js')
            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            )
            const { data } = await supabase
                .from('posts')
                .select('slug, created_at, updated_at')
                .eq('status', 'published')

            if (data) return data
        }

        // Fallback to local
        const fs = await import('fs/promises')
        const path = await import('path')
        const filePath = path.resolve('./data/posts.json')
        const fileContents = await fs.readFile(filePath, 'utf8')
        const posts = JSON.parse(fileContents.replace(/^\uFEFF/, ''))
        return posts.filter((p: any) => p.status !== 'draft')
    } catch (error) {
        console.error('Error fetching posts for sitemap:', error)
        return []
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://vogo-agency.vercel.app' // Vercel URL'ini buraya koy

    const posts = await getBlogPosts()
    const blogUrls = posts.map((post: any) => ({
        url: `${baseUrl}/blog/${post.slug || post.id}`,
        lastModified: post.updated_at || post.created_at || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/services`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/portfolio`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.7,
        },
        ...blogUrls,
    ]
}
