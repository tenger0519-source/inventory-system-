import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const EmployeeComponent = dynamic(() => import('./employee-component'), {
  ssr: false,
  loading: () => <div>Loading...</div>
})

export default function EmployeePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmployeeComponent />
    </Suspense>
  )
}
