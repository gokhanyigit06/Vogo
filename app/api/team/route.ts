import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

// GET - Tüm kullanıcıları (admin/manager/member) getir
export async function GET() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                image: true,
                createdAt: true
            }
        })

        // Frontend mock data yapısıyla uyumlu hale getir
        const formattedUsers = users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role, // ADMIN, EDITOR, USER
            avatar_url: user.image,
            active: true // User tablosunda active kolonu olmadığı için varsayılan true
        }))

        return NextResponse.json(formattedUsers)
    } catch (error: unknown) {
        console.error('Team GET error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// POST - Yeni kullanıcı ekle
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, email, password, role, avatar_url } = body

        if (!email || !password || !name) {
            return NextResponse.json({ error: 'İsim, E-posta ve Şifre zorunludur' }, { status: 400 })
        }

        // E-posta kullanımda mı kontrol et
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json({ error: 'Bu e-posta adresi zaten kullanımda' }, { status: 400 })
        }

        // Şifreyi hashle
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'USER',
                image: avatar_url
            }
        })

        return NextResponse.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar_url: user.image
        })

    } catch (error: unknown) {
        console.error('Team POST error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// PUT - Kullanıcı güncelle
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, name, email, password, role, avatar_url } = body

        if (!id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
        }

        const updateData: any = {
            name,
            email,
            role,
            image: avatar_url
        }

        // Eğer yeni şifre girildiyse hashle ve güncelle
        if (password && password.trim() !== '') {
            updateData.password = await bcrypt.hash(password, 10)
        }

        const user = await prisma.user.update({
            where: { id: String(id) }, // User ID string (cuid)
            data: updateData
        })

        return NextResponse.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar_url: user.image
        })

    } catch (error: unknown) {
        console.error('Team PUT error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// DELETE - Kullanıcı sil
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
        }

        await prisma.user.delete({
            where: { id: String(id) }
        })

        return NextResponse.json({ success: true })
    } catch (error: unknown) {
        console.error('Team DELETE error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
