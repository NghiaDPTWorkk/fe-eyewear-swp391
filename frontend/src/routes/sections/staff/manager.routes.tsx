import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import { LazyPage } from '@/pages/LazyPage'
import { AuthGuard } from '@/routes/guards'
import { ManagerVouchersPage } from '@/pages/manager'

const ManagerLayout = lazy(() =>
  import('@/pages/manager/ManagerLayout').then((m) => ({ default: m.default }))
)
const ManagerDashboardPage = lazy(() =>
  import('@/pages/manager/ManagerDashboardPage').then((m) => ({ default: m.default }))
)
const ManagerInvoicesPage = lazy(() =>
  import('@/pages/manager/ManagerInvoicesPage').then((m) => ({ default: m.default }))
)
const ManagerSettingsPage = lazy(() =>
  import('@/pages/manager/ManagerSettingsPage').then((m) => ({ default: m.default }))
)
const ManagerSupportPage = lazy(() =>
  import('@/pages/manager/ManagerSupportPage').then((m) => ({ default: m.default }))
)
const ManagerReportsPage = lazy(() =>
  import('@/pages/manager/ManagerReportsPage').then((m) => ({ default: m.default }))
)
const ManagerTransactionsPage = lazy(() =>
  import('@/pages/manager/ManagerTransactionsPage').then((m) => ({ default: m.default }))
)
const ManagerProductsPage = lazy(() =>
  import('@/pages/manager/ManagerProductsPage').then((m) => ({ default: m.default }))
)
const ManagerAddProductPage = lazy(() =>
  import('@/pages/manager/ManagerAddProductPage').then((m) => ({ default: m.default }))
)
const ManagerAddAttributePage = lazy(() =>
  import('@/pages/manager/ManagerAddAttributePage').then((m) => ({ default: m.default }))
)

export const managerRoutes = [
  {
    path: '/manager',
    element: (
      <AuthGuard allowedRoles={['MANAGER']}>
        <LazyPage>
          <ManagerLayout />
        </LazyPage>
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/manager/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <ManagerDashboardPage />
      },
      {
        path: 'orders',
        element: (
          <LazyPage>
            <ManagerInvoicesPage />
          </LazyPage>
        )
      },
      {
        path: 'settings',
        element: (
          <LazyPage>
            <ManagerSettingsPage />
          </LazyPage>
        )
      },
      {
        path: 'help',
        element: (
          <LazyPage>
            <ManagerSupportPage />
          </LazyPage>
        )
      },
      {
        path: 'reports',
        element: (
          <LazyPage>
            <ManagerReportsPage />
          </LazyPage>
        )
      },
      {
        path: 'transactions',
        element: (
          <LazyPage>
            <ManagerTransactionsPage />
          </LazyPage>
        )
      },
      {
        path: 'products',
        element: (
          <LazyPage>
            <ManagerProductsPage />
          </LazyPage>
        )
      },
      {
        path: 'products/add',
        element: (
          <LazyPage>
            <ManagerAddProductPage />
          </LazyPage>
        )
      },
      {
        path: 'attributes/add',
        element: (
          <LazyPage>
            <ManagerAddAttributePage />
          </LazyPage>
        )
      },
      {
        path: 'vouchers',
        element: (
          <LazyPage>
            <ManagerVouchersPage />
          </LazyPage>
        )
      }
    ]
  }
]
