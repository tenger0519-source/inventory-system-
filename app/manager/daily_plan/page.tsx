"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const employees = ["Бат", "Сараа", "Тэмүүжин", "Нараа"]

// 8:00 → 18:00 (10 hours)
const hours = Array.from({ length: 10 }, (_, i) => `${8 + i}:00`)

// SHIFT DATA (WORKING HOURS)
const shifts: Record<string, { start: number; end: number }> = {
  Бат: { start: 8, end: 16 },
  Сараа: { start: 10, end: 18 },
  Тэмүүжин: { start: 9, end: 17 },
  Нараа: { start: 8, end: 14 },
}

type Task = {
  id: string
  employee: string
  hour: string
  title: string
  description: string
}

export default function DailyPlanPage() {
  const [tasks, setTasks] = useState<Task[]>([])

  const [selectedCell, setSelectedCell] = useState<{
    employee: string
    hour: string
  } | null>(null)

  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")

  // ➕ ADD TASK
  const handleAddTask = () => {
    if (!selectedCell || !title) return

    const newTask: Task = {
      id: Math.random().toString(36).substring(2, 9),
      employee: selectedCell.employee,
      hour: selectedCell.hour,
      title,
      description: desc,
    }

    setTasks([...tasks, newTask])

    setSelectedCell(null)
    setTitle("")
    setDesc("")
  }

  // ❌ DELETE TASK
  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id))
  }

  return (
    <main className="p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-semibold">
            Өдрийн төлөвлөгөө
          </h1>
        </div>

        {/* GRID */}
        <Card>
          <CardHeader>
            <CardTitle>Ажилчдын хуваарь</CardTitle>
          </CardHeader>

          <CardContent className="overflow-auto">

            <div className="min-w-[800px]">

              {/* HEADER ROW */}
              <div className="grid grid-cols-[100px_repeat(4,1fr)]">
                <div></div>
                {employees.map((emp) => (
                  <div
                    key={emp}
                    className="border p-2 text-center font-medium"
                  >
                    {emp}
                  </div>
                ))}
              </div>

              {/* GRID */}
              {hours.map((hour, i) => (
                <div
                  key={hour}
                  className="grid grid-cols-[100px_repeat(4,1fr)]"
                >
                  {/* TIME */}
                  <div className="border p-2 text-sm text-muted-foreground">
                    {hour}
                  </div>

                  {/* CELLS */}
                  {employees.map((emp) => {
                    const shift = shifts[emp]
                    const hourNum = 8 + i

                    const isWorking =
                      shift &&
                      hourNum >= shift.start &&
                      hourNum < shift.end

                    const task = tasks.find(
                      (t) => t.employee === emp && t.hour === hour
                    )

                    return (
                      <div
                        key={emp + hour}
                        onClick={() =>
                          setSelectedCell({ employee: emp, hour })
                        }
                        className={`
                          border h-16 relative cursor-pointer
                          transition
                          hover:bg-muted
                          ${isWorking ? "bg-blue-500/10" : ""}
                        `}
                      >
                        {/* SHIFT OVERLAY */}
                        {isWorking && (
                          <div className="absolute inset-0 bg-blue-400/10" />
                        )}

                        {/* TASK DISPLAY */}
                        {task && (
                          <div className="absolute inset-0 flex items-center justify-center p-1">
                            <div className="bg-white border rounded px-2 py-1 text-xs shadow w-full flex justify-between items-center">

                              <span className="truncate">
                                {task.title}
                              </span>

                              {/* DELETE BUTTON */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteTask(task.id)
                                }}
                                className="text-red-500 ml-2 text-xs"
                              >
                                ✕
                              </button>

                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}

            </div>
          </CardContent>
        </Card>

        {/* TASK CREATION MODAL */}
        {selectedCell && (
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle>
                Даалгавар нэмэх ({selectedCell.employee} -{" "}
                {selectedCell.hour})
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">

              <Input
                placeholder="Гарчиг"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <Textarea
                placeholder="Дэлгэрэнгүй тайлбар"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />

              <div className="flex gap-2">
                <Button onClick={handleAddTask}>
                  Хадгалах
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setSelectedCell(null)}
                >
                  Болих
                </Button>
              </div>

            </CardContent>
          </Card>
        )}

      </div>
    </main>
  )
}