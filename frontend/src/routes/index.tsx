import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { LazyPage } from '@/pages/LazyPage'
import { LoginStaffPage } from '@/pages/auth/staff/LoginStaffPage'

const HomePage = lazy(() =>
  import('@/pages/customer/homepage/HomePage').then((m) => ({ default: m.HomePage }))
)
const LoginPage = lazy(() =>
  import('@/pages/auth/customer/LoginPage').then((m) => ({ default: m.LoginPage }))
)
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <LazyPage>
        <HomePage />
      </LazyPage>
    )
  },
  {
    path: '/login',
    element: (
      <LazyPage>
        <LoginPage />
      </LazyPage>
    )
  },
  {
    path: '/staff/login',
    element: (
      <LazyPage>
        <LoginStaffPage />
      </LazyPage>
    )
  },

  {
    path: '*',
    element: (
      <LazyPage>
        <NotFoundPage />
      </LazyPage>
    )
  }
])
