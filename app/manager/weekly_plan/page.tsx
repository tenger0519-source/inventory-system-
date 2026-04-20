"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useApp } from "@/lib/app-context"

const DAYS = ["Ням", "Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан", "Бямба"]

export default function WeeklyPlanPage() {
  const router = useRouter()
  const { tasks, addTask, deleteTask, users, getConfirmedMoveRequests, assignMoveRequest } = useApp()
  
  // Get dynamic employee list from users with employee role
  const EMPLOYEES = users.filter(u => u.roles.includes("employee")).map(u => u.name)
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
  const [selectedRequest, setSelectedRequest] = useState<string>("")

  const confirmedRequests = getConfirmedMoveRequests()

  const handleAddTask = (day: number, hour: number) => {
    setPendingTask({ day, hour })
    setIsDialogOpen(true)
  }

  const confirmAddTask = () => {
    if (!pendingTask || !selectedEmployee || !taskTitle) return
    
    const duration = Math.min(Math.max(Number(taskDuration), 1), 4)
    
    if (taskType === "move") {
      // Check if there's a selected request
      const selectedRequestData = confirmedRequests.find(r => r.id === selectedRequest)
      
      if (selectedRequestData) {
        // Use confirmed request data
        addTask({
          type: "move",
          time: `${pendingTask.hour}:00`,
          action: taskTitle,
          employee: selectedEmployee,
          product: selectedRequestData.product,
          quantity: selectedRequestData.quantity,
          from: selectedRequestData.from,
          to: selectedRequestData.to,
          shelf: selectedRequestData.shelf,
          day: DAYS[pendingTask.day],
          week: 0,
          duration: duration,
          message: message,
        })
        
        // Assign the request to this employee
        assignMoveRequest(selectedRequestData.id, selectedEmployee)
      } else {
        // No confirmed request selected - prevent task creation
        alert("Бараа зөөх даалгавар үүсгэхээс өмнө батлагдсан хүсэлтийг сонгоно уу!")
        return
      }
    } else if (taskType === "message") {
      addTask({
        type: "message",
        time: `${pendingTask.hour}:00`,
        action: taskTitle,
        employee: selectedEmployee,
        message: message,
        day: DAYS[pendingTask.day],
        week: 0,
        duration: duration,
      })
    } else {
      addTask({
        type: "general",
        time: `${pendingTask.hour}:00`,
        action: taskTitle,
        employee: selectedEmployee,
        message: message,
        day: DAYS[pendingTask.day],
        week: 0,
        duration: duration,
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
    setSelectedRequest("")
  }

  const getTaskAt = (day: number, hour: number) => {
    // Find the main task at this hour
    const mainTask = tasks.find(t => t.day === DAYS[day] && t.time === `${hour}:00`)
    if (mainTask) return mainTask
    
    // Check if this hour is part of a multi-block task
    for (const task of tasks) {
      if (task.day === DAYS[day] && task.duration && task.duration > 1) {
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
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.push('/manager')}>← Буцах</Button>
          <div className="text-right">
            <h1 className="text-2xl font-semibold">7 хоногийн төлөвлөгөө</h1>
            <p className="text-sm text-muted-foreground">1-р долоо хоног</p>
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
                          <div 
                            className={`absolute inset-0 left-0.5 right-0.5 text-white text-xs p-1 rounded overflow-hidden z-10 flex items-center justify-between ${
                              task.completed ? 'bg-green-600' : 
                              task.type === 'move' ? 'bg-blue-500' : 
                              task.type === 'message' ? 'bg-purple-500' : 'bg-gray-500'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation()
                              if (isTaskStart(dayIndex, hour, task)) {
                                // Show task details dialog
                                alert(`Даалгавар: ${task.action}\nАжилтан: ${task.employee}\nТөрөл: ${task.type}\nТөлөв: ${task.completed ? 'Гүйцэтгэсэн' : 'Хүлээгдэж байна'}\n${task.message || ''}`)
                              }
                            }}
                          >
                            {isTaskStart(dayIndex, hour, task) && (
                              <>
                                <span className="flex-1 truncate">{task.action}</span>
                                <div className="flex items-center space-x-1">
                                  {task.completed && <span className="text-green-200">!</span>}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      deleteTask(task.id)
                                    }}
                                    className="text-red-300 hover:text-red-100 ml-1 text-xs"
                                  >
                                    ×
                                  </button>
                                </div>
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
          </CardContent>
        </Card>

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
                <>
                  {confirmedRequests.length > 0 ? (
                    <div>
                      <label className="text-sm font-medium">Батлагдсан хөдөлгөөний хүсэлт:</label>
                      <Select value={selectedRequest} onValueChange={setSelectedRequest}>
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder="Батлагдсан хөдөлгөөний хүсэлт сонгоно уу" />
                        </SelectTrigger>
                        <SelectContent>
                          {confirmedRequests.map(request => (
                            <SelectItem key={request.id} value={request.id}>
                              {request.product} ({request.quantity}pcs) - {request.from} - {request.to}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-sm text-yellow-800">
                        Батлагдсан хөдөлгөөний хүсэлт байхгүй байна. Эхлээд хөдөлгөөний хүсэлт үүсгэнэ үү.
                      </p>
                    </div>
                  )}
                </>
              )}
              
              <Input placeholder="Нэмэлт мэдээлэл" value={message} onChange={e => setMessage(e.target.value)} />
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Болих</Button>
                <Button onClick={confirmAddTask} disabled={!selectedEmployee || !taskTitle}>Хадгалах</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </main>
  )
}