"use client"

import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSupabaseApp } from "@/lib/supabase-app-context"

const dayOrder = ["Äàâàà","ÿãìàð","Ëõàãâà","Ïýðýâ","Áààñàí","Áÿìáà","Íÿì"]

export default function WeeklySalesComponent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const weekIndex = searchParams.get("week")
  const { transactions } = useSupabaseApp()
  const weeklyData = transactions
    .filter((transaction) => transaction.day)
    .reduce((acc: any[], transaction) => {
      const dayIndex = dayOrder.indexOf(transaction.day)
      if (dayIndex === -1) return acc
      
      const existingDay = acc.find((item) => item.day === transaction.day)
      if (existingDay) {
        existingDay.revenue += transaction.total
        existingDay.items += transaction.items.reduce((sum: number, item: any) => sum + item.quantity, 0)
      } else {
        acc.push({
          day: transaction.day,
          revenue: transaction.total,
          items: transaction.items.reduce((sum: number, item: any) => sum + item.quantity, 0)
        })
      }
      return acc
    }, [])
    .sort((a: any, b: any) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day))

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/manager"><Button variant="outline">« Áóóöàõ</Button></Link>
          <div className="text-right">
            <h1 className="text-2xl font-semibold">7 õîíîãèéí áîðëóóëàëò</h1>
            <p className="text-sm text-muted-foreground">Õóíàã ààð õÿçãààð áàðàà áîðëóóëñàí òàëäàë</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Õóíàã ààð îðëîãî</CardTitle>
            <CardDescription>Òàëäàëòàé õóíàã ààð îðëîãî</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Õóíàã ààð áàðààíû òîî</CardTitle>
            <CardDescription>Òàëäàëòàé õóíàã ààð áàðààíû òîî</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="items" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
