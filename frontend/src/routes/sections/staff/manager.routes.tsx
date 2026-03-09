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
const ManagerReportsPage = lazy(() =>
  import('@/pages/manager/ManagerReportsPage').then((m) => ({ default: m.default }))
)
const ManagerTransactionsPage = lazy(() =>
  import('@/pages/manager/ManagerTransactionsPage').then((m) => ({ default: m.default }))
)
const ManagerProductsPage = lazy(() =>
  import('@/pages/manager/ManagerProductsPage').then((m) => ({ default: m.default }))
)
const ManagerProductDetailPage = lazy(() =>
  import('@/pages/manager/ManagerProductDetailPage').then((m) => ({ default: m.default }))
)
const ManagerEditProductPage = lazy(() =>
  import('@/pages/manager/ManagerEditProductPage').then((m) => ({ default: m.default }))
)
const ManagerAddProductPage = lazy(() =>
  import('@/pages/manager/ManagerAddProductPage').then((m) => ({ default: m.default }))
)

const StaffSettingsPage = lazy(() => import('@/pages/staff/StaffSettingsPage'))
const StaffSupportPage = lazy(() => import('@/pages/staff/StaffSupportPage'))
const StaffProfilePage = lazy(() => import('@/pages/staff/StaffProfilePage'))

const ManagerAddAttributePage = lazy(() =>
  import('@/pages/manager/ManagerAddAttributePage').then((m) => ({ default: m.default }))
)
const ManagerImportPage = lazy(() =>
  import('@/pages/manager/ManagerImportPage').then((m) => ({ default: m.default }))
)
const ManagerVoucherDetailPage = lazy(() =>
  import('@/pages/manager/ManagerVoucherDetail').then((m) => ({ default: m.default }))
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
        path: 'profile',
        element: (
          <LazyPage>
            <StaffProfilePage dashboardPath="/manager/dashboard" settingsPath="/manager/settings" />
          </LazyPage>
        )
      },
      {
        path: 'settings',
        element: (
          <LazyPage>
            <StaffSettingsPage dashboardPath="/manager/dashboard" roleName="Manager" />
          </LazyPage>
        )
      },
      {
        path: 'support',
        element: (
          <LazyPage>
            <StaffSupportPage dashboardPath="/manager/dashboard" />
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
        path: 'products/:id',
        element: (
          <LazyPage>
            <ManagerProductDetailPage />
          </LazyPage>
        )
      },
      {
        path: 'products/:id/edit',
        element: (
          <LazyPage>
            <ManagerEditProductPage />
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
      },
      {
        path: 'vouchers/:id',
        element: (
          <LazyPage>
            <ManagerVoucherDetailPage />
          </LazyPage>
        )
      },
      {
        path: 'imports',
        element: (
          <LazyPage>
            <ManagerImportPage />
          </LazyPage>
        )
      }
    ]
  }
]
