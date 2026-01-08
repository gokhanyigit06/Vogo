import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/admin/',
        },
        sitemap: 'https://vogo-agency.vercel.app/sitemap.xml', // Vercel URL'ini buraya koy
    }
}
