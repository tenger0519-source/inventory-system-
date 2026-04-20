"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

type Product = { id: number; name: string; supplier: string; price: number; type: string; date: string }

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Кока-Кола", supplier: "ABC Co",    price: 2500, type: "Ундаа", date: "2026-04-10" },
    { id: 2, name: "Чипс",      supplier: "Snack LLC", price: 1500, type: "Хоол",  date: "2026-04-09" },
  ])
  const [search, setSearch] = useState("")
  const [form, setForm] = useState<Omit<Product, "id">>({ name: "", supplier: "", price: 0, type: "", date: "" })

  const addProduct = () => {
    if (!form.name) return
    setProducts([{ id: Date.now(), ...form }, ...products])
    setForm({ name: "", supplier: "", price: 0, type: "", date: "" })
  }
  const deleteProduct = (id: number) => setProducts(products.filter(p => p.id !== id))
  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

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
            <Input type="date"                value={form.date}     onChange={e => setForm({ ...form, date: e.target.value })} />
            <Button onClick={addProduct} className="self-end">Нэмэх</Button>
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
              {filtered.map(p => (
                <div key={p.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-sm text-muted-foreground">{p.supplier} · ₮{p.price.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{p.type} · {p.date}</p>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => deleteProduct(p.id)}>Устгах</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </main>
  )
}