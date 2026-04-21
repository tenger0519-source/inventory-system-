"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import NotificationBell from "@/components/notification-bell"

export default function SupplierComponent() {
  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <Link href="/"><Button variant="outline">« Áóóöàõ</Button></Link>
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
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">Áàðàà 1</p>
                <p className="text-sm text-muted-foreground">Àãóóëãà: 10 ø</p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Òîî"
                  min="0"
                  max={10}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">/10</span>
              </div>
            </div>
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
              />
              <Button disabled>
                Õ³ñýëò èëãýõ
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* MY REQUESTS */}
        <Card>
          <CardHeader>
            <CardTitle>Ìèíèé õ³ñýëò³³ä</CardTitle>
            <CardDescription>Òàíû èëãýñýí áàðààíû õ³ñýëòý³ä</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Õ³ñýëò áàéõã³é áàéíà.</p>
          </CardContent>
        </Card>

      </div>
    </main>
  )
}
