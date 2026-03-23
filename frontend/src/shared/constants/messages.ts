export const ERROR_MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: 'Incorrect email or password',
    LOGIN_FAILED: 'Login failed. Please try again.',
    REGISTER_FAILED: 'Registration failed. Please try again.',
    INVALID_EMAIL: 'Invalid email address',
    PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters long',
    PASSWORD_UPPERCASE: 'Password must contain at least 1 uppercase letter',
    PASSWORD_NUMBER: 'Password must contain at least 1 number',
    UNAUTHORIZED: 'Session expired. Please log in again.',
    INVALID_NAME: 'Name must contain only letters and spaces. Special characters are not allowed.',
    PASSWORD_COMPLEXITY:
      'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
  },
  CART: {
    ADD_FAILED: 'Failed to add to cart',
    UPDATE_FAILED: 'Failed to update cart',
    REMOVE_FAILED: 'Failed to remove product',
    EMPTY_CART: 'Cart is empty'
  },
  CHECKOUT: {
    STOCK_UNAVAILABLE: 'Product is out of stock',
    PAYMENT_FAILED: 'Payment failed. Please try again.',
    ORDER_FAILED: 'Order failed. Please try again.'
  },
  PRESCRIPTION: {
    INVALID_SPH: 'Invalid SPH value (-20.00 to +20.00)',
    INVALID_CYL: 'Invalid CYL value (-6.00 to +6.00)',
    INVALID_AXIS: 'Invalid AXIS value (1 to 180)',
    INVALID_PD: 'Invalid PD value (50 to 80)',
    AXIS_REQUIRED: 'AXIS is required when CYL is not 0'
  },
  PRODUCT: {
    NOT_FOUND: 'Product not found',
    INVALID_PRICE: 'Invalid product price',
    LOAD_FAILED: 'Failed to load products',
    CREATE_FAILED: 'Failed to create product',
    UPDATE_FAILED: 'Failed to update product',
    DELETE_FAILED: 'Failed to delete product'
  },
  HTTP: {
    BAD_REQUEST: 'Invalid request',
    FORBIDDEN: 'You do not have permission to access this',
    NOT_FOUND: 'Data not found',
    CONFLICT: 'Data already exists',
    UNPROCESSABLE: 'Invalid data',
    TOO_MANY_REQUESTS: 'Too many requests. Please try again later.',
    SERVICE_UNAVAILABLE: 'System maintenance. Please try again later.'
  },
  GENERAL: {
    SUCCESS: 'Success',
    NETWORK_ERROR: 'Connection error. Please check your network.',
    SERVER_ERROR: 'System error. Please try again later.',
    UNKNOWN_ERROR: 'An error occurred. Please try again.'
  },
  SALES: {
    APPROVE_INVOICE_FAILED: 'Failed to approve invoice',
    REJECT_INVOICE_FAILED: 'Failed to reject invoice',
    VERIFY_ORDER_FAILED: 'Failed to verify order',
    REJECT_ORDER_FAILED: 'Failed to reject order',
    INVOICE_ID_NOT_FOUND: 'Associated invoice ID not found'
  },
  MANAGER: {
    ASSIGN_STAFF_FAILED: 'Failed to assign staff',
    IMPORT_FAILED: 'Failed to import product',
    ONBOARD_FAILED: 'Failed to start onboarding',
    COMPLETE_FAILED: 'Failed to mark as completed'
  }
} as const

export const SUCCESS_MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: 'Login successful',
    REGISTER_SUCCESS: 'Registration successful',
    LOGOUT_SUCCESS: 'Logout successful'
  },
  CART: {
    ADDED: 'Added to cart',
    UPDATED: 'Cart updated',
    REMOVED: 'Product removed'
  },
  CHECKOUT: {
    ORDER_SUCCESS: 'Order placed successfully'
  },
  SALES: {
    INVOICE_APPROVED: 'Invoice approved successfully',
    INVOICE_REJECTED: 'Invoice rejected successfully',
    ORDER_VERIFIED: 'Order verified successfully',
    BATCH_REJECTED: 'Invoice and all associated orders rejected'
  },
  MANAGER: {
    STAFF_ASSIGNED: 'Staff assigned successfully',
    PRODUCT_IMPORTED: 'Product imported successfully',
    ONBOARD_STARTED: 'Onboarding started successfully',
    COMPLETED: 'Marked as completed successfully'
  }
} as const
