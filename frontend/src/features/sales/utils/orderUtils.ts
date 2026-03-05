import { OrderType } from '@/shared/utils/enums/order.enum'
import type { Order } from '../types'

/**
 * Transforms raw API order/invoice data into a standardized Order object.
 */

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
      inv?.customer?.name ||
      inv?.name ||
      ord.invoice?.fullName ||
      ord.invoice?.customer?.fullName ||
      ord.invoice?.customer?.name ||
      ord.invoice?.name ||
      'Guest',
    customerPhone:
      ord.customerPhone ||
      inv?.phone ||
      inv?.phoneNumber ||
      inv?.customer?.phone ||
      inv?.customer?.phoneNumber ||
      ord.invoice?.phone ||
      ord.invoice?.phoneNumber ||
      ord.invoice?.customer?.phone ||
      ord.invoice?.customer?.phoneNumber ||
      '',

    createdAt: ord.createdAt || inv?.createdAt,
    status: ord.status || 'DEPOSITED',
    isPrescription: ord.type?.includes(OrderType.MANUFACTURING) || ord.isPrescription || false,
    products: ord.products || ord.orderItems || [],
    invoice: inv || ord.invoice,
    // Note: lấy từ order trước, fallback sang invoice note
    note: ord.note || ord.orderNote || inv?.note || inv?.orderNote || ord.invoice?.note || '',
    // Email: thử nhiều paths khác nhau trong response của backend
    customerEmail:
      ord.customerEmail ||
      inv?.email ||
      inv?.customer?.email ||
      inv?.customerEmail ||
      inv?.owner?.email ||
      ord.invoice?.email ||
      ord.invoice?.customer?.email ||
      ''
  }
}

/**
 * Determines the order type label for UI display.
 */
export const getOrderTypeLabel = (order: Order): 'Prescription' | 'Pre-order' | 'Regular' => {
  if (order.isPrescription || order.type?.includes(OrderType.MANUFACTURING)) return 'Prescription'
  if (order.type?.includes(OrderType.PRE_ORDER)) return 'Pre-order'
  return 'Regular'
}

/**
 * Checks if an order is verified (for Prescription orders).
 */
export const isOrderVerified = (order: Order): boolean => {
  return [
    'VERIFIED',
    'APPROVE',
    'APPROVED',
    'WAITING_ASSIGN',
    'ASSIGNED',
    'MAKING',
    'PACKAGING',
    'COMPLETED',
    'ONBOARD',
    'DELIVERED',
    'DELIVERING',
    'SHIPPED',
    'PROCESSING'
  ].includes(order.status.toUpperCase())
}

/**
 * Checks if an order can be approved.
 */
export const canApproveOrder = (order: Order): boolean => {
  return (
    order.status === 'WAITING_ASSIGN' || order.status === 'DEPOSITED' || order.status === 'PENDING'
  )
}
