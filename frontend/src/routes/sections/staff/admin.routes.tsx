import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import { LazyPage } from '@/pages/LazyPage'
import { AuthGuard } from '@/routes/guards'

const AdminLayout = lazy(() => import('@/pages/admin/AdminLayout'))
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'))
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage'))
const AdminStaffPage = lazy(() => import('@/pages/admin/AdminStaffPage'))
const StaffSettingsPage = lazy(() => import('@/pages/staff/StaffSettingsPage'))
const StaffSupportPage = lazy(() => import('@/pages/staff/StaffSupportPage'))
const StaffProfilePage = lazy(() => import('@/pages/staff/StaffProfilePage'))
const AdminEditUser = lazy(() => import('@/pages/admin/AdminEditUser'))
const AdminRequestUpdateProfilePage = lazy(
  () => import('@/pages/admin/AdminRequestUpdateProfilePage')
)
const AdminRequestStaffDetail = lazy(() => import('@/pages/admin/AdminRequestStaffDetail'))
const AdminEditStaffPage = lazy(() => import('@/pages/admin/AdminEditStaffPage'))
const AdminSystemConfigPage = lazy(() => import('@/pages/admin/AdminSystemConfigPage'))

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
        path: 'users/edit/:id',
        element: (
          <LazyPage>
            <AdminEditUser />
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
        path: 'staff/edit/:id',
        element: (
          <LazyPage>
            <AdminEditStaffPage />
          </LazyPage>
        )
      },
      {
        path: 'settings',
        element: (
          <LazyPage>
            <StaffSettingsPage dashboardPath="/admin/dashboard" roleName="Admin" />
          </LazyPage>
        )
      },
      {
        path: 'support',
        element: (
          <LazyPage>
            <StaffSupportPage dashboardPath="/admin/dashboard" />
          </LazyPage>
        )
      },
      {
        path: 'profile',
        element: (
          <LazyPage>
            <StaffProfilePage dashboardPath="/admin/dashboard" settingsPath="/admin/settings" />
          </LazyPage>
        )
      },
      {
        path: 'request-update-profile',
        element: (
          <LazyPage>
            <AdminRequestUpdateProfilePage />
          </LazyPage>
        )
      },
      {
        path: 'request-update-profile/:id',
        element: (
          <LazyPage>
            <AdminRequestStaffDetail />
          </LazyPage>
        )
      },
      {
        path: 'config',
        element: (
          <LazyPage>
            <AdminSystemConfigPage />
          </LazyPage>
        )
      }
    ]
  }
]
