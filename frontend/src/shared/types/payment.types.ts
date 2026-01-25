import type { PaymentMethodType, PaymentStatus } from './enums'

export interface Payment {
  _id: string
  paymentMethod: PaymentMethodType
  status: PaymentStatus
  ownerId: string
  orderId: string
  note?: string
  price: number
  createdAt: Date
  updatedAt: Date
}

export interface PaymentRequest {
  orderId: string
  amount: number
  method: PaymentMethodType
  note?: string
}

export interface PaymentResponse {
  payment: Payment
}

export interface PaymentStatusResponse {
  _id: string
  status: PaymentStatus
  message: string
}
