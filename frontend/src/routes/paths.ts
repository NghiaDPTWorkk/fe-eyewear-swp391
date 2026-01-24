export const PATHS = {
  HOME: '/',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register'
  },
  PRODUCT: {
    LIST: '/products',
    DETAIL: (id: string) => `/products/${id}`
  },
  CART: '/cart',
  ADMIN: {
    DASHBOARD: '/admin/dashboard'
  },
  SALESTAFF: {
    DASHBOARD: '/salestaff/dashboard'
  },
  OPERATIONSTAFF: {
    DASHBOARD: '/operationstaff/dashboard',
    PRESCRIPTION_ORDERS: '/operationstaff/prescription-orders'
  },
  NOT_FOUND: '*'
}
