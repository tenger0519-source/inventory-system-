"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSupabaseApp } from "@/lib/supabase-app-context"

const employees = ["Бат", "Сараа", "Тэмүүжин", "Нараа"]
const hours = Array.from({ length: 10 }, (_, i) => `${8 + i}:00`)
const shifts: Record<string, { start: number; end: number }> = {
  "Бат":      { start: 8, end: 16 },
  "Сараа":    { start: 10, end: 18 },
  "Тэмүүжин": { start: 9, end: 17 },
  "Нараа":    { start: 8, end: 14 },
}

type LocalTask = { id: string; employee: string; hour: string; title: string; description: string; week: number; duration: number }

export default function DailyPlanPage() {
  const router = useRouter()
  const { tasks, addTask, deleteTask, users, getConfirmedMoveRequests, assignMoveRequest, loading } = useSupabaseApp()
  
  // Get dynamic employee list from users with employee role
  const EMPLOYEES = users.filter(u => u.roles.includes("employee")).map(u => u.name)
  const [selectedCell, setSelectedCell] = useState<{ employee: string; hour: string } | null>(null)
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [taskType, setTaskType] = useState<"move" | "message" | "general">("general")
  const [product, setProduct] = useState("")
  const [quantity, setQuantity] = useState("")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [shelf, setShelf] = useState("")
  const [selectedRequest, setSelectedRequest] = useState("")

  const confirmedRequests = getConfirmedMoveRequests()

  const handleAddTask = async () => {
    if (!selectedCell || !title) return
    
    const daysMap = ["Ням", "Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан", "Бямба"]
    const today = daysMap[new Date().getDay()]
    
    if (taskType === "move") {
      // Check if there's a selected request
      const selectedRequestData = confirmedRequests.find(r => r.id === selectedRequest)
      
      if (selectedRequestData) {
        // Use confirmed request data
        await addTask({
          type: "move",
          time: selectedCell.hour,
          action: title,
          employee: selectedCell.employee,
          product: selectedRequestData.product,
          quantity: selectedRequestData.quantity,
          from: selectedRequestData.from,
          to: selectedRequestData.to,
          shelf: selectedRequestData.shelf,
          day: today,
          week: 0,
          duration: 1,
          message: desc,
        })
        
        // Assign the request to this employee
        await assignMoveRequest(selectedRequestData.id, selectedCell.employee)
      } else {
        // No confirmed request selected - prevent task creation
        alert("Бараа зөөх даалгавар үүсгэхээс өмнө батлагдсан хүсэлтийг сонгоно уу!")
        return
      }
    } else if (taskType === "message") {
      await addTask({
        type: "message",
        time: selectedCell.hour,
        action: title,
        employee: selectedCell.employee,
        message: desc,
        day: today,
        week: 0,
        duration: 1,
      })
    } else {
      await addTask({
        type: "general",
        time: selectedCell.hour,
        action: title,
        employee: selectedCell.employee,
        message: desc,
        day: today,
        week: 0,
        duration: 1,
      })
    }
    
    setSelectedCell(null)
    setTitle("")
    setDesc("")
    setProduct("")
    setQuantity("")
    setFrom("")
    setTo("")
    setShelf("")
    setTaskType("general")
    setSelectedRequest("")
  }

  const handleDeleteTask = async (id: string) => await deleteTask(id)

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
                {EMPLOYEES.slice(0, 4).map(emp => (
                  <div key={emp} className="p-2 text-center text-sm font-medium border-l">{emp}</div>
                ))}
              </div>
              {hours.map((hour, i) => (
                <div key={hour} className="grid grid-cols-[80px_repeat(4,1fr)] border-b">
                  <div className="p-2 text-xs text-muted-foreground flex items-center">{hour}</div>
                  {EMPLOYEES.slice(0, 4).map(emp => {
                    const shift = shifts[emp]
                    const hourNum = 8 + i
                    const isWorking = shift && hourNum >= shift.start && hourNum < shift.end
                    const task = tasks.find(t => t.employee === emp && t.time === hour)
                    return (
                      <div
                        key={emp + hour}
                        onClick={() => setSelectedCell({ employee: emp, hour })}
                        className={`border-l h-14 relative cursor-pointer transition hover:bg-muted ${isWorking ? "bg-blue-50" : "bg-background"}`}
                      >
                        {task && (
                          <div className="absolute inset-1 bg-white border rounded flex items-center justify-between px-2 py-1 text-xs shadow-sm">
                            <span className="truncate">{task.action}</span>
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
              <Input placeholder="Гарчиг" value={title} onChange={e => setTitle(e.target.value)} />
              <Textarea placeholder="Тайлбар" value={desc} onChange={e => setDesc(e.target.value)} />
              
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