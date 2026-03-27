import { Navigate, useLocation } from 'react-router-dom'

interface SplashGuardProps {
  children: React.ReactNode
}

export function SplashGuard({ children }: SplashGuardProps) {
  const location = useLocation()
  const hasSeenSplash = sessionStorage.getItem('metWelcome') === 'true'

  if (!hasSeenSplash && location.pathname !== '/welcome') {
    return <Navigate to="/welcome" replace />
  }

  return <>{children}</>
}
