import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> } // Next.js 15+ tipi
) {
    try {
        const { id } = await context.params

        // 1. Müşteri bilgilerini çek
        const { data: client, error: clientError } = await supabase
            .from('clients')
            .select('*')
            .eq('id', id)
            .single()

        if (clientError) throw clientError

        // 2. Projelerini çek
        const { data: projects, error: projectsError } = await supabase
            .from('projects')
            .select('*')
            .eq('client_id', id)
            .order('created_at', { ascending: false })

        if (projectsError) throw projectsError

        // 3. Ödemelerini (Gelirleri) çek
        const { data: income, error: incomeError } = await supabase
            .from('income')
            .select('*')
            .eq('client_id', id)
            .order('date', { ascending: false })

        if (incomeError) throw incomeError

        return NextResponse.json({
            ...client,
            projects: projects || [],
            income: income || []
        })

    } catch (error: any) {
        console.error('Client Detail Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
