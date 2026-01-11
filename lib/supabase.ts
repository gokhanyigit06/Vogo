import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Build sırasında env değişkenleri yoksa patlamaması için fallback
const url = supabaseUrl && supabaseUrl.startsWith('http')
    ? supabaseUrl
    : 'https://placeholder.supabase.co'

const key = supabaseAnonKey || 'placeholder-key'

if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window !== 'undefined') {
        // Sadece tarayıcıda (çalışma zamanında) uyarı ver, build sırasında verme
        console.warn('Supabase URL/Key eksik! .env.local veya Vercel Env Vars kontrol ediniz.')
    }
}

// Singleton pattern - sadece bir kere oluştur
let supabaseInstance: SupabaseClient | null = null

export const supabase = (() => {
    if (!supabaseInstance) {
        supabaseInstance = createClient(url, key, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true
            }
        })
    }
    return supabaseInstance
})()

// Admin Client (Service Role) - RLS Bypass
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
let supabaseAdminInstance: SupabaseClient | null = null

export const supabaseAdmin = (() => {
    if (!supabaseAdminInstance && serviceRoleKey) {
        supabaseAdminInstance = createClient(url, serviceRoleKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        })
    }
    return supabaseAdminInstance || supabase
})()
