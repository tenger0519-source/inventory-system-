"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import NotificationBell from "@/components/notification-bell"
import { useSupabaseApp } from "@/lib/supabase-app-context"

const DAYS = ["Ñàì", "Äàâàà", "ÿãìàð", "Ëõàãâà", "Ïýðýâ", "Áààñàí", "Áÿìáà"]

export default function ManagerComponent() {
  const { tasks, transactions, products, users, globalTime } = useSupabaseApp()
  
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
          <Link href="/dashboard"><Button variant="outline">« Áóóöàõ</Button></Link>
          <div className="text-right">
            <h1 className="text-2xl font-semibold">Ìåíåæåðèéí ñàìáàð</h1>
            <p className="text-sm text-muted-foreground">Òºëºâëºëò, áîðëóóëàëò, óäèðäëàãà</p>
          </div>
          <NotificationBell />
        </div>

        {/* PLANNING */}
        <Card>
          <CardHeader>
            <CardTitle>Òºëºâëºëò</CardTitle>
            <CardDescription>¨äºð, 7 õîíîã</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/manager/daily_plan">
              <div className="rounded-lg border p-4 hover:bg-muted transition cursor-pointer space-y-1">
                <p className="text-sm text-muted-foreground">¨íººäºð</p>
                <p className="text-xl font-semibold">{dailyCount} äààëãàâàð</p>
                <p className="text-sm text-muted-foreground">{incomingTasks.length} îðæ èðýõ · {outgoingTasks.length} ãàðàõ</p>
              </div>
            </Link>
            <Link href="/manager/weekly_plan">
              <div className="rounded-lg border p-4 hover:bg-muted transition cursor-pointer space-y-1">
                <p className="text-sm text-muted-foreground">7 õîíîã</p>
                <p className="text-xl font-semibold">{weeklyCount} äààëãàâàð</p>
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* SALES */}
        <Card>
          <CardHeader>
            <CardTitle>Áîðëóóëàëò</CardTitle>
            <CardDescription>¨äºð, 7 õîíîã, ñàðûí îðëîãî</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/manager/daily_sales">
              <div className="rounded-lg border p-4 hover:bg-muted transition cursor-pointer space-y-1">
                <p className="text-sm text-muted-foreground">¨íººäºð</p>
                <p className="text-xl font-semibold">{todayItems} áàðàà</p>
                <p className="text-sm text-muted-foreground">® {todayRevenue.toLocaleString()}</p>
              </div>
            </Link>
            <Link href="/manager/weekly_sales">
              <div className="rounded-lg border p-4 hover:bg-muted transition cursor-pointer space-y-1">
                <p className="text-sm text-muted-foreground">7 õîíîã</p>
                <p className="text-xl font-semibold">{weekItems} áàðàà</p>
                <p className="text-sm text-muted-foreground">® {weekRevenue.toLocaleString()}</p>
              </div>
            </Link>
            <Link href="/manager/monthly_sales">
              <div className="rounded-lg border p-4 hover:bg-muted transition cursor-pointer space-y-1">
                <p className="text-sm text-muted-foreground">Ñàð</p>
                <p className="text-xl font-semibold">{monthItems} áàðàà</p>
                <p className="text-sm text-muted-foreground">® {monthRevenue.toLocaleString()}</p>
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* SYSTEM */}
        <Card>
          <CardHeader>
            <CardTitle>Ñèñòåìèéí á³ðòãýë</CardTitle>
            <CardDescription>Àæèë÷èä, íèéë³ë³ëýã÷èä, áàðàà</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/manager/employees">
              <div className="rounded-lg border p-4 hover:bg-muted transition cursor-pointer space-y-1">
                <p className="text-sm text-muted-foreground">Àæèë÷èä</p>
                <p className="text-xl font-semibold">{employeeCount}</p>
              </div>
            </Link>
            <Link href="/manager/suppliers">
              <div className="rounded-lg border p-4 hover:bg-muted transition cursor-pointer space-y-1">
                <p className="text-sm text-muted-foreground">Íèéë³ë³ëýã÷èä</p>
                <p className="text-xl font-semibold">{supplierCount}</p>
              </div>
            </Link>
            <Link href="/manager/products">
              <div className="rounded-lg border p-4 hover:bg-muted transition cursor-pointer space-y-1">
                <p className="text-sm text-muted-foreground">Áàðàà</p>
                <p className="text-xl font-semibold">{productCount}</p>
              </div>
            </Link>
          </CardContent>
        </Card>

      </div>
    </main>
  )
}
