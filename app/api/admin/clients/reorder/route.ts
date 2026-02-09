
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
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

        // Transaction to update all items safely
        await prisma.$transaction(
            items.map((item: { id: number; order: number }) =>
                prisma.client.update({
                    where: { id: item.id },
                    data: { order: item.order },
                })
            )
        )

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Reorder error:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
