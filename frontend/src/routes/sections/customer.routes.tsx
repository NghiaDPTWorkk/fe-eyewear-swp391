import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import { LazyPage } from '@/pages/LazyPage'
import { AuthGuard } from '@/routes/guards'

// Layouts
const CustomerLayout = lazy(() => import('@/components/layout/customer/CustomerLayout'))
const AccountLayout = lazy(() =>
  import('@/components/layout/customer/account/AccountLayout').then((m) => ({
    default: m.AccountLayout
  }))
)

// Pages
const LandingPage = lazy(() =>
  import('@/pages/LandingPage').then((m) => ({ default: m.LandingPage }))
)
const CustomerHomePage = lazy(() =>
  import('@/pages/customer/CustomerHomePage').then((m) => ({ default: m.CustomerHomePage }))
)
const CustomerProductPage = lazy(() =>
  import('@/pages/customer/CustomerProductPage').then((m) => ({ default: m.CustomerProductPage }))
)
const ProductDetailPage = lazy(() =>
  import('@/pages/customer/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage }))
)
const CartPage = lazy(() =>
  import('@/pages/customer/CartPage').then((m) => ({ default: m.CartPage }))
)
const PaymentResultPage = lazy(() =>
  import('@/pages/customer/PaymentResultPage').then((m) => ({
    default: m.PaymentResultPage
  }))
)

// Account Pages
const AccountSettingsPage = lazy(() =>
  import('@/pages/customer/account/AccountSettingsPage').then((m) => ({
    default: m.AccountSettingsPage
  }))
)
const OrdersPage = lazy(() =>
  import('@/pages/customer/account/OrdersPage').then((m) => ({ default: m.OrdersPage }))
)
const AddressesPage = lazy(() =>
  import('@/pages/customer/account/AddressesPage').then((m) => ({ default: m.AddressesPage }))
)
const PrescriptionsPage = lazy(() =>
  import('@/pages/customer/account/PrescriptionsPage').then((m) => ({
    default: m.PrescriptionsPage
  }))
)
const FavoritesPage = lazy(() =>
  import('@/pages/customer/account/FavoritesPage').then((m) => ({ default: m.FavoritesPage }))
)
const CustomerOrderDetailPage = lazy(() =>
  import('@/pages/customer/account/OrderDetailPage').then((m) => ({
    default: m.CustomerOrderDetailPage
  }))
)

export const customerRoutes = [
  {
    element: (
      <AuthGuard requireAuth={false}>
        <LazyPage>
          <CustomerLayout />
        </LazyPage>
      </AuthGuard>
    ),
    children: [
      {
        path: '/',
        element: (
          <LazyPage>
            <LandingPage />
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
        path: '/payment-result',
        element: (
          <LazyPage>
            <PaymentResultPage />
          </LazyPage>
        )
      },
      {
        path: '/cart',
        element: (
          <AuthGuard allowedRoles={['CUSTOMER']}>
            <LazyPage>
              <CartPage />
            </LazyPage>
          </AuthGuard>
        )
      },
      {
        path: '/account',
        element: (
          <AuthGuard allowedRoles={['CUSTOMER']}>
            <LazyPage>
              <AccountLayout />
            </LazyPage>
          </AuthGuard>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="/account/settings" replace />
          },
          {
            path: 'settings',
            element: (
              <LazyPage>
                <AccountSettingsPage />
              </LazyPage>
            )
          },
          {
            path: 'orders',
            element: (
              <LazyPage>
                <OrdersPage />
              </LazyPage>
            )
          },
          {
            path: 'orders/:invoiceId',
            element: (
              <LazyPage>
                <CustomerOrderDetailPage />
              </LazyPage>
            )
          },
          {
            path: 'addresses',
            element: (
              <LazyPage>
                <AddressesPage />
              </LazyPage>
            )
          },
          {
            path: 'prescriptions',
            element: (
              <LazyPage>
                <PrescriptionsPage />
              </LazyPage>
            )
          },
          {
            path: 'favorites',
            element: (
              <LazyPage>
                <FavoritesPage />
              </LazyPage>
            )
          }
        ]
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
      }
    ]
  },
  {
    path: '/admin/dashboard',
    element: (
      <AuthGuard allowedRoles={['CUSTOMER']}>
        <LazyPage>
          <CustomerHomePage />
        </LazyPage>
      </AuthGuard>
    )
  }
]
