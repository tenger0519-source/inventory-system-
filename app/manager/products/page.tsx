"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useApp } from "@/lib/app-context"

type Product = { id: number; name: string; supplier: string; price: number; type: string; date: string; stock: number; minStock: number }

export default function ProductsPage() {
  const router = useRouter()
  const { products, addProduct, deleteProduct } = useApp()
  const [search, setSearch] = useState("")
  const [form, setForm] = useState<Omit<Product, "id">>({ name: "", supplier: "", price: 0, type: "", date: "", stock: 0, minStock: 0 })

  const handleAddProduct = () => {
    if (!form.name) return
    addProduct(form)
    setForm({ name: "", supplier: "", price: 0, type: "", date: "", stock: 0, minStock: 0 })
  }

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock === 0) return { status: "Out of Stock", color: "text-red-600 bg-red-50", textColor: "text-red-600" }
    if (stock <= minStock) return { status: "Low Stock", color: "text-yellow-600 bg-yellow-50", textColor: "text-yellow-600" }
    return { status: "In Stock", color: "text-green-600 bg-green-50", textColor: "text-green-600" }
  }

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.push('/manager')}>← Буцах</Button>
          <div className="text-right">
            <h1 className="text-2xl font-semibold">Барааны удирдлага</h1>
            <p className="text-sm text-muted-foreground">{products.length} бараа бүртгэлтэй</p>
          </div>
        </div>

        {/* ADD FORM */}
        <Card>
          <CardHeader>
            <CardTitle>Бараа нэмэх</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input placeholder="Нэр"          value={form.name}     onChange={e => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Нийлүүлэгч"  value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })} />
            <Input placeholder="Үнэ" type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
            <Input placeholder="Төрөл"        value={form.type}     onChange={e => setForm({ ...form, type: e.target.value })} />
            <Input placeholder="Stock" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} />
            <Input placeholder="Min Stock" type="number" value={form.minStock} onChange={e => setForm({ ...form, minStock: Number(e.target.value) })} />
            <Input type="date"                value={form.date}     onChange={e => setForm({ ...form, date: e.target.value })} />
            <Button onClick={handleAddProduct} className="self-end">Нэмэх</Button>
          </CardContent>
        </Card>

        {/* LIST */}
        <Card>
          <CardHeader>
            <CardTitle>Барааны жагсаалт</CardTitle>
            <CardDescription>{filtered.length} бараа</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Бараа хайх..." value={search} onChange={e => setSearch(e.target.value)} />
            <div className="space-y-2">
              {filtered.map(p => {
                const stockStatus = getStockStatus(p.stock, p.minStock)
                return (
                  <div key={p.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <p className="font-medium">{p.name}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                          {stockStatus.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{p.supplier} · {p.price.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{p.type} · {p.date}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className={`text-sm font-medium ${stockStatus.textColor}`}>
                          Stock: {p.stock}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Min: {p.minStock}
                        </span>
                      </div>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => deleteProduct(p.id)}>Устгах</Button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

      </div>
    </main>
  )
}