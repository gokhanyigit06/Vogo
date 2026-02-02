import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface TeamMember {
    id: number | string
    name: string
    email?: string
    role?: string
    active?: boolean
}

export function useTeamWithCurrentUser() {
    const [team, setTeam] = useState<TeamMember[]>([])
    const [loading, setLoading] = useState(true)
    const { data: session } = useSession()

    useEffect(() => {
        fetchTeamWithCurrentUser()
    }, [session])

    const fetchTeamWithCurrentUser = async () => {
        try {
            // 1. Team listesini al
            const res = await fetch('/api/team')
            const data = await res.json()

            console.log('📡 API Response:', data)

            let teamList: TeamMember[] = []

            if (Array.isArray(data) && data.length > 0) {
                teamList = data
                console.log('✅ Using API data:', teamList)
            } else {
                // API boş dönerse mock data kullan
                console.log('⚠️ Team API returned empty, using MOCK data')
                teamList = [
                    { id: 101, name: "Ahmet Yılmaz", role: "Frontend Dev", active: true, email: "ahmet@vogo.com" },
                    { id: 102, name: "Zeynep Kaya", role: "Backend Dev", active: true, email: "zeynep@vogo.com" },
                    { id: 103, name: "Mehmet Demir", role: "Designer", active: true, email: "mehmet@vogo.com" }
                ]
            }

            // 2. Authenticated user'ı kontrol et
            if (session?.user?.email) {
                const userEmail = session.user.email
                const userName = session.user.name || userEmail.split('@')[0]

                console.log('🔍 Auth User:', userEmail, userName)

                // EMAIL bazında kontrol et (aynı email = aynı kişi)
                const userExists = teamList.some((m) => m.email === userEmail)

                // Eğer listede yoksa ekle
                if (!userExists) {
                    const currentUser: TeamMember = {
                        id: session.user.id || 'current-user',
                        name: userName,
                        email: userEmail,
                        role: 'admin',
                        active: true
                    }
                    console.log('✅ Adding current user (not in list):', currentUser)
                    teamList = [currentUser, ...teamList]
                } else {
                    console.log('ℹ️ User already in team list (email match) - skipping')
                }
            }

            console.log('📋 Team List FINAL:', teamList.map((m) => ({ id: m.id, name: m.name })))
            setTeam(teamList)
        } catch (err) {
            console.error("Team fetch error:", err)
            // Fallback mock data
            setTeam([
                { id: 101, name: "Ahmet Yılmaz", role: "Frontend Dev", active: true, email: "ahmet@vogo.com" },
                { id: 102, name: "Zeynep Kaya", role: "Backend Dev", active: true, email: "zeynep@vogo.com" },
            ])
        } finally {
            setLoading(false)
        }
    }

    return { team, loading, refetch: fetchTeamWithCurrentUser }
}
