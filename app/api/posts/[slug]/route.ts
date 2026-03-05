import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params

        // Önce slug ile dene
        const q = query(collection(db, "posts"), where("slug", "==", slug))
        const querySnapshot = await getDocs(q)

        let post = null

        if (!querySnapshot.empty) {
            post = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() }
        } else {
            // Slug bulunamazsa ID ile dene
            try {
                const docRef = doc(db, "posts", slug)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    post = { id: docSnap.id, ...docSnap.data() }
                }
            } catch (e) {
                // Ignore format error if slug is not a valid doc ID string
            }
        }

        if (post) {
            return NextResponse.json(post)
        }

        return NextResponse.json(
            { error: 'Post bulunamadı' },
            { status: 404 }
        )

    } catch (error) {
        console.error('Error fetching post:', error)
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500 }
        )
    }
}
