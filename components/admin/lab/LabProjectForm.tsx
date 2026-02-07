"use client"

import { useState } from "react"
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Plus, Type, Image as ImageIcon, Columns } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import { ContentBlock, TextBlock, ImageFullBlock, ImageSplitBlock, LabProjectFormData } from "@/types/lab";

// --- Block Renderers (Editable) ---

function EditableTextBlock({ block, onChange }: { block: TextBlock, onChange: (b: TextBlock) => void }) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase">Metin İçeriği (HTML)</label>
            <textarea
                className="w-full bg-background border border-border rounded-lg p-3 min-h-[100px] font-mono text-sm"
                value={block.content}
                onChange={(e) => onChange({ ...block, content: e.target.value })}
                placeholder="<p>Buraya metin...</p>"
            />
        </div>
    )
}

function EditableImageFullBlock({ block, onChange }: { block: ImageFullBlock, onChange: (b: ImageFullBlock) => void }) {
    return (
        <div className="space-y-4">
            <div>
                <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Tam Ekran Görsel</label>
                <ImageUpload value={block.url} onChange={(url) => onChange({ ...block, url })} />
            </div>
            <input
                type="text"
                placeholder="Görsel Alt Metni (SEO)"
                className="w-full bg-background border border-border rounded p-2 text-sm"
                value={block.alt || ''}
                onChange={(e) => onChange({ ...block, alt: e.target.value })}
            />
            <input
                type="text"
                placeholder="Görsel Altı Yazısı (Caption - Opsiyonel)"
                className="w-full bg-background border border-border rounded p-2 text-sm"
                value={block.caption || ''}
                onChange={(e) => onChange({ ...block, caption: e.target.value })}
            />
        </div>
    )
}

function EditableImageSplitBlock({ block, onChange }: { block: ImageSplitBlock, onChange: (b: ImageSplitBlock) => void }) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase block">Sol Görsel</label>
                <ImageUpload value={block.leftUrl} onChange={(url) => onChange({ ...block, leftUrl: url })} />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase block">Sağ Görsel</label>
                <ImageUpload value={block.rightUrl} onChange={(url) => onChange({ ...block, rightUrl: url })} />
            </div>
        </div>
    )
}

// --- Sortable Block Wrapper ---

