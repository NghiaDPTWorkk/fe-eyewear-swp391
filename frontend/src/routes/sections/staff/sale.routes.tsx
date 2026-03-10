import { lazy } from 'react'
import { LazyPage } from '@/pages/LazyPage'
import { AuthGuard } from '@/routes/guards'

const SaleStaffLayout = lazy(() => import('@/components/layout/staff/salestaff/SaleStaffLayout'))
const SaleStaffDashboardPage = lazy(() => import('@/pages/sales/SaleStaffDashboardPage'))
const SaleStaffOrderPage = lazy(() => import('@/pages/sales/SaleStaffOrderPage'))
const SaleStaffCustomerPage = lazy(() => import('@/pages/sales/SaleStaffCustomerPage'))
const SaleStaffLabStatusPage = lazy(() => import('@/pages/sales/SaleStaffLabStatusPage'))
const SaleStaffPrescriptionPage = lazy(() => import('@/pages/sales/SaleStaffPrescriptionPage'))
const SaleStaffPreOrdersPage = lazy(() => import('@/pages/sales/SaleStaffPreOrdersPage'))
const SaleStaffLiveMapPage = lazy(() => import('@/pages/sales/SaleStaffLiveMapPage'))
const SaleStaffReturnsPage = lazy(() => import('@/pages/sales/SaleStaffReturnsPage'))
const StaffSettingsPage = lazy(() => import('@/pages/staff/StaffSettingsPage'))
const StaffSupportPage = lazy(() => import('@/pages/staff/StaffSupportPage'))
const StaffProfilePage = lazy(() => import('@/pages/staff/StaffProfilePage'))
const SaleStaffRxVerificationPage = lazy(() => import('@/pages/sales/SaleStaffRxVerificationPage'))
const RegularOrderDetailPage = lazy(() => import('@/pages/sales/SaleStaffRegularOrderDetailPage'))
const PreOrderDetailPage = lazy(() => import('@/pages/sales/SaleStaffPreOrderDetailPage'))

export const saleRoutes = [
  {
    path: '/salestaff',
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
            <StaffSettingsPage dashboardPath="/salestaff/dashboard" roleName="Sale Staff" />
          </LazyPage>
        )
      },
      {
        path: 'support',
        element: (
          <LazyPage>
            <StaffSupportPage dashboardPath="/salestaff/dashboard" />
          </LazyPage>
        )
      },
      {
        path: 'profile',
        element: (
          <LazyPage>
            <StaffProfilePage
              dashboardPath="/salestaff/dashboard"
              settingsPath="/salestaff/settings"
            />
          </LazyPage>
        )
      }
    ]
  }
]
