import type { Order } from '../types'

/**
 * Transforms raw API order/invoice data into a standardized Order object.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const transformOrder = (ord: any, inv?: any): Order => {
  const orderId = ord.id || ord._id
  const invoiceId = inv?.id || inv?._id || ord.invoiceId || ord.invoice?._id

  return {
    ...ord,
    _id: orderId,
    orderCode:
      ord.orderCode || (orderId ? `ORD-${orderId.toString().slice(-6).toUpperCase()}` : 'N/A'),
    invoiceId: invoiceId,
    invoiceCode: inv?.invoiceCode,
    customerName:
      ord.customerName ||
      inv?.fullName ||
      inv?.customer?.fullName ||
      ord.invoice?.fullName ||
      ord.invoice?.customer?.fullName ||
      'Guest',
    customerPhone:
      ord.customerPhone ||
      inv?.phone ||
      inv?.customer?.phone ||
      ord.invoice?.phone ||
      ord.invoice?.customer?.phone ||
      '',
    createdAt: ord.createdAt || inv?.createdAt,
    status: ord.status || 'DEPOSITED',
    isPrescription: ord.type?.includes('MANUFACTURING') || ord.isPrescription || false,
    products: ord.products || ord.orderItems || []
  }
}

/**
 * Determines the order type label for UI display.
 */
export const getOrderTypeLabel = (order: Order): 'Prescription' | 'Pre-order' | 'Regular' => {
  if (order.isPrescription || order.type?.includes('MANUFACTURING')) return 'Prescription'
  if (order.type?.includes('PRE-ORDER')) return 'Pre-order'
  return 'Regular'
}

/**
 * Checks if an order is verified (for Prescription orders).
 */
export const isOrderVerified = (order: Order): boolean => {
  return [
    'VERIFIED',
    'APPROVED',
    'WAITING_ASSIGN',
    'PROCESSING',
    'COMPLETED',
    'SHIPPED',
    'DELIVERED'
  ].includes(order.status)
}

/**
 * Checks if an order can be approved.
 */
export const canApproveOrder = (order: Order): boolean => {
  return (
    order.status === 'WAITING_ASSIGN' || order.status === 'DEPOSITED' || order.status === 'PENDING'
  )
}
