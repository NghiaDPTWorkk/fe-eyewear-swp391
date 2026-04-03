import { lazy } from 'react'
import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import { LazyPage } from '@/pages/LazyPage'
import RootErrorPage from '@/pages/RootErrorPage'

// Route Sections
import { authRoutes } from './sections/auth.routes'
import { customerRoutes } from './sections/customer.routes'
import { saleRoutes } from './sections/staff/sale.routes'
import { operationRoutes } from './sections/staff/operation.routes'
import { managerRoutes } from './sections/staff/manager.routes'
import { adminRoutes } from './sections/staff/admin.routes'

const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
)

const appRoutes: RouteObject[] = [
  ...customerRoutes,
  ...authRoutes,
  ...saleRoutes,
  ...operationRoutes,
  ...managerRoutes,
  ...adminRoutes
]

const routesWithErrorBoundary = appRoutes.map((route) => ({
  ...route,
  errorElement: route.errorElement ?? <RootErrorPage />
}))

export const router = createBrowserRouter([
  ...routesWithErrorBoundary,
  {
    path: '*',
    element: (
      <LazyPage>
        <NotFoundPage />
      </LazyPage>
    ),
    errorElement: <RootErrorPage />
  }
])
