"use client"

import Link from "next/link"
import WeeklyGraph from "@/components/weekly-graph"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { weeklyData } from "@/lib/weekly-data"

const daysMap = ["Ням", "Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан", "Бямба"]
const todayIndex = 1
const todayName = daysMap[todayIndex]
const todayData = weeklyData.find((d) => d.day === todayName)
const tasks = todayData?.tasks ?? []

export default function EmployeeHome() {
  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <Link href="/"><Button variant="outline">← Гарах</Button></Link>
          <div className="text-right">
            <h1 className="text-2xl font-semibold">Ажилтны хуудас</h1>
            <p className="text-sm text-muted-foreground">Өнөөдрийн ажил болон 7 хоногийн мэдээлэл</p>
          </div>
        </div>

        {/* TODAY TASKS */}
        <Card>
          <CardHeader>
            <CardTitle>Өнөөдрийн даалгавар</CardTitle>
            <CardDescription>Ямар бараа, хэзээ, хаашаа</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasks.length > 0 ? tasks.map((task: any, i: number) => (
              <div key={i} className="rounded-lg border p-4 space-y-2">
                <div className="flex justify-between">
                  <p className="font-medium">{task.action}</p>
                  <span className="text-sm text-muted-foreground">{task.time}</span>
                </div>
                {task.type === "move" && (
                  <>
                    {task.quantity > 0 && (
                      <p className="text-sm text-muted-foreground">{task.product} — {task.quantity}ш</p>
                    )}
                    <p className="text-sm font-medium">{task.from} → {task.to}</p>
                    <p className="text-sm text-muted-foreground">Тавиур: {task.shelf}</p>
                  </>
                )}
                {task.type === "message" && (
                  <div className="rounded-md bg-muted px-3 py-2">
                    <p className="text-sm">{task.message}</p>
                  </div>
                )}
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">Өнөөдөр амралтын өдөр байна.</p>
            )}
          </CardContent>
        </Card>

        {/* LOCATIONS */}
        <Card>
          <CardHeader>
            <CardTitle>Барааны байршил</CardTitle>
            <CardDescription>Бараа ямар байршилд хадгалагдаж байгааг харах</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/employee/locations">
              <Button variant="outline" className="w-full">Байршил харах</Button>
            </Link>
          </CardContent>
        </Card>

        {/* WEEKLY GRAPH */}
        <Card>
          <CardHeader>
            <CardTitle>7 хоногийн график</CardTitle>
            <CardDescription>Ажлын цаг болон даалгаврын мэдээлэл</CardDescription>
          </CardHeader>
          <CardContent>
            <WeeklyGraph employee="Батболд" />
          </CardContent>
        </Card>

      </div>
    </main>
  )
}