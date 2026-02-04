import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
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

        // Transaction to update all orders
        await prisma.$transaction(
            projects.map((p: any) =>
                prisma.project.update({
                    where: { id: p.id },
                    data: { order: p.order }
                })
            )
        )

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Reorder error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
