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
            let teamList = []

            if (Array.isArray(data) && data.length > 0) {
                teamList = data.filter((m: any) => m.active)
            } else if (process.env.NODE_ENV === 'development') {
                teamList = require('@/lib/mock-data').MOCK_TEAM
            }

            // 2. Authenticated user'ı ekle
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (user && user.email) {
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
                    teamList = [currentUser, ...teamList]
                }
            }

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
