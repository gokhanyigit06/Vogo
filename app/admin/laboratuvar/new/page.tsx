"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import LabProjectForm from "@/components/admin/lab/LabProjectForm"
import { LabProjectFormData } from "@/types/lab"

export default function NewLabProjectPage() {
    const router = useRouter()
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (data: LabProjectFormData) => {
        setSubmitting(true)
        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            if (!res.ok) throw new Error('Failed')

            alert('Proje başarıyla oluşturuldu!')
            router.push('/admin/laboratuvar')
        } catch (error) {
            console.error(error)
            alert('Hata oluştu')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Yeni Laboratuvar Projesi</h1>
            <LabProjectForm onSubmit={handleSubmit} loading={submitting} />
        </div>
    )
}
