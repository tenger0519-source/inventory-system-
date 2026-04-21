"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

const DashboardComponent = dynamic(() => import('./dashboard-component'), {
  ssr: false,
  loading: () => <div>Loading...</div>
})

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div>Loading...</div>
  }

  return <DashboardComponent />
}
