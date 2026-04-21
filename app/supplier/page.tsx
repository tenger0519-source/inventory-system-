import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const SupplierComponent = dynamic(() => import('./supplier-component'), {
  ssr: false,
  loading: () => <div>Loading...</div>
})

export default function SupplierPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SupplierComponent />
    </Suspense>
  )
}
