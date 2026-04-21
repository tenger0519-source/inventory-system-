"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSupabaseApp } from "@/lib/supabase-app-context"
import NotificationBell from "@/components/notification-bell"
import type { ProductRequest } from "@/lib/supabase-app-context"

type StockProduct = { id: number; name: string; stock: number }
type RequestMap = { [id: number]: number }

const statusLabel = (status: ProductRequest["status"]) => {
  switch (status) {
    case "pending": return "Õ³ëýýäæ áàéíà"
    case "approved": return "Çîâøººðñºí"
    case "rejected": return "Òàòãàëçñàí"
    default: return status
  }
}

export default function SupplierComponent() {
  const { 
    currentUser, 
    products, 
    productRequests, 
    createProductRequest, 
    updateProductRequest,
    loading 
  } = useSupabaseApp()
  
  const [stockProducts, setStockProducts] = useState<StockProduct[]>([
    { id: 1, name: "Áàðàà 1", stock: 10 },
    { id: 2, name: "Áàðàà 2", stock: 5 },
    { id: 3, name: "Áàðàà 3", stock: 15 },
  ])
  
  const [requests, setRequests] = useState<RequestMap>({})
  const [newProduct, setNewProduct] = useState("")

  if (loading || !currentUser) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div>Loading...</div>
      </main>
    )
  }

  const myRequests = productRequests.filter(r => r.fromUserId === currentUser.id)

  const handleRequest = (productId: number, quantity: number) => {
    if (quantity > 0) {
      setRequests(prev => ({ ...prev, [productId]: quantity }))
    } else {
      setRequests(prev => {
        const newRequests = { ...prev }
        delete newRequests[productId]
        return newRequests
      })
    }
  }

  const handleSubmitRequests = async () => {
    for (const [productId, quantity] of Object.entries(requests)) {
      await createProductRequest({
        fromUserId: currentUser.id,
        productId: parseInt(productId),
        quantity,
        status: "pending"
      })
    }
    setRequests({})
  }

  const handleAddProduct = async () => {
    if (newProduct.trim()) {
      await createProductRequest({
        fromUserId: currentUser.id,
        productId: -1, // Indicates new product request
        quantity: 1,
        status: "pending",
        message: newProduct
      })
      setNewProduct("")
    }
  }

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <Link href="/dashboard"><Button variant="outline">« Áóóöàõ</Button></Link>
          <div className="text-right">
            <h1 className="text-2xl font-semibold">Íèéë³ë³ëýã÷èéí õóäàñ</h1>
            <p className="text-sm text-muted-foreground">Áàðàà íèéë³³ëýõ, õ³ëýýëýí ìýäýýëýë</p>
          </div>
          <NotificationBell />
        </div>

        {/* STOCK PRODUCTS */}
        <Card>
          <CardHeader>
            <CardTitle>Àãóóëãûí áàðàà</CardTitle>
            <CardDescription>Õóâààñàí áàðààíóóäñ íèéë³³ëýõ õ³ñýëò</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stockProducts.map(product => (
              <div key={product.id} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">Àãóóëãà: {product.stock} ø</p>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Òîî"
                    min="0"
                    max={product.stock}
                    value={requests[product.id] || ""}
                    onChange={(e) => handleRequest(product.id, parseInt(e.target.value) || 0)}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">/{product.stock}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* NEW PRODUCT REQUEST */}
        <Card>
          <CardHeader>
            <CardTitle>Øèí áàðààíû õ³ñýëò</CardTitle>
            <CardDescription>Øèí áàðàà íýìýõ õ³ñýëò èëãýýõ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Áàðààíû íýð"
                value={newProduct}
                onChange={(e) => setNewProduct(e.target.value)}
              />
              <Button onClick={handleAddProduct} disabled={!newProduct.trim()}>
                Õ³ñýëò èëãýõ
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* SUBMIT REQUESTS */}
        {Object.keys(requests).length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {Object.keys(requests).length} áàðààíû õ³ñýëò áàéíà
                </p>
                <Button onClick={handleSubmitRequests}>
                  Õ³ñýëò³³ä èëãýõ
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* MY REQUESTS */}
        <Card>
          <CardHeader>
            <CardTitle>Ìèíèé õ³ñýëò³³ä</CardTitle>
            <CardDescription>Òàíû èëãýñýí áàðààíû õ³ñýëòý³ä</CardDescription>
          </CardHeader>
          <CardContent>
            {myRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground">Õ³ñýëò áàéõã³é áàéíà.</p>
            ) : (
              <div className="space-y-2">
                {myRequests.map(request => (
                  <div key={request.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">
                        {request.productId === -1 ? request.message : `Áàðàà ${request.productId}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Òîî: {request.quantity} · Òºëºâ: {statusLabel(request.status)}
                      </p>
                    </div>
                    <div className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                      {statusLabel(request.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </main>
  )
}
