"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Briefcase, ArrowLeft, Calendar, DollarSign, Building2, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function ProjectDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [project, setProject] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (params.id) fetchProject(params.id as string)
    }, [params.id])

    const fetchProject = async (id: string) => {
        try {
            const res = await fetch(`/api/projects?id=${id}`)
            if (!res.ok) throw new Error('Proje bulunamadı')
            const data = await res.json()
            setProject(data)
        } catch (error) {
            console.error(error)
            alert("Proje yüklenirken hata oluştu")
            router.push('/admin/projects')
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="p-8 text-slate-400">Yükleniyor...</div>
    if (!project) return <div className="p-8 text-slate-400">Proje bulunamadı.</div>

    // Stats Hesaplama
    const totalTasks = project.tasks?.length || 0
    const completedTasks = project.tasks?.filter((t: any) => t.status === 'done').length || 0
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/projects" className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-white">{project.name}</h1>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${project.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                project.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                    'bg-slate-800 text-slate-400 border-slate-700'
                            }`}>
                            {project.status === 'completed' ? 'Tamamlandı' :
                                project.status === 'in_progress' ? 'Devam Ediyor' : project.status}
                        </span>
                    </div>
                    <p className="text-slate-400 mt-1 flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        {project.clients?.company || project.clients?.name || 'Müşteri Yok'}
                    </p>
                </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Sol Kolon: Detaylar */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Açıklama Kartı */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-emerald-500" />
                            Proje Detayları
                        </h2>
                        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {project.description || 'Açıklama girilmemiş.'}
                        </p>
                    </div>

                    {/* Görevler Listesi */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                Proje Görevleri
                            </h2>
                            <Link href="/admin/tasks" className="text-sm text-emerald-400 hover:text-emerald-300">
                                Görev Yönetimine Git →
                            </Link>
                        </div>

                        {totalTasks === 0 ? (
                            <div className="text-center py-8 text-slate-500">
                                Bu projeye ait görev bulunmuyor.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {project.tasks.map((task: any) => (
                                    <div key={task.id} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800/50">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${task.status === 'done' ? 'bg-emerald-500' :
                                                    task.status === 'in_progress' ? 'bg-blue-500' : 'bg-slate-500'
                                                }`} />
                                            <span className={`text-sm font-medium ${task.status === 'done' ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                                                {task.title}
                                            </span>
                                        </div>
                                        <span className="text-xs text-slate-500 px-2 py-1 bg-slate-900 rounded">
                                            {task.assigned_to ? 'Atandı' : 'Atanmadı'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

                {/* Sağ Kolon: Özet & Meta */}
                <div className="space-y-6">

                    {/* İlerleme Durumu */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">İlerleme</h3>
                        <div className="flex items-end justify-between mb-2">
                            <span className="text-3xl font-bold text-white">%{progress}</span>
                            <span className="text-sm text-slate-400">{completedTasks}/{totalTasks} Görev</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }} />
                        </div>
                    </div>

                    {/* Finansal Özet */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Finansal</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-500 block mb-1">Toplam Bütçe</label>
                                <div className="text-xl font-bold text-white flex items-center gap-1">
                                    <DollarSign className="w-5 h-5 text-emerald-500" />
                                    {project.budget ? project.budget.toLocaleString('tr-TR') : '0'} ₺
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-800">
                                <label className="text-xs text-slate-500 block mb-1">Bitiş Tarihi</label>
                                <div className="text-sm font-medium text-white flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-blue-500" />
                                    {project.end_date ? new Date(project.end_date).toLocaleDateString('tr-TR') : 'Belirsiz'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Aksiyonlar */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                        <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors">
                            Projeyi Düzenle
                        </button>
                        <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors">
                            Rapor Oluştur
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}
