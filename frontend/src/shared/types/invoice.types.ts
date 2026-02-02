import type { Address, PaymentMethodType } from '.'
import type { OrderProduct } from './order-item.types'
import type { InvoiceStatus } from './enums'

/**
 * {
    "products": [
        {
            "product": {
                "product_id": "6965c4bc979f1a2fb5e32963",
                "sku": "LENS-007-01"
            },
            "quantity": 1
        }
    ],
    "address": {
        "street": "Le van viet",
        "ward": "Phuong Thu Duc",
        "city": "Thanh pho Ho Chi Minh"
    },
    "fullName": "Minh Lâm",
    "phone": "0812345678",
    "voucher": [],
    "paymentMethod": "COD",
    "note": "Giao ngoài giờ hành chánh dùm"
}
 */
export interface CreateInvoiceRequest {
  products: OrderProduct[]
  address: Address
  fullName: string
  phone: string
  voucher?: string[]
  paymentMethod: PaymentMethodType
  note?: string
}

export interface Invoice {
  _id: string
  invoiceCode: string
  orders: string[]
  owner: string
  totalPrice: number
  voucher: string[]
  address: Address
  status: InvoiceStatus
  fullName: string
  phone: string
  totalDiscount: number
  manager_onboard?: string | null
  staffVerified: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  __v?: number
}

// Timestamps are strings in API response

/**
 * {
    "success": true,
    "message": "Tạo hóa đơn thành công!",
    "data": {
        "invoice": {
            "invoiceCode": "HD_0886121769494797912",
            "orders": [
                "6978590d861fc6fb03e27b6d"
            ],
            "owner": "6968a5e8f1b5f9eb080bb411",
            "totalPrice": 50000,
            "voucher": [],
            "address": {
                "street": "Le van viet",
                "ward": "Phuong Thu Duc",
                "city": "Thanh pho Ho Chi Minh"
            },
            "status": "PENDING",
            "fullName": "Minh Lâm",
            "phone": "0812345678",
            "totalDiscount": 0,
            "staffVerified": null,
            "deletedAt": null,
            "_id": "6978590d861fc6fb03e27b70",
            "createdAt": "2026-01-27T06:19:57.917Z",
            "updatedAt": "2026-01-27T06:19:57.917Z",
            "__v": 0
        },
        "payment": {
            "ownerId": "6968a5e8f1b5f9eb080bb411",
            "invoiceId": "6978590d861fc6fb03e27b70",
            "paymentMethod": "COD",
            "status": "UNPAID",
            "note": "",
            "price": 50000,
            "deletedAt": null,
            "_id": "6978590d861fc6fb03e27b72",
            "createdAt": "2026-01-27T06:19:57.985Z",
            "updatedAt": "2026-01-27T06:19:57.985Z",
            "__v": 0
        }
    }
}
 */

export interface InvoiceResponse {
  invoice: Invoice
}

export interface CreateInvoiceApiResponse {
  success: boolean
  message: string
  data: InvoiceResponse
}
