"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Role = "worker" | "manager"

type User = {
  id: number
  name: string
  role: Role
}

type Request = {
  userId: number
  requestedRole: Role
}

export default function EmployeesPage() {
  const [tab, setTab] = useState<"list" | "requests">("list")

  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "Бат", role: "worker" },
    { id: 2, name: "Сараа", role: "manager" },
    { id: 3, name: "Тэмүүжин", role: "worker" },
    { id: 4, name: "Номин", role: "worker" },
  ])

  const [search, setSearch] = useState("")
  const [requests, setRequests] = useState<Request[]>([])

  const [requestUserId, setRequestUserId] = useState("")
  const [requestRole, setRequestRole] = useState<Role>("worker")

  // DELETE USER
  const deleteUser = (id: number) => {
    setUsers(users.filter((u) => u.id !== id))
  }

  // SEND REQUEST
  const sendRequest = () => {
    const id = Number(requestUserId)
    if (!id) return

    setRequests([
      ...requests,
      { userId: id, requestedRole: requestRole },
    ])

    setRequestUserId("")
  }

  // SEARCH FILTER
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Ажилчдын удирдлага</h1>

        <Button variant="outline" onClick={() => window.history.back()}>
          ← Буцах
        </Button>
      </div>

      {/* TABS */}
      <div className="flex gap-2">
        <Button
          variant={tab === "list" ? "default" : "outline"}
          onClick={() => setTab("list")}
        >
          Ажилчдын жагсаалт
        </Button>

        <Button
          variant={tab === "requests" ? "default" : "outline"}
          onClick={() => setTab("requests")}
        >
          Хүсэлт илгээх
        </Button>
      </div>

      {/* ================= LIST TAB ================= */}
      {tab === "list" && (
        <Card>
          <CardHeader>
            <CardTitle>Ажилчид</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">

            {/* SEARCH */}
            <input
              className="w-full border p-2 rounded"
              placeholder="Нэрээр хайх..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* USERS */}
            {filteredUsers.map((u) => (
              <div
                key={u.id}
                className="border rounded p-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{u.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ID: {u.id} • Role: {u.role}
                  </p>
                </div>

                <Button
                  variant="destructive"
                  onClick={() => deleteUser(u.id)}
                >
                  Устгах
                </Button>
              </div>
            ))}

          </CardContent>
        </Card>
      )}

      {/* ================= REQUEST TAB ================= */}
      {tab === "requests" && (
        <Card>
          <CardHeader>
            <CardTitle>Role солих хүсэлт</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">

            {/* INPUTS */}
            <input
              className="w-full border p-2 rounded"
              placeholder="User ID"
              value={requestUserId}
              onChange={(e) => setRequestUserId(e.target.value)}
            />

            <select
              className="w-full border p-2 rounded"
              value={requestRole}
              onChange={(e) => setRequestRole(e.target.value as Role)}
            >
              <option value="worker">Worker</option>
              <option value="manager">Manager</option>
            </select>

            <Button onClick={sendRequest}>
              Хүсэлт илгээх
            </Button>

            {/* REQUEST LIST */}
            <div className="space-y-2 pt-4">
              {requests.map((r, i) => (
                <div key={i} className="border p-3 rounded">
                  <p>User ID: {r.userId}</p>
                  <p>Requested Role: {r.requestedRole}</p>
                </div>
              ))}
            </div>

          </CardContent>
        </Card>
      )}

    </main>
  )
}