
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Fallback değerler (Build hatasını önlemek için)
    const url = supabaseUrl && supabaseUrl.length > 0 ? supabaseUrl : 'https://placeholder.supabase.co'
    const key = supabaseKey && supabaseKey.length > 0 ? supabaseKey : 'placeholder'

    return createBrowserClient(url, key)
}
