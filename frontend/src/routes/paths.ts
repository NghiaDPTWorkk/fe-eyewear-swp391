export const PATHS = {
  WELCOME: '/welcome',
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
  CHECKOUT: '/checkout',
  ACCOUNT: {
    SETTINGS: '/account/settings',
    ORDERS: '/account/orders',
    ADDRESSES: '/account/addresses',
    PRESCRIPTIONS: '/account/prescriptions',
    FAVORITES: '/account/favorites'
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    STAFF: '/admin/staff',
    SETTINGS: '/admin/settings',
    SUPPORT: '/admin/support'
  },
  SALESSTAFF: {
    DASHBOARD: '/sale-staff/dashboard',
    CUSTOMERS: '/sale-staff/customers',
    PRESCRIPTION_ORDERS: '/sale-staff/orders/prescription-orders',
    VERIFY_RX: (orderId: string) => `/sale-staff/orders/${orderId}/verify-rx`,
    REGULAR_DETAIL: (orderId: string) => `/sale-staff/orders/${orderId}/regular`,
    PRE_ORDER_DETAIL: (orderId: string) => `/sale-staff/orders/${orderId}/pre-order`
  },
  OPERATIONSTAFF: {
    DASHBOARD: '/operation-staff/dashboard',
    PRESCRIPTION_ORDERS: '/operation-staff/prescription-orders',
    ORDER_DETAIL: (orderId: string) => `/operation-staff/orders/${orderId}`,
    MANUFACTURING_PROCESS: (orderId: string) => `/operation-staff/orders/${orderId}/manufacturing`,
    PACKING_PROCESS: (orderId: string) => `/operation-staff/orders/${orderId}/process`,
    PACKING_SUCCESS: (orderId: string) => `/operation-staff/orders/${orderId}/success`,
    COMPLETE_ORDERS: '/operation-staff/packed-success'
  },
  MANAGER: {
    DASHBOARD: '/manager/dashboard',
    PRODUCTS: '/manager/products',
    VOUCHERS: '/manager/vouchers',
    VOUCHER_DETAIL: (id: string) => `/manager/vouchers/${id}`,
    ADD_PRODUCT: '/manager/products/add',
    SUPPORT: '/manager/support'
  },
  NOT_FOUND: '*'
}
