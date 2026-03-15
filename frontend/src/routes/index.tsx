import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { LazyPage } from '@/pages/LazyPage'

import { authRoutes } from './sections/auth.routes'
import { customerRoutes } from './sections/customer.routes'
import { saleRoutes } from './sections/staff/sale.routes'
import { operationRoutes } from './sections/staff/operation.routes'
import { managerRoutes } from './sections/staff/manager.routes'
import { adminRoutes } from './sections/staff/admin.routes'

const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
)

export const router = createBrowserRouter([
  ...customerRoutes,
  ...authRoutes,
  ...saleRoutes,
  ...operationRoutes,
  ...managerRoutes,
  ...adminRoutes,
  {
    path: '*',
    element: (
      <LazyPage>
        <NotFoundPage />
      </LazyPage>
    )
  }
])
