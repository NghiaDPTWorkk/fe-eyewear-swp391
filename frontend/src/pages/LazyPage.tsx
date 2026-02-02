import { Suspense } from 'react'

interface LazyPageProps {
  children: React.ReactNode
}

export function LazyPage({ children }: LazyPageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen text-mint-600 font-medium">
          Loading page...
        </div>
      }
    >
      {children}
    </Suspense>
  )
}
