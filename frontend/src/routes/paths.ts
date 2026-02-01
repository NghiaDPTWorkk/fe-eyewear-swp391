export const PATHS = {
  HOME: '/',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register'
  },
  PRODUCT: {
    LIST: '/products',
    DETAIL: (id: string) => `/products/${id}`,
    EYEGLASSES: '/products/eyeglasses',
    SUNGLASSES: '/products/sunglasses',
    LENSES: '/products/lenses'
  },
  CART: '/cart',
  ADMIN: {
    DASHBOARD: '/admin/dashboard'
  },
  SALESTAFF: {
    DASHBOARD: '/salestaff/dashboard',
    CUSTOMERS: '/salestaff/customers',
    PRESCRIPTION_ORDERS: '/salestaff/orders/prescription-orders',
    VERIFY_RX: (orderId: string) => `/salestaff/orders/${orderId}/verify-rx`,
    REGULAR_DETAIL: (orderId: string) => `/salestaff/orders/${orderId}/regular`,
    PRE_ORDER_DETAIL: (orderId: string) => `/salestaff/orders/${orderId}/pre-order`
  },
  OPERATIONSTAFF: {
    DASHBOARD: '/operationstaff/dashboard',
    PRESCRIPTION_ORDERS: '/operationstaff/prescription-orders',
    ORDER_DETAIL: (orderId: string) => `/operationstaff/orders/${orderId}`,
    PACKING_PROCESS: (orderId: string) => `/operationstaff/orders/${orderId}/process`,
    PACKING_SUCCESS: (orderId: string) => `/operationstaff/orders/${orderId}/success`
  },
  NOT_FOUND: '*'
}
