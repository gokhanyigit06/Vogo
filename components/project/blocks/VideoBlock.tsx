interface VideoBlockProps {
    url: string
    provider?: 'youtube' | 'vimeo' | 'direct'
}

export default function VideoBlock({ url, provider = 'youtube' }: VideoBlockProps) {
    const getEmbedUrl = () => {
        if (provider === 'youtube') {
            const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1]
            return videoId ? `https://www.youtube.com/embed/${videoId}` : url
        } else if (provider === 'vimeo') {
            const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1]
            return videoId ? `https://player.vimeo.com/video/${videoId}` : url
        }
        return url
    }

    return (
        <div className="py-8 px-6 lg:px-12 bg-stone-50">
            <div className="max-w-5xl mx-auto">
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl bg-black">
                    {provider === 'direct' ? (
                        <video
                            src={url}
                            controls
                            className="w-full h-full"
                        />
                    ) : (
                        <iframe
                            src={getEmbedUrl()}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
