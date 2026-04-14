"use client"

import { useRouter } from "next/navigation"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// PIE DATA
const pieData = [
  { name: "Ундаа", value: 4200 },
  { name: "Хоол", value: 3100 },
  { name: "Амттан", value: 1800 },
  { name: "Бусад", value: 900 },
]

const COLORS = ["#60a5fa", "#34d399", "#fbbf24", "#f87171"]

// WEEKLY DATA (IMPORTANT: each week is unique)
const weeklyBreakdown = [
  { week: "1-р долоо хоног", products: 900 },
  { week: "2-р долоо хоног", products: 1100 },
  { week: "3-р долоо хоног", products: 1400 },
  { week: "4-р долоо хоног", products: 1000 },
]

export default function MonthlySalesPage() {
  const router = useRouter()

  return (
    <main className="p-4 md:p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-semibold">
          Сарын борлуулалт
        </h1>

        <Button variant="outline" onClick={() => window.history.back()}>
          ← Буцах
        </Button>
      </div>

      {/* TOP SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* PIE CHART */}
        <Card>
          <CardHeader>
            <CardTitle>Бүтээгдэхүүний төрөл</CardTitle>
          </CardHeader>

          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={120} label>
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* SUMMARY */}
        <Card>
          <CardHeader>
            <CardTitle>Сарын хураангуй</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <p>📦 Нийт бүтээгдэхүүн: <b>9,000</b></p>
            <p>💰 Орлого: <b>₮ 5,000,000</b></p>
            <p>📊 Дундаж өдөр: <b>300 бүтээгдэхүүн</b></p>
          </CardContent>
        </Card>

      </div>

      {/* WEEKLY BAR CHART */}
      <Card>
        <CardHeader>
          <CardTitle>7 хоногийн задаргаа</CardTitle>
        </CardHeader>

        <CardContent className="h-[60vh] min-h-[300px]">

          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyBreakdown}>
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />

              {/* ✅ CLICK FIXED HERE */}
              <Bar
                dataKey="products"
                cursor="pointer"
                onClick={(data) => {
                  const index = weeklyBreakdown.indexOf(data.payload)
                  router.push(`/manager/weekly_sales?week=${index}`)
                }}
              />
            </BarChart>
          </ResponsiveContainer>

        </CardContent>
      </Card>

    </main>
  )
}