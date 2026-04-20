"use client"

import { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/app-context"

const dayOrder = ["Даваа","Мягмар","Лхагва","Пүрэв","Баасан","Бямба","Ням"]

function WeeklySalesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const weekIndex = searchParams.get("week")
  const { transactions } = useApp()
  const weeklyData = transactions
    .filter((transaction) => transaction.day)
    .reduce((acc: any[], transaction) => {
      const dayIndex = dayOrder.indexOf(transaction.day)
      if (!acc[dayIndex]) {
        acc[dayIndex] = { day: transaction.day, revenue: 0, count: 0 }
      }
      acc[dayIndex].revenue += transaction.total
      acc[dayIndex].count += 1
      return acc
    }, [])
    .filter((day) => day)
    .sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day))

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