"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Package, Users, Truck, Bell, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useApp } from "@/lib/app-context"
import type { Role } from "@/lib/app-context"

const roleConfig: Record<Role, {
  label: string
  description: string
  href: string
  icon: React.ReactNode
}> = {
  manager: {
    label: "Менежер",
    description: "Төлөвлөлт, борлуулалт, удирдлага",
    href: "/manager",
    icon: <Users className="h-6 w-6" />,
  },
  employee: {
    label: "Ажилтан",
    description: "Өдрийн даалгавар, байршил",
    href: "/employee",
    icon: <Package className="h-6 w-6" />,
  },
  supplier: {
    label: "Нийлүүлэгч",
    description: "Хүргэлт, захиалга, бараа",
    href: "/supplier",
    icon: <Truck className="h-6 w-6" />,
  },
}

export default function DashboardPage() {
  const router = useRouter()
  const { currentUser, roleRequests, logout, respondToRequest, users } = useApp()

  useEffect(() => {
    if (!currentUser) router.push("/")
  }, [currentUser, router])

  if (!currentUser) return null

  const pendingRequests = roleRequests.filter(
    r => r.toUserId === currentUser.id && r.status === "pending"
  )

  const isRoleless = currentUser.roles.length === 0

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Сайн байна уу, {currentUser.name}</h1>
            <p className="text-sm text-muted-foreground">
              {isRoleless ? "Таны эрхийг менежер тогтооно" : "Өөрийн самбараа сонгоно уу"}
            </p>
          </div>
          <Button variant="outline" onClick={() => { logout(); router.push("/") }}>
            ← Гарах
          </Button>
        </div>

        {/* ROLELESS STATE */}
        {isRoleless && pendingRequests.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 space-y-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <Clock className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="font-medium">Эрх хүлээгдэж байна</p>
              <p className="text-sm text-muted-foreground text-center max-w-xs">
                Таны бүртгэл амжилттай үүслээ. Менежер таньд эрх олгох хүсэлт илгээх болно.
              </p>
            </CardContent>
          </Card>
        )}

        {/* ROLE CARDS */}
        {!isRoleless && (
          <Card>
            <CardHeader>
              <CardTitle>Миний эрхүүд</CardTitle>
              <CardDescription>Та доорх самбаруудад нэвтрэх боломжтой</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentUser.roles.map(role => {
                const config = roleConfig[role]
                return (
                  <Link key={role} href={config.href}>
                    <div className="rounded-lg border p-4 hover:bg-muted transition cursor-pointer space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          {config.icon}
                        </div>
                        <div>
                          <p className="font-medium">{config.label}</p>
                          <p className="text-xs text-muted-foreground">{config.description}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </CardContent>
          </Card>
        )}

        {/* PENDING REQUESTS */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Эрхийн хүсэлтүүд
                </CardTitle>
                <CardDescription>Танд ирсэн эрх олгох хүсэлтүүд</CardDescription>
              </div>
              {pendingRequests.length > 0 && (
                <span className="text-xs font-medium bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                  {pendingRequests.length}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {pendingRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground">Одоогоор хүсэлт байхгүй байна.</p>
            ) : (
              <div className="space-y-2">
                {pendingRequests.map(r => {
                  const sender = users.find(u => u.id === r.fromUserId)
                  return (
                    <div key={r.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="text-sm font-medium">
                          {roleConfig[r.requestedRole].label} эрх авах хүсэлт
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Илгээсэн: {sender?.name ?? `ID: ${r.fromUserId}`}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => respondToRequest(r.id, true)}>
                          Зөвшөөрөх
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => respondToRequest(r.id, false)}>
                          Татгалзах
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </main>
  )
}