"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { UsersRound, UserPlus, Trash2, Mail, Lock } from "lucide-react"
import ImageUpload from "@/components/ImageUpload"

export default function TeamPage() {
    const [team, setTeam] = useState<any[]>([])
    const [showForm, setShowForm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedMember, setSelectedMember] = useState<any>(null) // Düzenleme için
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "user",
        avatar_url: ""
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
            const method = selectedMember ? 'PUT' : 'POST'
            const body = selectedMember
                ? JSON.stringify({ id: selectedMember.id, ...formData })
                : JSON.stringify(formData)

            const res = await fetch('/api/team', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body
            })

            const result = await res.json()

            if (!res.ok) throw new Error(result.error || 'İşlem başarısız')

            alert(selectedMember ? 'Kullanıcı güncellendi!' : 'Kullanıcı eklendi!')
            setShowForm(false)
            setSelectedMember(null)
            setFormData({ name: "", email: "", password: "", role: "user", avatar_url: "" })
            fetchTeam()
        } catch (error: any) {
            alert(error.message || 'Bir hata oluştu!')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Bu kullanıcıyı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) return

        try {
            const res = await fetch(`/api/team?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                setTeam(team.filter(t => t.id !== id))
                alert('Kullanıcı silindi')
            } else {
                alert('Silme işlemi başarısız')
            }
        } catch (error) {
            alert('Silme hatası')
        }
    }

    const getRoleBadge = (role: string) => {
        const r = role?.toLowerCase()
        switch (r) {
            case 'admin': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            case 'manager': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
            default: return 'bg-slate-700/50 text-muted-foreground border-border'
        }
    }

    const getRoleText = (role: string) => {
        const r = role?.toLowerCase()
        switch (r) {
            case 'admin': return 'Yönetici'
            case 'manager': return 'Müdür'
            default: return 'Kullanıcı'
        }
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                        <UsersRound className="w-8 h-8 text-emerald-500" />
                        Ekip Yönetimi
                    </h1>
                    <p className="text-muted-foreground mt-1">Sisteme giriş yapabilecek kullanıcıları yönetin</p>
                </div>
                <button
                    onClick={() => {
                        setShowForm(!showForm)
                        setSelectedMember(null)
                        setFormData({ name: "", email: "", password: "", role: "user", avatar_url: "" })
                    }}
                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                    <UserPlus className="w-5 h-5" />
                    {showForm ? 'Formu Gizle' : 'Kullanıcı Ekle'}
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-card border border-border rounded-notebook p-6 space-y-6">
                    <h2 className="text-lg font-bold text-foreground border-b border-border pb-3">
                        {selectedMember ? 'Kullanıcıyı Düzenle' : 'Yeni Kullanıcı'}
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <ImageUpload
                                label="Profil Fotoğrafı"
                                value={formData.avatar_url}
                                onChange={(url) => setFormData({ ...formData, avatar_url: url })}
                                className="w-full md:w-1/3"
                            />
                        </div>

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
                            <label className="block text-muted-foreground text-sm font-medium mb-2 flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                {selectedMember ? 'Yeni Şifre (Opsiyonel)' : 'Şifre *'}
                            </label>
                            <input
                                type="password"
                                required={!selectedMember}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
                                placeholder={selectedMember ? "Değiştirmek için yeni şifre girin" : "Güçlü bir şifre girin"}
                            />
                        </div>

                        <div>
                            <label className="block text-muted-foreground text-sm font-medium mb-2">Rol</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
                            >
                                <option value="user">Kullanıcı</option>
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
                        {loading ? (selectedMember ? 'Güncelleniyor...' : 'Ekleniyor...') : (selectedMember ? 'Güncelle' : 'Kullanıcı Ekle')}
                    </button>
                </form>
            )}

            {/* Team List */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {team.length === 0 ? (
                    <div className="col-span-full p-12 text-center bg-card border border-border rounded-notebook">
                        <UsersRound className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                        <p className="text-muted-foreground">Henüz kullanıcı eklenmemiş</p>
                    </div>
                ) : (
                    team.map((member) => (
                        <div
                            key={member.id}
                            className="bg-card border border-border rounded-notebook p-6 hover:border-emerald-500/30 transition-all group relative cursor-pointer"
                            onClick={() => {
                                setSelectedMember(member)
                                setFormData({
                                    name: member.name,
                                    email: member.email,
                                    password: "", // Şifre güvenlik nedeniyle boş gelir
                                    role: member.role || "user",
                                    avatar_url: member.avatar_url || ""
                                })
                                setShowForm(true)
                            }}
                        >
                            {/* Actions */}
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleDelete(member.id)
                                    }}
                                    className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                                    title="Sil"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex flex-col items-center text-center">
                                {/* Avatar */}
                                <div className="w-20 h-20 rounded-full border-2 border-border mb-4 overflow-hidden bg-muted flex items-center justify-center relative">
                                    {member.avatar_url ? (
                                        <img src={member.avatar_url} alt={member.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-2xl font-bold text-muted-foreground">
                                            {member.name?.charAt(0).toUpperCase() || '?'}
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-lg font-bold text-foreground mb-1">{member.name}</h3>

                                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border mb-3 ${getRoleBadge(member.role)}`}>
                                    {getRoleText(member.role)}
                                </span>

                                <div className="w-full pt-4 border-t border-border mt-2 space-y-2">
                                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                        <Mail className="w-3.5 h-3.5" />
                                        {member.email}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
