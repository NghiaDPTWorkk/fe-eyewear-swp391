/* eslint-disable */
import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { LazyPage } from '@/pages/LazyPage'

const RegisterPage = lazy(() =>
  import('@/pages/auth/customer/RegisterPage').then((m) => ({ default: m.RegisterPage }))
)
const ProductDetailPage = lazy(() =>
  import('@/pages/customer/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage }))
)
const CartPage = lazy(() =>
  import('@/pages/customer/CartPage').then((m) => ({ default: m.CartPage }))
)

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
const SaleStaffLayout = lazy(() => import('@/components/layout/staff/salestaff/SaleStaffLayout'))

const SaleStaffDashboardPage = lazy(() => import('@/pages/sales/SaleStaffDashboardPage'))

const SaleStaffOrderPage = lazy(() => import('@/pages/sales/SaleStaffOrderPage'))

const SaleStaffCustomerPage = lazy(() => import('@/pages/sales/SaleStaffCustomerPage'))

const SaleStaffLabStatusPage = lazy(() => import('@/pages/sales/SaleStaffLabStatusPage'))

const SaleStaffPrescriptionPage = lazy(() => import('@/pages/sales/SaleStaffPrescriptionPage'))

const SaleStaffPreOrdersPage = lazy(() => import('@/pages/sales/SaleStaffPreOrdersPage'))

const SaleStaffLiveMapPage = lazy(() => import('@/pages/sales/SaleStaffLiveMapPage'))

const SaleStaffReturnsPage = lazy(() => import('@/pages/sales/SaleStaffReturnsPage'))

const SaleStaffSettingsPage = lazy(() => import('@/pages/sales/SaleStaffSettingsPage'))

const SaleStaffSupportPage = lazy(() => import('@/pages/sales/SaleStaffSupportPage'))
const SaleStaffRxVerificationPage = lazy(() => import('@/pages/sales/SaleStaffRxVerificationPage'))

const RegularOrderDetailPage = lazy(() => import('@/pages/sales/RegularOrderDetailPage'))

const PreOrderDetailPage = lazy(() => import('@/pages/sales/PreOrderDetailPage'))

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
    path: '/products/:id',
    element: (
      <LazyPage>
        <ProductDetailPage />
      </LazyPage>
    )
  },
  {
    path: '/cart',
    element: (
      <LazyPage>
        <CartPage />
      </LazyPage>
    )
  },
  {
    path: '/eyeglasses',
    element: (
      <LazyPage>
        <CustomerProductPage />
      </LazyPage>
    )
  },
  {
    path: '/sunglasses',
    element: (
      <LazyPage>
        <CustomerProductPage />
      </LazyPage>
    )
  },
  {
    path: '/lenses',
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
            <SaleStaffSettingsPage />
          </LazyPage>
        )
      },
      {
        path: 'support',
        element: (
          <LazyPage>
            <SaleStaffSupportPage />
          </LazyPage>
        )
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
