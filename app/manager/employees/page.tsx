"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

type Role = "worker" | "manager"
type User = { id: number; name: string; role: Role }
type Request = { userId: number; requestedRole: Role }

const roleLabel: Record<Role, string> = { worker: "Ажилтан", manager: "Менежер" }

export default function EmployeesPage() {
  const router = useRouter()
  const [tab, setTab] = useState<"list" | "requests">("list")
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "Бат",       role: "worker"  },
    { id: 2, name: "Сараа",     role: "manager" },
    { id: 3, name: "Тэмүүжин", role: "worker"  },
    { id: 4, name: "Номин",     role: "worker"  },
  ])
  const [search, setSearch] = useState("")
  const [requests, setRequests] = useState<Request[]>([])
  const [requestUserId, setRequestUserId] = useState("")
  const [requestRole, setRequestRole] = useState<Role>("worker")

  const deleteUser = (id: number) => setUsers(users.filter(u => u.id !== id))
  const sendRequest = () => {
    const id = Number(requestUserId)
    if (!id) return
    setRequests([...requests, { userId: id, requestedRole: requestRole }])
    setRequestUserId("")
  }
  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.push('/manager')}>← Буцах</Button>
          <div className="text-right">
            <h1 className="text-2xl font-semibold">Ажилчдын удирдлага</h1>
            <p className="text-sm text-muted-foreground">{users.length} ажилтан бүртгэлтэй</p>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-2">
          <Button variant={tab === "list"     ? "default" : "outline"} onClick={() => setTab("list")}>Жагсаалт</Button>
          <Button variant={tab === "requests" ? "default" : "outline"} onClick={() => setTab("requests")}>Хүсэлт илгээх</Button>
        </div>

        {tab === "list" && (
          <Card>
            <CardHeader>
              <CardTitle>Ажилчид</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Нэрээр хайх..." value={search} onChange={e => setSearch(e.target.value)} />
              <div className="space-y-2">
                {filtered.map(u => (
                  <div key={u.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{u.name}</p>
                      <p className="text-sm text-muted-foreground">ID: {u.id} · {roleLabel[u.role]}</p>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => deleteUser(u.id)}>Устгах</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {tab === "requests" && (
          <Card>
            <CardHeader>
              <CardTitle>Эрх солих хүсэлт</CardTitle>
              <CardDescription>Ажилтны ID болон шинэ эрхийг оруулна уу</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Ажилтны ID" value={requestUserId} onChange={e => setRequestUserId(e.target.value)} />
              <select
                value={requestRole}
                onChange={e => setRequestRole(e.target.value as Role)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="worker">Ажилтан</option>
                <option value="manager">Менежер</option>
              </select>
              <Button onClick={sendRequest}>Хүсэлт илгээх</Button>
              {requests.length > 0 && (
                <div className="space-y-2 pt-2 border-t">
                  {requests.map((r, i) => (
                    <div key={i} className="rounded-lg border p-3 text-sm">
                      <p>ID: {r.userId} → {roleLabel[r.requestedRole]}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

      </div>
    </main>
  )
}