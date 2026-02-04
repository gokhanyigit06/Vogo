import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

export interface TeamMember {
    id: string | number
    name: string
    email?: string
    role?: string
    avatar_url?: string // UI uses avatar_url
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
            if (!res.ok) throw new Error('Failed to fetch team')

            const data = await res.json()
            let teamList: TeamMember[] = Array.isArray(data) ? data : []

            // 2. Authenticated user'ı kontrol et ve gerekirse ekle (API henüz dönmediyse veya senkronizasyon sorunu varsa)
            if (session?.user?.email) {
                const userEmail = session.user.email
                // Email bazında kontrol et
                const userExists = teamList.some((m) => m.email === userEmail)

                if (!userExists) {
                    const currentUser: TeamMember = {
                        id: session.user.id || 'current-user',
                        name: session.user.name || userEmail.split('@')[0],
                        email: userEmail,
                        role: (session.user as any).role || 'user',
                        avatar_url: session.user.image || '',
                        active: true
                    }
                    // Listeye ekle
                    teamList = [currentUser, ...teamList]
                }
            }

            setTeam(teamList)
        } catch (err) {
            console.error("Team fetch error:", err)
            setTeam([]) // Mock data yerine boş liste dön
        } finally {
            setLoading(false)
        }
    }

    return { team, loading, refetch: fetchTeamWithCurrentUser }
}
