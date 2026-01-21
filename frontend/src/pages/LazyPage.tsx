import { Suspense } from 'react'

interface LazyPageProps {
  children: React.ReactNode
}

export function LazyPage({ children }: LazyPageProps) {
  return <Suspense fallback={<div>Đang tải trang...</div>}>{children}</Suspense>
}
