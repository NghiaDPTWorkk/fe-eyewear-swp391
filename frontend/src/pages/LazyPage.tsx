import { Loading } from '@/shared/components/ui/loading'
import { Suspense } from 'react'

interface LazyPageProps {
  children: React.ReactNode
}

export function LazyPage({ children }: LazyPageProps) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>
}
