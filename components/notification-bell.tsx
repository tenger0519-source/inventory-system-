"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotificationBell() {
  return (
    <Button variant="outline" size="sm">
      <Bell className="h-4 w-4" />
    </Button>
  )
}
