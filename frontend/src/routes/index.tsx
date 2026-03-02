/* enable  eslint  */
import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import RootErrorPage from '@/pages/RootErrorPage'
import { LazyPage } from '@/pages/LazyPage'
import { AuthGuard } from '@/routes/guards'
import { GoogleCallbackPage } from '@/pages/auth'
import CustomerLayout from '@/components/layout/customer/CustomerLayout'

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
const SaleStaffProfilePage = lazy(() => import('@/pages/sales/SaleStaffProfilePage'))

const RegularOrderDetailPage = lazy(() => import('@/pages/sales/SaleStaffRegularOrderDetailPage'))

const PreOrderDetailPage = lazy(() => import('@/pages/sales/SaleStaffPreOrderDetailPage'))

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

const OperationProfilePage = lazy(() =>
  import('@/pages/operations/OperationProfilePage').then((m) => ({ default: m.default }))
)

const ManagerLayout = lazy(() =>
  import('@/pages/manager/ManagerLayout').then((m) => ({ default: m.default }))
)

const ManagerDashboardPage = lazy(() =>
  import('@/pages/manager/ManagerDashboardPage').then((m) => ({ default: m.default }))
)

const ManagerInvoicesPage = lazy(() =>
  import('@/pages/manager/ManagerInvoicesPage').then((m) => ({ default: m.default }))
)

const ManagerSettingsPage = lazy(() =>
  import('@/pages/manager/ManagerSettingsPage').then((m) => ({ default: m.default }))
)

const ManagerSupportPage = lazy(() =>
  import('@/pages/manager/ManagerSupportPage').then((m) => ({ default: m.default }))
)

const ManagerReportsPage = lazy(() =>
  import('@/pages/manager/ManagerReportsPage').then((m) => ({ default: m.default }))
)

const ManagerProfilePage = lazy(() =>
  import('@/pages/manager/ManagerProfilePage').then((m) => ({ default: m.default }))
)

const ManagerProductsPage = lazy(() =>
  import('@/pages/manager/ManagerProductsPage').then((m) => ({ default: m.default }))
)

const ManagerProductDetailPage = lazy(() =>
  import('@/pages/manager/ManagerProductDetailPage').then((m) => ({ default: m.default }))
)

const ManagerAddProductPage = lazy(() =>
  import('@/pages/manager/ManagerAddProductPage').then((m) => ({ default: m.default }))
)

const ManagerEditProductPage = lazy(() =>
  import('@/pages/manager/ManagerEditProductPage').then((m) => ({ default: m.default }))
)

// Admin Pages
const AdminLayout = lazy(() =>
  import('@/pages/admin/AdminLayout').then((m) => ({ default: m.default }))
)

const AdminDashboardPage = lazy(() =>
  import('@/pages/admin/AdminDashboardPage').then((m) => ({ default: m.default }))
)

const AdminUsersPage = lazy(() =>
  import('@/pages/admin/AdminUsersPage').then((m) => ({ default: m.default }))
)

const AdminStaffPage = lazy(() =>
  import('@/pages/admin/AdminStaffPage').then((m) => ({ default: m.default }))
)

const AdminSettingsPage = lazy(() =>
  import('@/pages/admin/AdminSettingsPage').then((m) => ({ default: m.default }))
)

