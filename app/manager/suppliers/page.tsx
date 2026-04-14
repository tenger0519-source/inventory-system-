"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Supplier = {
  id: number
  name: string
}

type CompanyRequest = {
  id: number
  companyName: string
  type: "join" | "access"
}

export default function SuppliersPage() {
  const [tab, setTab] = useState<"list" | "requests">("list")

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: 1, name: "ABC Co" },
    { id: 2, name: "FoodSupply" },
    { id: 3, name: "LogiTech" },
  ])

  const [search, setSearch] = useState("")

  const [requests, setRequests] = useState<CompanyRequest[]>([
    { id: 1, companyName: "NewSupply LLC", type: "join" },
    { id: 2, companyName: "GlobalTrade", type: "join" },
    { id: 3, companyName: "FastLogistics", type: "access" },
    { id: 4, companyName: "MegaFood", type: "access" },
  ])

  // DELETE SUPPLIER
  const deleteSupplier = (id: number) => {
    setSuppliers(suppliers.filter((s) => s.id !== id))
  }

  // FILTER
  const filteredSuppliers = suppliers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  const joinRequests = requests.filter((r) => r.type === "join")
  const accessRequests = requests.filter((r) => r.type === "access")

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Нийлүүлэгчдийн удирдлага</h1>

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
          Нийлүүлэгчид
        </Button>

        <Button
          variant={tab === "requests" ? "default" : "outline"}
          onClick={() => setTab("requests")}
        >
          Компанийн хүсэлтүүд
        </Button>
      </div>

      {/* ================= LIST TAB ================= */}
      {tab === "list" && (
        <Card>
          <CardHeader>
            <CardTitle>Компанийн жагсаалт</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">

            {/* SEARCH */}
            <input
              className="w-full border p-2 rounded"
              placeholder="Компанийн нэрээр хайх..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* SUPPLIER LIST */}
            {filteredSuppliers.map((s) => (
              <div
                key={s.id}
                className="border rounded p-3 flex justify-between items-center"
              >
                <p className="font-semibold">{s.name}</p>

                <Button
                  variant="destructive"
                  onClick={() => deleteSupplier(s.id)}
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
        <div className="space-y-4">

          {/* JOIN REQUESTS */}
          <Card>
            <CardHeader>
              <CardTitle>Системд нэгдэх хүсэлт</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <p className="text-muted-foreground">
                Нийт: {joinRequests.length}
              </p>

              {joinRequests.map((r) => (
                <div key={r.id} className="border p-3 rounded">
                  {r.companyName}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* ACCESS REQUESTS */}
          <Card>
            <CardHeader>
              <CardTitle>Бусад компанид нэвтрэх хүсэлт</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <p className="text-muted-foreground">
                Нийт: {accessRequests.length}
              </p>

              {accessRequests.map((r) => (
                <div key={r.id} className="border p-3 rounded">
                  {r.companyName}
                </div>
              ))}
            </CardContent>
          </Card>

        </div>
      )}

    </main>
  )
}