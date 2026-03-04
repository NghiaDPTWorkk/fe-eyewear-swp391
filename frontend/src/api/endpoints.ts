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
    CHANGE_DEFAULT: (id: string) => `/customer/profile/address/change-default/${id}`,
    GOOGLE: '/auth/google'
  },

  // Products
  PRODUCTS: {
    COMMON_GET: (page: number, limit: number) => `/products?page=${page}&limit=${limit}`,
    COMMON_GET_BY_TYPE: (page: number, limit: number, type: string) =>
      `/products?page=${page}&limit=${limit}&type=${type}`,
    SEARCH: (page: number, limit: number, search: string) =>
      `/products?page=${page}&limit=${limit}&search=${search}`,
    DETAIL: (id: string) => `/products/${id}`,
    VARIANT: (id: string, sku: string) => `/products/${id}/variants/${sku}`,
    SPECS: '/products/specs',
    FILTER: (params: Record<string, string | number | string[] | undefined>) => {
      const query = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === '' || (Array.isArray(value) && value.length === 0))
          return
        if (Array.isArray(value)) {
          value.forEach((v) => query.append(key, v))
        } else {
          query.append(key, String(value))
        }
      })
      return `/products?${query.toString()}`
    }
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
    UPDATE_STATUS_COMPLETED: (id: string) => `/admin/orders/${id}/status/complete`,
    SEARCH_BY_CODE: (orderCode: string) =>
      `/admin/orders?orderCode=${encodeURIComponent(orderCode)}`
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
    VNPAY_URL: (invoiceId: string, paymentId: string) =>
      `/payments/vnpay/url/${invoiceId}/${paymentId}`,
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
    INVOICES_HANDLE_DELIVERY: (invoiceId: string) =>
      `/admin/invoices/${invoiceId}/assign/handle-delivery`,
    INVOICES_DELIVERING: (invoiceId: string) => `/admin/invoices/${invoiceId}/status/delivering`,
    ORDER_DETAIL: (orderId: string) => `/admin/orders/${orderId}`,
    ORDER_ASSIGN: (orderId: string) => `/admin/orders/${orderId}/status/assign`,
    INVOICES_READY_TO_SHIP: (invoiceId: string) =>
      `/admin/invoices/${invoiceId}/status/ready-to-ship`,
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
    ORDER_APPROVE: (id: string) => `/admin/orders/${id}/status/approve`,
    INVOICES_SHIP_CODE: (invoiceId: string) => `/ships/invoice/${invoiceId}/ship-code`,
    PROFILE_REQUESTS: '/admin/profile-requests',
    CUSTOMERS_LIST: (page?: number, limit?: number, search?: string, status?: string) => {
      const params = new URLSearchParams()
      if (page) params.append('page', String(page))
      if (limit) params.append('limit', String(limit))
      if (search) params.append('search', search)
      if (status && status !== 'All') params.append('status', status)
      const qs = params.toString()
      return qs ? `/admin/customers?${qs}` : '/admin/customers'
    },
    PRODUCTS_LIST: (
      page?: number,
      limit?: number,
      type?: string,
      brand?: string,
      search?: string
    ) => {
      const params = new URLSearchParams()
      if (page) params.append('page', String(page))
      if (limit) params.append('limit', String(limit))
      if (type) params.append('type', type)
      if (brand) params.append('brand', brand)
      if (search) params.append('search', search)
      const qs = params.toString()
      return qs ? `/admin/products?${qs}` : '/admin/products'
    },
    PRODUCT_DETAIL: (id: string) => `/admin/products/${id}`,
    ATTRIBUTES: '/admin/attributes'
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

  ADMIN_ACCOUNTS: {
    LIST: (page = 1, limit = 10, role?: string, search?: string) => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit)
      })
      if (role) params.append('role', role)
      if (search) params.append('search', search)
      return `/admin/admin-accounts?${params.toString()}`
    },
    DETAIL: (id: string) => `/admin/admin-accounts/${id}`,
    CREATE: '/admin/admin-accounts',
    UPDATE: (id: string) => `/admin/admin-accounts/${id}`,
    DELETE: (id: string) => `/admin/admin-accounts/${id}`
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
  },
  // Categories
  CATEGORIES: {
    TREE: '/categories/tree'
  },
  // Support
  SUPPORT: {
    REPORT_TICKETS: '/admin/report-tickets',
    MY_HISTORY: '/admin/report-tickets/my-history'
  },
  // AI Chat
  AI_CHAT: {
    GET_CONVERSATION: '/ai-conversation',
    GET_MESSAGES: (lastMessageAt?: number) =>
      lastMessageAt ? `/ai-message?lastMessageAt=${lastMessageAt}` : '/ai-message',
    SEND_MESSAGE: '/ai-conversation/chat'
  },

  // Operation Staff
  OPERATION_STAFF: {
    INVOICES_HANDLE_DELIVERY: (page: number, limit: number, status?: string) => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit)
      })
      if (status) params.append('status', status)
      return `/admin/invoices/handle-delivery?${params.toString()}`
    },
    INVOICE_DETAIL: (id: string) => `/admin/invoices/${id}`
  },

  // Admin AI Conversations
  ADMIN_AI_CONVERSATIONS: {
    LIST: (search: string = '', lastItem: string = '') =>
      `/admin/ai-conversations?search=${encodeURIComponent(search)}&lastItem=${lastItem}`,
    MESSAGES: (id: string, lastItem: string = '') =>
      `/admin/ai-conversations/${id}/messages?lastItem=${lastItem}`
  }
} as const
