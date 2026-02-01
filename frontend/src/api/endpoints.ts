// API Endpoints Configuration

export const ENDPOINTS = {
  // Auth
  AUTH: {
    // Client
    REGISTER: '/auth/register',
    LOGIN_CUSTOMER: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    FORGOT_PASSWORD: '/auth/forgot-password',
    VERIFY_OTP: '/auth/verify-otp',
    RESET_PASSWORD: '/auth/reset-password',

    // Admin
    LOGIN_STAFF: '/admin/auth/login',
    LOGOUT_STAFF: '/admin/auth/logout',
    REFRESH_TOKEN_STAFF: '/admin/auth/refresh-token',

    // Profile
    PROFILE: '/customer'
  },

  // Products
  PRODUCTS: {
    GET_LIST: '/products',
    GET_DETAIL: (id: string) => `/products/${id}`,
    ADMIN_GET: '/admin/products',
    ADMIN_CREATE: '/admin/products',
    ADMIN_UPDATE: (id: string) => `/admin/products/${id}`,
    ADMIN_DELETE: (id: string) => `/admin/products/${id}`,
    ADMIN_STATISTICS: '/admin/products/statistics',
    ADMIN_SEARCH_NAME: '/admin/products/search/name-slug',
    ADMIN_SEARCH_SKU: (sku: string) => `/admin/products/search/sku/${sku}`
  },

  // Cart (Client)
  CART: {
    GET: '/cart',
    ADD: '/cart/items',
    UPDATE: (itemId: string) => `/cart/items/${itemId}`,
    REMOVE: (itemId: string) => `/cart/items/${itemId}`,
    CLEAR: '/cart/clear'
  },

  // Checkout & Payment
  CHECKOUT: {
    SESSIONS: '/checkout/sessions',
    SESSION_DETAIL: (id: string) => `/checkout/sessions/${id}`
  },
  PAYMENT: {
    GET_URL: (invoiceId: string, paymentId: string) =>
      `/payments/zalopay/url/${invoiceId}/${paymentId}`,
    STATUS: (transactionId: string) => `/payment/status/${transactionId}`
  },

  // Invoices (Admin & Client)
  INVOICES: {
    // Client
    CREATE: '/invoices',
    LIST: '/invoices',
    DETAIL: (id: string) => `/invoices/${id}`,
    CANCEL: (id: string) => `/invoices/${id}/cancel`,

    // Admin/Manager
    ADMIN_LIST: '/admin/invoices',
    ADMIN_MANAGER_LIST: '/admin/invoices/manager',
    APPROVE: (id: string) => `/admin/invoices/${id}/status/approve`,
    REJECT: (id: string) => `/admin/invoices/${id}/status/reject`,
    ONBOARD: (id: string) => `/admin/invoices/${id}/status/onboard`
  },

  // Orders (Admin)
  ORDERS: {
    ADMIN_LIST: '/admin/orders',
    ADMIN_DETAIL: (id: string) => `/admin/orders/${id}`,
    ASSIGN: (id: string) => `/admin/orders/${id}/status/assign`,
    MAKING: (id: string) => `/admin/orders/${id}/status/making`,
    PACKAGING: (id: string) => `/admin/orders/${id}/status/packaging`,
    COMPLETE: (id: string) => `/admin/orders/${id}/status/complete`
  },

  // Customers (Admin)
  CUSTOMERS: {
    LIST: '/admin/customers',
    DETAIL: (id: string) => `/admin/customers/${id}`
  },

  // Vouchers
  VOUCHERS: {
    AVAILABLE: '/vouchers/available',
    MY_VOUCHERS: '/vouchers/my-vouchers',
    VALIDATE: '/vouchers/validate',
    // Admin
    ADMIN_LIST: '/admin/vouchers',
    ADMIN_CREATE: '/admin/vouchers',
    ADMIN_DETAIL: (id: string) => `/admin/vouchers/${id}`,
    ADMIN_STATS: '/admin/vouchers/statistics',
    GRANT: (id: string) => `/admin/vouchers/${id}/grant`,
    REVOKE: (id: string) => `/admin/vouchers/${id}/revoke`
  },

  // Attributes (Admin)
  ATTRIBUTES: {
    LIST: '/admin/attributes',
    CREATE: '/admin/attributes',
    DETAIL: (id: string) => `/admin/attributes/${id}`,
    UPDATE: (id: string) => `/admin/attributes/${id}`,
    DELETE: (id: string) => `/admin/attributes/${id}`
  }
} as const
