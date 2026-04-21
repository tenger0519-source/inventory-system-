import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const RegisterComponent = dynamic(() => import('./register-component'), {
  ssr: false,
  loading: () => <div>Loading...</div>
})

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterComponent />
    </Suspense>
  )
}
