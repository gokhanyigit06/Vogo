'use server'

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export interface ContactFormData {
    name: string
    email: string
    phone?: string
    subject: string
    message: string
}

// Simple validation function
function validateContactForm(data: ContactFormData): string | null {
    if (!data.name || data.name.trim().length < 2) {
        return 'İsim en az 2 karakter olmalıdır'
    }
    if (data.name.length > 100) {
        return 'İsim çok uzun'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!data.email || !emailRegex.test(data.email)) {
        return 'Geçerli bir email adresi giriniz'
    }

    if (!data.subject || data.subject.trim().length < 3) {
        return 'Konu en az 3 karakter olmalıdır'
    }
    if (data.subject.length > 200) {
        return 'Konu çok uzun'
    }

    if (!data.message || data.message.trim().length < 10) {
        return 'Mesaj en az 10 karakter olmalıdır'
    }
    if (data.message.length > 2000) {
        return 'Mesaj çok uzun'
    }

    return null
}

export async function submitContactForm(formData: ContactFormData) {
    try {
        // Validate form data
        const validationError = validateContactForm(formData)
        if (validationError) {
            return {
                success: false,
                error: validationError
            }
        }

        // Create Supabase client
        const cookieStore = await cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        cookieStore.set(name, value, options)
                    },
                    remove(name: string, options: CookieOptions) {
                        cookieStore.set(name, '', options)
                    }
                }
            }
        )

        // Insert message into database
        const { data, error } = await supabase
            .from('messages')
            .insert([
                {
                    name: formData.name.trim(),
                    email: formData.email.trim().toLowerCase(),
                    phone: formData.phone?.trim() || null,
                    subject: formData.subject.trim(),
                    message: formData.message.trim(),
                    status: 'unread',
                    created_at: new Date().toISOString()
                }
            ])
            .select()
            .single()

        if (error) {
            console.error('❌ Supabase error:', error)
            return {
                success: false,
                error: 'Mesaj gönderilemedi. Lütfen tekrar deneyin.'
            }
        }

        console.log('✅ Message saved:', data)

        return {
            success: true,
            message: 'Mesajınız başarıyla gönderildi! En kısa sürede sizinle iletişime geçeceğiz.',
            data
        }

    } catch (error) {
        console.error('💥 Contact form error:', error)
        return {
            success: false,
            error: 'Bir hata oluştu. Lütfen tekrar deneyin.'
        }
    }
}
