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
    PRESCRIPTION_ORDERS: '/operationstaff/prescription-orders',
    ORDER_DETAIL: (orderId: string) => `/operationstaff/orders/${orderId}`,
    PACKING_PROCESS: (orderId: string) => `/operationstaff/orders/${orderId}/process`
  },
  NOT_FOUND: '*'
}
