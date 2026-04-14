"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type Task = {
  id: string
  title: string
  day: number
  startHour: number
  duration: number
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export default function WeeklyPlanPage() {
  const [weekIndex, setWeekIndex] = useState(0)
  const [tasks, setTasks] = useState<Task[]>([])

  // =========================
  // ADD TASK
  // =========================
  const handleAddTask = (day: number, hour: number) => {
    const title = prompt("Task нэр оруулна уу:")
    if (!title) return

    const durationInput = prompt("Duration (hours): 1-4")
    const duration = Math.min(Math.max(Number(durationInput || 1), 1), 4)

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      day,
      startHour: hour,
      duration,
    }

    setTasks((prev) => [...prev, newTask])
  }

  // =========================
  // WEEK NAVIGATION
  // =========================
  const nextWeek = () => setWeekIndex((w) => w + 1)
  const prevWeek = () => setWeekIndex((w) => Math.max(0, w - 1))

  // =========================
  // GET TASK
  // =========================
  const getTaskAt = (day: number, hour: number) => {
    return tasks.find(
      (t) =>
        t.day === day &&
        hour >= t.startHour &&
        hour < t.startHour + t.duration
    )
  }

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* ========================= */}
        {/* HEADER */}
        {/* ========================= */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          <Link href="/manager">
            <Button variant="outline" className="w-full sm:w-auto">
              ⬅ Буцах
            </Button>
          </Link>

          <div className="text-left sm:text-right">
            <h1 className="text-xl sm:text-2xl font-semibold">
              Долоо хоногийн төлөвлөгөө
            </h1>
            <p className="text-sm text-muted-foreground">
              Week #{weekIndex + 1}
            </p>
          </div>

        </div>

        {/* ========================= */}
        {/* GRID SCHEDULE */}
        {/* ========================= */}
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">

            {/* DAYS HEADER */}
            <div className="grid grid-cols-8 text-center text-sm font-medium">
              <div className="p-2 text-muted-foreground">Time</div>
              {DAYS.map((d) => (
                <div key={d} className="p-2 border-l">
                  {d}
                </div>
              ))}
            </div>

            {/* GRID */}
            <div className="border-t">

              {Array.from({ length: 24 }).map((_, hour) => (
                <div key={hour} className="grid grid-cols-8 border-b">

                  {/* TIME */}
                  <div className="p-2 text-xs text-muted-foreground border-r">
                    {hour}:00
                  </div>

                  {/* DAYS */}
                  {DAYS.map((_, dayIndex) => {
                    const task = getTaskAt(dayIndex, hour)

                    return (
                      <div
                        key={dayIndex}
                        onClick={() => handleAddTask(dayIndex, hour)}
                        className="h-12 border-l relative cursor-pointer hover:bg-muted transition"
                      >
                        {/* TASK */}
                        {task && task.startHour === hour && (
                          <div
                            className="absolute left-0 right-0 top-0 bg-blue-500 text-white text-xs p-1 rounded-md overflow-hidden"
                            style={{
                              height: `${task.duration * 48}px`,
                              zIndex: 10,
                            }}
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
          </div>
        </div>

        {/* ========================= */}
        {/* WEEK NAVIGATION */}
        {/* ========================= */}
        <div className="flex flex-col sm:flex-row justify-between gap-3">

          <Button
            onClick={prevWeek}
            variant="outline"
            className="w-full sm:w-auto"
            disabled={weekIndex === 0}
          >
            ⬅ Previous Week
          </Button>

          <Button
            onClick={nextWeek}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Next Week ➡
          </Button>

        </div>

      </div>
    </main>
  )
}