"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import LabProjectForm from "@/components/admin/lab/LabProjectForm"
import { LabProjectFormData } from "@/types/lab"

export default function EditLabProjectPage() {
    const params = useParams()
    const router = useRouter()
    const [project, setProject] = useState<Partial<LabProjectFormData> | null>(null)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        fetch(`/api/projects?id=${params.id}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) throw new Error(data.error)
                setProject(data)
            })
            .catch(() => {
                alert('Proje yüklenemedi')
                router.push('/admin/laboratuvar')
            })
    }, [params.id]) // Correct dependency

    const handleSubmit = async (data: LabProjectFormData) => {
        setSubmitting(true)
        try {
            const res = await fetch('/api/projects', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: params.id, ...data })
            })

            if (!res.ok) throw new Error('Failed')

            alert('Proje başarıyla güncellendi!')
            router.push('/admin/laboratuvar')
        } catch (error) {
            console.error(error)
            alert('Hata oluştu')
        } finally {
            setSubmitting(false)
        }
    }

    if (!project) return <div className="p-20 text-center">Yükleniyor...</div>

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Projeyi Düzenle</h1>
            <LabProjectForm initialData={project} onSubmit={handleSubmit} loading={submitting} />
        </div>
    )
}
