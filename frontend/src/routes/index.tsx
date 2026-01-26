import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { LazyPage } from '@/pages/LazyPage'
import { HomePage } from '@/pages/customer'
import { RegisterPage } from '@/pages/auth/customer/RegisterPage'

const LoginPage = lazy(() =>
  import('@/pages/auth/customer/LoginPage').then((m) => ({ default: m.LoginPage }))
)

const LoginStaffPage = lazy(() =>
  import('@/pages/auth/staff/LoginStaffPage').then((m) => ({ default: m.LoginStaffPage }))
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
  import('@/pages/salestaff/SaleStaffDashboardPage').then((m) => ({ default: m.default }))
)

const SaleStaffOrderPage = lazy(() =>
  import('@/pages/salestaff/SaleStaffOrderPage').then((m) => ({ default: m.default }))
)

const SaleStaffProductPage = lazy(() =>
  import('@/pages/salestaff/SaleStaffProductPage').then((m) => ({ default: m.default }))
)

const SaleStaffCustomerPage = lazy(() =>
  import('@/pages/salestaff/SaleStaffCustomerPage').then((m) => ({ default: m.default }))
)

const SaleStaffLabStatusPage = lazy(() =>
  import('@/pages/salestaff/SaleStaffLabStatusPage').then((m) => ({ default: m.default }))
)

const SaleStaffRxVerificationPage = lazy(() =>
  import('@/pages/salestaff/SaleStaffRxVerificationPage').then((m) => ({ default: m.default }))
)

const SaleStaffPreOrdersPage = lazy(() =>
  import('@/pages/salestaff/SaleStaffPreOrdersPage').then((m) => ({ default: m.default }))
)

const SaleStaffReturnsPage = lazy(() =>
  import('@/pages/salestaff/SaleStaffReturnsPage').then((m) => ({ default: m.default }))
)

const OperationLayout = lazy(() =>
  import('@/pages/operation/OperationLayout').then((m) => ({
    default: m.default
  }))
)

const OperationDashboardPage = lazy(() =>
  import('@/pages/operation/OperationDashboardPage').then((m) => ({ default: m.default }))
)

const OperationPrescriptionPage = lazy(() =>
  import('@/pages/operation/OperationPrescriptionPage').then((m) => ({ default: m.default }))
)

const OperationPreOrdersPage = lazy(() =>
  import('@/pages/operation/OperationPreOrdersPage').then((m) => ({ default: m.default }))
)

const OperationAllOrdersPage = lazy(() =>
  import('@/pages/operation/OperationAllOrdersPage').then((m) => ({ default: m.default }))
)

const OperationDeliveryPage = lazy(() =>
  import('@/pages/operation/OperationDeliveryPage').then((m) => ({ default: m.default }))
)

const OperationPackingPage = lazy(() =>
  import('@/pages/operation/OperationPackingPage').then((m) => ({ default: m.default }))
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <LazyPage>
        <HomePage />
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
        path: 'orders/rx-verification',
        element: <SaleStaffRxVerificationPage />
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
