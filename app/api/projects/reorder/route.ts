import { NextRequest, NextResponse } from "next/server"
import { db } from '@/lib/firebase'
import { doc, writeBatch } from 'firebase/firestore'
import { auth } from "@/lib/auth"

export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        if (!session || session.user?.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { projects } = body

        if (!Array.isArray(projects)) {
            return new NextResponse("Invalid data", { status: 400 })
        }

        const batch = writeBatch(db);

        projects.forEach((p: any) => {
            if (p.id) {
                const projectRef = doc(db, "projects", p.id);
                batch.update(projectRef, { order: p.order });
            }
        });

        await batch.commit();

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Reorder error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
