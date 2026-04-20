"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Product = { id: number; name: string; supplier: string; price: number; type: string; date: string; stock: number }
type RequestMap = { [id: number]: number }

export default function SupplierHome() {
  const [search, setSearch] = useState("")
  const [requested, setRequested] = useState<RequestMap>({})
  const [panelOpen, setPanelOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Кока-Кола", supplier: "ABC Co",    price: 2500, type: "Ундаа", date: "2026-04-10", stock: 20 },
    { id: 2, name: "Чипс",      supplier: "Snack LLC", price: 1500, type: "Хоол",  date: "2026-04-09", stock: 12 },
    { id: 3, name: "Пепси",     supplier: "ABC Co",    price: 2300, type: "Ундаа", date: "2026-04-08", stock: 30 },
  ])

  const handleRequest = (p: Product) => {
    const input = prompt(`${p.name} — хүсэх тоо (Нөөц: ${p.stock})`)
    if (!input) return
    let qty = Math.min(Math.max(Number(input), 0), p.stock)
    if (!qty) return
    setRequested(prev => ({ ...prev, [p.id]: qty }))
  }

  const cancelRequest = (id: number) => {
    setRequested(prev => { const c = { ...prev }; delete c[id]; return c })
  }

  const submitRequests = () => {
    setProducts(prev => prev.map(p => ({ ...p, stock: p.stock - (requested[p.id] || 0) })))
    setRequested({})
    setPanelOpen(false)
  }

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
  const requestCount = Object.keys(requested).length

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <Link href="/"><Button variant="outline">← Гарах</Button></Link>
          <div className="text-right">
            <h1 className="text-2xl font-semibold">Нийлүүлэгчийн самбар</h1>
            <p className="text-sm text-muted-foreground">Хүргэлт, хүсэлт, бүтээгдэхүүний удирдлага</p>
          </div>
        </div>

        {/* DELIVERY */}
        <Card>
          <CardHeader>
            <CardTitle>Төлөвлөгдсөн хүргэлт</CardTitle>
            <CardDescription>Баталгаажсан хүргэлтүүд</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Өнөөдөр",  delivery: 6,   receive: 4   },
              { label: "7 хоног",  delivery: 28,  receive: 19  },
              { label: "Сар",      delivery: 110, receive: 85  },
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
          <CardContent className="grid grid-cols-2 gap-4">
            {[{ label: "Илгээсэн", value: 15 }, { label: "Хүлээн авсан", value: 11 }].map(s => (
              <div key={s.label} className="rounded-lg border p-4 space-y-1">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-semibold">{s.value}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* COMPANY REQUESTS */}
        <Card>
          <CardHeader>
            <CardTitle>Компанийн хүсэлтүүд</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {[{ label: "Системд нэгдэх", value: 7 }, { label: "Бусад компани", value: 5 }].map(s => (
              <div key={s.label} className="rounded-lg border p-4 space-y-1">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-semibold">{s.value}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* PRODUCTS */}
        <Card>
          <CardHeader>
            <CardTitle>Барааны систем</CardTitle>
            <CardDescription>Нөөц болон захиалга</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Бараа хайх..." value={search} onChange={e => setSearch(e.target.value)} />
            <div className="space-y-2">
              {filtered.map(p => {
                const req = requested[p.id] || 0
                return (
                  <div key={p.id} className={`flex items-center justify-between rounded-lg border p-3 transition ${req > 0 ? "border-blue-300 bg-blue-50" : ""}`}>
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Нөөц: {p.stock}{req > 0 ? ` · Захиалсан: ${req}` : ""}
                      </p>
                    </div>
                    <Button variant={req > 0 ? "secondary" : "outline"} size="sm" onClick={() => handleRequest(p)}>
                      {req > 0 ? "Засах" : "Захиалах"}
                    </Button>
                  </div>
                )
              })}
            </div>
            {requestCount > 0 && (
              <Button className="w-full" onClick={() => setPanelOpen(true)}>
                Захиалгуудыг харах ({requestCount})
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
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => cancelRequest(Number(id))}>Хасах</Button>
                  </div>
                )
              })}
            </div>
            <div className="p-4 border-t">
              <Button className="w-full" onClick={submitRequests}>Захиалга баталгаажуулах</Button>
            </div>
          </div>
        </div>
      )}

    </main>
  )
}