import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { doc, writeBatch } from "firebase/firestore"
import { auth } from "@/lib/auth"

export async function POST(req: Request) {
    try {
        const session = await auth()

        // Basic auth check
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { items } = body

        if (!Array.isArray(items)) {
            return new NextResponse("Invalid data format", { status: 400 })
        }

        const batch = writeBatch(db)

        items.forEach((item: { id: string; order: number }) => {
            if (item.id) {
                const docRef = doc(db, "clients", item.id)
                batch.update(docRef, { order: Number(item.order) })
            }
        })

        await batch.commit()

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Reorder error:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
