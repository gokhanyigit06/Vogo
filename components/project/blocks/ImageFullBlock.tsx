import Image from "next/image"

interface ImageFullBlockProps {
    url: string
    alt?: string
}

export default function ImageFullBlock({ url, alt = "Project image" }: ImageFullBlockProps) {
    return (
        <div className="py-8 px-6 lg:px-12 bg-stone-50">
            <div className="max-w-7xl mx-auto">
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-xl">
                    <Image
                        src={url}
                        alt={alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1536px) 100vw, 1536px"
                    />
                </div>
            </div>
        </div>
    )
}
