"use client"

import Link from "next/link"
import WeeklyGraph from "@/components/weekly-graph"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { weeklyData } from "@/lib/weekly-data"

// ✅ Map JS day → Mongolian
const daysMap = ["Ням", "Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан", "Бямба"]

// 🔧 Dev override (change this to test different days)
const todayIndex = 1 // new Date().getDay()
const todayName = daysMap[todayIndex]

// ✅ Find today's data
const todayData = weeklyData.find((d) => d.day === todayName)

// safer fallback
const tasks = todayData?.tasks ?? []

export default function EmployeeHome() {
  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* ===== HEADER ===== */}
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="outline">Гарах</Button>
          </Link>

          <div className="text-right">
            <h1 className="text-2xl font-semibold">Ажилтны эхлэх хуудас</h1>
            <p className="text-muted-foreground">
              Өнөөдрийн ажил болон 7 хоногийн мэдээлэл
            </p>
          </div>
        </div>

        {/* ===== TODAY TASKS ===== */}
        <Card>
          <CardHeader>
            <CardTitle>Өнөөдрийн даалгавар</CardTitle>
            <CardDescription>
              Ямар бараа, хэзээ, хаашаа
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {tasks.length > 0 ? (
              tasks.map((task: any, i: number) => (
                <div key={i} className="border p-4 rounded-lg space-y-2">

                  {/* HEADER */}
                  <div className="flex justify-between">
                    <p className="font-semibold">{task.action}</p>
                    <span className="text-sm text-muted-foreground">
                      {task.time}
                    </span>
                  </div>

                  {/* MOVEMENT TASK */}
                  {task.type === "move" && (
                    <>
                      {task.quantity > 0 && (
                        <p className="text-sm">
                          📦 {task.product} — {task.quantity}ш
                        </p>
                      )}

                      <p className="text-sm text-blue-600 font-medium">
                        📍 {task.from} → {task.to}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        🗄 Тавиур: {task.shelf}
                      </p>
                    </>
                  )}

                  {/* MESSAGE TASK */}
                  {task.type === "message" && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                      <p className="text-sm text-yellow-800">
                        💬 {task.message}
                      </p>
                    </div>
                  )}

                </div>
              ))
            ) : (
              <p className="text-muted-foreground">
                Өнөөдөр амралтын өдөр байна 🎉
              </p>
            )}
          </CardContent>
        </Card>

        {/* ===== POSITIONS ===== */}
        <Card>
          <CardHeader>
            <CardTitle>Барааны позициид</CardTitle>
            <CardDescription>
              Барааны төрөл, санхүүгийн секториор хайж үзэх
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Link href="/employee/positions">
              <Button className="w-full">
                Барааны позициид
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* ===== WEEKLY GRAPH ===== */}
        <Card>
          <CardHeader>
            <CardTitle>7 хоногийн ажлын график</CardTitle>
            <CardDescription>
              Ажлын цаг + менежерийн даалгавар
            </CardDescription>
          </CardHeader>

          <CardContent>
            <WeeklyGraph />
          </CardContent>
        </Card>

      </div>
    </main>
  )
}