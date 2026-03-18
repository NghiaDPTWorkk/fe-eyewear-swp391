export const UserRole = {
  CUSTOMER: 'CUSTOMER',
  SALE_STAFF: 'SALE_STAFF',
  OPERATION_STAFF: 'OPERATION_STAFF',
  MANAGER: 'MANAGER',
  ADMIN: 'ADMIN'
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]
