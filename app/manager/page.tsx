"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import NotificationBell from "@/components/notification-bell"
import { useApp } from "@/lib/app-context"

const DAYS = ["H Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export default function ManagerHome() {
  const { tasks, transactions, products, users, globalTime } = useApp()
  
  // Calculate task counts
  const todayTasks = tasks.filter(task => task.day === globalTime.currentDay)
  const weekTasks = tasks.filter(task => DAYS.includes(task.day || ""))
  
  // Count by type
  const incomingTasks = weekTasks.filter(task => task.type === "move" && task.from?.includes("outside"))
  const outgoingTasks = weekTasks.filter(task => task.type === "move" && task.to?.includes("outside"))
  
  const dailyCount = todayTasks.length
  const weeklyCount = weekTasks.length
  const monthlyCount = weeklyCount * 4 // Rough estimate
  
  // Calculate sales statistics
  const todayTransactions = transactions.filter(t => t.day === globalTime.currentDay)
  const weekTransactions = transactions.filter(t => DAYS.includes(t.day || ""))
  
  const todayItems = todayTransactions.reduce((sum, t) => sum + t.items.reduce((s, item) => s + item.quantity, 0), 0)
  const todayRevenue = todayTransactions.reduce((sum, t) => sum + t.total, 0)
  
  const weekItems = weekTransactions.reduce((sum, t) => sum + t.items.reduce((s, item) => s + item.quantity, 0), 0)
  const weekRevenue = weekTransactions.reduce((sum, t) => sum + t.total, 0)
  
  const monthItems = weekItems * 4 // Rough estimate
  const monthRevenue = weekRevenue * 4 // Rough estimate
  
  // Calculate system statistics
  const employeeCount = users.filter(u => u.roles.includes("employee")).length
  const supplierCount = users.filter(u => u.roles.includes("supplier")).length
  const productCount = products.length
  
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
                <p className="text-xl font-semibold">{todayItems} бараа</p>
                <p className="text-sm text-muted-foreground">₮ {todayRevenue.toLocaleString()}</p>
              </div>
            </Link>
            <Link href="/manager/weekly_sales">
              <div className="rounded-lg border p-4 hover:bg-muted transition cursor-pointer space-y-1">
                <p className="text-sm text-muted-foreground">7 хоног</p>
                <p className="text-xl font-semibold">{weekItems} бараа</p>
                <p className="text-sm text-muted-foreground">₮ {weekRevenue.toLocaleString()}</p>
              </div>
            </Link>
            <Link href="/manager/monthly_sales">
              <div className="rounded-lg border p-4 hover:bg-muted transition cursor-pointer space-y-1">
                <p className="text-sm text-muted-foreground">Сар</p>
                <p className="text-xl font-semibold">{monthItems} бараа</p>
                <p className="text-sm text-muted-foreground">₮ {monthRevenue.toLocaleString()}</p>
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
                <p className="text-xl font-semibold">{employeeCount}</p>
              </div>
            </Link>
            <Link href="/manager/suppliers">
              <div className="rounded-lg border p-4 hover:bg-muted transition cursor-pointer space-y-1">
                <p className="text-sm text-muted-foreground">Нийлүүлэгчид</p>
                <p className="text-xl font-semibold">{supplierCount}</p>
              </div>
            </Link>
            <Link href="/manager/products">
              <div className="rounded-lg border p-4 hover:bg-muted transition cursor-pointer space-y-1">
                <p className="text-sm text-muted-foreground">Бараа</p>
                <p className="text-xl font-semibold">{productCount}</p>
              </div>
            </Link>
          </CardContent>
        </Card>

      </div>
    </main>
  )
}