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

const OperationDeliveryPage = lazy(() => import('@/pages/operations/OperationDeliveryPage'))

const OperationPackingPage = lazy(() => import('@/pages/operations/OperationPackingPage'))

const OrderDetailPage = lazy(() => import('@/pages/operations/OperationOrderDetailPage'))

const OperationOrderPackingProcess = lazy(
  () => import('@/pages/operations/OperationOrderPackingProcess')
)

import { RoleGuard } from '@/routes/guards/RoleGuard'
import { UserRole } from '@/shared/constants/user-role'

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
    path: '/cart',
    element: (
      <LazyPage>
        <CartPage />
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
      <RoleGuard allowedRoles={[UserRole.STAFF, UserRole.ADMIN]}>
        <LazyPage>
          <SaleStaffLayout />
        </LazyPage>
      </RoleGuard>
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
        path: 'orders/:orderId/verify-rx',
        element: <SaleStaffRxVerificationPage />
      },

      {
        path: 'orders/:orderId/regular',
        element: <RegularOrderDetailPage />
      },
      {
        path: 'orders/:orderId/pre-order',
        element: <PreOrderDetailPage />
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
      <RoleGuard allowedRoles={[UserRole.OPERATIONS, UserRole.STAFF, UserRole.ADMIN]}>
        <LazyPage>
          <OperationLayout />
        </LazyPage>
      </RoleGuard>
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
