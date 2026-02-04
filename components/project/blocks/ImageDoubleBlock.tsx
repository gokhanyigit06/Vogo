import Image from "next/image"

interface ImageDoubleBlockProps {
    images: Array<{ url: string; alt?: string }>
}

export default function ImageDoubleBlock({ images }: ImageDoubleBlockProps) {
    return (
        <div className="py-8 px-6 lg:px-12 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-6">
                    {images.slice(0, 2).map((image, idx) => (
                        <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
                            <Image
                                src={image.url}
                                alt={image.alt || `Project image ${idx + 1}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
