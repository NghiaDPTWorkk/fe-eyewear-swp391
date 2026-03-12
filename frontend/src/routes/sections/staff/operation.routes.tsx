import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import { LazyPage } from '@/pages/LazyPage'
import { AuthGuard } from '@/routes/guards'

const OperationLayout = lazy(
  () => import('@/components/layout/staff/operation-staff/OperationLayout')
)
const OperationDashboardPage = lazy(() => import('@/pages/operations/OperationDashboardPage'))
const OperationPrescriptionPage = lazy(() => import('@/pages/operations/OperationPrescriptionPage'))
const OperationPreOrdersPage = lazy(() => import('@/pages/operations/OperationPreOrdersPage'))
const OperationAllOrdersPage = lazy(() => import('@/pages/operations/OperationAllOrdersPage'))
const OperationPackingPage = lazy(() => import('@/pages/operations/OperationPackingPage'))
const OrderDetailPage = lazy(() => import('@/pages/operations/OperationOrderDetailPage'))
const OperationOrderPackingProcess = lazy(
  () => import('@/pages/operations/OperationOrderPackingProcess')
)
const OperationManufacturingProcess = lazy(
  () => import('@/pages/operations/OperationManufacturingProcess')
)
const StaffSettingsPage = lazy(() => import('@/pages/staff/StaffSettingsPage'))
const StaffSupportPage = lazy(() => import('@/pages/staff/StaffSupportPage'))
const StaffProfilePage = lazy(() => import('@/pages/staff/StaffProfilePage'))

const OperationCompleteOrdersPage = lazy(() =>
  import('@/pages/operations/OperationCompleteOrdersPage').then((m) => ({
    default: m.default
  }))
)
const OperationShippingHandoverPage = lazy(() =>
  import('@/pages/operations/OperationShippingHandoverPage').then((m) => ({
    default: m.default
  }))
)
const OperationAllInvoices = lazy(() =>
  import('@/pages/operations/OperationAllInvoices').then((m) => ({
    default: m.default
  }))
)

const OperationInventoryReceivingPage = lazy(() =>
  import('@/pages/operations/OperationInventoryReceivingPage').then((m) => ({ default: m.default }))
)

const OperationInventoryViewDetailPage = lazy(() =>
  import('@/pages/operations/OperationInventoryViewDetailPage').then((m) => ({
    default: m.default
  }))
)

export const operationRoutes = [
  {
    path: '/operation-staff',
    element: (
      <AuthGuard allowedRoles={['OPERATION_STAFF']}>
        <LazyPage>
          <OperationLayout />
        </LazyPage>
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/operation-staff/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: (
          <LazyPage>
            <OperationDashboardPage />
          </LazyPage>
        )
      },
      {
        path: 'all',
        element: (
          <LazyPage>
            <OperationAllOrdersPage />
          </LazyPage>
        )
      },
      {
        path: 'prescription-orders',
        element: (
          <LazyPage>
            <OperationPrescriptionPage />
          </LazyPage>
        )
      },
      {
        path: 'pre-orders',
        element: (
          <LazyPage>
            <OperationPreOrdersPage />
          </LazyPage>
        )
      },
      {
        path: 'packing',
        element: (
          <LazyPage>
            <OperationPackingPage />
          </LazyPage>
        )
      },
      {
        path: 'orders/:orderId',
        element: (
          <LazyPage>
            <OrderDetailPage />
          </LazyPage>
        )
      },
      {
        path: 'orders/:orderId/manufacturing',
        element: (
          <LazyPage>
            <OperationManufacturingProcess />
          </LazyPage>
        )
      },
      {
        path: 'orders/:orderId/process',
        element: (
          <LazyPage>
            <OperationOrderPackingProcess />
          </LazyPage>
        )
      },
      {
        path: 'packed-success',
        element: (
          <LazyPage>
            <OperationCompleteOrdersPage />
          </LazyPage>
        )
      },
      {
        path: 'shipping-handover',
        element: (
          <LazyPage>
            <OperationAllInvoices />
          </LazyPage>
        )
      },
      {
        path: 'shipping-handover/:invoiceId',
        element: (
          <LazyPage>
            <OperationShippingHandoverPage />
          </LazyPage>
        )
      },
      {
        path: 'settings',
        element: (
          <LazyPage>
            <StaffSettingsPage
              dashboardPath="/operation-staff/dashboard"
              roleName="Operation Staff"
            />
          </LazyPage>
        )
      },
      {
        path: 'support',
        element: (
          <LazyPage>
            <StaffSupportPage dashboardPath="/operation-staff/dashboard" />
          </LazyPage>
        )
      },
      {
        path: 'profile',
        element: (
          <LazyPage>
            <StaffProfilePage
              dashboardPath="/operation-staff/dashboard"
              settingsPath="/operation-staff/settings"
            />
          </LazyPage>
        )
      },
      {
        path: 'inventory-receiving',
        element: (
          <LazyPage>
            <OperationInventoryReceivingPage />
          </LazyPage>
        )
      },
      {
        path: 'inventory-receiving/:receiptId',
        element: (
          <LazyPage>
            <OperationInventoryViewDetailPage />
          </LazyPage>
        )
      }
    ]
  }
]
