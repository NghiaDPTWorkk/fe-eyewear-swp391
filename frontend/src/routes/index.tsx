import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { LazyPage } from '@/pages/LazyPage'
import HomePageOperation from '@/pages/operation/HomePageOperation'

// const HomePage = lazy(() =>
//   import('@/pages/customer/HomePage').then((m) => ({ default: m.HomePage }))
// )
const LoginPage = lazy(() =>
  import('@/pages/auth/LoginPage').then((m) => ({ default: m.LoginPage }))
)
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <LazyPage>
        {/* <HomePage /> */}
        <HomePageOperation />
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
    path: '*',
    element: (
      <LazyPage>
        <NotFoundPage />
      </LazyPage>
    )
  }
])
