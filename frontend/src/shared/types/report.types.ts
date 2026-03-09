export interface RevenueRow {
  period: string
  totalRevenue: number
  invoiceCount: number
}

export interface RevenueStats {
  period: string
  fromDate: string
  toDate: string
  userId?: string
  rows: RevenueRow[]
}

export type ReturnTicketStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'CANCEL'
  | 'REJECTED'
  | 'APPROVED'
  | 'DELIVERING'
  | 'RETURNED'

export interface ReturnTicket {
  id: string
  orderId: string
  customerId: string
  reason: string
  description: string
  media: string[]
  skus: string[]
  money: number
  staffVerify: string | null
  status: ReturnTicketStatus
  createdAt: string
  updatedAt: string
}

export interface ReturnTicketListResponse {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  returnTicketList: ReturnTicket[]
}

export interface ReturnedOrder {
  returnTicket: ReturnTicket
  order: {
    _id: string
    [key: string]: any
  }
}

export interface ReturnedOrdersResponse {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  returnedOrders: ReturnedOrder[]
}
