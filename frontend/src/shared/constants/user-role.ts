export const UserRole = {
  CUSTOMER: 'customer',
  STAFF: 'staff',
  OPERATIONS: 'operations',
  MANAGER: 'manager',
  ADMIN: 'admin'
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]
