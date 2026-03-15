export enum OrderType {
  NORMAL = 'NORMAL',
  PRE_ORDER = 'PRE-ORDER',
  MANUFACTURING = 'MANUFACTURING',
  RETURN = 'RETURN'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  WAITING_VERIFY = 'WAITING_VERIFY',
  VERIFIED = 'VERIFIED',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  WAITING_ASSIGN = 'WAITING_ASSIGN',
  ASSIGNED = 'ASSIGNED',
  MAKING = 'MAKING',
  PACKAGING = 'PACKAGING',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  WAITING_REFUND = 'WAITING_REFUND',
  REFUNDED = 'REFUNDED'
}

export const AssignmentOrderStatus = {
  PENDING: 'PENDING',
  ASSIGNED: 'ASSIGNED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED'
} as const
export type AssignmentOrderStatus =
  (typeof AssignmentOrderStatus)[keyof typeof AssignmentOrderStatus]
