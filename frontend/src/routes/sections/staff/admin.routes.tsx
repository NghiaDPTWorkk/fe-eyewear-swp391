import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import { LazyPage } from '@/pages/LazyPage'
import { AuthGuard } from '@/routes/guards'

const AdminLayout = lazy(() => import('@/pages/admin/AdminLayout'))
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'))
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage'))
const AdminStaffPage = lazy(() => import('@/pages/admin/AdminStaffPage'))
const AdminSettingsPage = lazy(() => import('@/pages/admin/AdminSettingsPage'))
const AdminSupportPage = lazy(() => import('@/pages/admin/AdminSupportPage'))
const AdminProfilePage = lazy(() => import('@/pages/admin/AdminProfilePage'))

export const adminRoutes = [
  {
    path: '/admin',
    element: (
      <AuthGuard allowedRoles={['SYSTEM_ADMIN', 'ADMIN']}>
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
      },
      {
        path: 'profile',
        element: (
          <LazyPage>
            <AdminProfilePage />
          </LazyPage>
        )
      }
    ]
  }
]
