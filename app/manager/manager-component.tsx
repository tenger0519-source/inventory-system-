"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import NotificationBell from "@/components/notification-bell"

const DAYS = ["Ñàì", "Äàâàà", "ÿãìàð", "Ëõàãâà", "Ïýðýâ", "Áààñàí", "Áÿìáà"]

export default function ManagerComponent() {
  // Mock data to prevent context usage during build
  const mockTasks = []
  const mockTransactions = []
  const mockProducts = []
  const mockUsers = []
  const mockGlobalTime = { currentDay: "Íÿì" }
  
  // Calculate task counts
  const todayTasks = mockTasks.filter(task => task.day === mockGlobalTime.currentDay)
  const weekTasks = mockTasks.filter(task => DAYS.includes(task.day || ""))
  
  const dailyCount = todayTasks.length
  const weeklyCount = weekTasks.length
  const monthlyCount = weeklyCount * 4
  
  // Calculate sales statistics
  const todayTransactions = mockTransactions.filter(t => t.day === mockGlobalTime.currentDay)
  const weekTransactions = mockTransactions.filter(t => DAYS.includes(t.day || ""))
  
  const todayItems = 0
  const todayRevenue = 0
  const weekItems = 0
  const weekRevenue = 0
  const monthItems = 0
  const monthRevenue = 0
  
  // Calculate system statistics
  const employeeCount = 0
  const supplierCount = 0
  const productCount = 0
  
  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <Link href="/"><Button variant="outline">« Áóóöàõ</Button></Link>
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
            <div className="rounded-lg border p-4 hover:bg-muted transition cursor-pointer space-y-1">
              <p className="text-sm text-muted-foreground">¨íººäºð</p>
              <p className="text-xl font-semibold">{dailyCount} äààëãàâàð</p>
              <p className="text-sm text-muted-foreground">0 îðæ èðýõ · 0 ãàðàõ</p>
            </div>
            <div className="rounded-lg border p-4 hover:bg-muted transition cursor-pointer space-y-1">
              <p className="text-sm text-muted-foreground">7 õîíîã</p>
              <p className="text-xl font-semibold">{weeklyCount} äààëãàâàð</p>
            </div>
          </CardContent>
        </Card>

        {/* SALES */}
        <Card>
          <CardHeader>
            <CardTitle>Áîðëóóëàëò</CardTitle>
            <CardDescription>¨äºð, 7 õîíîã, ñàðûí îðëîãî</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border p-4 hover:bg-muted transition cursor-pointer space-y-1">
              <p className="text-sm text-muted-foreground">¨íººäºð</p>
              <p className="text-xl font-semibold">{todayItems} áàðàà</p>
              <p className="text-sm text-muted-foreground">® {todayRevenue.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border p-4 hover:bg-muted transition cursor-pointer space-y-1">
              <p className="text-sm text-muted-foreground">7 õîíîã</p>
              <p className="text-xl font-semibold">{weekItems} áàðàà</p>
              <p className="text-sm text-muted-foreground">® {weekRevenue.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border p-4 hover:bg-muted transition cursor-pointer space-y-1">
              <p className="text-sm text-muted-foreground">Ñàð</p>
              <p className="text-xl font-semibold">{monthItems} áàðàà</p>
              <p className="text-sm text-muted-foreground">® {monthRevenue.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        {/* SYSTEM */}
        <Card>
          <CardHeader>
            <CardTitle>Ñèñòåìèéí á³ðòãýë</CardTitle>
            <CardDescription>Àæèë÷èä, íèéë³ë³ëýã÷èä, áàðàà</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border p-4 hover:bg-muted transition cursor-pointer space-y-1">
              <p className="text-sm text-muted-foreground">Àæèë÷èä</p>
              <p className="text-xl font-semibold">{employeeCount}</p>
            </div>
            <div className="rounded-lg border p-4 hover:bg-muted transition cursor-pointer space-y-1">
              <p className="text-sm text-muted-foreground">Íèéë³ë³ëýã÷èä</p>
              <p className="text-xl font-semibold">{supplierCount}</p>
            </div>
            <div className="rounded-lg border p-4 hover:bg-muted transition cursor-pointer space-y-1">
              <p className="text-sm text-muted-foreground">Áàðàà</p>
              <p className="text-xl font-semibold">{productCount}</p>
            </div>
          </CardContent>
        </Card>

      </div>
    </main>
  )
}
