"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useSupabaseApp } from "@/lib/supabase-app-context"
import type { Role } from "@/lib/supabase-app-context"

const roleLabel: Record<Role, string> = {
  employee: "Ажилтан",
  manager:  "Менежер",
  supplier: "Нийлүүлэгч",
}

export default function EmployeesPage() {
  const router = useRouter()
  const { users, currentUser, roleRequests, sendRoleRequest } = useSupabaseApp()
  const [tab, setTab] = useState<"list" | "requests">("list")
  const [search, setSearch] = useState("")
  const [selectedUserId, setSelectedUserId] = useState("")
  const [selectedRole, setSelectedRole] = useState<Role>("employee")

  const employees = users.filter(u => u.roles.includes("employee"))
  const filtered = employees.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase())
  )

  // roleless users + existing employees (no suppliers, no managers-only)
  const assignableUsers = users.filter(u =>
    u.id !== currentUser?.id &&
    !u.roles.includes("supplier") &&
    !u.roles.includes("manager")
  )

  const sentRequests = roleRequests.filter(
    r => r.fromUserId === currentUser?.id && r.status === "pending"
  )

  const handleSend = () => {
    const id = Number(selectedUserId)
    if (!id) return
    sendRoleRequest(id, selectedRole)
    setSelectedUserId("")
  }

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.push('/manager')}>← Буцах</Button>
          <div className="text-right">
            <h1 className="text-2xl font-semibold">Ажилчдын удирдлага</h1>
            <p className="text-sm text-muted-foreground">{employees.length} ажилтан бүртгэлтэй</p>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-2">
          <Button variant={tab === "list"     ? "default" : "outline"} onClick={() => setTab("list")}>Жагсаалт</Button>
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
            <CardHeader><CardTitle>Ажилчид</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Нэрээр хайх..." value={search} onChange={e => setSearch(e.target.value)} />
              <div className="space-y-2">
                {filtered.map(u => (
                  <div key={u.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{u.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ID: {u.id} · {u.roles.map(r => roleLabel[r]).join(", ")}
                      </p>
                    </div>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <p className="text-sm text-muted-foreground">Ажилтан олдсонгүй.</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {tab === "requests" && (
          <Card>
            <CardHeader>
              <CardTitle>Эрх олгох хүсэлт илгээх</CardTitle>
              <CardDescription>Хэрэглэгч сонгоод өгөх эрхийг зааж өгнө үү</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">

              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Хэрэглэгч сонгох
                  <span className="ml-2 text-xs text-muted-foreground">(эрхгүй болон ажилтнууд)</span>
                </p>
                {assignableUsers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Сонгох хэрэглэгч байхгүй байна.</p>
                ) : (
                  <div className="space-y-1">
                    {assignableUsers.map(u => (
                      <div
                        key={u.id}
                        onClick={() => setSelectedUserId(String(u.id))}
                        className={`flex items-center justify-between rounded-lg border p-3 cursor-pointer transition ${
                          selectedUserId === String(u.id) ? "border-primary bg-primary/5" : "hover:bg-muted"
                        }`}
                      >
                        <div>
                          <p className="text-sm font-medium">{u.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {u.roles.length === 0 ? "Эрхгүй хэрэглэгч" : u.roles.map(r => roleLabel[r]).join(", ")}
                          </p>
                        </div>
                        {selectedUserId === String(u.id) && (
                          <span className="text-xs text-primary font-medium">Сонгогдсон</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Өгөх эрх</p>
                <select
                  value={selectedRole}
                  onChange={e => setSelectedRole(e.target.value as Role)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="employee">Ажилтан</option>
                  <option value="manager">Менежер</option>
                </select>
              </div>

              <Button onClick={handleSend} disabled={!selectedUserId} className="w-full">
                Хүсэлт илгээх
              </Button>

              {sentRequests.length > 0 && (
                <div className="space-y-2 pt-2 border-t">
                  <p className="text-sm font-medium">Илгээсэн хүсэлтүүд</p>
                  {sentRequests.map(r => {
                    const target = users.find(u => u.id === r.toUserId)
                    return (
                      <div key={r.id} className="rounded-lg border p-3 text-sm">
                        <p className="font-medium">{target?.name}</p>
                        <p className="text-muted-foreground">
                          → {roleLabel[r.requestedRole]} · Хүлээгдэж байна
                        </p>
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