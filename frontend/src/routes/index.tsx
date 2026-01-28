import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { LazyPage } from '@/pages/LazyPage'
import { RegisterPage } from '@/pages/auth/customer/RegisterPage'

const LoginPage = lazy(() =>
  import('@/pages/auth/customer/CustomerLoginPage').then((m) => ({ default: m.CustomerLoginPage }))
)

const LoginStaffPage = lazy(() =>
  import('@/pages/auth/staff/StaffLoginPage').then((m) => ({ default: m.StaffLoginPage }))
)

const CustomerHomePage = lazy(() =>
  import('@/pages/customer/CustomerHomePage').then((m) => ({ default: m.CustomerHomePage }))
)

const LandingPage = lazy(() =>
  import('@/pages/LandingPage').then((m) => ({ default: m.LandingPage }))
)

const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
)

const CustomerProductPage = lazy(() =>
  import('@/pages/customer/CustomerProductPage').then((m) => ({ default: m.CustomerProductPage }))
)
const SaleStaffLayout = lazy(() =>
  import('@/components/layout/staff/salestaff/SaleStaffLayout').then((m) => ({
    default: m.default
  }))
)

const SaleStaffDashboardPage = lazy(() =>
  import('@/pages/sales/SaleStaffDashboardPage').then((m) => ({ default: m.default }))
)

const SaleStaffOrderPage = lazy(() =>
  import('@/pages/sales/SaleStaffOrderPage').then((m) => ({ default: m.default }))
)

const SaleStaffProductPage = lazy(() =>
  import('@/pages/sales/SaleStaffProductPage').then((m) => ({ default: m.default }))
)

const SaleStaffCustomerPage = lazy(() =>
  import('@/pages/sales/SaleStaffCustomerPage').then((m) => ({ default: m.default }))
)

const SaleStaffLabStatusPage = lazy(() =>
  import('@/pages/sales/SaleStaffLabStatusPage').then((m) => ({ default: m.default }))
)

const SaleStaffPrescriptionPage = lazy(() =>
  import('@/pages/sales').then((m) => ({ default: m.SaleStaffPrescriptionPage }))
)

const SaleStaffPreOrdersPage = lazy(() =>
  import('@/pages/sales/SaleStaffPreOrdersPage').then((m) => ({ default: m.default }))
)

const SaleStaffLiveMapPage = lazy(() =>
  import('@/pages/sales/SaleStaffLiveMapPage').then((m) => ({ default: m.default }))
)

const SaleStaffReturnsPage = lazy(() =>
  import('@/pages/sales/SaleStaffReturnsPage').then((m) => ({ default: m.default }))
)

const SaleStaffSettingsPage = lazy(() =>
  import('@/pages/sales/SaleStaffSettingsPage').then((m) => ({ default: m.default }))
)

const SaleStaffSupportPage = lazy(() =>
  import('@/pages/sales/SaleStaffSupportPage').then((m) => ({ default: m.default }))
)

const OperationLayout = lazy(() =>
  import('@/pages/operations/OperationLayout').then((m) => ({
    default: m.default
  }))
)

const OperationDashboardPage = lazy(() =>
  import('@/pages/operations/OperationDashboardPage').then((m) => ({ default: m.default }))
)

const OperationPrescriptionPage = lazy(() =>
  import('@/pages/operations/OperationPrescriptionPage').then((m) => ({ default: m.default }))
)

const OperationPreOrdersPage = lazy(() =>
  import('@/pages/operations/OperationPreOrdersPage').then((m) => ({ default: m.default }))
)

const OperationAllOrdersPage = lazy(() =>
  import('@/pages/operations/OperationAllOrdersPage').then((m) => ({ default: m.default }))
)

const OperationDeliveryPage = lazy(() =>
  import('@/pages/operations/OperationDeliveryPage').then((m) => ({ default: m.default }))
)

const OperationPackingPage = lazy(() =>
  import('@/pages/operations/OperationPackingPage').then((m) => ({ default: m.default }))
)

const OrderDetailPage = lazy(() =>
  import('@/pages/operations/OperationOrderDetailPage').then((m) => ({ default: m.default }))
)

const OperationOrderPackingProcess = lazy(() =>
  import('@/pages/operations/OperationOrderPackingProcess').then((m) => ({ default: m.default }))
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <LazyPage>
        <LandingPage />
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
    path: '/register',
    element: (
      <LazyPage>
        <RegisterPage />
      </LazyPage>
    )
  },
  {
    path: '/products',
    element: (
      <LazyPage>
        <CustomerProductPage />
      </LazyPage>
    )
  },
  {
    path: '/admin/login',
    element: (
      <LazyPage>
        <LoginStaffPage />
      </LazyPage>
    )
  },
  {
    path: '/admin/dashboard',
    element: (
      <LazyPage>
        <CustomerHomePage />
      </LazyPage>
    )
  },
  {
    path: '/salestaff',
    element: (
      <LazyPage>
        <SaleStaffLayout />
      </LazyPage>
    ),
    children: [
      {
        path: 'dashboard',
        element: <SaleStaffDashboardPage />
      },
      {
        path: 'orders',
        element: <SaleStaffOrderPage />
      },
      {
        path: 'orders/prescription-orders',
        element: <SaleStaffPrescriptionPage />
      },
      {
        path: 'orders/pre-orders',
        element: <SaleStaffPreOrdersPage />
      },
      {
        path: 'orders/returns',
        element: <SaleStaffReturnsPage />
      },
      {
        path: 'products',
        element: <SaleStaffProductPage />
      },
      {
        path: 'customers',
        element: <SaleStaffCustomerPage />
      },
      {
        path: 'lab-status',
        element: <SaleStaffLabStatusPage />
      },
      {
        path: 'live-map/:trackingId',
        element: <SaleStaffLiveMapPage />
      },
      {
        path: 'settings',
        element: <SaleStaffSettingsPage />
      },
      {
        path: 'support',
        element: <SaleStaffSupportPage />
      }
    ]
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
        index: true,
        element: <Navigate to="/operationstaff/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <OperationDashboardPage />
      },
      {
        path: 'all',
        element: <OperationAllOrdersPage />
      },
      {
        path: 'prescription-orders',
        element: <OperationPrescriptionPage />
      },
      {
        path: 'pre-orders',
        element: <OperationPreOrdersPage />
      },
      {
        path: 'packing',
        element: <OperationPackingPage />
      },
      {
        path: 'orders/:orderId',
        element: <OrderDetailPage />
      },
      {
        path: 'orders/:orderId/process',
        element: <OperationOrderPackingProcess />
      },
      {
        path: 'delivery-orders',
        element: <OperationDeliveryPage />
      },
      {
        path: 'settings',
        element: <SaleStaffSettingsPage />
      },
      {
        path: 'support',
        element: <SaleStaffSupportPage />
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
