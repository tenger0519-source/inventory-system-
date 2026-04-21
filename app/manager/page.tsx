import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const ManagerComponent = dynamic(() => import('./manager-component'), {
  ssr: false,
  loading: () => <div>Loading...</div>
})

export default function ManagerPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ManagerComponent />
    </Suspense>
  )
}
