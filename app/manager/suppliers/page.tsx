"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

type Supplier = { id: number; name: string }
type CompanyRequest = { id: number; companyName: string; type: "join" | "access" }

export default function SuppliersPage() {
  const router = useRouter()
  const [tab, setTab] = useState<"list" | "requests">("list")
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: 1, name: "ABC Co"       },
    { id: 2, name: "FoodSupply"   },
    { id: 3, name: "LogiTech"     },
  ])
  const [search, setSearch] = useState("")
  const [requests] = useState<CompanyRequest[]>([
    { id: 1, companyName: "NewSupply LLC",  type: "join"   },
    { id: 2, companyName: "GlobalTrade",    type: "join"   },
    { id: 3, companyName: "FastLogistics",  type: "access" },
    { id: 4, companyName: "MegaFood",       type: "access" },
  ])

  const deleteSupplier = (id: number) => setSuppliers(suppliers.filter(s => s.id !== id))
  const filtered = suppliers.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
  const joinRequests   = requests.filter(r => r.type === "join")
  const accessRequests = requests.filter(r => r.type === "access")

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
          <Button variant={tab === "requests" ? "default" : "outline"} onClick={() => setTab("requests")}>Хүсэлтүүд</Button>
        </div>

        {tab === "list" && (
          <Card>
            <CardHeader>
              <CardTitle>Компанийн жагсаалт</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Нэрээр хайх..." value={search} onChange={e => setSearch(e.target.value)} />
              <div className="space-y-2">
                {filtered.map(s => (
                  <div key={s.id} className="flex items-center justify-between rounded-lg border p-3">
                    <p className="font-medium">{s.name}</p>
                    <Button variant="destructive" size="sm" onClick={() => deleteSupplier(s.id)}>Устгах</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {tab === "requests" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Системд нэгдэх хүсэлт</CardTitle>
                <CardDescription>{joinRequests.length} хүсэлт</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {joinRequests.map(r => (
                  <div key={r.id} className="rounded-lg border p-3 text-sm font-medium">{r.companyName}</div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Бусад компанид нэвтрэх хүсэлт</CardTitle>
                <CardDescription>{accessRequests.length} хүсэлт</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {accessRequests.map(r => (
                  <div key={r.id} className="rounded-lg border p-3 text-sm font-medium">{r.companyName}</div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

      </div>
    </main>
  )
}