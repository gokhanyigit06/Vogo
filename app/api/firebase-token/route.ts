import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

function getAdminApp() {
    if (getApps().length > 0) return getApps()[0]
    return initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
    }, 'admin')
}

export async function GET() {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const adminApp = getAdminApp()
        const adminAuth = getAuth(adminApp)

        // Create a custom token for this admin user
        const uid = `admin_${session.user.email?.replace(/[^a-zA-Z0-9]/g, '_') || 'user'}`
        const customToken = await adminAuth.createCustomToken(uid, {
            role: 'admin',
        })

        return NextResponse.json({ token: customToken })
    } catch (error) {
        console.error('Firebase token error:', error)
        return NextResponse.json({ error: 'Token oluşturulamadı' }, { status: 500 })
    }
}
