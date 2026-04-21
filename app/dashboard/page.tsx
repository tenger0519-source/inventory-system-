"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Package, Users, Truck, Bell, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useSupabaseApp } from "@/lib/supabase-app-context"
import type { Role } from "@/lib/supabase-app-context"

export const dynamic = 'force-dynamic'

const roleConfig: Record<Role, {
  label: string
  description: string
  href: string
  icon: React.ReactNode
}> = {
  manager: {
    label: "Meneger",
    description: "Tölövlölt, borluulalt, udirlag",
    href: "/manager",
    icon: <Users className="h-6 w-6" />,
  },
  employee: {
    label: "Ajiltan",
    description: "Ödriin daalgavar, bairshil",
    href: "/employee",
    icon: <Package className="h-6 w-6" />,
  },
  supplier: {
    label: "Niilüüldegch",
    description: "Khürgegt, zhiialga, bara",
    href: "/supplier",
    icon: <Truck className="h-6 w-6" />,
  },
}

export default function DashboardPage() {
  const router = useRouter()
  const { currentUser, roleRequests, logout, respondToRoleRequest, users } = useSupabaseApp()

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
            <h1 className="text-2xl font-semibold">Sain baina uu, {currentUser.name}</h1>
            <p className="text-sm text-muted-foreground">
              {isRoleless ? "Tany erhiig manager togtoono" : "Öriin sambraa songno uu"}
            </p>
          </div>
          <Button variant="outline" onClick={() => { logout(); router.push("/") }}>
            « Garah
          </Button>
        </div>

        {/* ROLELESS STATE */}
        {isRoleless && pendingRequests.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 space-y-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <Clock className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="font-medium">Erkh khüledegdei baina</p>
              <p className="text-sm text-muted-foreground text-center max-w-xs">
                Tany bürtgel amjilttai üüsllee. Manager tand erkh olgokh khüselt ilgeekh bolno.
              </p>
            </CardContent>
          </Card>
        )}

        {/* ROLE CARDS */}
        {!isRoleless && (
          <Card>
            <CardHeader>
              <CardTitle>Mini erkhüüd</CardTitle>
              <CardDescription>Ta doorkh sambarduudad nevtrekh bolomjtoi</CardDescription>
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
                  Erkhiin khüseltüüd
                </CardTitle>
                <CardDescription>Tand irsen erkh olgokh khüseltüüd</CardDescription>
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
              <p className="text-sm text-muted-foreground">Odoogoor khüselt baikhgüi baina.</p>
            ) : (
              <div className="space-y-2">
                {pendingRequests.map(r => {
                  const sender = users.find(u => u.id === r.fromUserId)
                  return (
                    <div key={r.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="text-sm font-medium">
                          {roleConfig[r.requestedRole].label} erkh avakh khüselt
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Ilgeesen: {sender?.name ?? `ID: ${r.fromUserId}`}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => respondToRoleRequest(r.id, true)}>
                          Zövshöörökh
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => respondToRoleRequest(r.id, false)}>
                          Tatgalzakh
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
