import WorkEditorClient from "@/components/admin/WorkEditorClient"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"

interface Props {
    params: Promise<{ id: string; locale: string }>
}

export default async function EditWorkPage({ params }: Props) {
    const { id } = await params
    let initialData = null

    try {
        const snap = await getDoc(doc(db, "projects", id))
        if (snap.exists()) {
            const d = snap.data()
            initialData = {
                publicTitle: d.publicTitle || d.title || d.name || "",
                description: d.description || "",
                thumbnail: d.thumbnail || d.image || "",
                thumbnailType: d.thumbnailType || "image",
                category: d.category || "",
                industry: d.industry || "",
                year: d.year || new Date().getFullYear().toString(),
                liveUrl: d.liveUrl || d.websiteUrl || "",
                tags: d.tags || [],
                scope: d.scope || [],
                status: d.status || "published",
                showOnHomepage: d.showOnHomepage ?? false,
                accordionImage: d.accordionImage || "",
                accordionImageType: d.accordionImageType || "image",
                contentBlocks: d.contentBlocks || [],
            }
        }
    } catch { }

    return <WorkEditorClient projectId={id} initialData={initialData} />
}
