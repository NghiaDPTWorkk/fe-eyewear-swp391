// API Endpoints Configuration

export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN_CUSTOMER: '/auth/login',
    LOGIN_STAFF: '/admin/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    PROFILE: '/customer',
    GET_PROFILE: '/admin/auth/profile', // Get admin/staff profile - Keep from target
    CHANGE_PASSWORD: '/admin/auth/profile/change-password',
    ADDRESS_LIST: '/customer/profile/address',
    ADDRESS_ADD: '/customer/profile/address',
    CHANGE_DEFAULT: (id: string) => `/customer/profile/address/change-default/${id}`
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
    ADD: '/cart/add-product',
    UPDATE_QUANTITY: '/cart/update-quantity',
    REMOVE_ITEM: '/cart/remove-product',
    CLEAR: '/cart/clear'
  },

  // Orders
  ORDERS: {
    CREATE: '/orders',
    LIST: '/orders',
    DETAIL: (id: string) => `/admin/orders/${id}`,
    CANCEL: (id: string) => `/orders/${id}/cancel`,
    TRACKING: (id: string) => `/orders/${id}/tracking`,
    LIST_WITH_PARAMS: (page: number, limit: number, status?: string, type?: string) => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit)
      })
      if (status) params.append('status', status)
      if (type) params.append('type', type)
      return `/admin/orders?${params.toString()}`
    },
    UPDATE: (id: string) => `/admin/orders/${id}`,
    UPDATE_STATUS_MAKING: (id: string) => `/admin/orders/${id}/status/making`, // Keep from target
    UPDATE_STATUS_PACKAGING: (id: string) => `/admin/orders/${id}/status/packaging`,
    UPDATE_STATUS_COMPLETED: (id: string) => `/admin/orders/${id}/status/complete`
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
    INVOICES: (
      page: number,
      limit: number,
      status?: string,
      statuses?: string,
      search?: string
    ) => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit)
      })

      if (status) {
        params.append('status', status)
      }
      if (statuses) {
        params.append('statuses', statuses)
      }
      if (search) {
        params.append('search', search)
      }

      return `/admin/invoices?${params.toString()}`
    },
    INVOICES_ONBOARD: (invoiceId: string) => `/admin/invoices/${invoiceId}/status/onboard`,
    INVOICES_COMPLETE: (invoiceId: string) => `/admin/invoices/${invoiceId}/status/complete`,
    INVOICES_DELIVERING: (invoiceId: string) => `/admin/invoices/${invoiceId}/status/delivering`,
    ORDER_DETAIL: (orderId: string) => `/admin/orders/${orderId}`,
    ORDER_ASSIGN: (orderId: string) => `/admin/orders/${orderId}/status/assign`,
    INVOICES_DEPOSITED: (page: number, limit: number, status?: string) => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit)
      })
      if (status) params.append('status', status)
      return `/admin/invoices/deposited?${params.toString()}`
    },
    INVOICE_REJECT: (id: string) => `/admin/invoices/${id}/status/reject`,
    INVOICE_APPROVE: (id: string) => `/admin/invoices/${id}/status/approve`,
    ORDERS_TOTAL: (invoiceId: string, status?: string) => {
      const params = new URLSearchParams({ invoiceId })
      if (status) params.append('status', status)
      return `/admin/orders/total?${params.toString()}`
    },
    ORDER_APPROVE: (id: string) => `/admin/orders/${id}/status/approve`
  },

  ADMINS: {
    GET_ADMIN: (role?: string) => {
      const params = new URLSearchParams()
      if (role) params.append('role', role)
      const queryString = params.toString()
      return queryString ? `/admin/staff/admins?${queryString}` : '/admin/staff/admins'
    },
    INVOICES_ONBOARD: (invoiceId: string) => `/admin/invoices/${invoiceId}/status/onboard`
  },

  // Invoices
  INVOICE: {
    CREATE: '/invoices',
    LIST: '/invoices',
    DETAIL: (id: string) => `/invoices/${id}`
  },
  // Wishlist
  WISHLIST: {
    GET: '/wishlist',
    ADD: (id: string) => `/wishlist/products/${id}`,
    REMOVE: (id: string) => `/wishlist/products/${id}`
  }
} as const
