import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { LazyPage } from '@/pages/LazyPage'
import { HomePage } from '@/pages/customer'

// const HomePage = lazy(() =>
//   import('@/pages/customer/HomePage').then((m) => ({ default: m.HomePage }))
// )
const LoginPage = lazy(() =>
  import('@/pages/auth/LoginPage').then((m) => ({ default: m.LoginPage }))
)
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
)
const SaleStaffDashboard = lazy(() =>
  import('@/pages/salestaff/SaleStaffDashboard').then((m) => ({ default: m.default }))
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
    path: '/salestaff/dashboard',
    element: (
      <LazyPage>
        <SaleStaffDashboard />
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
