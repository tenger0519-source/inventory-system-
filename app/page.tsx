import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const LoginComponent = dynamic(() => import('./login-component'), {
  ssr: false,
  loading: () => <div>Loading...</div>
})

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginComponent />
    </Suspense>
  )
}
