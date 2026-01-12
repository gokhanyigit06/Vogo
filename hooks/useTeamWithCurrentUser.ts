import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'

export function useTeamWithCurrentUser() {
    const [team, setTeam] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchTeamWithCurrentUser()
    }, [])

    const fetchTeamWithCurrentUser = async () => {
        try {
            // 1. Team listesini al
            const res = await fetch('/api/team')
            const data = await res.json()

            console.log('📡 API Response:', data)
            console.log('🔧 NODE_ENV:', process.env.NODE_ENV)

            let teamList = []

            if (Array.isArray(data) && data.length > 0) {
                // Active kontrolü KALDIRILDI - tüm team memberları göster
                teamList = data
                console.log('✅ Using API data:', teamList)
            } else {
                // API boş dönerse mock data kullan (her zaman)
                console.log('⚠️ Team API returned empty, using MOCK data')
                teamList = [
                    { id: 101, name: "Ahmet Yılmaz", role: "Frontend Dev", active: true, email: "ahmet@vogo.com" },
                    { id: 102, name: "Zeynep Kaya", role: "Backend Dev", active: true, email: "zeynep@vogo.com" },
                    { id: 103, name: "Mehmet Demir", role: "Designer", active: true, email: "mehmet@vogo.com" }
                ]
            }

            // 2. Authenticated user'ı kontrol et
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            console.log('🔍 Auth User:', user?.email, user?.user_metadata)
            console.log('📋 Team List BEFORE:', teamList.map((m: any) => ({ id: m.id, name: m.name, email: m.email })))

            if (user && user.email) {
                // EMAIL bazında kontrol et (aynı email = aynı kişi)
                const userExists = teamList.some((m: any) => m.email === user.email)

                // Eğer listede yoksa ekle
                if (!userExists) {
                    const currentUser = {
                        id: user.id,
                        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Ben',
                        email: user.email,
                        role: 'admin',
                        active: true
                    }
                    console.log('✅ Adding current user (not in list):', currentUser)
                    teamList = [currentUser, ...teamList]
                } else {
                    console.log('ℹ️ User already in team list (email match) - skipping')
                }
            }

            console.log('📋 Team List AFTER:', teamList.map((m: any) => ({ id: m.id, name: m.name })))
            setTeam(teamList)
        } catch (err) {
            console.error("Team fetch error:", err)
            if (process.env.NODE_ENV === 'development') {
                setTeam(require('@/lib/mock-data').MOCK_TEAM)
            }
        } finally {
            setLoading(false)
        }
    }

    return { team, loading, refetch: fetchTeamWithCurrentUser }
}
