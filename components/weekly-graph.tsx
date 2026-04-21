"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts"
import { useSupabaseApp } from "@/lib/supabase-app-context"

const DAYS = ["Ням", "Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан", "Бямба"]

// ✅ CUSTOM TOOLTIP
function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const d = payload[0].payload

    return (
      <div className="bg-white border rounded-lg p-3 shadow-md text-sm space-y-1">
        <p className="font-semibold">{d.day}</p>
        <p>⏰ {d.hours} цаг</p>
        <p>🕒 {d.time}</p>

        {/* TASKS - SHOW TITLES AND TYPES */}
        {Array.isArray(d.tasks) && d.tasks.length > 0 && (
          <div className="mt-2">
            <p className="font-medium">Yesgavar:</p>
            <ul className="list-disc ml-4 space-y-1">
              {d.tasks.map((task: any, i: number) => (
                <li key={i} className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs text-white ${
                    task.type === 'move' ? 'bg-blue-500' : 
                    task.type === 'message' ? 'bg-purple-500' : 'bg-gray-500'
                  }`}>
                    {task.type}
                  </span>
                  <span>{task.action}</span>
                  {task.completed && <span className="text-green-600">!</span>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* REMINDERS - SHOW ONLY TITLES */}
        {Array.isArray(d.reminders) && d.reminders.length > 0 && (
          <div className="mt-2">
            <p className="font-medium">Сануулга:</p>
            <ul className="list-disc ml-4">
              {d.reminders.map((r: string, i: number) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  return null
}

// ✅ CUSTOM X AXIS LABEL (DAY + TIME)
interface CustomXAxisTickProps {
  x: number
  y: number
  payload: any
  weeklyData: any[]
}

const CustomXAxisTick = ({ x, y, payload, weeklyData }: CustomXAxisTickProps) => {
  const item = weeklyData.find((d) => d.day === payload.value)

  return (
    <g transform={`translate(${x},${y})`}>
      {/* Day */}
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="middle"
        fill="#666"
        fontSize={12}
      >
        {payload.value}
      </text>

      {/* Time under day */}
      <text
        x={0}
        y={0}
        dy={32}
        textAnchor="middle"
        fill="#999"
        fontSize={11}
      >
        {item?.time}
      </text>
    </g>
  )
}

interface WeeklyGraphProps {
  employee?: string
}

export default function WeeklyGraph({ employee }: WeeklyGraphProps) {
  const { tasks } = useSupabaseApp()

  // Generate weekly data from tasks
  const weeklyData = DAYS.map((day) => {
    const dayTasks = employee
      ? tasks.filter((task) => task.day === day && (task.employee === employee || !task.employee))
      : tasks.filter((task) => task.day === day)

    // Calculate total hours from task durations
    const hours = dayTasks.reduce((total, task) => {
      return total + (task.duration || 1)
    }, 0)

    // Get time range from tasks
    const taskTimes = dayTasks.map(t => parseInt(t.time.split(':')[0])).sort((a, b) => a - b)
    const timeRange = taskTimes.length > 0 
      ? `${taskTimes[0]}:00-${Math.max(...taskTimes) + 1}:00` 
      : "Амралт"

    return {
      day,
      hours: Math.min(hours, 8), // Max 8 hours per day
      time: timeRange,
      tasks: dayTasks,
      reminders: [], // No reminders in new system
    }
  })

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={weeklyData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="day"
            tick={({ x, y, payload }) => <CustomXAxisTick x={Number(x)} y={Number(y)} payload={payload} weeklyData={weeklyData} />}
            interval={0}
            height={60}
          />

          <YAxis />

          <Tooltip content={<CustomTooltip />} />

          <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
            {/* ✅ SHOW NUMBER OF TASKS ON BAR */}
            <LabelList
              dataKey={(entry: any) =>
                entry.tasks.length + entry.reminders.length
              }
              position="top"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}