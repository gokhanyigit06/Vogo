"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Youtube from '@tiptap/extension-youtube'
import {
    Bold, Italic, Strikethrough, List, ListOrdered,
    Heading1, Heading2, Quote, Link as LinkIcon,
    Image as ImageIcon, Undo, Redo, Code, Youtube as YoutubeIcon,
    Loader2
} from 'lucide-react'
import { useCallback, useState } from 'react'

interface RichTextEditorProps {
    content: string
    onChange: (content: string) => void
    placeholder?: string
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
    const [isUploading, setIsUploading] = useState(false)

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-xl shadow-lg border border-border my-6 max-h-[500px] w-auto mx-auto',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-emerald-400 hover:text-emerald-300 underline',
                },
            }),
            Youtube.configure({
                controls: false,
                HTMLAttributes: {
                    class: 'rounded-xl shadow-lg border border-border my-6 w-full aspect-video',
                },
            }),
            Placeholder.configure({
                placeholder: placeholder || 'İçeriğinizi buraya yazın...',
                emptyEditorClass: 'is-editor-empty before:content-[attr(data-placeholder)] before:text-slate-600 before:float-left before:pointer-events-none',
            }),
        ],
        content: content,
        editorProps: {
            attributes: {
                class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[400px] prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        immediatelyRender: false,
    })

    const addImage = useCallback(async () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'

        input.onchange = async () => {
            if (input.files?.length) {
                const file = input.files[0]
                setIsUploading(true)

                try {
                    const formData = new FormData()
                    formData.append('file', file)

                    const res = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData
                    })

                    if (!res.ok) throw new Error('Upload failed')

                    const data = await res.json()
                    editor?.chain().focus().setImage({ src: data.url }).run()

                } catch (error) {
                    console.error(error)
                    alert('Görsel yüklenirken bir hata oluştu.')
                } finally {
                    setIsUploading(false)
                }
            }
        }

        input.click()
    }, [editor])

    const addYoutubeVideo = useCallback(() => {
        const url = window.prompt('YouTube Video URL:')

        if (url) {
            editor?.chain().focus().setYoutubeVideo({ src: url }).run()
        }
    }, [editor])

    const setLink = useCallback(() => {
        const previousUrl = editor?.getAttributes('link').href
        const url = window.prompt('URL:', previousUrl)

        // cancelled
        if (url === null) {
            return
        }

        // empty
        if (url === '') {
            editor?.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }

        // update
        editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }, [editor])

    if (!editor) {
        return null
    }

    const ToolbarButton = ({ onClick, isActive = false, disabled = false, icon: Icon, title }: { onClick: () => void; isActive?: boolean; disabled?: boolean; icon: React.ComponentType<{ className?: string }>; title?: string }) => (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`p-2 rounded-lg transition-colors flex items-center justify-center
                ${isActive
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
        >
            <Icon className="w-4 h-4" />
        </button>
    )

    return (
        <div className="bg-card border border-border rounded-notebook overflow-hidden shadow-sm flex flex-col min-h-[600px]">

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-3 border-b border-border bg-muted/30">

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    icon={Bold}
                    title="Kalın (Bold)"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    icon={Italic}
                    title="İtalik"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive('strike')}
                    icon={Strikethrough}
                    title="Üstü Çizili"
                />

                <div className="w-px h-6 bg-border mx-2" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive('heading', { level: 1 })}
                    icon={Heading1}
                    title="Başlık 1"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    icon={Heading2}
                    title="Başlık 2"
                />

                <div className="w-px h-6 bg-border mx-2" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    icon={List}
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    icon={ListOrdered}
                />

                <div className="w-px h-6 bg-border mx-2" />

                <ToolbarButton
                    onClick={setLink}
                    isActive={editor.isActive('link')}
                    icon={LinkIcon}
                    title="Link Ekle"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive('blockquote')}
                    icon={Quote}
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    isActive={editor.isActive('codeBlock')}
                    icon={Code}
                />

                <div className="w-px h-6 bg-border mx-2" />

                <button
                    type="button"
                    onClick={addImage}
                    disabled={isUploading}
                    title="Görsel Yükle"
                    className="p-2 rounded-lg transition-colors flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground hover:text-emerald-400"
                >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                </button>
                <ToolbarButton
                    onClick={addYoutubeVideo}
                    icon={YoutubeIcon}
                    title="YouTube Videosu Ekle"
                />

                <div className="ml-auto flex items-center gap-1">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().chain().focus().undo().run()}
                        icon={Undo}
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().chain().focus().redo().run()}
                        icon={Redo}
                    />
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 cursor-text" onClick={() => editor.chain().focus().run()}>
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}
