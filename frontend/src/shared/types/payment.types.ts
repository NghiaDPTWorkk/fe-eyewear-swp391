import type { PaymentMethodType, PaymentStatus } from './enums'

export interface Payment {
  _id: string
  paymentMethod: PaymentMethodType
  status: PaymentStatus
  ownerId: string
  invoiceId: string
  note?: string
  price: number
  createdAt: Date
  updatedAt: Date
}

export interface CreatePaymentRequest {
  ownerId: string
  invoiceId: string
  paymentMethod: PaymentMethodType
  status?: PaymentStatus
  note?: string
  price: number
}

export interface UpdatePaymentRequest {
  paymentMethod?: PaymentMethodType
  status?: PaymentStatus
  note?: string
  price?: number
}

export interface PaymentResponse {
  payment: Payment
}

export interface PaymentStatusResponse {
  _id: string
  status: PaymentStatus
  message: string
}
