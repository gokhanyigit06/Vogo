import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore'

// GET - Tüm gelirleri getir
export async function GET() {
    try {
        const incomeQuery = query(collection(db, "income"), orderBy("date", "desc"))
        const incomeSnapshot = await getDocs(incomeQuery)

        const incomeData = incomeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

        // Fetch related client and project data
        for (let i = 0; i < incomeData.length; i++) {
            const inc = incomeData[i] as any;
            if (inc.clientId) {
                const clientDoc = await getDoc(doc(db, "clients", inc.clientId))
                if (clientDoc.exists()) {
                    const cData = clientDoc.data()
                    inc.client = { id: clientDoc.id, name: cData.name, company: cData.company }
                }
            }
            if (inc.projectId) {
                const projectDoc = await getDoc(doc(db, "projects", inc.projectId))
                if (projectDoc.exists()) {
                    const pData = projectDoc.data()
                    inc.project = { id: projectDoc.id, title: pData.title || pData.publicTitle, name: pData.name || pData.internalName }
                }
            }
        }

        return NextResponse.json(incomeData)
    } catch (error: unknown) {
        console.error('Income GET error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// POST - Yeni gelir ekle
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const newIncome = {
            amount: parseFloat(body.amount),
            date: new Date(body.date).toISOString(),
            category: body.category || 'payment',
            paymentMethod: body.payment_method || body.paymentMethod || null,
            invoiceNumber: body.invoice_number || body.invoiceNumber || null,
            description: body.description || null,
            status: body.status || 'paid',
            isPaid: body.is_paid !== false,
            clientId: body.client_id ? String(body.client_id) : null,
            projectId: body.project_id ? String(body.project_id) : null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        const docRef = await addDoc(collection(db, "income"), newIncome)

        // Müşteri bakiyesini güncelle
        if (newIncome.clientId) {
            await updateClientBalance(newIncome.clientId)
        }

        return NextResponse.json({ id: docRef.id, ...newIncome })
    } catch (error: unknown) {
        console.error('Income POST error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// PUT - Gelir güncelle
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, client_id, project_id, payment_method, invoice_number, is_paid, ...rest } = body

        if (!id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
        }

        const updateData: any = {
            ...rest,
            updatedAt: new Date().toISOString()
        }

        if (rest.amount) updateData.amount = parseFloat(rest.amount)
        if (rest.date) updateData.date = new Date(rest.date).toISOString()
        if (payment_method !== undefined) updateData.paymentMethod = payment_method
        if (invoice_number !== undefined) updateData.invoiceNumber = invoice_number
        if (is_paid !== undefined) updateData.isPaid = is_paid
        if (client_id !== undefined) updateData.clientId = client_id ? String(client_id) : null
        if (project_id !== undefined) updateData.projectId = project_id ? String(project_id) : null

        const incomeRef = doc(db, "income", id)
        await updateDoc(incomeRef, updateData)

        // Müşteri bakiyesini güncelle (eski client id'yi de güncellemek gerekir ama şimdilik yeni gelene göre yapıyoruz)
        if (updateData.clientId) {
            await updateClientBalance(updateData.clientId)
        }

        return NextResponse.json({ id, ...updateData })
    } catch (error: unknown) {
        console.error('Income PUT error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// DELETE - Gelir sil
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
        }

        const incomeDoc = await getDoc(doc(db, "income", id))
        if (!incomeDoc.exists()) {
            return NextResponse.json({ error: 'Gelir bulunamadı' }, { status: 404 })
        }
        const incomeData = incomeDoc.data()

        await deleteDoc(doc(db, "income", id))

        // Müşteri bakiyesini güncelle
        if (incomeData.clientId) {
            await updateClientBalance(incomeData.clientId)
        }

        return NextResponse.json({ success: true })
    } catch (error: unknown) {
        console.error('Income DELETE error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// Helper: Müşteri bakiyesini güncelle
async function updateClientBalance(clientId: string) {
    try {
        const incomesQuery = query(collection(db, "income"), where("clientId", "==", clientId))
        const snapshot = await getDocs(incomesQuery)

        const incomes = snapshot.docs.map(doc => doc.data())

        const totalRevenue = incomes.reduce((sum, i) => sum + Number(i.amount || 0), 0)
        const totalPaid = incomes
            .filter(i => i.status === 'paid' || i.isPaid)
            .reduce((sum, i) => sum + Number(i.amount || 0), 0)

        const clientRef = doc(db, "clients", clientId)
        await updateDoc(clientRef, {
            totalRevenue,
            totalPaid,
            balance: totalRevenue - totalPaid,
            lastTransactionDate: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        })
    } catch (e) {
        console.error("updateClientBalance Error:", e)
    }
}
