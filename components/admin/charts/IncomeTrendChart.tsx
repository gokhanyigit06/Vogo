"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface TrendChartProps {
    income: any[]
    expenses: any[]
}

export default function IncomeTrendChart({ income, expenses }: TrendChartProps) {
    // Son 6 ayın verilerini hazırla
    const getLast6Months = () => {
        const months = []
        for (let i = 5; i >= 0; i--) {
            const d = new Date()
            d.setMonth(d.getMonth() - i)
            months.push(d)
        }
        return months
    }

    const processData = () => {
        const months = getLast6Months()
        return months.map(date => {
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` // YYYY-MM
            const monthLabel = date.toLocaleDateString('tr-TR', { month: 'short' })

            // O aya ait gelirleri topla
            const incomeSum = income
                .filter(i => i.date.startsWith(monthKey))
                .reduce((sum, item) => sum + parseFloat(item.amount), 0)

            // O aya ait giderleri topla
            const expenseSum = expenses
                .filter(e => e.date.startsWith(monthKey))
                .reduce((sum, item) => sum + parseFloat(item.amount), 0)

            return {
                name: monthLabel,
                Gelir: incomeSum,
                Gider: expenseSum
            }
        })
    }

    const data = processData()

    return (
        <div className="bg-card border border-border p-6 rounded-notebook h-[400px]">
            <h3 className="text-lg font-bold text-foreground mb-6">Finansal Trend (Son 6 Ay)</h3>
            <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis
                            dataKey="name"
                            stroke="#94a3b8"
                            tick={{ fill: '#94a3b8' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            stroke="#94a3b8"
                            tick={{ fill: '#94a3b8' }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value) => `₺${value / 1000}k`}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value: any) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value || 0)}
                        />
                        <Legend />
                        <Bar dataKey="Gelir" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Gider" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
