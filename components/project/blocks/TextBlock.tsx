interface TextBlockProps {
    content: string
}

export default function TextBlock({ content }: TextBlockProps) {
    return (
        <div className="py-16 px-6 lg:px-12 bg-white">
            <div className="max-w-4xl mx-auto">
                <div
                    className="prose prose-lg prose-stone max-w-none
                        prose-headings:font-bold prose-headings:text-stone-900
                        prose-p:text-stone-700 prose-p:leading-relaxed prose-p:text-lg
                        prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-stone-900 prose-strong:font-bold"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
        </div>
    )
}
