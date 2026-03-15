import { OrderType } from '@/shared/utils/enums/order.enum'
import type { Order } from '../types'

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

    note: ord.note || ord.orderNote || inv?.note || inv?.orderNote || ord.invoice?.note || '',

    customerEmail:
      ord.customerEmail ||
      inv?.email ||
      inv?.customer?.email ||
      inv?.customerEmail ||
      inv?.owner?.email ||
      ord.invoice?.email ||
      ord.invoice?.customer?.email ||
      '',

    staffNote: ord.staffNote || '',

    rejectedNote: inv?.rejectedNote || ord.invoice?.rejectedNote || ''
  }
}

export const getOrderTypeLabel = (order: Order): 'Prescription' | 'Pre-order' | 'Regular' => {
  if (order.isPrescription || order.type?.includes(OrderType.MANUFACTURING)) return 'Prescription'
  if (order.type?.includes(OrderType.PRE_ORDER)) return 'Pre-order'
  return 'Regular'
}

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

export const canApproveOrder = (order: Order): boolean => {
  return (
    order.status === 'WAITING_ASSIGN' || order.status === 'DEPOSITED' || order.status === 'PENDING'
  )
}
