import TextBlock from './blocks/TextBlock'
import ImageFullBlock from './blocks/ImageFullBlock'
import ImageDoubleBlock from './blocks/ImageDoubleBlock'
import VideoBlock from './blocks/VideoBlock'

type ContentBlock =
    | { type: 'text'; content: string }
    | { type: 'image-full'; url: string; alt?: string }
    | { type: 'image-double'; images: Array<{ url: string; alt?: string }> }
    | { type: 'video'; url: string; provider?: 'youtube' | 'vimeo' | 'direct' }

interface ContentBlockRendererProps {
    blocks: ContentBlock[]
}

export default function ContentBlockRenderer({ blocks }: ContentBlockRendererProps) {
    if (!blocks || blocks.length === 0) {
        return null
    }

    return (
        <div className="space-y-0">
            {blocks.map((block, index) => {
                switch (block.type) {
                    case 'text':
                        return <TextBlock key={index} content={block.content} />

                    case 'image-full':
                        return <ImageFullBlock key={index} url={block.url} alt={block.alt} />

                    case 'image-double':
                        return <ImageDoubleBlock key={index} images={block.images} />

                    case 'video':
                        return <VideoBlock key={index} url={block.url} provider={block.provider} />

                    default:
                        return null
                }
            })}
        </div>
    )
}
