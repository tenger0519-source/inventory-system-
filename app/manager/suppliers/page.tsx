"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useApp } from "@/lib/app-context"
import type { Role } from "@/lib/app-context"

const roleLabel: Record<Role, string> = {
  employee: "Ажилтан",
  manager:  "Менежер",
  supplier: "Нийлүүлэгч",
}

export default function SuppliersPage() {
  const router = useRouter()
  const { users, currentUser, roleRequests, sendRoleRequest } = useApp()
  const [tab, setTab] = useState<"list" | "requests">("list")
  const [search, setSearch] = useState("")
  const [selectedUserId, setSelectedUserId] = useState("")

  const suppliers = users.filter(u => u.roles.includes("supplier"))
  const filtered = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  // only roleless users can become suppliers
  const rolelessUsers = users.filter(u =>
    u.id !== currentUser?.id && u.roles.length === 0
  )

  const sentRequests = roleRequests.filter(
    r => r.fromUserId === currentUser?.id &&
         r.requestedRole === "supplier" &&
         r.status === "pending"
  )

  const handleSend = () => {
    const id = Number(selectedUserId)
    if (!id) return
    sendRoleRequest(id, "supplier")
    setSelectedUserId("")
  }

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.push('/manager')}>← Буцах</Button>
          <div className="text-right">
            <h1 className="text-2xl font-semibold">Нийлүүлэгчдийн удирдлага</h1>
            <p className="text-sm text-muted-foreground">{suppliers.length} нийлүүлэгч бүртгэлтэй</p>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-2">
          <Button variant={tab === "list"     ? "default" : "outline"} onClick={() => setTab("list")}>Нийлүүлэгчид</Button>
          <Button variant={tab === "requests" ? "default" : "outline"} onClick={() => setTab("requests")}>
            Хүсэлт илгээх
            {sentRequests.length > 0 && (
              <span className="ml-2 text-xs bg-primary-foreground text-primary rounded-full px-1.5">
                {sentRequests.length}
              </span>
            )}
          </Button>
        </div>

        {tab === "list" && (
          <Card>
            <CardHeader><CardTitle>Нийлүүлэгчдийн жагсаалт</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Нэрээр хайх..." value={search} onChange={e => setSearch(e.target.value)} />
              <div className="space-y-2">
                {filtered.map(s => (
                  <div key={s.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{s.name}</p>
                      <p className="text-sm text-muted-foreground">ID: {s.id}</p>
                    </div>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <p className="text-sm text-muted-foreground">Нийлүүлэгч олдсонгүй.</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {tab === "requests" && (
          <Card>
            <CardHeader>
              <CardTitle>Нийлүүлэгч болгох хүсэлт</CardTitle>
              <CardDescription>Зөвхөн эрхгүй хэрэглэгчдийг нийлүүлэгч болгох боломжтой</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">

              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Эрхгүй хэрэглэгч сонгох
                </p>
                {rolelessUsers.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      Одоогоор эрхгүй хэрэглэгч байхгүй байна.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Шинэ хэрэглэгч бүртгүүлсний дараа энд харагдана.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {rolelessUsers.map(u => (
                      <div
                        key={u.id}
                        onClick={() => setSelectedUserId(String(u.id))}
                        className={`flex items-center justify-between rounded-lg border p-3 cursor-pointer transition ${
                          selectedUserId === String(u.id) ? "border-primary bg-primary/5" : "hover:bg-muted"
                        }`}
                      >
                        <div>
                          <p className="text-sm font-medium">{u.name}</p>
                          <p className="text-xs text-muted-foreground">Эрхгүй хэрэглэгч</p>
                        </div>
                        {selectedUserId === String(u.id) && (
                          <span className="text-xs text-primary font-medium">Сонгогдсон</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button
                onClick={handleSend}
                disabled={!selectedUserId}
                className="w-full"
              >
                Нийлүүлэгч болгох хүсэлт илгээх
              </Button>

              {sentRequests.length > 0 && (
                <div className="space-y-2 pt-2 border-t">
                  <p className="text-sm font-medium">Илгээсэн хүсэлтүүд</p>
                  {sentRequests.map(r => {
                    const target = users.find(u => u.id === r.toUserId)
                    return (
                      <div key={r.id} className="rounded-lg border p-3 text-sm">
                        <p className="font-medium">{target?.name}</p>
                        <p className="text-muted-foreground">→ Нийлүүлэгч · Хүлээгдэж байна</p>
                      </div>
                    )
                  })}
                </div>
              )}

            </CardContent>
          </Card>
        )}

      </div>
    </main>
  )
}