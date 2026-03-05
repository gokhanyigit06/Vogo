import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const projectsRef = collection(db, "projects")
        const projectsSnapshot = await getDocs(projectsRef)
        const projectsData = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

        const receivables = []

        for (const project of projectsData) {
            const p = project as any

            // Client bilgisini çek
            let clientData = null
            if (p.clientId) {
                const clientDoc = await getDoc(doc(db, "clients", p.clientId))
                if (clientDoc.exists()) {
                    clientData = clientDoc.data()
                }
            }

            // Project Income (Sadece bu projeye ait gelirler) çek
            let projectIncome = 0
            const incomeQ = query(collection(db, "income"), where("projectId", "==", p.id))
            const incomeSnapshot = await getDocs(incomeQ)
            incomeSnapshot.forEach(incDoc => {
                projectIncome += Number(incDoc.data().amount || 0)
            })

            const budget = Number(p.budget || 0)
            const remaining = budget - projectIncome

            if (remaining > 0) {
                receivables.push({
                    projectId: p.id,
                    projectName: p.publicTitle || p.title || p.internalName || p.name,
                    clientName: clientData?.name,
                    companyName: clientData?.company,
                    clientPhone: clientData?.phone,
                    clientEmail: clientData?.email,
                    budget: budget,
                    paid: projectIncome,
                    remaining: remaining
                })
            }
        }

        // Toplam alacak sırasına göre diz
        receivables.sort((a, b) => b.remaining - a.remaining)

        return NextResponse.json(receivables)
    } catch (error: unknown) {
        console.error('Receivables API error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
