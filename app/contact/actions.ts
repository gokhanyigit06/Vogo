'use server'

import prisma from '@/lib/prisma'

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

        console.log('📝 Inserting message via Prisma...')

        const message = await prisma.message.create({
            data: {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                subject: formData.subject.trim(),
                message: formData.message.trim()
            }
        })

        console.log('✅ Message saved:', message)

        return {
            success: true,
            message: 'Mesajınız başarıyla gönderildi! En kısa sürede sizinle iletişime geçeceğiz.',
            data: message
        }

    } catch (error) {
        console.error('💥 Contact form error:', error)
        return {
            success: false,
            error: 'Bir hata oluştu. Lütfen tekrar deneyin.'
        }
    }
}
