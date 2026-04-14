"use client"

import Link from "next/link"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ManagerHome() {
  return (
    <main className="min-h-screen bg-background p-4 sm:p-6">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* ========================= */}
        {/* HEADER */}
        {/* ========================= */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">
              Гарах
            </Button>
          </Link>

          <div className="text-left sm:text-right">
            <h1 className="text-xl sm:text-2xl font-semibold">
              Менежерийн хяналтын самбар
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Төлөвлөлт, борлуулалт, системийн удирдлага
            </p>
          </div>
        </div>

        {/* ========================= */}
        {/* PLANNING */}
        {/* ========================= */}
        <Card>
          <CardHeader>
            <CardTitle>Төлөвлөлт</CardTitle>
            <CardDescription>Өдөр, 7 хоног, сар</CardDescription>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* DAILY */}
            <Link href="/manager/daily_plan">
              <div className="border rounded-lg p-4 hover:bg-muted cursor-pointer transition h-full min-h-[120px]">
                <p className="text-sm text-muted-foreground">Өнөөдөр</p>
                <p className="text-lg sm:text-xl font-semibold">12 даалгавар</p>
                <p className="text-sm">⬇ 5 орж ирэх</p>
                <p className="text-sm">⬆ 7 гарах</p>
              </div>
            </Link>

            {/* WEEK + MONTH (SIMPLIFIED AS YOU REQUESTED) */}
            <Link href="/manager/weekly_plan">
              <div className="border rounded-lg p-4 hover:bg-muted cursor-pointer transition h-full min-h-[120px] flex flex-col justify-center">

                <p className="text-sm text-muted-foreground">Төлөвлөгөө</p>

                {/* ONLY TASK COUNTS */}
                <div className="mt-2 space-y-1">
                  <p className="text-lg sm:text-xl font-semibold">
                    📅 7 хоног: 68
                  </p>
                  <p className="text-lg sm:text-xl font-semibold">
                    📆 Сар: 240
                  </p>
                </div>

              </div>
            </Link>

          </CardContent>
        </Card>

        {/* ========================= */}
        {/* SALES REPORTS */}
        {/* ========================= */}
        <Card>
          <CardHeader>
            <CardTitle>Борлуулалтын тайлан</CardTitle>
            <CardDescription>
              Өдөр, 7 хоног, сарын орлого болон анализ
            </CardDescription>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <Link href="/manager/daily_sales">
              <div className="border rounded-lg p-4 hover:bg-muted cursor-pointer transition min-h-[120px]">
                <p className="text-sm text-muted-foreground">Өнөөдөр</p>
                <p className="text-lg sm:text-xl font-semibold">120 бараа</p>
                <p className="text-sm">₮ 1,200,000</p>
              </div>
            </Link>

            <Link href="/manager/weekly_sales">
              <div className="border rounded-lg p-4 hover:bg-muted cursor-pointer transition min-h-[120px]">
                <p className="text-sm text-muted-foreground">7 хоног</p>
                <p className="text-lg sm:text-xl font-semibold">860 бараа</p>
                <p className="text-sm">₮ 8,500,000</p>
              </div>
            </Link>

            <Link href="/manager/monthly_sales">
              <div className="border rounded-lg p-4 hover:bg-muted cursor-pointer transition min-h-[120px]">
                <p className="text-sm text-muted-foreground">Сар</p>
                <p className="text-lg sm:text-xl font-semibold">3,200 бараа</p>
                <p className="text-sm">₮ 32,000,000</p>
              </div>
            </Link>

          </CardContent>
        </Card>

        {/* ========================= */}
        {/* SYSTEM MODULES */}
        {/* ========================= */}
        <Card>
          <CardHeader>
            <CardTitle>Системийн бүртгэл</CardTitle>
            <CardDescription>
              Ажилчид, нийлүүлэгчид, бараа
            </CardDescription>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <Link href="/manager/employees">
              <div className="border rounded-lg p-4 hover:bg-muted cursor-pointer transition min-h-[120px]">
                <p className="text-sm text-muted-foreground">Ажилчид</p>
                <p className="text-lg sm:text-xl font-semibold">18</p>
              </div>
            </Link>

            <Link href="/manager/suppliers">
              <div className="border rounded-lg p-4 hover:bg-muted cursor-pointer transition min-h-[120px]">
                <p className="text-sm text-muted-foreground">Нийлүүлэгчид</p>
                <p className="text-lg sm:text-xl font-semibold">6</p>
              </div>
            </Link>

            <Link href="/manager/products">
              <div className="border rounded-lg p-4 hover:bg-muted cursor-pointer transition min-h-[120px]">
                <p className="text-sm text-muted-foreground">Бараа</p>
                <p className="text-lg sm:text-xl font-semibold">1,240</p>
              </div>
            </Link>

          </CardContent>
        </Card>

      </div>
    </main>
  )
}