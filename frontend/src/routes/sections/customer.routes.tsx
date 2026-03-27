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
const WelcomePage = lazy(() =>
  import('@/pages/WelcomePage').then((m) => ({ default: m.WelcomePage }))
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
const CheckoutPage = lazy(() =>
  import('@/pages/customer/CheckoutPage').then((m) => ({ default: m.CheckoutPage }))
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
const ReturnRequestPage = lazy(() =>
  import('@/pages/customer/account/ReturnRequestPage').then((m) => ({
    default: m.ReturnRequestPage
  }))
)
const FaceTutorialPage = lazy(() =>
  import('@/pages/customer/components/FaceTutorial').then((m) => ({
    default: m.default
  }))
)

// Policy Pages
const PrivacyPolicyPage = lazy(() =>
  import('@/pages/customer/policies/PrivacyPolicyPage').then((m) => ({
    default: m.PrivacyPolicyPage
  }))
)
const OrderPaymentPolicyPage = lazy(() =>
  import('@/pages/customer/policies/OrderPaymentPolicyPage').then((m) => ({
    default: m.OrderPaymentPolicyPage
  }))
)
const ShippingPolicyPage = lazy(() =>
  import('@/pages/customer/policies/ShippingPolicyPage').then((m) => ({
    default: m.ShippingPolicyPage
  }))
)
const ReturnWarrantyPolicyPage = lazy(() =>
  import('@/pages/customer/policies/ReturnWarrantyPolicyPage').then((m) => ({
    default: m.ReturnWarrantyPolicyPage
  }))
)

export const customerRoutes = [
  {
    path: '/',
    element: (
      <LazyPage>
        <WelcomePage />
      </LazyPage>
    )
  },
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
        path: '/home',
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
        path: '/policies/privacy',
        element: (
          <LazyPage>
            <PrivacyPolicyPage />
          </LazyPage>
        )
      },
      {
        path: '/policies/order-payment',
        element: (
          <LazyPage>
            <OrderPaymentPolicyPage />
          </LazyPage>
        )
      },
      {
        path: '/policies/shipping',
        element: (
          <LazyPage>
            <ShippingPolicyPage />
          </LazyPage>
        )
      },
      {
        path: '/policies/return-warranty',
        element: (
          <LazyPage>
            <ReturnWarrantyPolicyPage />
          </LazyPage>
        )
      },
      {
        path: '/face-tutorial',
        element: (
          <LazyPage>
            <FaceTutorialPage />
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
        path: '/checkout',
        element: (
          <AuthGuard allowedRoles={['CUSTOMER']}>
            <LazyPage>
              <CheckoutPage />
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
            path: 'orders/:invoiceId/return',
            element: (
              <LazyPage>
                <ReturnRequestPage />
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
  }
]
