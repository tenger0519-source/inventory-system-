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

// ✅ DATA
import { weeklyData as data } from "@/lib/weekly-data"

// ✅ CUSTOM TOOLTIP
function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const d = payload[0].payload

    return (
      <div className="bg-white border rounded-lg p-3 shadow-md text-sm space-y-1">
        <p className="font-semibold">{d.day}</p>
        <p>⏰ {d.hours} цаг</p>
        <p>🕒 {d.time}</p>

        {/* TASKS - SHOW ONLY TITLES */}
        {Array.isArray(d.tasks) && d.tasks.length > 0 && (
          <div className="mt-2">
            <p className="font-medium">Даалгавар:</p>
            <ul className="list-disc ml-4">
              {d.tasks.map((task: any, i: number) => (
                <li key={i}>
                  {task.title || (task.type === "move" ? task.product : task.message)}
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
const CustomXAxisTick = ({ x, y, payload }: any) => {
  const item = data.find((d) => d.day === payload.value)

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
  // Filter data by employee if provided
  const filteredData = employee 
    ? data.map(d => ({
        ...d,
        tasks: d.tasks.filter((task: any) => 
          task.employee === employee || !task.employee // Show tasks without employee too
        )
      }))
    : data

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="day"
            tick={<CustomXAxisTick />}
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