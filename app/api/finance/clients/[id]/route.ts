import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

export const dynamic = 'force-dynamic'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const clientDoc = await getDoc(doc(db, "clients", id))
        if (!clientDoc.exists()) {
            return NextResponse.json({ error: 'Müşteri bulunamadı' }, { status: 404 })
        }

        return NextResponse.json({ id: clientDoc.id, ...clientDoc.data() })
    } catch (error: unknown) {
        console.error('Client Detail Error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
