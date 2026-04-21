import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const LoginComponent = dynamic(() => import('./login-component'), {
  loading: () => <div>Loading...</div>
})

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginComponent />
    </Suspense>
  )
}
