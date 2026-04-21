import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const DashboardPage = dynamic(() => import('./client-wrapper'), {
  ssr: false,
  loading: () => <div>Loading...</div>
})

export default function Dashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardPage />
    </Suspense>
  )
}
