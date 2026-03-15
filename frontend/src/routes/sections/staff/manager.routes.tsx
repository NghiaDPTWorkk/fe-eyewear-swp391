import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import { LazyPage } from '@/pages/LazyPage'
import { AuthGuard } from '@/routes/guards'
import { ManagerVouchersPage } from '@/pages/manager-staff'

const ManagerLayout = lazy(() =>
  import('@/components/layout/staff/manager-staff/ManagerLayout').then((m) => ({
    default: m.default
  }))
)
const ManagerDashboardPage = lazy(() =>
  import('@/pages/manager-staff/ManagerDashboardPage').then((m) => ({ default: m.default }))
)
const ManagerInvoicesPage = lazy(() =>
  import('@/pages/manager-staff/ManagerInvoicesPage').then((m) => ({ default: m.default }))
)
const ManagerReportsPage = lazy(() =>
  import('@/pages/manager-staff/ManagerReportsPage').then((m) => ({ default: m.default }))
)
const ManagerTransactionsPage = lazy(() =>
  import('@/pages/manager-staff/ManagerTransactionsPage').then((m) => ({ default: m.default }))
)
const ManagerProductsPage = lazy(() =>
  import('@/pages/manager-staff/ManagerProductsPage').then((m) => ({ default: m.default }))
)
const ManagerProductDetailPage = lazy(() =>
  import('@/pages/manager-staff/ManagerProductDetailPage').then((m) => ({ default: m.default }))
)
const ManagerEditProductPage = lazy(() =>
  import('@/pages/manager-staff/ManagerEditProductPage').then((m) => ({ default: m.default }))
)
const ManagerAddProductPage = lazy(() =>
  import('@/pages/manager-staff/ManagerAddProductPage').then((m) => ({ default: m.default }))
)

const StaffSettingsPage = lazy(() => import('@/pages/staff/StaffSettingsPage'))
const StaffSupportPage = lazy(() => import('@/pages/staff/StaffSupportPage'))
const StaffProfilePage = lazy(() => import('@/pages/staff/StaffProfilePage'))

const ManagerAddAttributePage = lazy(() =>
  import('@/pages/manager-staff/ManagerAddAttributePage').then((m) => ({ default: m.default }))
)
const ManagerImportPage = lazy(() =>
  import('@/pages/manager-staff/ManagerImportPage').then((m) => ({ default: m.default }))
)
const ManagerVoucherDetailPage = lazy(() =>
  import('@/pages/manager-staff/ManagerVoucherDetail').then((m) => ({ default: m.default }))
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
