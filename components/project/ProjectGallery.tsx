"use client"

import Image from "next/image"
import { useState } from "react"
import { X } from "lucide-react"

interface ProjectGalleryProps {
    images: string[]
}

export default function ProjectGallery({ images }: ProjectGalleryProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [currentImage, setCurrentImage] = useState(0)

    if (!images || images.length === 0) return null

    const openLightbox = (index: number) => {
        setCurrentImage(index)
        setLightboxOpen(true)
    }

    const closeLightbox = () => {
        setLightboxOpen(false)
    }

    const nextImage = () => {
        setCurrentImage((prev) => (prev + 1) % images.length)
    }

    const prevImage = () => {
        setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
    }

    return (
        <>
            <section className="py-0 bg-white">
                <div className="w-full">
                    <div className="flex flex-col gap-0">
                        {images.map((image, index) => (
                            <div
                                key={index}
                                className="relative w-full cursor-pointer group"
                                onClick={() => openLightbox(index)}
                            >
                                <Image
                                    src={image}
                                    alt={`Gallery image ${index + 1}`}
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    className="w-full h-auto object-cover"
                                    unoptimized={image.startsWith('http')}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Lightbox */}
            {lightboxOpen && (
                <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
                    {/* Close Button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>

                    {/* Previous Button */}
                    {images.length > 1 && (
                        <button
                            onClick={prevImage}
                            className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}

                    {/* Image */}
                    <div className="relative max-w-6xl max-h-[90vh] w-full h-full">
                        <Image
                            src={images[currentImage]}
                            alt={`Gallery image ${currentImage + 1}`}
                            fill
                            className="object-contain"
                            sizes="100vw"
                        />
                    </div>

                    {/* Next Button */}
                    {images.length > 1 && (
                        <button
                            onClick={nextImage}
                            className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}

                    {/* Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm">
                        {currentImage + 1} / {images.length}
                    </div>
                </div>
            )}
        </>
    )
}
