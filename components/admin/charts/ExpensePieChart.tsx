"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface PieChartProps {
    expenses: any[]
}

export default function ExpensePieChart({ expenses }: PieChartProps) {

    // Kategorileri Türkçe'ye çevir ve renk ata
    const categoryConfig: any = {
        rent: { label: 'Kira', color: '#8b5cf6' }, // Purple
        salary: { label: 'Maaş', color: '#3b82f6' }, // Blue
        software: { label: 'Yazılım', color: '#06b6d4' }, // Cyan
        ads: { label: 'Reklam', color: '#f59e0b' }, // Amber
        office: { label: 'Ofis', color: '#10b981' }, // Emerald
        other: { label: 'Diğer', color: '#64748b' } // Slate
    }

    const processData = () => {
        const grouped = expenses.reduce((acc: any, item) => {
            const cat = item.category || 'other'
            if (!acc[cat]) acc[cat] = 0
            acc[cat] += parseFloat(item.amount)
            return acc
        }, {})

        return Object.keys(grouped).map(key => ({
            name: categoryConfig[key]?.label || key,
            value: grouped[key],
            color: categoryConfig[key]?.color || '#64748b'
        })).sort((a, b) => b.value - a.value) // Büyükten küçüğe sırala
    }

    const data = processData()

    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-[400px]">
            <h3 className="text-lg font-bold text-white mb-6">Gider Dağılımı</h3>
            <div className="w-full h-[300px]">
                {expenses.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                                formatter={(value: any) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value || 0)}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-slate-500">
                        Veri yok
                    </div>
                )}
            </div>
        </div>
    )
}
