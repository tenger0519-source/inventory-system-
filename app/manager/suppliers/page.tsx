"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useSupabaseApp } from "@/lib/supabase-app-context"
import type { Role, ProductRequest } from "@/lib/supabase-app-context"
import NotificationBell from "@/components/notification-bell"

const roleLabel: Record<Role, string> = {
  employee: "Ажилтан",
  manager:  "Менежер",
  supplier: "Нийлүүлэгч",
}

const statusLabel = (status: ProductRequest["status"]) => {
  if (status === "accepted") return { text: "Зөвшөөрөгдсөн", cls: "bg-green-50 text-green-700" }
  if (status === "declined") return { text: "Татгалзсан",     cls: "bg-red-50 text-red-700"   }
  return                            { text: "Хүлээгдэж байна", cls: "bg-muted text-muted-foreground" }
}

const typeLabel = (type: "give" | "take") => type === "give" ? "Өгөх" : "Авах"

export default function SuppliersPage() {
  const router = useRouter()
  const { users, currentUser, roleRequests, productRequests, sendRoleRequest, sendProductRequest, respondToProductRequest } = useSupabaseApp()

  const [tab, setTab] = useState<"list" | "role_requests" | "product_requests">("list")
  const [search, setSearch] = useState("")

  // role request state
  const [selectedUserId, setSelectedUserId] = useState("")
  const [selectedRole, setSelectedRole] = useState<Role>("supplier")

  // product request state
  const [selectedSupplierId, setSelectedSupplierId] = useState("")
  const [reqProduct, setReqProduct]   = useState("")
  const [reqQty, setReqQty]           = useState("")
  const [reqType, setReqType]         = useState<"give" | "take">("give")
  const [productReqView, setProductReqView] = useState<"sent" | "received" | null>(null)

  const suppliers = users.filter(u => u.roles.includes("supplier"))
  const filtered  = suppliers.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
  const rolelessUsers = users.filter(u => u.id !== currentUser?.id && u.roles.length === 0)

  const sentRoleRequests = roleRequests.filter(
    r => r.fromUserId === currentUser?.id && r.requestedRole === "supplier" && r.status === "pending"
  )

  // product requests
  const mySentProduct = productRequests.filter(r => r.fromUserId === currentUser?.id)
  const myReceivedProduct = productRequests.filter(
    r => r.toUserId === currentUser?.id
  )
  const pendingReceived = myReceivedProduct.filter(r => r.status === "pending")

  const handleSendRoleRequest = () => {
    const id = Number(selectedUserId)
    if (!id) return
    sendRoleRequest(id, selectedRole)
    setSelectedUserId("")
  }

  const handleSendProductRequest = () => {
    const id = Number(selectedSupplierId)
    if (!id || !reqProduct || !reqQty) return
    sendProductRequest(id, reqType, reqProduct, Number(reqQty))
    setReqProduct("")
    setReqQty("")
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
          <NotificationBell />
        </div>

        {/* TABS */}
        <div className="flex gap-2 flex-wrap">
          <Button variant={tab === "list"             ? "default" : "outline"} onClick={() => setTab("list")}>Нийлүүлэгчид</Button>
          <Button variant={tab === "product_requests" ? "default" : "outline"} onClick={() => setTab("product_requests")}>
            Бүтээгдэхүүний хүсэлт
            {pendingReceived.length > 0 && (
              <span className="ml-2 text-xs bg-primary-foreground text-primary rounded-full px-1.5">
                {pendingReceived.length}
              </span>
            )}
          </Button>
          <Button variant={tab === "role_requests"    ? "default" : "outline"} onClick={() => setTab("role_requests")}>
            Эрх олгох
            {sentRoleRequests.length > 0 && (
              <span className="ml-2 text-xs bg-primary-foreground text-primary rounded-full px-1.5">
                {sentRoleRequests.length}
              </span>
            )}
          </Button>
        </div>

        {/* ── LIST TAB ── */}
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

        {/* ── PRODUCT REQUESTS TAB ── */}
        {tab === "product_requests" && (
          <div className="space-y-4">

            {/* SEND REQUEST */}
            <Card>
              <CardHeader>
                <CardTitle>Нийлүүлэгчид хүсэлт илгээх</CardTitle>
                <CardDescription>Бараа өгөх эсвэл авах хүсэлт</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* SUPPLIER PICKER */}
                <div className="space-y-1">
                  <p className="text-sm font-medium">Нийлүүлэгч сонгох</p>
                  {suppliers.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Нийлүүлэгч байхгүй байна.</p>
                  ) : (
                    suppliers.map(s => (
                      <div
                        key={s.id}
                        onClick={() => setSelectedSupplierId(String(s.id))}
                        className={`flex items-center justify-between rounded-lg border p-3 cursor-pointer transition ${
                          selectedSupplierId === String(s.id) ? "border-primary bg-primary/5" : "hover:bg-muted"
                        }`}
                      >
                        <p className="text-sm font-medium">{s.name}</p>
                        {selectedSupplierId === String(s.id) && (
                          <span className="text-xs text-primary font-medium">Сонгогдсон</span>
                        )}
                      </div>
                    ))
                  )}
                </div>

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
                  disabled={!selectedSupplierId || !reqProduct || !reqQty}
                  className="w-full"
                >
                  Хүсэлт илгээх
                </Button>
              </CardContent>
            </Card>

            {/* SENT / RECEIVED SUMMARY */}
            <Card>
              <CardHeader>
                <CardTitle>Хүсэлтүүд</CardTitle>
                <CardDescription>Илгээсэн болон хүлээн авсан</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setProductReqView(v => v === "sent" ? null : "sent")}
                    className={`rounded-lg border p-4 text-left transition hover:bg-muted ${productReqView === "sent" ? "border-primary bg-primary/5" : ""}`}
                  >
                    <p className="text-sm text-muted-foreground">Илгээсэн</p>
                    <p className="text-2xl font-semibold">{mySentProduct.length}</p>
                  </button>
                  <button
                    onClick={() => setProductReqView(v => v === "received" ? null : "received")}
                    className={`rounded-lg border p-4 text-left transition hover:bg-muted relative ${productReqView === "received" ? "border-primary bg-primary/5" : ""}`}
                  >
                    <p className="text-sm text-muted-foreground">Хүлээн авсан</p>
                    <p className="text-2xl font-semibold">{myReceivedProduct.length}</p>
                    {pendingReceived.length > 0 && (
                      <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-medium">
                        {pendingReceived.length}
                      </span>
                    )}
                  </button>
                </div>

                {/* SENT LIST */}
                {productReqView === "sent" && (
                  <div className="space-y-2 pt-2 border-t">
                    <p className="text-sm font-medium">Илгээсэн хүсэлтүүд</p>
                    {mySentProduct.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Илгээсэн хүсэлт байхгүй.</p>
                    ) : (
                      mySentProduct.map(r => {
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
                {productReqView === "received" && (
                  <div className="space-y-2 pt-2 border-t">
                    <p className="text-sm font-medium">Хүлээн авсан хүсэлтүүд</p>
                    {myReceivedProduct.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Хүлээн авсан хүсэлт байхгүй.</p>
                    ) : (
                      myReceivedProduct.map(r => {
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
          </div>
        )}

        {/* ── ROLE REQUESTS TAB ── */}
        {tab === "role_requests" && (
          <Card>
            <CardHeader>
              <CardTitle>Нийлүүлэгч болгох хүсэлт</CardTitle>
              <CardDescription>Зөвхөн эрхгүй хэрэглэгчдийг нийлүүлэгч болгох боломжтой</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Эрхгүй хэрэглэгч сонгох</p>
                {rolelessUsers.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-6 text-center">
                    <p className="text-sm text-muted-foreground">Одоогоор эрхгүй хэрэглэгч байхгүй байна.</p>
                  </div>
                ) : (
                  rolelessUsers.map(u => (
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
                  ))
                )}
              </div>

              <Button onClick={handleSendRoleRequest} disabled={!selectedUserId} className="w-full">
                Нийлүүлэгч болгох хүсэлт илгээх
              </Button>

              {sentRoleRequests.length > 0 && (
                <div className="space-y-2 pt-2 border-t">
                  <p className="text-sm font-medium">Илгээсэн хүсэлтүүд</p>
                  {sentRoleRequests.map(r => {
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