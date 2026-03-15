import { lazy } from 'react'
import { LazyPage } from '@/pages/LazyPage'
import { AuthGuard } from '@/routes/guards'

const SaleStaffLayout = lazy(() => import('@/components/layout/staff/sale-staff/SaleStaffLayout'))
const SaleStaffDashboardPage = lazy(() => import('@/pages/sale-staff/SaleStaffDashboardPage'))
const SaleStaffOrderPage = lazy(() => import('@/pages/sale-staff/SaleStaffOrderPage'))
const SaleStaffCustomerPage = lazy(() => import('@/pages/sale-staff/SaleStaffCustomerPage'))
const SaleStaffLabStatusPage = lazy(() => import('@/pages/sale-staff/SaleStaffLabStatusPage'))
const SaleStaffPrescriptionPage = lazy(() => import('@/pages/sale-staff/SaleStaffPrescriptionPage'))
const SaleStaffPreOrdersPage = lazy(() => import('@/pages/sale-staff/SaleStaffPreOrdersPage'))
const SaleStaffLiveMapPage = lazy(() => import('@/pages/sale-staff/SaleStaffLiveMapPage'))
const SaleStaffReturnsPage = lazy(() => import('@/pages/sale-staff/SaleStaffReturnsPage'))
const StaffSettingsPage = lazy(() => import('@/pages/staff/StaffSettingsPage'))
const StaffSupportPage = lazy(() => import('@/pages/staff/StaffSupportPage'))
const StaffProfilePage = lazy(() => import('@/pages/staff/StaffProfilePage'))
const SaleStaffRxVerificationPage = lazy(
  () => import('@/pages/sale-staff/SaleStaffRxVerificationPage')
)
const RegularOrderDetailPage = lazy(
  () => import('@/pages/sale-staff/SaleStaffRegularOrderDetailPage')
)
const PreOrderDetailPage = lazy(() => import('@/pages/sale-staff/SaleStaffPreOrderDetailPage'))

export const saleRoutes = [
  {
    path: '/sale-staff',
    element: (
      <AuthGuard allowedRoles={['SALE_STAFF']}>
        <LazyPage>
          <SaleStaffLayout />
        </LazyPage>
      </AuthGuard>
    ),
    children: [
      {
        path: 'dashboard',
        element: (
          <LazyPage>
            <SaleStaffDashboardPage />
          </LazyPage>
        )
      },
      {
        path: 'orders',
        element: (
          <LazyPage>
            <SaleStaffOrderPage />
          </LazyPage>
        )
      },
      {
        path: 'orders/prescription-orders',
        element: (
          <LazyPage>
            <SaleStaffPrescriptionPage />
          </LazyPage>
        )
      },
      {
        path: 'orders/pre-orders',
        element: (
          <LazyPage>
            <SaleStaffPreOrdersPage />
          </LazyPage>
        )
      },
      {
        path: 'orders/returns',
        element: (
          <LazyPage>
            <SaleStaffReturnsPage />
          </LazyPage>
        )
      },
      {
        path: 'orders/:orderId/verify-rx',
        element: (
          <LazyPage>
            <SaleStaffRxVerificationPage />
          </LazyPage>
        )
      },
      {
        path: 'orders/:orderId/regular',
        element: (
          <LazyPage>
            <RegularOrderDetailPage />
          </LazyPage>
        )
      },
      {
        path: 'orders/:orderId/pre-order',
        element: (
          <LazyPage>
            <PreOrderDetailPage />
          </LazyPage>
        )
      },
      {
        path: 'customers',
        element: (
          <LazyPage>
            <SaleStaffCustomerPage />
          </LazyPage>
        )
      },
      {
        path: 'lab-status',
        element: (
          <LazyPage>
            <SaleStaffLabStatusPage />
          </LazyPage>
        )
      },
      {
        path: 'live-map/:trackingId',
        element: (
          <LazyPage>
            <SaleStaffLiveMapPage />
          </LazyPage>
        )
      },
      {
        path: 'settings',
        element: (
          <LazyPage>
            <StaffSettingsPage dashboardPath="/sale-staff/dashboard" roleName="Sale Staff" />
          </LazyPage>
        )
      },
      {
        path: 'support',
        element: (
          <LazyPage>
            <StaffSupportPage dashboardPath="/sale-staff/dashboard" />
          </LazyPage>
        )
      },
      {
        path: 'profile',
        element: (
          <LazyPage>
            <StaffProfilePage
              dashboardPath="/sale-staff/dashboard"
              settingsPath="/sale-staff/settings"
            />
          </LazyPage>
        )
      }
    ]
  }
]
