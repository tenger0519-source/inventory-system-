"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function DailyPlanComponent() {
  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/manager"><Button variant="outline">« Áóóöàõ</Button></Link>
          <div className="text-right">
            <h1 className="text-2xl font-semibold">¨íººäðèí òºëºâëºãºº</h1>
            <p className="text-sm text-muted-foreground">Àæèëòíû ¤äðèéí äààëãàâðòàé òºëºâëºõ</p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Òºëºâëºãººí õóóäñ õºâèéí òºëºé áàéíà.</p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
