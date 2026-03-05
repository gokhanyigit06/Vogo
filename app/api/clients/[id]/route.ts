import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore'

export const dynamic = 'force-dynamic'

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params

        // Müşteri bilgilerini çek
        const clientDoc = await getDoc(doc(db, "clients", id))
        if (!clientDoc.exists()) {
            return NextResponse.json({ error: 'Müşteri bulunamadı' }, { status: 404 })
        }

        const clientData = clientDoc.data()

        // Müşteriye ait projeleri çek (orderBy requires a composite index, we might need to sort in memory if index is missing)
        let projects: any[] = []
        try {
            const projectsQuery = query(
                collection(db, "projects"),
                where("clientId", "==", id)
            )
            const pSnapshot = await getDocs(projectsQuery)
            projects = pSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            projects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        } catch (e) {
            console.error("fetch projects error:", e)
        }

        // Müşteriye ait gelirleri çek
        let income: any[] = []
        try {
            const incomeQuery = query(
                collection(db, "income"),
                where("clientId", "==", id)
            )
            const iSnapshot = await getDocs(incomeQuery)
            income = iSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            income.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        } catch (e) {
            console.error("fetch income error:", e)
        }

        const client = {
            id: clientDoc.id,
            ...clientData,
            projects: projects,
            income: income
        }

        return NextResponse.json(client)

    } catch (error: unknown) {
        console.error('Client Detail Error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
