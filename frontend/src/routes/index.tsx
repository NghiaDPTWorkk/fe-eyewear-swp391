import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { LazyPage } from '@/pages/LazyPage'

const LoginPage = lazy(() =>
  import('@/pages/auth/customer/CustomerLoginPage').then((m) => ({ default: m.CustomerLoginPage }))
)

const LoginStaffPage = lazy(() =>
  import('@/pages/auth/staff/StaffLoginPage').then((m) => ({ default: m.StaffLoginPage }))
)

const CustomerHomePage = lazy(() =>
  import('@/pages/customer/CustomerHomePage').then((m) => ({ default: m.CustomerHomePage }))
)

const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
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

const SaleStaffReturnsPage = lazy(() =>
  import('@/pages/sales/SaleStaffReturnsPage').then((m) => ({ default: m.default }))
)

const OperationLayout = lazy(() =>
  import('@/components/layout/staff/operationstaff/OperationLayout').then((m) => ({
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

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <LazyPage>
        <CustomerHomePage />
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
        path: 'delivery-orders',
        element: <OperationDeliveryPage />
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