const AdminSupportPage = lazy(() =>
  import('@/pages/admin/AdminSupportPage').then((m) => ({ default: m.default }))
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

// Account Pages
const AccountLayout = lazy(() =>
  import('@/components/layout/customer/account/AccountLayout').then((m) => ({
    default: m.AccountLayout
  }))
)
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

export const router = createBrowserRouter([
  {
    errorElement: <RootErrorPage />,
    children: [
      {
        path: '/',
        element: (
          <LazyPage>
            <CustomerLayout />
          </LazyPage>
        ),
        children: [
          {
            index: true,
            element: (
              <LazyPage>
                <LandingPage />
              </LazyPage>
            )
          },
          {
            path: 'products',
            element: (
              <LazyPage>
                <CustomerProductPage />
              </LazyPage>
            )
          },
          {
            path: 'products/:id',
            element: (
              <LazyPage>
                <ProductDetailPage />
              </LazyPage>
            )
          },
          {
            path: 'cart',
            element: (
              <LazyPage>
                <CartPage />
              </LazyPage>
            )
          },
          {
            path: 'account',
            element: (
              <AuthGuard>
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
            path: 'eyeglasses',
            element: (
              <LazyPage>
                <CustomerProductPage />
              </LazyPage>
            )
          },
          {
            path: 'sunglasses',
            element: (
              <LazyPage>
                <CustomerProductPage />
              </LazyPage>
            )
          },
          {
            path: 'lenses',
            element: (
              <LazyPage>
                <CustomerProductPage />
              </LazyPage>
            )
          }
        ]
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
        path: '/google/oauth/callback',
        element: (
          <LazyPage>
            <GoogleCallbackPage />
          </LazyPage>
        )
      },
      {
        path: '/admin',
        element: (
          <AuthGuard>
            <LazyPage>
              <AdminLayout />
            </LazyPage>
          </AuthGuard>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="/admin/dashboard" replace />
          },
          {
            path: 'dashboard',
            element: (
              <LazyPage>
                <AdminDashboardPage />
              </LazyPage>
            )
          },
          {
            path: 'users',
            element: (
              <LazyPage>
                <AdminUsersPage />
              </LazyPage>
            )
          },
          {
            path: 'staff',
            element: (
              <LazyPage>
                <AdminStaffPage />
              </LazyPage>
            )
          },
          {
            path: 'settings',
            element: (
              <LazyPage>
                <AdminSettingsPage />
              </LazyPage>
            )
          },
          {
            path: 'support',
            element: (
              <LazyPage>
                <AdminSupportPage />
              </LazyPage>
            )
          }
        ]
      },
      {
        path: '/salestaff',
        element: (
          <AuthGuard>
            <LazyPage>
              <SaleStaffLayout />
            </LazyPage>
          </AuthGuard>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="/salestaff/dashboard" replace />
          },
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
            path: 'profile',
            element: (
              <LazyPage>
                <SaleStaffProfilePage />
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
          <AuthGuard>
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
            path: 'profile',
            element: (
              <LazyPage>
                <OperationProfilePage />
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
        path: '/manager',
        element: (
          <LazyPage>
            <ManagerLayout />
          </LazyPage>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="/manager/dashboard" replace />
          },
          {
            path: 'dashboard',
            element: <ManagerDashboardPage />
          },
          {
            path: 'orders',
            element: (
              <LazyPage>
                <ManagerInvoicesPage />
              </LazyPage>
            )
          },
          {
            path: 'settings',
            element: (
              <LazyPage>
                <ManagerSettingsPage />
              </LazyPage>
            )
          },
          {
            path: 'support',
            element: (
              <LazyPage>
                <ManagerSupportPage />
              </LazyPage>
            )
          },
          {
            path: 'profile',
            element: (
              <LazyPage>
                <ManagerProfilePage />
              </LazyPage>
            )
          },
          {
            path: 'reports',
            element: (
              <LazyPage>
                <ManagerReportsPage />
              </LazyPage>
            )
          },
          {
            path: 'products',
            element: (
              <LazyPage>
                <ManagerProductsPage />
              </LazyPage>
            )
          },
          {
            path: 'products/add',
            element: (
              <LazyPage>
                <ManagerAddProductPage />
              </LazyPage>
            )
          },
          {
            path: 'products/:id',
            element: (
              <LazyPage>
                <ManagerProductDetailPage />
              </LazyPage>
            )
          },
          {
            path: 'products/:id/edit',
            element: (
              <LazyPage>
                <ManagerEditProductPage />
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
    ]
  }
])
