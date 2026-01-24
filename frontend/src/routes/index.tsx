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

const OperationLayout = lazy(() =>
  import('@/pages/operation/OperationLayout').then((m) => ({ default: m.default }))
)

const HomePageOperation = lazy(() =>
  import('@/pages/operation/HomePageOperation').then((m) => ({ default: m.default }))
)

const PrescriptionOrdersPage = lazy(() =>
  import('@/pages/operation/PrescriptionOrders').then((m) => ({ default: m.default }))
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
    path: '/operationstaff',
    element: (
      <LazyPage>
        <OperationLayout />
      </LazyPage>
    ),
    children: [
      {
        path: 'dashboard',
        element: <HomePageOperation />
      },
      {
        path: 'prescription-orders',
        element: <PrescriptionOrdersPage />
      }
    ]
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
