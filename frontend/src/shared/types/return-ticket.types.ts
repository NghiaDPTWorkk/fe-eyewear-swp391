export interface ReturnTicketRequest {
  orderId: string
  reason: string
  description: string
  media: string[]
}

export interface ReturnTicketData {
  id: string
  orderId: string
  customerId: string
  reason: string
  description: string
  media: string[]
  quantity: number
  money: number
  staffVerify: string | null
  staffName?: string
  customerName?: string
  staffNote?: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface ReturnTicketResponse {
  success: boolean
  message: string
  data: ReturnTicketData
}

export interface OrderItemProduct {
  product: {
    product_id: string
    sku: string
    pricePerUnit: number
  }
  quantity: number
  _id: string
}

export interface OrderListItem {
  _id: string
  orderCode: string
  invoiceId: string
  type: string[]
  status: string
  products: OrderItemProduct[]
  price: number
  createdAt: string
  updatedAt: string
  // Add other fields if needed for UI
}

export interface ListOrderByInvoiceResponse {
  success: boolean
  message: string
  data: {
    orderList: OrderListItem[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

export type ReturnTicketStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'CANCEL'
  | 'REJECTED'
  | 'APPROVED'
  | 'DELIVERING'
  | 'RETURNED'

export interface ListReturnTicketResponse {
  success: boolean
  message: string
  data: {
    returnTicketList: ReturnTicketData[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

export type ReturnTicketReason = 'DAMAGE' | 'WRONG_ITEM' | 'NOT_EXPECTED' | 'OTHER'

export const RETURN_TICKET_REASONS: { value: ReturnTicketReason; label: string }[] = [
  { value: 'DAMAGE', label: 'Product is damaged' },
  { value: 'WRONG_ITEM', label: 'Wrong item received' },
  { value: 'NOT_EXPECTED', label: 'Product not as expected' },
  { value: 'OTHER', label: 'Other' }
]
