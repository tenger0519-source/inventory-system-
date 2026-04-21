"use client"

import Link from "next/link"
import WeeklyGraph from "@/components/weekly-graph"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSupabaseApp } from "@/lib/supabase-app-context"

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

const DAYS = ["Ням", "Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан", "Бямба"]

// Employee Weekly Plan Component
function EmployeeWeeklyPlan() {
  const { tasks, currentUser, loading } = useSupabaseApp()
  
  const getTaskAt = (day: number, hour: number) => {
    // Find tasks for this employee at this specific day and hour
    const mainTask = tasks.find(t => 
      t.day === DAYS[day] && 
      t.time === `${hour}:00` && 
      t.employee === currentUser?.name
    )
    if (mainTask) return mainTask
    
    // Check if this hour is part of a multi-block task
    for (const task of tasks) {
      if (task.day === DAYS[day] && 
          task.employee === currentUser?.name && 
          task.duration && 
          task.duration > 1) {
        const taskHour = parseInt(task.time.split(':')[0])
        if (hour >= taskHour && hour < taskHour + task.duration) {
          return task
        }
      }
    }
    return null
  }

  const isTaskStart = (day: number, hour: number, task: any) => {
    return task && task.time === `${hour}:00`
  }

  return (
    <div className="overflow-auto">
      <div className="min-w-[600px]">
        <div className="grid grid-cols-8 border-b">
          <div className="p-2 text-muted-foreground">Цаг</div>
          {DAYS.map(d => <div key={d} className="p-2 text-center border-l text-sm">{d}</div>)}
        </div>
        {Array.from({ length: 12 }).map((_, hour) => (
          <div key={hour} className="grid grid-cols-8 border-b">
            <div className="p-2 text-xs text-muted-foreground border-r">{8 + hour}:00</div>
            {DAYS.map((_, dayIndex) => {
              const task = getTaskAt(dayIndex, 8 + hour)
              return (
                <div
                  key={dayIndex}
                  className="h-10 border-l relative"
                >
                  {task && (
                    <div 
                      className={`absolute inset-0 left-0.5 right-0.5 text-white text-xs p-1 rounded overflow-hidden z-10 flex items-center justify-between ${
                        task.completed ? 'bg-green-600' : 
                        task.type === 'move' ? 'bg-blue-500' : 
                        task.type === 'message' ? 'bg-purple-500' : 'bg-gray-500'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (isTaskStart(dayIndex, 8 + hour, task)) {
                          alert(`Даалгавар: ${task.action}\nТөрөл: ${task.type}\nТөлөв: ${task.completed ? 'Гүйцэтгэсэн' : 'Хүлээгдэж байна'}\n${task.message || ''}`)
                        }
                      }}
                    >
                      {isTaskStart(dayIndex, 8 + hour, task) && (
                        <>
                          <span className="flex-1 truncate">{task.action}</span>
                          {task.completed && <span className="text-green-200">!</span>}
                        </>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function EmployeeHome() {
  const { getTasksForEmployee, completeTask, globalTime, currentUser, tasks } = useSupabaseApp()
  const tasksList = tasks.filter(task => 
    task.day === globalTime.currentDay && 
    task.employee === currentUser?.name && 
    (task.week === 0 || task.week === undefined)
  )

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <Link href="/"><Button variant="outline">« Гарах</Button></Link>
          <div className="text-right">
            <h1 className="text-2xl font-semibold">Ажилтны хуудас</h1>
            <p className="text-sm text-muted-foreground">Өнөөдрийн ажил болон 7 хоногийн мэдээлэл</p>
          </div>
        </div>

        {/* TODAY TASKS */}
        <Card>
          <CardHeader>
            <CardTitle>Өнөөдрийн даалгавар</CardTitle>
            <CardDescription>Ямар бараа, хэзээ, хаашаа</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasksList.length > 0 ? tasksList.map((task: any, i: number) => (
              <div key={i} className={`rounded-lg border p-4 space-y-2 ${task.completed ? 'bg-muted/50 opacity-60' : ''}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {task.action}
                    </p>
                    <span className="text-sm text-muted-foreground">{task.time}</span>
                  </div>
                  {!task.completed && (
                    <Button 
                      size="sm" 
                      onClick={() => completeTask(task.id)}
                      className="ml-3"
                    >
                      Гүйцэтгэх
                    </Button>
                  )}
                  {task.completed && (
                    <span className="ml-3 text-sm text-green-600 font-medium">Гүйцэтгэсэн</span>
                  )}
                </div>
                {task.type === "move" && (
                  <>
                    {task.quantity > 0 && (
                      <p className="text-sm text-muted-foreground">{task.product} — {task.quantity}ш</p>
                    )}
                    <p className="text-sm font-medium">{task.from} → {task.to}</p>
                    <p className="text-sm text-muted-foreground">Тавиур: {task.shelf}</p>
                  </>
                )}
                {task.type === "message" && (
                  <div className="rounded-md bg-muted px-3 py-2">
                    <p className="text-sm">{task.message}</p>
                  </div>
                )}
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">Өнөөдөр амралтын өдөр байна.</p>
            )}
          </CardContent>
        </Card>

        {/* LOCATIONS */}
        <Card>
          <CardHeader>
            <CardTitle>Барааны байршил</CardTitle>
            <CardDescription>Бараа ямар байршилд хадгалагдаж байгааг харах</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/employee/locations">
              <Button variant="outline" className="w-full">Байршил харах</Button>
            </Link>
          </CardContent>
        </Card>

        {/* WEEKLY PLAN VIEW */}
        <Card>
          <CardHeader>
            <CardTitle>7 хоногийн төлөвлөгөө</CardTitle>
            <CardDescription>Таны ажлын цаг болон даалгаврын мэдээлэл</CardDescription>
          </CardHeader>
          <CardContent>
            <EmployeeWeeklyPlan />
          </CardContent>
        </Card>

      </div>
    </main>
  )
}