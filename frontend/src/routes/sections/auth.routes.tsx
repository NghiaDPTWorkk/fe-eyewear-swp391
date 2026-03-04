import { lazy } from 'react'
import { LazyPage } from '@/pages/LazyPage'

const LoginPage = lazy(() =>
  import('@/pages/auth/customer/CustomerLoginPage').then((m) => ({ default: m.CustomerLoginPage }))
)
const RegisterPage = lazy(() =>
  import('@/pages/auth/customer/RegisterPage').then((m) => ({ default: m.RegisterPage }))
)
const LoginStaffPage = lazy(() =>
  import('@/pages/auth/staff/StaffLoginPage').then((m) => ({ default: m.StaffLoginPage }))
)
const GoogleCallbackPage = lazy(() =>
  import('@/pages/auth/customer/GoogleCallbackPage').then((m) => ({
    default: m.GoogleCallbackPage
  }))
)

export const authRoutes = [
  {
    path: '/login',
    element: (
      <LazyPage>
        <LoginPage />
      </LazyPage>
    )
  },
  {
    path: '/register',
    element: (
      <LazyPage>
        <RegisterPage />
      </LazyPage>
    )
  },
  {
    path: '/admin/login',
    element: (
      <LazyPage>
        <LoginStaffPage />
      </LazyPage>
    )
  },
  {
    path: '/google/oauth/callback',
    element: (
      <LazyPage>
        <GoogleCallbackPage />
      </LazyPage>
    )
  }
]
