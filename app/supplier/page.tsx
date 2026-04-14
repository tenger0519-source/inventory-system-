"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Product = {
  id: number
  name: string
  supplier: string
  price: number
  type: string
  date: string
  stock: number
}

type RequestMap = {
  [id: number]: number
}

export default function SupplierHome() {
  const [search, setSearch] = useState("")
  const [panelOpen, setPanelOpen] = useState(false)
  const [requested, setRequested] = useState<RequestMap>({})

  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Кока-Кола", supplier: "ABC Co", price: 2500, type: "Ундаа", date: "2026-04-10", stock: 20 },
    { id: 2, name: "Чипс", supplier: "Snack LLC", price: 1500, type: "Хоол", date: "2026-04-09", stock: 12 },
    { id: 3, name: "Пепси", supplier: "ABC Co", price: 2300, type: "Ундаа", date: "2026-04-08", stock: 30 },
  ])

  // =========================
  // REQUEST HANDLING
  // =========================
  const handleRequest = (p: Product) => {
    const input = prompt(
      `Request quantity for ${p.name} (Stock: ${p.stock})`
    )
    if (!input) return

    let qty = Number(input)
    if (isNaN(qty) || qty <= 0) return
    if (qty > p.stock) qty = p.stock

    setRequested((prev) => ({
      ...prev,
      [p.id]: qty,
    }))
  }

  const cancelRequest = (id: number) => {
    setRequested((prev) => {
      const copy = { ...prev }
      delete copy[id]
      return copy
    })
  }

  const submitRequests = () => {
    setProducts((prev) =>
      prev.map((p) => {
        const req = requested[p.id] || 0
        return { ...p, stock: p.stock - req }
      })
    )
    setRequested({})
    setPanelOpen(false)
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6 relative">

      <div className="mx-auto max-w-5xl space-y-6">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Link href="/">
            <Button variant="outline">Гарах</Button>
          </Link>

          <div className="text-right">
            <h1 className="text-xl sm:text-2xl font-semibold">
              Нийлүүлэгчийн самбар
            </h1>
            <p className="text-sm text-muted-foreground">
              Хүргэлт, хүсэлт, бүтээгдэхүүний удирдлага
            </p>
          </div>
        </div>

        {/* ================= DELIVERY ================= */}
        <Card>
          <CardHeader>
            <CardTitle>Төлөвлөгдсөн хүргэлт</CardTitle>
            <CardDescription>Ирээдүйн баталгаажсан хүргэлтүүд</CardDescription>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="border rounded p-4">
              <p>Өнөөдөр</p>
              <p className="font-semibold">🚚 6 хүргэлт</p>
              <p className="text-sm">📥 4 хүлээн авах</p>
            </div>

            <div className="border rounded p-4">
              <p>7 хоног</p>
              <p className="font-semibold">🚚 28 хүргэлт</p>
              <p className="text-sm">📥 19 хүлээн авах</p>
            </div>

            <div className="border rounded p-4">
              <p>Сар</p>
              <p className="font-semibold">🚚 110 хүргэлт</p>
              <p className="text-sm">📥 85 хүлээн авах</p>
            </div>

          </CardContent>
        </Card>

        {/* ================= REQUESTS ================= */}
        <Card>
          <CardHeader>
            <CardTitle>Хүсэлтүүд</CardTitle>
            <CardDescription>Илгээсэн / Хүлээн авсан</CardDescription>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="border rounded p-4">
              <p>Илгээсэн</p>
              <p className="text-2xl font-bold">15</p>
            </div>

            <div className="border rounded p-4">
              <p>Хүлээн авсан</p>
              <p className="text-2xl font-bold">11</p>
            </div>

          </CardContent>
        </Card>

        {/* ================= COMPANY REQUESTS ================= */}
        <Card>
          <CardHeader>
            <CardTitle>Компанийн хүсэлтүүд</CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="border rounded p-4">
              <p>Системд нэгдэх</p>
              <p className="text-2xl font-bold">7</p>
            </div>

            <div className="border rounded p-4">
              <p>Бусад компани</p>
              <p className="text-2xl font-bold">5</p>
            </div>

          </CardContent>
        </Card>

        {/* ================= PRODUCTS ================= */}
        <Card>
          <CardHeader>
            <CardTitle>Барааны систем</CardTitle>
            <CardDescription>Stock + request system</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">

            <input
              className="w-full border p-2 rounded"
              placeholder="Бараа хайх..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="space-y-3">
              {filtered.map((p) => {
                const req = requested[p.id] || 0
                const isFull = req === p.stock && req > 0

                return (
                  <div
                    key={p.id}
                    className={`border rounded p-3 flex justify-between items-center ${
                      isFull ? "bg-green-200 border-green-600" : ""
                    }`}
                  >
                    <div>
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-sm text-muted-foreground">
                        📦 Stock: {p.stock} {req > 0 && `→ Requested: ${req}`}
                      </p>
                    </div>

                    <Button onClick={() => handleRequest(p)}>
                      {req > 0 ? "Edit" : "Request"}
                    </Button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* ================= FLOATING BUTTON ================= */}
      <Button
        className="fixed bottom-4 right-4 z-40"
        onClick={() => setPanelOpen(true)}
      >
        📂 Requests ({Object.keys(requested).length})
      </Button>

      {/* ================= SLIDE PANEL ================= */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl border-l transition-transform duration-300 z-50 ${
          panelOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >

        <div className="p-4 border-b flex justify-between">
          <h2 className="font-semibold">Requested Products</h2>
          <Button variant="outline" onClick={() => setPanelOpen(false)}>
            ✖
          </Button>
        </div>

        <div className="p-4 space-y-3 overflow-y-auto h-[calc(100%-120px)]">

          {Object.keys(requested).length === 0 && (
            <p className="text-sm text-muted-foreground">
              No requested products
            </p>
          )}

          {Object.entries(requested).map(([id, qty]) => {
            const product = products.find((p) => p.id === Number(id))
            if (!product) return null

            return (
              <div
                key={id}
                className="border rounded p-3 flex justify-between"
              >
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm">Qty: {qty}</p>
                </div>

                <Button
                  variant="destructive"
                  onClick={() => cancelRequest(Number(id))}
                >
                  Cancel
                </Button>
              </div>
            )
          })}

        </div>

        {Object.keys(requested).length > 0 && (
          <div className="p-4 border-t">
            <Button className="w-full" onClick={submitRequests}>
              Confirm Requests
            </Button>
          </div>
        )}

      </div>

      {/* BACKDROP */}
      {panelOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setPanelOpen(false)}
        />
      )}

    </main>
  )
}