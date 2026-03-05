import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import { LazyPage } from '@/pages/LazyPage'
import { AuthGuard } from '@/routes/guards'

const OperationLayout = lazy(() => import('@/pages/operations/OperationLayout'))
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
const OperationSettingPage = lazy(() =>
  import('@/pages/operations/OperationSettingPage').then((m) => ({ default: m.default }))
)
const OperationSupportPage = lazy(() =>
  import('@/pages/operations/OperationSupportPage').then((m) => ({ default: m.default }))
)
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

const OperationPersonalProfile = lazy(() =>
  import('@/pages/operations/OperationPersonalProfile').then((m) => ({ default: m.default }))
)

const OperationInventoryReceivingPage = lazy(() =>
  import('@/pages/operations/OperationInventoryReceivingPage').then((m) => ({ default: m.default }))
)

const OperationInventoryViewDetailPage = lazy(() =>
  import('@/pages/operations/OperationInventoryViewDetailPage').then((m) => ({ default: m.default }))
)

export const operationRoutes = [
  {
    path: '/operationstaff',
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
        element: <Navigate to="/operationstaff/dashboard" replace />
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
            <OperationSettingPage />
          </LazyPage>
        )
      },
      {
        path: 'support',
        element: (
          <LazyPage>
            <OperationSupportPage />
          </LazyPage>
        )
      },
      {
        path: 'profile',
        element: (
          <LazyPage>
            <OperationPersonalProfile />
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
