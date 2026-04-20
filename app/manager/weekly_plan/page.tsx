"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useApp } from "@/lib/app-context"

const DAYS = ["Дав", "Мяг", "Лха", "Пүр", "Баа", "Бям", "Ням"]
const EMPLOYEES = ["Батболд", "Наранбаатар", "Ганболд", "Отгонбаатар", "Алтангэрэл"]

export default function WeeklyPlanPage() {
  const router = useRouter()
  const { tasks, addTask, deleteTask } = useApp()
  const [weekIndex, setWeekIndex] = useState(0)
  const [selectedEmployee, setSelectedEmployee] = useState<string>("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [pendingTask, setPendingTask] = useState<{ day: number; hour: number } | null>(null)
  const [taskTitle, setTaskTitle] = useState("")
  const [taskDuration, setTaskDuration] = useState("1")
  const [taskType, setTaskType] = useState<"move" | "message" | "general">("general")
  const [product, setProduct] = useState("")
  const [quantity, setQuantity] = useState("")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [shelf, setShelf] = useState("")
  const [message, setMessage] = useState("")

  const handleAddTask = (day: number, hour: number) => {
    setPendingTask({ day, hour })
    setIsDialogOpen(true)
  }

  const confirmAddTask = () => {
    if (!pendingTask || !selectedEmployee || !taskTitle) return
    
    const duration = Math.min(Math.max(Number(taskDuration), 1), 4)
    
    if (taskType === "move") {
      addTask({
        type: "move",
        time: `${pendingTask.hour}:00`,
        action: taskTitle,
        employee: selectedEmployee,
        product: product || undefined,
        quantity: quantity ? parseInt(quantity) : undefined,
        from: from || undefined,
        to: to || undefined,
        shelf: shelf || undefined,
        day: DAYS[pendingTask.day],
        message: message,
      })
    } else if (taskType === "message") {
      addTask({
        type: "message",
        time: `${pendingTask.hour}:00`,
        action: taskTitle,
        employee: selectedEmployee,
        message: message,
        day: DAYS[pendingTask.day],
      })
    } else {
      addTask({
        type: "general",
        time: `${pendingTask.hour}:00`,
        action: taskTitle,
        employee: selectedEmployee,
        message: message,
        day: DAYS[pendingTask.day],
      })
    }
    
    setIsDialogOpen(false)
    setSelectedEmployee("")
    setPendingTask(null)
    setTaskTitle("")
    setTaskDuration("1")
    setTaskType("general")
    setProduct("")
    setQuantity("")
    setFrom("")
    setTo("")
    setShelf("")
    setMessage("")
  }

  const getTaskAt = (day: number, hour: number) =>
    tasks.find(t => t.day === DAYS[day] && parseInt(t.time) === hour)

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
                        {task && (
                          <div className="absolute inset-0 left-0.5 right-0.5 bg-blue-500 text-white text-xs p-1 rounded overflow-hidden z-10">
                            {task.action}
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
              <div>
                <label className="text-sm font-medium">Даалгаврын төрөл:</label>
                <Select value={taskType} onValueChange={(value: "move" | "message" | "general") => setTaskType(value)}>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Төрөл сонгоно уу" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">Ерөнхий</SelectItem>
                    <SelectItem value="move">Бараа зөөх</SelectItem>
                    <SelectItem value="message">Зурвас</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input placeholder="Даалгаврын нэр" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} />
              <Input placeholder="Үргэлжлэх хугацаа (цаг)" value={taskDuration} onChange={e => setTaskDuration(e.target.value)} />
              
              {taskType === "move" && (
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Бараа" value={product} onChange={e => setProduct(e.target.value)} />
                  <Input placeholder="Тоо хэмжээ" value={quantity} onChange={e => setQuantity(e.target.value)} />
                  <Input placeholder="Хаанаас" value={from} onChange={e => setFrom(e.target.value)} />
                  <Input placeholder="Хаашаа" value={to} onChange={e => setTo(e.target.value)} />
                  <Input placeholder="Тавиур" value={shelf} onChange={e => setShelf(e.target.value)} />
                </div>
              )}
              
              <Input placeholder="Нэмэлт мэдээлэл" value={message} onChange={e => setMessage(e.target.value)} />
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Цуцлах</Button>
                <Button onClick={confirmAddTask} disabled={!selectedEmployee || !taskTitle}>Хадгалах</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </main>
  )
}