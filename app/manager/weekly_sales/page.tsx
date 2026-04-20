"use client"

import { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const allWeeksData = [
  [
    { day: "Даваа", revenue: 200000, count: 20 },
    { day: "Мягмар", revenue: 250000, count: 25 },
    { day: "Лхагва", revenue: 300000, count: 30 },
    { day: "Пүрэв", revenue: 280000, count: 28 },
    { day: "Баасан", revenue: 350000, count: 35 },
    { day: "Бямба", revenue: 400000, count: 40 },
    { day: "Ням", revenue: 220000, count: 22 },
  ],
  [
    { day: "Даваа", revenue: 260000, count: 26 },
    { day: "Мягмар", revenue: 300000, count: 30 },
    { day: "Лхагва", revenue: 320000, count: 32 },
    { day: "Пүрэв", revenue: 290000, count: 29 },
    { day: "Баасан", revenue: 370000, count: 37 },
    { day: "Бямба", revenue: 420000, count: 42 },
    { day: "Ням", revenue: 240000, count: 24 },
  ],
  [
    { day: "Даваа", revenue: 300000, count: 30 },
    { day: "Мягмар", revenue: 340000, count: 34 },
    { day: "Лхагва", revenue: 360000, count: 36 },
    { day: "Пүрэв", revenue: 330000, count: 33 },
    { day: "Баасан", revenue: 420000, count: 42 },
    { day: "Бямба", revenue: 500000, count: 50 },
    { day: "Ням", revenue: 270000, count: 27 },
  ],
  [
    { day: "Даваа", revenue: 280000, count: 28 },
    { day: "Мягмар", revenue: 310000, count: 31 },
    { day: "Лхагва", revenue: 330000, count: 33 },
    { day: "Пүрэв", revenue: 300000, count: 30 },
    { day: "Баасан", revenue: 390000, count: 39 },
    { day: "Бямба", revenue: 450000, count: 45 },
    { day: "Ням", revenue: 260000, count: 26 },
  ],
]

const dayOrder = ["Даваа","Мягмар","Лхагва","Пүрэв","Баасан","Бямба","Ням"]

function WeeklySalesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const weekIndex = searchParams.get("week")
  const weeklyData = [...(allWeeksData[Number(weekIndex)] || allWeeksData[0])].sort(
    (a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
  )

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.back()}>← Буцах</Button>
          <div className="text-right">
            <h1 className="text-2xl font-semibold">{weekIndex !== null ? `${Number(weekIndex) + 1}-р долоо хоног` : "7 хоногийн борлуулалт"}</h1>
            <p className="text-sm text-muted-foreground">Өдөр бүрийн орлого</p>
          </div>
        </div>

        {/* CHART */}
        <Card>
          <CardHeader>
            <CardTitle>Өдөр бүрийн орлого</CardTitle>
            <CardDescription>Баганан дээр дарж өдрийн дэлгэрэнгүйг харна</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
  formatter={(value) =>
    typeof value === "number"
      ? `₮ ${value.toLocaleString()}`
      : value
  }
/>
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[4,4,0,0]} cursor="pointer"
                    onClick={data => router.push(`/manager/daily_sales?day=${data.payload.day}`)}>
                    <LabelList dataKey="count" position="top" style={{ fontSize: 11 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      </div>
    </main>
  )
}

export default function WeeklySalesPage() {
  return (
    <Suspense fallback={<div className="p-6 text-muted-foreground">Уншиж байна...</div>}>
      <WeeklySalesContent />
    </Suspense>
  )
}