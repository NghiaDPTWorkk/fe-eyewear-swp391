export const UserRole = {
  CUSTOMER: 'customer',
  SALE_STAFF: 'sale-staff',
  OPERATION_STAFF: 'operation-staff',
  MANAGER: 'manager',
  ADMIN: 'admin',
  STAFF: 'staff' // Generic staff role for legacy or general checks
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

/**
 * Mapping of role strings from backend to internal role IDs
 */
export const ROLE_MAP: Record<string, UserRole> = {
  CUSTOMER: UserRole.CUSTOMER,
  SALE_STAFF: UserRole.SALE_STAFF,
  OPERATION_STAFF: UserRole.OPERATION_STAFF,
  MANAGER: UserRole.MANAGER,
  SYSTEM_ADMIN: UserRole.ADMIN,
  ADMIN: UserRole.ADMIN,
  STAFF: UserRole.STAFF
} as const
