"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import WeeklyGraph from "@/components/weekly-graph"

const DAYS = ["Ñàì", "Äàâàà", "ÿãìàð", "Ëõàãâà", "Ïýðýâ", "Áààñàí", "Áÿìáà"]

export default function EmployeeComponent() {
  // Mock data to prevent context usage during build
  const mockTasks = []
  const mockGlobalTime = { currentDay: "Íÿì" }
  const mockCurrentUser = { name: "Employee" }
  
  const tasksList = mockTasks.filter(task => 
    task.day === mockGlobalTime.currentDay && 
    task.employee === mockCurrentUser.name && 
    (task.week === 0 || task.week === undefined)
  )

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <Link href="/"><Button variant="outline">« Ãàðàõ</Button></Link>
          <div className="text-right">
            <h1 className="text-2xl font-semibold">Àæèëòíû õóäàñ</h1>
            <p className="text-sm text-muted-foreground">¨íººäðèí àæèë áîëîí 7 õîíîãèéí ýäýýëýë</p>
          </div>
        </div>

        {/* TODAY TASKS */}
        <Card>
          <CardHeader>
            <CardTitle>¨íººäðèí äààëãàâàð</CardTitle>
            <CardDescription>ßìàð áàðàà, õýçýý, õààøàà</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasksList.length > 0 ? (
              <p className="text-sm text-muted-foreground">Tasks would be displayed here.</p>
            ) : (
              <p className="text-sm text-muted-foreground">¨íººäºð àìðàëòûí ¤äºð áàéíà.</p>
            )}
          </CardContent>
        </Card>

        {/* LOCATIONS */}
        <Card>
          <CardHeader>
            <CardTitle>Áàðààíû áàéðøèë</CardTitle>
            <CardDescription>Áàðàà ÿìàð áàéðøèëä õàäãàëàãäæ áàéãààã õàðàõ</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/employee/locations">
              <Button variant="outline" className="w-full">Áàéðøèë õàðàõ</Button>
            </Link>
          </CardContent>
        </Card>

        {/* WEEKLY PLAN VIEW */}
        <Card>
          <CardHeader>
            <CardTitle>7 õîíîãèéí òºëºâëºãºº</CardTitle>
            <CardDescription>Òàíû àæëûí öàã áîëîí äààëãàâðûí ýäýýëýë</CardDescription>
          </CardHeader>
          <CardContent>
            <WeeklyGraph employee={mockCurrentUser.name} />
          </CardContent>
        </Card>

      </div>
    </main>
  )
}
