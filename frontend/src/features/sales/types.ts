export interface Invoice {
  id: string
  invoiceCode: string
  fullName: string
  phone: string
  finalPrice: string
  status: 'DEPOSITED' | 'WAITING_ASSIGN' | 'REJECTED' | 'APPROVED'
  address: string
  createdAt: string
  orders: {
    id: string
    type: ('MANUFACTURING' | 'STANDARD' | 'PRE-ORDER')[]
    status:
      | 'PENDING'
      | 'APPROVED'
      | 'REJECTED'
      | 'VERIFIED'
      | 'UNVERIFIED'
      | 'WAITING_ASSIGN'
      | 'PROCESSING'
      | 'COMPLETED'
      | 'DEPOSITED'
  }[]
  approvedOrdersCount?: number
  totalOrdersCount?: number
}

export interface OrderDetail {
  _id: string
  orderCode: string
  invoiceId: string
  type: ('MANUFACTURING' | 'STANDARD' | 'PRE-ORDER')[]
  status:
    | 'PENDING'
    | 'APPROVED'
    | 'REJECTED'
    | 'VERIFIED'
    | 'UNVERIFIED'
    | 'WAITING_ASSIGN'
    | 'PROCESSING'
    | 'COMPLETED'
    | 'DEPOSITED'
  price: number
  products: {
    product: {
      product_id: string
      sku: string
      product_name?: string
      pricePerUnit: number
    }
    quantity: number
    lens?: {
      lens_id: string
      sku: string
      parameters: {
        left: { SPH: number; CYL: number; AXIS: number }
        right: { SPH: number; CYL: number; AXIS: number }
        PD: number
      }
    }
  }[]
  assignedAt?: string | null
  startedAt?: string | null
  completedAt?: string | null
  createdAt?: string
  // Additional fields for compatibility
  customerName?: string
  customerPhone?: string
  isPrescription?: boolean
  invoice?: Invoice
}

export type Order = OrderDetail
