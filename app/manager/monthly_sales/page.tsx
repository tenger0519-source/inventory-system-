"use client"

import { useRouter } from "next/navigation"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSupabaseApp } from "@/lib/supabase-app-context"

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"]

export default function MonthlySalesPage() {
  const router = useRouter()
  const { transactions, products, loading } = useSupabaseApp()

  // Calculate monthly statistics from transactions
  const calculateMonthlyStats = () => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    
    const monthlyTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date)
      return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear
    })

    const totalProducts = monthlyTransactions.reduce((sum, t) => 
      sum + t.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    )

    const totalRevenue = monthlyTransactions.reduce((sum, t) => sum + t.total, 0)

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const dailyAverage = Math.round(totalProducts / daysInMonth)

    return {
      totalProducts,
      totalRevenue,
      dailyAverage
    }
  }

  // Calculate pie chart data from product types
  const calculatePieData = () => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    
    const monthlyTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date)
      return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear
    })

    const productTypeMap = new Map<string, number>()

    monthlyTransactions.forEach(t => {
      t.items.forEach(item => {
        const product = products.find(p => p.name === item.product)
        const productType = product?.type || "Бусад"
        productTypeMap.set(productType, (productTypeMap.get(productType) || 0) + item.quantity)
      })
    })

    return Array.from(productTypeMap.entries()).map(([name, value]) => ({ name, value }))
  }

  // Calculate weekly breakdown
  const calculateWeeklyBreakdown = () => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    
    const monthlyTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date)
      return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear
    })

    const weeks = [
      { week: "1-р долоо хоног", products: 0 },
      { week: "2-р долоо хоног", products: 0 },
      { week: "3-р долоо хоног", products: 0 },
      { week: "4-р долоо хоног", products: 0 },
    ]

    monthlyTransactions.forEach(t => {
      const date = new Date(t.date)
      const weekOfMonth = Math.ceil(date.getDate() / 7)
      const weekIndex = Math.min(weekOfMonth - 1, 3)
      
      if (weekIndex >= 0 && weekIndex < 4) {
        weeks[weekIndex].products += t.items.reduce((sum, item) => sum + item.quantity, 0)
      }
    })

    return weeks
  }

  const stats = calculateMonthlyStats()
  const pieData = calculatePieData()
  const weeklyBreakdown = calculateWeeklyBreakdown()

  if (loading) {
    return (
      <main className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading data...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.back()}>← Буцах</Button>
          <div className="text-right">
            <h1 className="text-2xl font-semibold">Сарын борлуулалт</h1>
            <p className="text-sm text-muted-foreground">Бүтээгдэхүүний төрөл ба долоо хоногийн задаргаа</p>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Нийт бүтээгдэхүүн", value: stats.totalProducts.toLocaleString() },
            { label: "Орлого",             value: `₮ ${stats.totalRevenue.toLocaleString()}` },
            { label: "Өдрийн дундаж",      value: stats.dailyAverage.toLocaleString() },
          ].map(s => (
            <div key={s.label} className="rounded-lg border p-4 space-y-1">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-xl font-semibold">{s.value}</p>
            </div>
          ))}
        </div>

        {/* PIE + WEEKLY */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Бүтээгдэхүүний төрөл</CardTitle>
              <CardDescription>
                {pieData.length === 0 ? "Энэ сард борлуулалт байхгүй байна" : "Бүтээгдэхүүний төрөл бүрийн борлуулалт"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[280px]">
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} label>
                        {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <p>Мэдээлэл байхгүй</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7 хоногийн задаргаа</CardTitle>
              <CardDescription>Баганан дээр дарж дэлгэрэнгүйг харна</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[280px]">
                {weeklyBreakdown.some(w => w.products > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyBreakdown}>
                      <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="products" fill="#3b82f6" radius={[4,4,0,0]} cursor="pointer"
                        onClick={data => {
                          const index = weeklyBreakdown.indexOf(data.payload)
                          router.push(`/manager/weekly_sales?week=${index}`)
                        }} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <p>Мэдээлэл байхгүй</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </main>
  )
}