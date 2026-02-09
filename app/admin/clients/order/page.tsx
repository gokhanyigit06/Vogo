"use client"

import { useState, useEffect } from "react"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core"
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Save, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Client {
    id: number
    name: string
    company?: string
    logo_url?: string
    order: number
}

function SortableItem({ id, client }: { id: number; client: Client }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl mb-3 shadow-sm group hover:border-emerald-500/30 transition-colors"
        >
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-2 text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors"
            >
                <GripVertical className="w-5 h-5" />
            </div>

            <div className="w-10 h-10 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                {client.logo_url ? (
                    <img src={client.logo_url} alt={client.name} className="w-full h-full object-contain p-1" />
                ) : (
                    <span className="text-xs font-bold text-slate-500">
                        {client.name.substring(0, 2).toUpperCase()}
                    </span>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">{client.name}</h3>
                {client.company && (
                    <p className="text-sm text-muted-foreground truncate">{client.company}</p>
                )}
            </div>
        </div>
    )
}

export default function ReorderClientsPage() {
    const [clients, setClients] = useState<Client[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const router = useRouter()

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    useEffect(() => {
        fetchClients()
    }, [])

    const fetchClients = async () => {
        try {
            const res = await fetch('/api/clients')
            if (!res.ok) throw new Error('Failed to fetch')
            const data = await res.json()

            // Filter only active clients and sort by order
            const activeClients = Array.isArray(data)
                ? data.filter((c: any) => c.status === 'active')
                    .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
                : []

            setClients(activeClients)
        } catch (error) {
            console.error('Error fetching clients:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            setClients((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id)
                const newIndex = items.findIndex((item) => item.id === over.id)

                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            // Prepare data with new order indices
            const updates = clients.map((client, index) => ({
                id: client.id,
                order: index + 1
            }))

            const res = await fetch('/api/admin/clients/reorder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: updates }),
            })

            if (!res.ok) throw new Error('Failed to save order')

            router.refresh()
            // Optional: Show success toast/alert
            alert('Sıralama başarıyla kaydedildi')
        } catch (error) {
            console.error('Error saving order:', error)
            alert('Kaydederken bir hata oluştu')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        )
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/clients"
                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Marka Sıralaması</h1>
                        <p className="text-muted-foreground">Sürükle bırak ile markaların sırasını düzenleyin</p>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Kaydediliyor...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Kaydet
                        </>
                    )}
                </button>
            </div>

            {/* Sortable List */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={clients.map(c => c.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-3">
                        {clients.map((client) => (
                            <SortableItem key={client.id} id={client.id} client={client} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {clients.length === 0 && (
                <div className="text-center py-12 text-muted-foreground bg-card border border-border rounded-xl">
                    Sıralanacak aktif marka bulunamadı.
                </div>
            )}
        </div>
    )
}
