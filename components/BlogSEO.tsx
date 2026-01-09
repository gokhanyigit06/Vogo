import Head from 'next/head'

type SEOProps = {
    title: string
    description: string
    image?: string
    url?: string
    type?: 'website' | 'article'
    publishedTime?: string
    author?: string
    category?: string
}

export default function BlogSEO({
    title,
    description,
    image = 'https://vogo-agency.vercel.app/og-default.png',
    url = 'https://vogo-agency.vercel.app',
    type = 'article',
    publishedTime,
    author = 'Volkan Yıldırım',
    category
}: SEOProps) {
    const fullTitle = `${title} | Vogo Blog`

    return (
        <>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={description} />
            {category && <meta name="keywords" content={`${category}, dijital ajans, web tasarım, SEO`} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content="Vogo Agency" />
            {publishedTime && <meta property="article:published_time" content={publishedTime} />}
            {author && <meta property="article:author" content={author} />}
            {category && <meta property="article:section" content={category} />}

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />

            {/* Canonical URL */}
            <link rel="canonical" href={url} />

            {/* JSON-LD for rich search results */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'BlogPosting',
                        headline: title,
                        description: description,
                        image: image,
                        datePublished: publishedTime,
                        author: {
                            '@type': 'Person',
                            name: author,
                        },
                        publisher: {
                            '@type': 'Organization',
                            name: 'Vogo Agency',
                            logo: {
                                '@type': 'ImageObject',
                                url: 'https://vogo-agency.vercel.app/logo.png',
                            },
                        },
                    }),
                }}
            />
        </>
    )
}
