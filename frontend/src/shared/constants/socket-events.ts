export const emittedEvent = {
  notification: {
    RECEIVE_INVOICE_CREATE: 'RECEIVE_INVOICE_CREATE',
    RECEIVE_ASSIGN_ORDER: 'RECEIVE_ASSIGN_ORDER',
    RECEIVE_ASSIGN_INVOICE: 'RECEIVE_ASSIGN_INVOICE',
    RECEIVE_COMPLETE_INVOICE: 'RECEIVE_COMPLETE_INVOICE'
  }
} as const

export const listenedEvent = {
  notification: {
    INVOICE_CREATE: 'INVOICE_CREATE',
    ASSIGN_ORDER: 'ASSIGN_ORDER',
    ASSIGN_INVOICE: 'ASSIGN_INVOICE',
    COMPLETE_INVOICE: 'COMPLETE_INVOICE'
  }
} as const

export type NotificationSocketEvent =
  (typeof emittedEvent.notification)[keyof typeof emittedEvent.notification]
