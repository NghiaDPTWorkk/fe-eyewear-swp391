import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import { LazyPage } from '@/pages/LazyPage'
import { AuthGuard } from '@/routes/guards'

const OperationLayout = lazy(
  () => import('@/components/layout/staff/operation-staff/OperationLayout')
)
const OperationDashboardPage = lazy(() => import('@/pages/operation-staff/OperationDashboardPage'))
const OperationPrescriptionPage = lazy(
  () => import('@/pages/operation-staff/OperationPrescriptionPage')
)
const OperationPreOrdersPage = lazy(() => import('@/pages/operation-staff/OperationPreOrdersPage'))
const OperationAllOrdersPage = lazy(() => import('@/pages/operation-staff/OperationAllOrdersPage'))
const OperationPackingPage = lazy(() => import('@/pages/operation-staff/OperationPackingPage'))
const OrderDetailPage = lazy(() => import('@/pages/operation-staff/OperationOrderDetailPage'))
const OperationOrderPackingProcess = lazy(
  () => import('@/pages/operation-staff/OperationOrderPackingProcess')
)
const OperationManufacturingProcess = lazy(
  () => import('@/pages/operation-staff/OperationManufacturingProcess')
)
const StaffSettingsPage = lazy(() => import('@/pages/staff/StaffSettingsPage'))
const StaffSupportPage = lazy(() => import('@/pages/staff/StaffSupportPage'))
const StaffProfilePage = lazy(() => import('@/pages/staff/StaffProfilePage'))

const OperationCompleteOrdersPage = lazy(() =>
  import('@/pages/operation-staff/OperationCompleteOrdersPage').then((m) => ({
    default: m.default
  }))
)
const OperationShippingHandoverPage = lazy(() =>
  import('@/pages/operation-staff/OperationShippingHandoverPage').then((m) => ({
    default: m.default
  }))
)
const OperationAllInvoices = lazy(() =>
  import('@/pages/operation-staff/OperationAllInvoices').then((m) => ({
    default: m.default
  }))
)

const OperationInventoryReceivingPage = lazy(() =>
  import('@/pages/operation-staff/OperationInventoryReceivingPage').then((m) => ({
    default: m.default
  }))
)

const OperationInvenProcessPlan = lazy(() =>
  import('@/pages/operation-staff/OperationInvenProcessPlan').then((m) => ({ default: m.default }))
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
            <OperationInvenProcessPlan />
          </LazyPage>
        )
      }
    ]
  }
]
