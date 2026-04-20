"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import NotificationBell from "@/components/notification-bell"
import { useApp } from "@/lib/app-context"

const DAYS = ["Ням", "Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан", "Бямба"]

export default function ManagerHome() {
  const { tasks } = useApp()
  
  // Get today's name
  const todayIndex = new Date().getDay()
  const todayName = DAYS[todayIndex]
  
  // Calculate task counts
  const todayTasks = tasks.filter(task => task.day === todayName)
  const weekTasks = tasks.filter(task => DAYS.includes(task.day || ""))
  
  // Count by type
  const incomingTasks = weekTasks.filter(task => task.type === "move" && task.from?.includes("Хүлээн авах"))
  const outgoingTasks = weekTasks.filter(task => task.type === "move" && !task.from?.includes("Хүлээн авах"))
  
  const dailyCount = todayTasks.length
  const weeklyCount = weekTasks.length
  const monthlyCount = weeklyCount * 4 // Rough estimate
  
  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <Link href="/dashboard"><Button variant="outline">← Буцах</Button></Link>
          <div className="text-right">
            <h1 className="text-2xl font-semibold">Менежерийн самбар</h1>
            <p className="text-sm text-muted-foreground">Төлөвлөлт, борлуулалт, удирдлага</p>
          </div>
          <NotificationBell />
        </div>

        {/* PLANNING */}
        <Card>
          <CardHeader>
            <CardTitle>Төлөвлөлт</CardTitle>
            <CardDescription>Өдөр, 7 хоног</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/manager/daily_plan">
              <div className="rounded-lg border p-4 hover:bg-muted transition cursor-pointer space-y-1">
                <p className="text-sm text-muted-foreground">Өнөөдөр</p>
                <p className="text-xl font-semibold">{dailyCount} даалгавар</p>
                <p className="text-sm text-muted-foreground">{incomingTasks.length} орж ирэх · {outgoingTasks.length} гарах</p>
              </div>
            </Link>
            <Link href="/manager/weekly_plan">
              <div className="rounded-lg border p-4 hover:bg-muted transition cursor-pointer space-y-1">
                <p className="text-sm text-muted-foreground">7 хоног · Сар</p>
                <p className="text-xl font-semibold">{weeklyCount} даалгавар</p>
                <p className="text-sm text-muted-foreground">Сарын нийт: {monthlyCount}</p>
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* SALES */}
        <Card>
          <CardHeader>
            <CardTitle>Борлуулалт</CardTitle>
            <CardDescription>Өдөр, 7 хоног, сарын орлого</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/manager/daily_sales">
              <div className="rounded-lg border p-4 hover:bg-muted transition cursor-pointer space-y-1">
                <p className="text-sm text-muted-foreground">Өнөөдөр</p>
                <p className="text-xl font-semibold">120 бараа</p>
                <p className="text-sm text-muted-foreground">₮ 1,200,000</p>
              </div>
            </Link>
            <Link href="/manager/weekly_sales">
              <div className="rounded-lg border p-4 hover:bg-muted transition cursor-pointer space-y-1">
                <p className="text-sm text-muted-foreground">7 хоног</p>
                <p className="text-xl font-semibold">860 бараа</p>
                <p className="text-sm text-muted-foreground">₮ 8,500,000</p>
              </div>
            </Link>
            <Link href="/manager/monthly_sales">
              <div className="rounded-lg border p-4 hover:bg-muted transition cursor-pointer space-y-1">
                <p className="text-sm text-muted-foreground">Сар</p>
                <p className="text-xl font-semibold">3,200 бараа</p>
                <p className="text-sm text-muted-foreground">₮ 32,000,000</p>
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* SYSTEM */}
        <Card>
          <CardHeader>
            <CardTitle>Системийн бүртгэл</CardTitle>
            <CardDescription>Ажилчид, нийлүүлэгчид, бараа</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/manager/employees">
              <div className="rounded-lg border p-4 hover:bg-muted transition cursor-pointer space-y-1">
                <p className="text-sm text-muted-foreground">Ажилчид</p>
                <p className="text-xl font-semibold">18</p>
              </div>
            </Link>
            <Link href="/manager/suppliers">
              <div className="rounded-lg border p-4 hover:bg-muted transition cursor-pointer space-y-1">
                <p className="text-sm text-muted-foreground">Нийлүүлэгчид</p>
                <p className="text-xl font-semibold">6</p>
              </div>
            </Link>
            <Link href="/manager/products">
              <div className="rounded-lg border p-4 hover:bg-muted transition cursor-pointer space-y-1">
                <p className="text-sm text-muted-foreground">Бараа</p>
                <p className="text-xl font-semibold">1,240</p>
              </div>
            </Link>
          </CardContent>
        </Card>

      </div>
    </main>
  )
}