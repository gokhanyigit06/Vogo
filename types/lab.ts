export type BlockType = 'text' | 'image-full' | 'image-split';

export interface BaseBlock {
    id: string;
    type: BlockType;
}

export interface TextBlock extends BaseBlock {
    type: 'text';
    content: string; // HTML content from RichTextEditor
}

export interface ImageFullBlock extends BaseBlock {
    type: 'image-full';
    url: string;
    alt?: string;
    caption?: string;
}

export interface ImageSplitBlock extends BaseBlock {
    type: 'image-split';
    leftUrl: string;
    leftAlt?: string;
    rightUrl: string;
    rightAlt?: string;
}

export type ContentBlock = TextBlock | ImageFullBlock | ImageSplitBlock;

export interface LabProjectFormData {
    internalName: string;
    publicTitle: string;
    slug: string;
    description: string;
    isLabProject: true;
    client?: string; // Client ID or name if needed, but schema says relation
    year?: string;
    liveUrl?: string;
    thumbnail?: string;
    heroImage?: string;
    tags: string[];
    contentBlocks: ContentBlock[];
}
