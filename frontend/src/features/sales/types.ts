export interface LensParameter {
  SPH: number
  CYL: number
  AXIS: number
  PD: number
  ADD?: number
  [key: string]: any
}

export interface Invoice {
  id: number | string
  status: 'DEPOSITED' | 'CANCEL' | 'PAID' | 'WAITING' | string
  totalAmount?: number
  createdAt?: string
}

export interface Order {
  id: number | string
  invoiceId?: number | string
  invoice?: Invoice
  status: 'WAITING_ASSIGN' | 'PROCESSING' | 'COMPLETED' | string
  lensParameter?: LensParameter
  productName?: string
  customerName?: string
  isPrescription?: boolean
  description?: string
}
