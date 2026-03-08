import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || 'en'

    try {
        const filePath = path.join(process.cwd(), 'messages', `${locale}.json`)
        const fileContent = fs.readFileSync(filePath, 'utf8')
        return NextResponse.json(JSON.parse(fileContent))
    } catch (error) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }
}

export async function POST(request: Request) {
    const body = await request.json()
    const { locale, messages } = body

    if (!locale || !messages) {
        return NextResponse.json({ error: 'Missing locale or messages' }, { status: 400 })
    }

    try {
        const filePath = path.join(process.cwd(), 'messages', `${locale}.json`)
        // Ensure directory exists
        const dirPath = path.join(process.cwd(), 'messages')
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath)
        }

        fs.writeFileSync(filePath, JSON.stringify(messages, null, 4), 'utf8')
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error saving messages:', error)
        return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
    }
}
