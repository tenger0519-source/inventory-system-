"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ManagerHome() {
  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <Link href="/"><Button variant="outline">← Гарах</Button></Link>
          <div className="text-right">
            <h1 className="text-2xl font-semibold">Менежерийн самбар</h1>
            <p className="text-sm text-muted-foreground">Төлөвлөлт, борлуулалт, удирдлага</p>
          </div>
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
                <p className="text-xl font-semibold">12 даалгавар</p>
                <p className="text-sm text-muted-foreground">5 орж ирэх · 7 гарах</p>
              </div>
            </Link>
            <Link href="/manager/weekly_plan">
              <div className="rounded-lg border p-4 hover:bg-muted transition cursor-pointer space-y-1">
                <p className="text-sm text-muted-foreground">7 хоног · Сар</p>
                <p className="text-xl font-semibold">68 даалгавар</p>
                <p className="text-sm text-muted-foreground">Сарын нийт: 240</p>
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