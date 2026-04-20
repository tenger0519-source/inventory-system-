"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const employees = ["Бат", "Сараа", "Тэмүүжин", "Нараа"]
const hours = Array.from({ length: 10 }, (_, i) => `${8 + i}:00`)
const shifts: Record<string, { start: number; end: number }> = {
  Бат:      { start: 8,  end: 16 },
  Сараа:    { start: 10, end: 18 },
  Тэмүүжин: { start: 9,  end: 17 },
  Нараа:    { start: 8,  end: 14 },
}

type Task = { id: string; employee: string; hour: string; title: string; description: string }

export default function DailyPlanPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedCell, setSelectedCell] = useState<{ employee: string; hour: string } | null>(null)
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")

  const handleAddTask = () => {
    if (!selectedCell || !title) return
    setTasks([...tasks, {
      id: Math.random().toString(36).substring(2, 9),
      employee: selectedCell.employee,
      hour: selectedCell.hour,
      title,
      description: desc,
    }])
    setSelectedCell(null)
    setTitle("")
    setDesc("")
  }

  const handleDeleteTask = (id: string) => setTasks(tasks.filter(t => t.id !== id))

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.push('/manager')}>← Буцах</Button>
          <div className="text-right">
            <h1 className="text-2xl font-semibold">Өдрийн төлөвлөгөө</h1>
            <p className="text-sm text-muted-foreground">Ажилчдын хуваарь</p>
          </div>
        </div>

        {/* GRID */}
        <Card>
          <CardHeader>
            <CardTitle>Хуваарь</CardTitle>
            <CardDescription>Нүд дээр дарж даалгавар нэмнэ</CardDescription>
          </CardHeader>
          <CardContent className="overflow-auto">
            <div className="min-w-[700px]">
              <div className="grid grid-cols-[80px_repeat(4,1fr)] border-b">
                <div />
                {employees.map(emp => (
                  <div key={emp} className="p-2 text-center text-sm font-medium border-l">{emp}</div>
                ))}
              </div>
              {hours.map((hour, i) => (
                <div key={hour} className="grid grid-cols-[80px_repeat(4,1fr)] border-b">
                  <div className="p-2 text-xs text-muted-foreground flex items-center">{hour}</div>
                  {employees.map(emp => {
                    const shift = shifts[emp]
                    const hourNum = 8 + i
                    const isWorking = shift && hourNum >= shift.start && hourNum < shift.end
                    const task = tasks.find(t => t.employee === emp && t.hour === hour)
                    return (
                      <div
                        key={emp + hour}
                        onClick={() => setSelectedCell({ employee: emp, hour })}
                        className={`border-l h-14 relative cursor-pointer transition hover:bg-muted ${isWorking ? "bg-blue-50" : "bg-background"}`}
                      >
                        {task && (
                          <div className="absolute inset-1 bg-white border rounded flex items-center justify-between px-2 py-1 text-xs shadow-sm">
                            <span className="truncate">{task.title}</span>
                            <button
                              onClick={e => { e.stopPropagation(); handleDeleteTask(task.id) }}
                              className="ml-2 text-muted-foreground hover:text-destructive"
                            >✕</button>
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

        {/* ADD TASK PANEL */}
        {selectedCell && (
          <Card>
            <CardHeader>
              <CardTitle>Даалгавар нэмэх</CardTitle>
              <CardDescription>{selectedCell.employee} · {selectedCell.hour}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Гарчиг" value={title} onChange={e => setTitle(e.target.value)} />
              <Textarea placeholder="Тайлбар" value={desc} onChange={e => setDesc(e.target.value)} />
              <div className="flex gap-2">
                <Button onClick={handleAddTask}>Хадгалах</Button>
                <Button variant="outline" onClick={() => setSelectedCell(null)}>Болих</Button>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </main>
  )
}