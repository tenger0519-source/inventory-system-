"use client"

import { useRouter, useSearchParams } from "next/navigation"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// 🔥 FULL 4 WEEKS × 7 DAYS
const allWeeksData = [
  // WEEK 1
  [
    { day: "Даваа", revenue: 200000, count: 20 },
    { day: "Мягмар", revenue: 250000, count: 25 },
    { day: "Лхагва", revenue: 300000, count: 30 },
    { day: "Пүрэв", revenue: 280000, count: 28 },
    { day: "Баасан", revenue: 350000, count: 35 },
    { day: "Бямба", revenue: 400000, count: 40 },
    { day: "Ням", revenue: 220000, count: 22 },
  ],

  // WEEK 2
  [
    { day: "Даваа", revenue: 260000, count: 26 },
    { day: "Мягмар", revenue: 300000, count: 30 },
    { day: "Лхагва", revenue: 320000, count: 32 },
    { day: "Пүрэв", revenue: 290000, count: 29 },
    { day: "Баасан", revenue: 370000, count: 37 },
    { day: "Бямба", revenue: 420000, count: 42 },
    { day: "Ням", revenue: 240000, count: 24 },
  ],

  // WEEK 3
  [
    { day: "Даваа", revenue: 300000, count: 30 },
    { day: "Мягмар", revenue: 340000, count: 34 },
    { day: "Лхагва", revenue: 360000, count: 36 },
    { day: "Пүрэв", revenue: 330000, count: 33 },
    { day: "Баасан", revenue: 420000, count: 42 },
    { day: "Бямба", revenue: 500000, count: 50 },
    { day: "Ням", revenue: 270000, count: 27 },
  ],

  // WEEK 4
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

// 🔧 ensures correct day order
const dayOrder = ["Даваа","Мягмар","Лхагва","Пүрэв","Баасан","Бямба","Ням"]

export default function WeeklySalesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const weekIndex = searchParams.get("week")

  // ✅ SELECT CORRECT WEEK
  let weeklyData =
    weekIndex !== null
      ? allWeeksData[Number(weekIndex)] || allWeeksData[0]
      : allWeeksData[0]

  // ✅ SORT DAYS (safety)
  weeklyData = [...weeklyData].sort(
    (a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
  )

  return (
    <main className="p-4 md:p-6">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-semibold">
            {weekIndex !== null
              ? `${Number(weekIndex) + 1}-р долоо хоног`
              : "7 хоногийн борлуулалт"}
          </h1>

          <Button variant="outline" onClick={() => window.history.back()}>
            ← Буцах
          </Button>
        </div>

        {/* CHART */}
        <Card>
          <CardHeader>
            <CardTitle>Өдөр бүрийн орлого</CardTitle>
          </CardHeader>

          {/* ✅ RESPONSIVE HEIGHT */}
          <CardContent className="h-[60vh] min-h-[300px]">

            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />

                {/* ✅ CLICK → DAILY PAGE */}
                <Bar
                  dataKey="revenue"
                  cursor="pointer"
                  onClick={(data) => {
                    router.push(`/manager/daily_sales?day=${data.payload.day}`)
                  }}
                >
                  <LabelList dataKey="count" position="top" />
                </Bar>

              </BarChart>
            </ResponsiveContainer>

          </CardContent>
        </Card>

      </div>
    </main>
  )
}