function SortableBlock({ block, onChange, onRemove }: { block: ContentBlock, onChange: (b: ContentBlock) => void, onRemove: () => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: block.id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    let content;
    switch (block.type) {
        case 'text':
            content = <EditableTextBlock block={block as TextBlock} onChange={onChange as any} />
            break;
        case 'image-full':
            content = <EditableImageFullBlock block={block as ImageFullBlock} onChange={onChange as any} />
            break;
        case 'image-split':
            content = <EditableImageSplitBlock block={block as ImageSplitBlock} onChange={onChange as any} />
            break;
    }

    return (
        <div ref={setNodeRef} style={style} className="group relative bg-muted/30 border border-border rounded-xl p-4 mb-4">
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 cursor-grab active:cursor-grabbing hover:bg-muted rounded" {...attributes} {...listeners}>
                    <GripVertical className="w-4 h-4" />
                </button>
                <button onClick={onRemove} className="p-2 hover:bg-red-500/10 text-red-500 rounded">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
            <div className="mr-12">
                {content}
            </div>
        </div>
    )
}

// --- Main Form Component ---

export default function LabProjectForm({ initialData, onSubmit, loading }: { initialData?: Partial<LabProjectFormData>, onSubmit: (data: LabProjectFormData) => void, loading: boolean }) {
    const [formData, setFormData] = useState<LabProjectFormData>({
        internalName: initialData?.internalName || '',
        publicTitle: initialData?.publicTitle || '',
        slug: initialData?.slug || '',
        description: initialData?.description || '',
        isLabProject: true,
        liveUrl: initialData?.liveUrl || '',
        thumbnail: initialData?.thumbnail || '',
        heroImage: initialData?.heroImage || '',
        year: initialData?.year || new Date().getFullYear().toString(),
        tags: initialData?.tags || [],
        contentBlocks: (initialData?.contentBlocks as ContentBlock[]) || [],
        client: initialData?.client // Keep if needed
    })

    const [tagInput, setTagInput] = useState('')

    // --- Block Handlers ---
    const addBlock = (type: 'text' | 'image-full' | 'image-split') => {
        const newBlock = { id: `block-${Date.now()}`, type } as ContentBlock
        if (type === 'text') (newBlock as TextBlock).content = ''
        if (type === 'image-full') (newBlock as ImageFullBlock).url = ''
        if (type === 'image-split') { (newBlock as ImageSplitBlock).leftUrl = ''; (newBlock as ImageSplitBlock).rightUrl = '' }

        setFormData(prev => ({ ...prev, contentBlocks: [...prev.contentBlocks, newBlock] }))
    }

    const updateBlock = (updatedBlock: ContentBlock) => {
        setFormData(prev => ({
            ...prev,
            contentBlocks: prev.contentBlocks.map(b => b.id === updatedBlock.id ? updatedBlock : b)
        }))
    }

    const removeBlock = (id: string) => {
        setFormData(prev => ({ ...prev, contentBlocks: prev.contentBlocks.filter(b => b.id !== id) }))
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setFormData(prev => {
                const oldIndex = prev.contentBlocks.findIndex(b => b.id === active.id);
                const newIndex = prev.contentBlocks.findIndex(b => b.id === over.id);
                return { ...prev, contentBlocks: arrayMove(prev.contentBlocks, oldIndex, newIndex) }
            })
        }
    }

    // --- Tag Handlers ---
    const addTag = () => {
        if (!tagInput.trim()) return
        if (!formData.tags.includes(tagInput.trim())) {
            setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }))
        }
        setTagInput('')
    }

    // --- Submit ---
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-20">
            {/* Top Section: Basic Info */}
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
                        <h3 className="font-bold text-lg">Temel Bilgiler</h3>
                        <div>
                            <label className="block text-sm font-medium mb-1">Admin İsmi (Internal)</label>
                            <input type="text" className="w-full bg-background border border-border rounded-lg p-3 outline-none focus:border-emerald-500"
                                value={formData.internalName} onChange={e => setFormData({ ...formData, internalName: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Public Başlık (Sitede Görünen)</label>
                            <input type="text" className="w-full bg-background border border-border rounded-lg p-3 outline-none focus:border-emerald-500"
                                value={formData.publicTitle} onChange={e => setFormData({ ...formData, publicTitle: e.target.value })} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Yıl</label>
                                <input type="text" className="w-full bg-background border border-border rounded-lg p-3"
                                    value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Canlı Link</label>
                                <input type="url" className="w-full bg-background border border-border rounded-lg p-3"
                                    value={formData.liveUrl} onChange={e => setFormData({ ...formData, liveUrl: e.target.value })} placeholder="https://..." />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Slug (URL)</label>
                            <input type="text" className="w-full bg-muted border border-border rounded-lg p-3 text-sm font-mono"
                                value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} placeholder="Otomatik oluşturulur..." />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
                        <h3 className="font-bold text-lg">Medyalar</h3>
                        <div>
                            <label className="block text-sm font-medium mb-2">Liste Görseli (Thumbnail)</label>
                            <ImageUpload value={formData.thumbnail} onChange={url => setFormData({ ...formData, thumbnail: url })} label="Kare veya Yatay" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Dev Kapak (Hero Image)</label>
                            <ImageUpload value={formData.heroImage} onChange={url => setFormData({ ...formData, heroImage: url })} label="1920x1080 px" />
                        </div>
                    </div>

                    <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
                        <h3 className="font-bold text-lg">Etiketler</h3>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                className="flex-1 bg-background border border-border rounded-lg p-2"
                                value={tagInput}
                                onChange={e => setTagInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                placeholder="React, Next.js..."
                            />
                            <button type="button" onClick={addTag} className="bg-muted px-4 rounded-lg font-bold">+</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.tags.map(tag => (
                                <span key={tag} className="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded text-xs flex items-center gap-1">
                                    {tag}
                                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))} className="hover:text-red-500">×</button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Blocks Editor */}
            <div className="bg-card border border-border p-8 rounded-3xl min-h-[400px]">
                <h3 className="font-bold text-2xl mb-6">İçerik Blokları</h3>

                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={formData.contentBlocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-4">
                            {formData.contentBlocks.map(block => (
                                <SortableBlock key={block.id} block={block} onChange={updateBlock} onRemove={() => removeBlock(block.id)} />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>

                {formData.contentBlocks.length === 0 && (
                    <div className="text-center py-10 border-2 border-dashed border-border rounded-xl mb-6 opacity-50">
                        Blok eklenmemiş. Aşağıdan seçin.
                    </div>
                )}

                <div className="flex flex-wrap justify-center gap-4 mt-8 pt-8 border-t border-border">
                    <button type="button" onClick={() => addBlock('text')} className="flex items-center gap-2 px-5 py-3 bg-muted hover:bg-muted/80 rounded-xl transition-all">
                        <Type className="w-5 h-5 text-blue-500" /> Metin Bloğu
                    </button>
                    <button type="button" onClick={() => addBlock('image-full')} className="flex items-center gap-2 px-5 py-3 bg-muted hover:bg-muted/80 rounded-xl transition-all">
                        <ImageIcon className="w-5 h-5 text-purple-500" /> Tam Görsel
                    </button>
                    <button type="button" onClick={() => addBlock('image-split')} className="flex items-center gap-2 px-5 py-3 bg-muted hover:bg-muted/80 rounded-xl transition-all">
                        <Columns className="w-5 h-5 text-orange-500" /> İkili Görsel
                    </button>
                </div>
            </div>

            {/* Sticky Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur border-t border-border z-50 flex justify-end gap-4 max-w-7xl mx-auto w-full">
                <button type="submit" disabled={loading} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg transition-all disabled:opacity-50">
                    {loading ? 'Kaydediliyor...' : 'Projeyi Yayınla'}
                </button>
            </div>
        </form>
    )
}
