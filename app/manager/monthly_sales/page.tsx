"use client"

import { useRouter } from "next/navigation"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const pieData = [
  { name: "Ундаа",   value: 4200 },
  { name: "Хоол",    value: 3100 },
  { name: "Амттан",  value: 1800 },
  { name: "Бусад",   value: 900  },
]
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"]

const weeklyBreakdown = [
  { week: "1-р долоо хоног", products: 900  },
  { week: "2-р долоо хоног", products: 1100 },
  { week: "3-р долоо хоног", products: 1400 },
  { week: "4-р долоо хоног", products: 1000 },
]

export default function MonthlySalesPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.back()}>← Буцах</Button>
          <div className="text-right">
            <h1 className="text-2xl font-semibold">Сарын борлуулалт</h1>
            <p className="text-sm text-muted-foreground">Бүтээгдэхүүний төрөл ба долоо хоногийн задаргаа</p>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Нийт бүтээгдэхүүн", value: "9,000" },
            { label: "Орлого",             value: "₮ 5,000,000" },
            { label: "Өдрийн дундаж",      value: "300" },
          ].map(s => (
            <div key={s.label} className="rounded-lg border p-4 space-y-1">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-xl font-semibold">{s.value}</p>
            </div>
          ))}
        </div>

        {/* PIE + WEEKLY */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Бүтээгдэхүүний төрөл</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} label>
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7 хоногийн задаргаа</CardTitle>
              <CardDescription>Баганан дээр дарж дэлгэрэнгүйг харна</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyBreakdown}>
                    <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="products" fill="#3b82f6" radius={[4,4,0,0]} cursor="pointer"
                      onClick={data => {
                        const index = weeklyBreakdown.indexOf(data.payload)
                        router.push(`/manager/weekly_sales?week=${index}`)
                      }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </main>
  )
}