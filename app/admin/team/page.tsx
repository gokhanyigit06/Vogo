"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { UsersRound, UserPlus, Trash2 } from "lucide-react"

export default function TeamPage() {
    const [team, setTeam] = useState<any[]>([])
    const [showForm, setShowForm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "member",
    })

    useEffect(() => {
        fetchTeam()
    }, [])

    const fetchTeam = async () => {
        try {
            const res = await fetch('/api/team')
            const data = await res.json()
            setTeam(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Fetch error:', error)
            setTeam([])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/team', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (!res.ok) throw new Error('Eklenemedi')

            alert('Takım üyesi eklendi!')
            setShowForm(false)
            setFormData({ name: "", email: "", role: "member" })
            fetchTeam()
        } catch (error) {
            alert('Bir hata oluştu!')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Bu üyeyi silmek istediğinize emin misiniz?')) return

        try {
            const res = await fetch(`/api/team?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                setTeam(team.filter(t => t.id !== id))
                alert('Üye silindi')
            }
        } catch (error) {
            alert('Silme hatası')
        }
    }

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            case 'manager': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
            default: return 'bg-slate-700/50 text-muted-foreground border-border'
        }
    }

    const getRoleText = (role: string) => {
        switch (role) {
            case 'admin': return 'Yönetici'
            case 'manager': return 'Müdür'
            default: return 'Üye'
        }
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                        <UsersRound className="w-8 h-8 text-emerald-500" />
                        Takım Üyeleri
                    </h1>
                    <p className="text-muted-foreground mt-1">Ekip arkadaşlarınızı yönetin</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                    <UserPlus className="w-5 h-5" />
                    {showForm ? 'Formu Gizle' : 'Üye Ekle'}
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-card border border-border rounded-notebook p-6 space-y-4">
                    <h2 className="text-lg font-bold text-foreground border-b border-border pb-3">Yeni Takım Üyesi</h2>

                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-muted-foreground text-sm font-medium mb-2">İsim Soyisim *</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
                                placeholder="Ahmet Yılmaz"
                            />
                        </div>

                        <div>
                            <label className="block text-muted-foreground text-sm font-medium mb-2">E-posta *</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
                                placeholder="ahmet@firma.com"
                            />
                        </div>

                        <div>
                            <label className="block text-muted-foreground text-sm font-medium mb-2">Rol</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
                            >
                                <option value="member">Üye</option>
                                <option value="manager">Müdür</option>
                                <option value="admin">Yönetici</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl font-bold transition-all"
                    >
                        {loading ? 'Ekleniyor...' : 'Üye Ekle'}
                    </button>
                </form>
            )}

            {/* Team List */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {team.length === 0 ? (
                    <div className="col-span-full p-12 text-center bg-card border border-border rounded-notebook">
                        <UsersRound className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                        <p className="text-muted-foreground">Henüz takım üyesi eklenmemiş</p>
                    </div>
                ) : (
                    team.map((member) => (
                        <div key={member.id} className="bg-card border border-border rounded-notebook p-6 hover:border-emerald-500/30 transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-foreground mb-1">{member.name}</h3>
                                    <p className="text-muted-foreground text-sm">{member.email}</p>
                                </div>
                                <span className={`text-xs px-2.5 py-1 rounded-md font-medium border ${getRoleBadge(member.role)}`}>
                                    {getRoleText(member.role)}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 pt-4 border-t border-border">
                                <button
                                    onClick={() => handleDelete(member.id)}
                                    className="flex-1 p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors flex items-center justify-center gap-2 text-sm"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Sil
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
