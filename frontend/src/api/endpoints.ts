// API Endpoints Configuration

export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN_CUSTOMER: '/auth/login',
    LOGIN_STAFF: '/admin/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    PROFILE: '/customer'
  },

  // Products
  PRODUCTS: {
    COMMON_GET: (page: number, limit: number) => `/products?page=${page}&limit=${limit}`,
    COMMON_GET_BY_TYPE: (page: number, limit: number, type: string) =>
      `/products?page=${page}&limit=${limit}&type=${type}`,
    SEARCH: (page: number, limit: number, search: string) =>
      `/products?page=${page}&limit=${limit}&search=${search}`,
    DETAIL: (id: string) => `/products/${id}`
  },

  // Cart
  CART: {
    GET: '/cart',
    ADD: '/cart/items',
    UPDATE: (itemId: string) => `/cart/items/${itemId}`,
    REMOVE: (itemId: string) => `/cart/items/${itemId}`,
    CLEAR: '/cart/clear'
  },

  // Orders
  ORDERS: {
    CREATE: '/orders',
    LIST: '/orders',
    DETAIL: (id: string) => `/orders/${id}`,
    CANCEL: (id: string) => `/orders/${id}/cancel`,
    TRACKING: (id: string) => `/orders/${id}/tracking`
  },

  // Prescription (Custom Lens)
  PRESCRIPTION: {
    VALIDATE: '/prescription/validate',
    CALCULATE: '/prescription/calculate',
    GET_SAVED: '/prescription/saved'
  },

  // Payment
  PAYMENT: {
    MOMO: '/payment/momo',
    VNPAY: '/payment/vnpay',
    STATUS: (transactionId: string) => `/payment/status/${transactionId}`
  },

  // Admin
  ADMIN: {
    INVOICES: (page: number, limit: number, status?: string) => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit)
      })

      if (status) {
        params.append('status', status)
      }

      return `/admin/invoices?${params.toString()}`
    },
    INVOICES_ONBOARD: (invoiceId: string) => `/admin/invoices/${invoiceId}/status/onboard`
  }
} as const
