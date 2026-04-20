"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useApp } from "@/lib/app-context"
import NotificationBell from "@/components/notification-bell"
import type { ProductRequest } from "@/lib/app-context"

type StockProduct = { id: number; name: string; stock: number }
type RequestMap = { [id: number]: number }

const statusLabel = (status: ProductRequest["status"]) => {
  if (status === "accepted")  return { text: "Зөвшөөрөгдсөн", cls: "bg-green-50 text-green-700" }
  if (status === "declined")  return { text: "Татгалзсан",     cls: "bg-red-50 text-red-700"   }
  return                               { text: "Хүлээгдэж байна", cls: "bg-muted text-muted-foreground" }
}

const typeLabel = (type: "give" | "take") =>
  type === "give" ? "Өгөх" : "Авах"

export default function SupplierHome() {
  const { currentUser, users, productRequests, sendProductRequest, respondToProductRequest } = useApp()

  const [search, setSearch] = useState("")
  const [requested, setRequested] = useState<RequestMap>({})
  const [panelOpen, setPanelOpen] = useState(false)
  const [requestsView, setRequestsView] = useState<"sent" | "received" | null>(null)

  const [products, setProducts] = useState<StockProduct[]>([
    { id: 1, name: "Кока-Кола", stock: 20 },
    { id: 2, name: "Чипс",      stock: 12 },
    { id: 3, name: "Пепси",     stock: 30 },
  ])

  // new product request form
  const [reqProduct, setReqProduct] = useState("")
  const [reqQty, setReqQty]         = useState("")
  const [reqType, setReqType]       = useState<"give" | "take">("give")

  const managers = users.filter(u => u.roles.includes("manager"))

  const mySent = productRequests.filter(r => r.fromUserId === currentUser?.id)
  const myReceived = productRequests.filter(
    r => r.toUserId === currentUser?.id
  )
  const myPendingReceived = myReceived.filter(r => r.status === "pending")

  const handleRequest = (p: StockProduct) => {
    const input = prompt(`${p.name} — хүсэх тоо (Нөөц: ${p.stock})`)
    if (!input) return
    const qty = Math.min(Math.max(Number(input), 0), p.stock)
    if (!qty) return
    setRequested(prev => ({ ...prev, [p.id]: qty }))
  }

  const cancelRequest = (id: number) => {
    setRequested(prev => { const c = { ...prev }; delete c[id]; return c })
  }

  const submitRequests = () => {
    setProducts(prev =>
      prev.map(p => ({ ...p, stock: p.stock - (requested[p.id] || 0) }))
    )
    setRequested({})
    setPanelOpen(false)
  }

  const handleSendProductRequest = () => {
    if (!reqProduct || !reqQty || managers.length === 0) return
    managers.forEach(m => {
      sendProductRequest(m.id, reqType, reqProduct, Number(reqQty))
    })
    setReqProduct("")
    setReqQty("")
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <Link href="/dashboard"><Button variant="outline">← Буцах</Button></Link>
          <div className="text-right">
            <h1 className="text-2xl font-semibold">Нийлүүлэгчийн самбар</h1>
            <p className="text-sm text-muted-foreground">Хүргэлт, хүсэлт, бүтээгдэхүүний удирдлага</p>
          </div>
          <NotificationBell />
        </div>

        {/* DELIVERY STATS */}
        <Card>
          <CardHeader>
            <CardTitle>Төлөвлөгдсөн хүргэлт</CardTitle>
            <CardDescription>Баталгаажсан хүргэлтүүд</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Өнөөдөр",  delivery: 6,   receive: 4  },
              { label: "7 хоног",  delivery: 28,  receive: 19 },
              { label: "Сар",      delivery: 110, receive: 85 },
            ].map(d => (
              <div key={d.label} className="rounded-lg border p-4 space-y-1">
                <p className="text-sm text-muted-foreground">{d.label}</p>
                <p className="font-semibold">{d.delivery} хүргэлт</p>
                <p className="text-sm text-muted-foreground">{d.receive} хүлээн авах</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* REQUESTS SUMMARY */}
        <Card>
          <CardHeader>
            <CardTitle>Хүсэлтүүд</CardTitle>
            <CardDescription>Илгээсэн болон хүлээн авсан</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setRequestsView(v => v === "sent" ? null : "sent")}
                className={`rounded-lg border p-4 text-left transition hover:bg-muted ${requestsView === "sent" ? "border-primary bg-primary/5" : ""}`}
              >
                <p className="text-sm text-muted-foreground">Илгээсэн</p>
                <p className="text-2xl font-semibold">{mySent.length}</p>
              </button>
              <button
                onClick={() => setRequestsView(v => v === "received" ? null : "received")}
                className={`rounded-lg border p-4 text-left transition hover:bg-muted relative ${requestsView === "received" ? "border-primary bg-primary/5" : ""}`}
              >
                <p className="text-sm text-muted-foreground">Хүлээн авсан</p>
                <p className="text-2xl font-semibold">{myReceived.length}</p>
                {myPendingReceived.length > 0 && (
                  <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-medium">
                    {myPendingReceived.length}
                  </span>
                )}
              </button>
            </div>

            {/* SENT LIST */}
            {requestsView === "sent" && (
              <div className="space-y-2 pt-2 border-t">
                <p className="text-sm font-medium">Илгээсэн хүсэлтүүд</p>
                {mySent.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Илгээсэн хүсэлт байхгүй.</p>
                ) : (
                  mySent.map(r => {
                    const receiver = users.find(u => u.id === r.toUserId)
                    const s = statusLabel(r.status)
                    return (
                      <div key={r.id} className="rounded-lg border p-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{receiver?.name}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.cls}`}>
                            {s.text}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {typeLabel(r.type)}: {r.product} — {r.quantity}ш
                        </p>
                      </div>
                    )
                  })
                )}
              </div>
            )}

            {/* RECEIVED LIST */}
            {requestsView === "received" && (
              <div className="space-y-2 pt-2 border-t">
                <p className="text-sm font-medium">Хүлээн авсан хүсэлтүүд</p>
                {myReceived.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Хүлээн авсан хүсэлт байхгүй.</p>
                ) : (
                  myReceived.map(r => {
                    const sender = users.find(u => u.id === r.fromUserId)
                    const s = statusLabel(r.status)
                    return (
                      <div key={r.id} className="rounded-lg border p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{sender?.name}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.cls}`}>
                            {s.text}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {typeLabel(r.type)}: {r.product} — {r.quantity}ш
                        </p>
                        {r.status === "pending" && (
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1" onClick={() => respondToProductRequest(r.id, true)}>
                              Зөвшөөрөх
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1" onClick={() => respondToProductRequest(r.id, false)}>
                              Татгалзах
                            </Button>
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* SEND PRODUCT REQUEST TO MANAGER */}
        <Card>
          <CardHeader>
            <CardTitle>Менежерт хүсэлт илгээх</CardTitle>
            <CardDescription>Бараа өгөх эсвэл авах хүсэлт</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                placeholder="Барааны нэр"
                value={reqProduct}
                onChange={e => setReqProduct(e.target.value)}
              />
              <Input
                placeholder="Тоо хэмжээ"
                type="number"
                value={reqQty}
                onChange={e => setReqQty(e.target.value)}
              />
              <select
                value={reqType}
                onChange={e => setReqType(e.target.value as "give" | "take")}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="give">Өгөх</option>
                <option value="take">Авах</option>
              </select>
            </div>
            <Button
              onClick={handleSendProductRequest}
              disabled={!reqProduct || !reqQty}
              className="w-full"
            >
              Хүсэлт илгээх
            </Button>
          </CardContent>
        </Card>

        {/* STOCK */}
        <Card>
          <CardHeader>
            <CardTitle>Барааны нөөц</CardTitle>
            <CardDescription>Нөөц болон захиалга</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Бараа хайх..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className="space-y-2">
              {filtered.map(p => {
                const req = requested[p.id] || 0
                return (
                  <div
                    key={p.id}
                    className={`flex items-center justify-between rounded-lg border p-3 transition ${req > 0 ? "border-primary/50 bg-primary/5" : ""}`}
                  >
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Нөөц: {p.stock}{req > 0 ? ` · Захиалсан: ${req}` : ""}
                      </p>
                    </div>
                    <Button
                      variant={req > 0 ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => handleRequest(p)}
                    >
                      {req > 0 ? "Засах" : "Захиалах"}
                    </Button>
                  </div>
                )
              })}
            </div>
            {Object.keys(requested).length > 0 && (
              <Button className="w-full" onClick={() => setPanelOpen(true)}>
                Захиалгуудыг харах ({Object.keys(requested).length})
              </Button>
            )}
          </CardContent>
        </Card>

      </div>

      {/* SLIDE PANEL */}
      {panelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setPanelOpen(false)} />
          <div className="relative w-full sm:w-[380px] bg-background border-l flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold">Захиалгын жагсаалт</h2>
              <Button variant="ghost" size="sm" onClick={() => setPanelOpen(false)}>✕</Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {Object.entries(requested).map(([id, qty]) => {
                const product = products.find(p => p.id === Number(id))
                if (!product) return null
                return (
                  <div key={id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">Тоо: {qty}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => cancelRequest(Number(id))}
                    >
                      Хасах
                    </Button>
                  </div>
                )
              })}
            </div>
            <div className="p-4 border-t">
              <Button className="w-full" onClick={submitRequests}>
                Захиалга баталгаажуулах
              </Button>
            </div>
          </div>
        </div>
      )}

    </main>
  )
}