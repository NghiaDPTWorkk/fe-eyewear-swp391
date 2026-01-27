export interface PaymentRequest {
  orderId: string
  amount: number
  method: 'momo' | 'vnpay'
  bankCode?: string
  language?: 'vn' | 'en'
}

export interface PaymentResponse {
  paymentUrl: string
  transactionId: string
}

export interface PaymentStatusResponse {
  transactionId: string
  status: 'pending' | 'success' | 'failed'
  message: string
}
