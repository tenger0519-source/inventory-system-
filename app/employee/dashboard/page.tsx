"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/app-context"

export default function EmployeeDashboard() {
  const { tasks, transactions, globalTime, currentUser } = useApp()
  
  // Calculate today's tasks (from current week)
  const todayTasks = tasks.filter(task => task.day === globalTime.currentDay && task.employee === currentUser?.name && (task.week === 0 || task.week === undefined))
  const completedTodayTasks = todayTasks.filter(task => task.completed)
  const pendingTodayTasks = todayTasks.filter(task => !task.completed)
  
  // Calculate weekly tasks
  const weekTasks = tasks.filter(task => task.employee === currentUser?.name)
  const completedWeekTasks = weekTasks.filter(task => task.completed)
  
  // Calculate today's work statistics
  const todayTransactions = transactions.filter(t => t.worker === currentUser?.name && t.day === globalTime.currentDay)
  const todayItemsSold = todayTransactions.reduce((sum, t) => sum + t.items.reduce((s, item) => s + item.quantity, 0), 0)
  const todayRevenue = todayTransactions.reduce((sum, t) => sum + t.total, 0)
  
  // Calculate weekly statistics
  const weekTransactions = transactions.filter(t => t.worker === currentUser?.name)
  const weekItemsSold = weekTransactions.reduce((sum, t) => sum + t.items.reduce((s, item) => s + item.quantity, 0), 0)
  const weekRevenue = weekTransactions.reduce((sum, t) => sum + t.total, 0)
  
  // Calculate monthly estimates
  const monthlyTasks = weekTasks.length * 4
  const monthlyCompletedTasks = completedWeekTasks.length * 4
  const monthlyItemsSold = weekItemsSold * 4
  const monthlyRevenue = weekRevenue * 4
  
  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <Link href="/employee"><Button variant="outline">← Буцах</Button></Link>
          <div className="text-right">
            <h1 className="text-2xl font-semibold">Ажилтны самбар</h1>
            <p className="text-sm text-muted-foreground">Өнөөдрийн ажил, гүйлгээ, орлого</p>
          </div>
        </div>

        {/* TODAY'S WORK */}
        <Card>
          <CardHeader>
            <CardTitle>Өнөөдрийн ажил</CardTitle>
            <CardDescription>{globalTime.currentDay} гэхүүлт</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border p-4 space-y-1">
              <p className="text-sm text-muted-foreground">Нийт даалгавар</p>
              <p className="text-xl font-semibold">{todayTasks.length}</p>
              <p className="text-sm text-muted-foreground">{completedTodayTasks.length} дууссан · {pendingTodayTasks.length} хүлээ</p>
            </div>
            <div className="rounded-lg border p-4 space-y-1">
              <p className="text-sm text-muted-foreground">Борлуулсан бараа</p>
              <p className="text-xl font-semibold">{todayItemsSold} ширхэг</p>
              <p className="text-sm text-muted-foreground">₮ {todayRevenue.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border p-4 space-y-1">
              <p className="text-sm text-muted-foreground">Ажилласан цаг</p>
              <p className="text-xl font-semibold">{completedTodayTasks.length * 2} цаг</p>
              <p className="text-sm text-muted-foreground">Үргэлж байна</p>
            </div>
          </CardContent>
        </Card>

        {/* WEEKLY PERFORMANCE */}
        <Card>
          <CardHeader>
            <CardTitle>7 хоногийн гүйлгээ</CardTitle>
            <CardDescription>Долоо хоногийн дүн, борлуулалт</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/employee">
              <div className="rounded-lg border p-4 hover:bg-muted transition cursor-pointer space-y-1">
                <p className="text-sm text-muted-foreground">7 хоногийн даалгавар</p>
                <p className="text-xl font-semibold">{weekTasks.length} даалгавар</p>
                <p className="text-sm text-muted-foreground">{completedWeekTasks.length} дúussan</p>
                <p className="text-sm text-muted-foreground">Сарын нийт: {monthlyTasks}</p>
              </div>
            </Link>
            <Link href="/employee">
              <div className="rounded-lg border p-4 hover:bg-muted transition cursor-pointer space-y-1">
                <p className="text-sm text-muted-foreground">7 хоногийн борлуулалт</p>
                <p className="text-xl font-semibold">{weekItemsSold} бараа</p>
                <p className="text-sm text-muted-foreground">₮ {weekRevenue.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Сарын нийт: ₮{monthlyRevenue.toLocaleString()}</p>
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* MONTHLY ESTIMATES */}
        <Card>
          <CardHeader>
            <CardTitle>Сарын таамглал</CardTitle>
            <CardDescription>Долоо хоногоос үндэслэн тооцоолол</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border p-4 space-y-1">
              <p className="text-sm text-muted-foreground">Нийт даалгавар</p>
              <p className="text-xl font-semibold">{monthlyTasks}</p>
              <p className="text-sm text-muted-foreground">{monthlyCompletedTasks} дууссан</p>
            </div>
            <div className="rounded-lg border p-4 space-y-1">
              <p className="text-sm text-muted-foreground">Нийт борлуулалт</p>
              <p className="text-xl font-semibold">{monthlyItemsSold} бараа</p>
              <p className="text-sm text-muted-foreground">₮ {monthlyRevenue.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border p-4 space-y-1">
              <p className="text-sm text-muted-foreground">Гүйцэт ажилласан</p>
              <p className="text-xl font-semibold">{monthlyCompletedTasks * 2} цаг</p>
              <p className="text-sm text-muted-foreground">Дундаж 8 цаг/өдөр</p>
            </div>
          </CardContent>
        </Card>

        {/* QUICK ACTIONS */}
        <Card>
          <CardHeader>
            <CardTitle>Түргэлэн үйлдэл</CardTitle>
            <CardDescription>Шууд ажилууд</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/employee">
              <div className="rounded-lg border p-4 hover:bg-muted transition cursor-pointer space-y-1">
                <p className="text-sm text-muted-foreground">Өнөөдрийн даалгавар</p>
                <p className="text-xl font-semibold">Харах</p>
                <p className="text-sm text-muted-foreground">Бүх даалгаврын жагсаалт</p>
              </div>
            </Link>
            <Link href="/employee/locations">
              <div className="rounded-lg border p-4 hover:bg-muted transition cursor-pointer space-y-1">
                <p className="text-sm text-muted-foreground">Барааны байршил</p>
                <p className="text-xl font-semibold">Харах</p>
                <p className="text-sm text-muted-foreground">Барааны байршил, хэмжээ</p>
              </div>
            </Link>
          </CardContent>
        </Card>

      </div>
    </main>
  )
}
