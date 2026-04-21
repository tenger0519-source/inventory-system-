"use client"

interface WeeklyGraphProps {
  employee: string
}

export default function WeeklyGraph({ employee }: WeeklyGraphProps) {
  return (
    <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
      <p className="text-muted-foreground">Weekly graph for {employee}</p>
    </div>
  )
}
