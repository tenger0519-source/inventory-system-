"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Task = { id: string; title: string; day: number; startHour: number; duration: number; employee: string }
const DAYS = ["Дав", "Мяг", "Лха", "Пүр", "Баа", "Бям", "Ням"]
const EMPLOYEES = ["Батболд", "Наранбаатар", "Ганболд", "Отгонбаатар", "Алтангэрэл"]

export default function WeeklyPlanPage() {
  const router = useRouter()
  const [weekIndex, setWeekIndex] = useState(0)
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<string>("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [pendingTask, setPendingTask] = useState<{ day: number; hour: number } | null>(null)

  const handleAddTask = (day: number, hour: number) => {
    setPendingTask({ day, hour })
    setIsDialogOpen(true)
  }

  const confirmAddTask = () => {
    if (!pendingTask || !selectedEmployee) return
    
    const title = prompt("Даалгаврын нэр:")
    if (!title) return
    const dur = Math.min(Math.max(Number(prompt("Үргэлжлэх хугацаа (цаг): 1-4") || 1), 1), 4)
    
    setTasks(prev => [...prev, { 
      id: Date.now().toString(), 
      title, 
      day: pendingTask.day, 
      startHour: pendingTask.hour, 
      duration: dur,
      employee: selectedEmployee 
    }])
    
    setIsDialogOpen(false)
    setSelectedEmployee("")
    setPendingTask(null)
  }

  const getTaskAt = (day: number, hour: number) =>
    tasks.find(t => t.day === day && hour >= t.startHour && hour < t.startHour + t.duration)

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.push('/manager')}>← Буцах</Button>
          <div className="text-right">
            <h1 className="text-2xl font-semibold">7 хоногийн төлөвлөгөө</h1>
            <p className="text-sm text-muted-foreground">{weekIndex + 1}-р долоо хоног</p>
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
              <div className="grid grid-cols-8 border-b text-sm font-medium">
                <div className="p-2 text-muted-foreground">Цаг</div>
                {DAYS.map(d => <div key={d} className="p-2 text-center border-l">{d}</div>)}
              </div>
              {Array.from({ length: 24 }).map((_, hour) => (
                <div key={hour} className="grid grid-cols-8 border-b">
                  <div className="p-2 text-xs text-muted-foreground border-r">{hour}:00</div>
                  {DAYS.map((_, dayIndex) => {
                    const task = getTaskAt(dayIndex, hour)
                    return (
                      <div
                        key={dayIndex}
                        onClick={() => handleAddTask(dayIndex, hour)}
                        className="h-10 border-l relative cursor-pointer hover:bg-muted transition"
                      >
                        {task && task.startHour === hour && (
                          <div
                            className="absolute inset-0 left-0.5 right-0.5 bg-blue-500 text-white text-xs p-1 rounded overflow-hidden z-10"
                            style={{ height: `${task.duration * 40}px` }}
                          >
                            {task.title}
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

        {/* WEEK NAV */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setWeekIndex(w => Math.max(0, w - 1))} disabled={weekIndex === 0}>← Өмнөх долоо хоног</Button>
          <Button variant="outline" onClick={() => setWeekIndex(w => w + 1)}>Дараагийн долоо хоног →</Button>
        </div>

        {/* EMPLOYEE SELECTION DIALOG */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ажилтан сонгох</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Ажилтан:</label>
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Ажилтан сонгоно уу" />
                  </SelectTrigger>
                  <SelectContent>
                    {EMPLOYEES.map(emp => (
                      <SelectItem key={emp} value={emp}>{emp}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Цуцлах</Button>
                <Button onClick={confirmAddTask} disabled={!selectedEmployee}>Үргэлжлүүлэх</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </main>
  )
}