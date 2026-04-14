"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Product = {
  id: number
  name: string
  supplier: string
  price: number
  type: string
  date: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Кока-Кола", supplier: "ABC Co", price: 2500, type: "Ундаа", date: "2026-04-10" },
    { id: 2, name: "Чипс", supplier: "Snack LLC", price: 1500, type: "Хоол", date: "2026-04-09" },
  ])

  const [search, setSearch] = useState("")

  const [form, setForm] = useState<Omit<Product, "id">>({
    name: "",
    supplier: "",
    price: 0,
    type: "",
    date: "",
  })

  // DELETE
  const deleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  // ADD
  const addProduct = () => {
    if (!form.name) return

    const newProduct: Product = {
      id: Date.now(),
      ...form,
    }

    setProducts([newProduct, ...products])

    setForm({
      name: "",
      supplier: "",
      price: 0,
      type: "",
      date: "",
    })
  }

  // SEARCH FILTER
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Барааны удирдлага</h1>

        <Button variant="outline" onClick={() => window.history.back()}>
          ← Буцах
        </Button>
      </div>

      {/* ADD PRODUCT */}
      <Card>
        <CardHeader>
          <CardTitle>Бараа нэмэх</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">

          <input
            className="border p-2 rounded"
            placeholder="Нэр"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="border p-2 rounded"
            placeholder="Нийлүүлэгч"
            value={form.supplier}
            onChange={(e) => setForm({ ...form, supplier: e.target.value })}
          />

          <input
            className="border p-2 rounded"
            type="number"
            placeholder="Үнэ"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) })
            }
          />

          <input
            className="border p-2 rounded"
            placeholder="Төрөл"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          />

          <input
            className="border p-2 rounded"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />

          <Button onClick={addProduct}>Нэмэх</Button>
        </CardContent>
      </Card>

      {/* SEARCH */}
      <input
        className="w-full border p-2 rounded"
        placeholder="Бараа хайх..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* PRODUCT LIST */}
      <Card>
        <CardContent className="space-y-3 p-4">

          {filtered.map((p) => (
            <div
              key={p.id}
              className="border rounded p-3 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{p.name}</p>
                <p className="text-sm text-muted-foreground">
                  {p.supplier} • ₮{p.price}
                </p>
                <p className="text-xs text-muted-foreground">
                  {p.type} • {p.date}
                </p>
              </div>

              <Button
                variant="destructive"
                onClick={() => deleteProduct(p.id)}
              >
                Устгах
              </Button>
            </div>
          ))}

        </CardContent>
      </Card>

    </main>
  )
}