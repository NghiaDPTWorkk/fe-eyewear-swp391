# TypeScript Types Documentation

> **Tài liệu chi tiết về tất cả các types/models trong frontend**  
> Cập nhật: 2026-01-26

## 📋 Mục lục

- [Tổng quan](#tổng-quan)
- [Enums](#enums)
- [Product Types](#product-types)
- [Order Types](#order-types)
- [Cart Types](#cart-types)
- [Payment Types](#payment-types)
- [Voucher Types](#voucher-types)
- [Category Types](#category-types)
- [Attribute Types](#attribute-types)
- [Customer Types](#customer-types)
- [Auth Types](#auth-types)
- [Address Types](#address-types)
- [User Types](#user-types)
- [Response Types](#response-types)

---

## Tổng quan

Tất cả types được định nghĩa trong `src/shared/types/` và được export thông qua `index.ts`. Các types này đồng bộ 100% với backend API để đảm bảo type safety.

### Cách import

```typescript
import { Product, CreateOrderRequest, Voucher } from '@/shared/types'
```

---

## Enums

**File:** `enums.ts`

### OrderType

**Mục đích:** Phân loại đơn hàng theo loại sản xuất

```typescript
export const OrderType = {
  NORMAL: 'NORMAL', // Đơn hàng thường (có sẵn)
  PRE_ORDER: 'PRE_ORDER', // Đơn đặt trước
  MANUFACTURING: 'MANUFACTURING' // Đơn sản xuất theo yêu cầu
} as const
```

**Sử dụng:**

```typescript
const order: Order = {
  type: OrderType.NORMAL
  // ...
}
```

---

### OrderStatus

**Mục đích:** Trạng thái của đơn hàng trong quy trình xử lý

```typescript
export const OrderStatus = {
  PENDING: 'PENDING', // Chờ xác nhận
  VERIFIED: 'VERIFIED', // Đã xác minh
  APPROVED: 'APPROVED', // Đã phê duyệt
  ASSIGNED: 'ASSIGNED', // Đã phân công
  MAKING: 'MAKING', // Đang sản xuất
  PACKAGED: 'PACKAGED', // Đã đóng gói
  REJECTED: 'REJECTED', // Bị từ chối
  CANCEL: 'CANCEL' // Đã hủy
} as const
```

---

### AssignmentOrderStatus

**Mục đích:** Trạng thái phân công nhân viên cho đơn hàng

```typescript
export const AssignmentOrderStatus = {
  PENDING: 'PENDING', // Chờ phân công
  ASSIGNED: 'ASSIGNED', // Đã phân công
  IN_PROGRESS: 'IN_PROGRESS', // Đang thực hiện
  COMPLETED: 'COMPLETED' // Hoàn thành
} as const
```

---

### InvoiceStatus

**Mục đích:** Trạng thái của hóa đơn/đơn thanh toán

```typescript
export const InvoiceStatus = {
  PENDING: 'PENDING', // Chờ xử lý
  DEPOSITED: 'DEPOSITED', // Đã đặt cọc
  WAITING_ASSIGN: 'WAITING_ASSIGN', // Chờ phân công
  ONBOARD: 'ONBOARD', // Đang xử lý tại cửa hàng
  COMPLETED: 'COMPLETED', // Hoàn thành
  DELIVERING: 'DELIVERING', // Đang giao hàng
  DELIVERED: 'DELIVERED' // Đã giao hàng
} as const
```

---

### PaymentMethodType

**Mục đích:** Phương thức thanh toán

```typescript
export const PaymentMethodType = {
  COD: 'COD', // Thanh toán khi nhận hàng
  ZALAPAY: 'ZALAPAY', // Ví ZaloPay
  MOMO: 'MOMO', // Ví MoMo
  VNPAY: 'VNPAY' // VNPAY
} as const
```

---

### PaymentStatus

**Mục đích:** Trạng thái thanh toán

```typescript
export const PaymentStatus = {
  PAID: 'PAID', // Đã thanh toán
  UNPAID: 'UNPAID' // Chưa thanh toán
} as const
```

---

### ProductType

**Mục đích:** Loại sản phẩm

```typescript
export const ProductType = {
  FRAME: 'frame', // Gọng kính
  LENS: 'lens', // Tròng kính
  SUNGLASS: 'sunglass' // Kính râm
} as const
```

---

### VoucherStatus

**Mục đích:** Trạng thái voucher

```typescript
export const VoucherStatus = {
  DRAFT: 'DRAFT', // Nháp
  ACTIVE: 'ACTIVE', // Đang hoạt động
  DISABLE: 'DISABLE' // Vô hiệu hóa
} as const
```

---

### VoucherDiscountType

**Mục đích:** Loại giảm giá của voucher

```typescript
export const VoucherDiscountType = {
  FIXED: 'FIXED', // Giảm giá cố định (VNĐ)
  PERCENTAGE: 'PERCENTAGE' // Giảm giá theo % (0-100)
} as const
```

---

### VoucherApplyScope

**Mục đích:** Phạm vi áp dụng voucher

```typescript
export const VoucherApplyScope = {
  ALL: 'ALL', // Áp dụng cho tất cả sản phẩm
  SPECIFIC: 'SPECIFIC' // Áp dụng cho sản phẩm cụ thể
} as const
```

---

### AttributeShowType

**Mục đích:** Cách hiển thị thuộc tính sản phẩm

```typescript
export const AttributeShowType = {
  COLOR: 'color', // Hiển thị dạng màu sắc
  TEXT: 'text' // Hiển thị dạng text
} as const
```

---

### Gender

**Mục đích:** Giới tính

```typescript
export const Gender = {
  FEMALE: 'F', // Nữ
  MALE: 'M', // Nam
  NON_BINARY: 'N' // Không xác định
} as const
```

---

## Product Types

**File:** `product.types.ts`

### FrameSpec

**Mục đích:** Thông số kỹ thuật của gọng kính/kính râm

**Thành phần:**

```typescript
interface FrameSpec {
  material: string[] // Danh sách chất liệu (vd: ['Titanium', 'Acetate'])
  shape: string // Hình dạng (vd: 'Round', 'Square')
  style: string | null // Phong cách (vd: 'Classic', 'Modern')
  gender: Gender // Giới tính phù hợp
  weight: number | null // Trọng lượng (gram)
  dimensions: {
    // Kích thước
    width: number // Chiều rộng (mm)
    height: number // Chiều cao (mm)
    depth: number // Độ sâu (mm)
  } | null
}
```

**Sử dụng:** Lưu thông tin chi tiết về gọng kính

---

### LenSpec

**Mục đích:** Thông số kỹ thuật của tròng kính

**Thành phần:**

```typescript
interface LenSpec {
  feature: string[] // Tính năng (vd: ['UV Protection', 'Anti-scratch'])
  origin: string | null // Xuất xứ (vd: 'Japan', 'Korea')
}
```

**Sử dụng:** Lưu thông tin chi tiết về tròng kính

---

### Product

**Mục đích:** Thông tin đầy đủ của sản phẩm (discriminated union)

**Thành phần:**

```typescript
type Product =
  | (BaseProduct & { type: 'frame'; spec: FrameSpec })
  | (BaseProduct & { type: 'sunglass'; spec: FrameSpec })
  | (BaseProduct & { type: 'lens'; spec: LenSpec | null })

interface BaseProduct {
  _id: string // ID sản phẩm
  nameBase: string // Tên cơ bản
  slugBase: string // Slug URL
  skuBase: string // SKU cơ bản
  categories: string[] // Danh sách category IDs
  brand: string | null // Thương hiệu
  variants: Variant[] // Danh sách biến thể
  deletedAt: Date | null // Ngày xóa (soft delete)
  createdAt: Date // Ngày tạo
  updatedAt: Date // Ngày cập nhật
}
```

**Sử dụng:**

- Hiển thị chi tiết sản phẩm
- Quản lý sản phẩm trong admin

**Ví dụ:**

```typescript
const product: Product = {
  _id: '123',
  type: 'frame',
  nameBase: 'Ray-Ban Aviator',
  spec: {
    material: ['Metal'],
    shape: 'Aviator',
    gender: Gender.MALE,
    // ...
  },
  variants: [...]
}
```

---

### StandardProduct

**Mục đích:** Sản phẩm đơn giản hóa cho danh sách/catalog

**Thành phần:**

```typescript
interface StandardProduct {
  id: string // ID sản phẩm
  nameBase: string // Tên sản phẩm
  slugBase: string // Slug URL
  skuBase: string // SKU
  type: ProductType // Loại sản phẩm
  brand: string | null // Thương hiệu
  categories: string[] // Categories
  defaultVariantPrice?: number // Giá mặc định
  defaultVariantFinalPrice?: number // Giá sau giảm
  defaultVariantImage?: string // Ảnh mặc định
  totalVariants: number // Tổng số biến thể
  createdAt: string // Ngày tạo
}
```

**Sử dụng:**

- Hiển thị danh sách sản phẩm
- Product cards
- Search results

---

### ProductCreateRequest

**Mục đích:** Tạo sản phẩm mới (discriminated union)

**Thành phần:**

```typescript
type ProductCreateRequest =
  | ProductCreateFrameRequest
  | ProductCreateSunglassRequest
  | ProductCreateLensRequest

// Ví dụ cho Frame
interface ProductCreateFrameRequest {
  type: 'frame'
  nameBase: string
  slugBase?: string
  skuBase?: string
  brand: string | null
  categories: string[]
  spec: FrameSpec
  variants: Variant[]
}
```

**Sử dụng:** API call tạo sản phẩm mới

---

### ProductUpdateRequest

**Mục đích:** Cập nhật sản phẩm

**Thành phần:**

```typescript
interface ProductUpdateRequest {
  nameBase?: string
  slugBase?: string
  skuBase?: string
  type?: ProductType
  brand?: string | null
  categories?: string[]
  spec?: FrameSpec | LenSpec | null
  variants?: Variant[]
}
```

**Sử dụng:** API call cập nhật sản phẩm

---

### ProductSearchRequest

**Mục đích:** Tìm kiếm/lọc sản phẩm

**Thành phần:**

```typescript
interface ProductSearchRequest {
  keyword?: string // Từ khóa tìm kiếm
  category?: string // Lọc theo category
  brand?: string // Lọc theo thương hiệu
  minPrice?: number // Giá tối thiểu
  maxPrice?: number // Giá tối đa
  rating?: number // Đánh giá tối thiểu
  isNew?: boolean // Sản phẩm mới
  isSale?: boolean // Đang giảm giá
  page?: number // Trang hiện tại
  limit?: number // Số item/trang
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'rating'
}
```

**Sử dụng:** API call tìm kiếm sản phẩm

---

### ProductResponse / StandardProductResponse

**Mục đích:** Response từ API với pagination

**Thành phần:**

```typescript
interface ProductResponse {
  data: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
}
```

**Sử dụng:** Nhận dữ liệu từ API

---

## Variant Types

**File:** `variant.types.ts`

### VariantOption

**Mục đích:** Thuộc tính của biến thể (màu sắc, kích thước, v.v.)

**Thành phần:**

```typescript
interface VariantOption {
  attributeId: string // ID thuộc tính
  attributeName: string // Tên thuộc tính (vd: 'Color', 'Size')
  label: string // Nhãn hiển thị (vd: 'Đen', 'Lớn')
  showType: 'color' | 'text' // Cách hiển thị
  value: string // Giá trị (vd: '#000000', 'L')
}
```

**Sử dụng:** Hiển thị options cho variant selector

---

### Variant

**Mục đích:** Biến thể sản phẩm (màu sắc, kích thước khác nhau)

**Thành phần:**

```typescript
interface Variant {
  sku?: string // SKU riêng của variant
  name?: string // Tên variant
  slug?: string // Slug variant
  options: VariantOption[] // Danh sách thuộc tính
  price: number // Giá gốc
  finalPrice: number // Giá sau giảm
  stock: number // Số lượng tồn kho
  imgs: string[] // Danh sách ảnh
  isDefault: boolean // Variant mặc định?
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null
}
```

**Sử dụng:**

- Hiển thị options sản phẩm
- Quản lý tồn kho
- Tính giá

**Ví dụ:**

```typescript
const variant: Variant = {
  sku: 'RB-AV-BLK-L',
  options: [
    {
      attributeName: 'Color',
      label: 'Black',
      showType: 'color',
      value: '#000000'
    }
  ],
  price: 5000000,
  finalPrice: 4500000,
  stock: 10,
  imgs: ['url1.jpg', 'url2.jpg'],
  isDefault: true
}
```

---

## Order Types

**File:** `order.types.ts`

### LensParameters

**Mục đích:** Thông số tròng kính theo đơn (cho kính cận/viễn)

**Thành phần:**

```typescript
interface LensParameters {
  left: {
    SPH: number // Sphere (độ cận/viễn)
    CYL: number // Cylinder (độ loạn)
    AXIS: number // Trục loạn (0-180)
  }
  right: {
    SPH: number
    CYL: number
    AXIS: number
  }
  PD: number // Pupillary Distance (khoảng cách đồng tử)
}
```

**Sử dụng:** Lưu thông số kính theo đơn của khách hàng

---

### OrderProductFrame

**Mục đích:** Thông tin gọng kính trong đơn hàng

**Thành phần:**

```typescript
interface OrderProductFrame {
  product_id: string // ID sản phẩm
  sku: string // SKU variant
}
```

---

### OrderProductLens

**Mục đích:** Thông tin tròng kính trong đơn hàng

**Thành phần:**

```typescript
interface OrderProductLens {
  lens_id: string // ID tròng kính
  sku: string // SKU tròng kính
  parameters: LensParameters // Thông số kính
}
```

---

### OrderProduct

**Mục đích:** Sản phẩm trong đơn hàng (có thể là gọng + tròng)

**Thành phần:**

```typescript
interface OrderProduct {
  product?: OrderProductFrame // Gọng kính (optional)
  lens?: OrderProductLens // Tròng kính (optional)
  quantity: number // Số lượng
}
```

**Sử dụng:**

- Lưu sản phẩm trong đơn hàng
- Có thể chỉ có gọng, chỉ có tròng, hoặc cả hai

**Ví dụ:**

```typescript
// Đơn hàng gọng + tròng
const orderProduct: OrderProduct = {
  product: {
    product_id: '123',
    sku: 'RB-AV-BLK'
  },
  lens: {
    lens_id: '456',
    sku: 'LENS-UV-1.5',
    parameters: {
      left: { SPH: -2.5, CYL: -0.5, AXIS: 90 },
      right: { SPH: -2.0, CYL: 0, AXIS: 0 },
      PD: 63
    }
  },
  quantity: 1
}
```

---

### Order

**Mục đích:** Thông tin đơn hàng

**Thành phần:**

```typescript
interface Order {
  _id: string
  type: OrderType // Loại đơn hàng
  status: OrderStatus // Trạng thái đơn
  assignmentStatus: AssignmentOrderStatus // Trạng thái phân công
  products: OrderProduct[] // Danh sách sản phẩm

  // Thông tin phân công
  staffId?: string | null // ID nhân viên
  assignStaff?: string | null // Người phân công
  assignedAt?: Date | null // Thời gian phân công
  startedAt?: Date | null // Thời gian bắt đầu
  completedAt?: Date | null // Thời gian hoàn thành
  staffVerified?: string | null // Nhân viên xác minh

  price: number // Tổng giá
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}
```

**Sử dụng:** Quản lý đơn hàng

---

### Invoice

**Mục đích:** Hóa đơn thanh toán (chứa nhiều orders)

**Thành phần:**

```typescript
interface Invoice {
  _id: string
  orders: string[] // Danh sách Order IDs
  owner: string // Customer ID
  totalPrice: number // Tổng tiền
  voucher: string[] // Danh sách Voucher IDs
  address: Address // Địa chỉ giao hàng
  status: InvoiceStatus // Trạng thái
  fullName: string // Tên người nhận
  phone: string // SĐT người nhận
  totalDiscount: number // Tổng giảm giá
  manager_onboard?: string | null // Manager xử lý
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}
```

**Sử dụng:** Quản lý thanh toán và giao hàng

---

### CreateOrderRequest

**Mục đích:** Tạo đơn hàng mới

**Thành phần:**

```typescript
interface CreateOrderRequest {
  type: OrderType
  products: {
    product?: {
      product_id: string
      sku: string
    }
    lens?: {
      lens_id: string
      sku: string
      parameters: LensParameters
    }
    quantity: number
  }[]
  voucher?: string[]
  paymentMethod: string
  shippingAddress?: Address
  customerInfo?: {
    fullName: string
    phone: string
  }
  note?: string
  status?: OrderStatus
}
```

**Sử dụng:** API call tạo đơn hàng

---

### UpdateOrderRequest

**Mục đích:** Cập nhật đơn hàng

**Sử dụng:** API call cập nhật đơn hàng (admin)

---

## Cart Types

**File:** `cart.types.ts`

### CartItem

**Mục đích:** Sản phẩm trong giỏ hàng

**Thành phần:**

```typescript
interface CartItem {
  product_id: string // SKU của variant
  quantity: number // Số lượng
  addAt: Date // Thời gian thêm vào
}
```

**Sử dụng:** Lưu item trong cart

---

### Cart

**Mục đích:** Giỏ hàng của user

**Thành phần:**

```typescript
interface Cart {
  _id: string
  owner: string // Customer ID
  products: CartItem[] // Danh sách sản phẩm
  totalProduct: number // Tổng số sản phẩm
  createdAt: Date
  updatedAt: Date
}
```

**Sử dụng:** Quản lý giỏ hàng

---

### AddToCartRequest / UpdateCartRequest

**Mục đích:** Thêm/cập nhật sản phẩm trong giỏ

**Thành phần:**

```typescript
interface AddToCartRequest {
  product_id: string // SKU
  quantity: number
}
```

**Sử dụng:** API call thêm/cập nhật cart

---

## Payment Types

**File:** `payment.types.ts`

### Payment

**Mục đích:** Thông tin thanh toán

**Thành phần:**

```typescript
interface Payment {
  _id: string
  paymentMethod: PaymentMethodType
  status: PaymentStatus
  ownerId: string // Customer ID
  invoiceId: string // Invoice ID (không phải orderId!)
  note?: string
  price: number // Số tiền thanh toán
  createdAt: Date
  updatedAt: Date
}
```

**Sử dụng:** Quản lý thanh toán

---

### CreatePaymentRequest

**Mục đích:** Tạo payment mới

**Thành phần:**

```typescript
interface CreatePaymentRequest {
  ownerId: string
  invoiceId: string
  paymentMethod: PaymentMethodType
  status?: PaymentStatus
  note?: string
  price: number
}
```

**Sử dụng:** API call tạo payment

---

## Voucher Types

**File:** `voucher.types.ts`

### Voucher

**Mục đích:** Mã giảm giá

**Thành phần:**

```typescript
interface Voucher {
  _id: string
  name: string // Tên voucher
  description: string // Mô tả
  code: string // Mã code (uppercase)
  typeDiscount: VoucherDiscountType // Loại giảm giá
  value: number // Giá trị (VNĐ hoặc %)
  usageLimit: number // Giới hạn sử dụng
  usageCount: number // Đã sử dụng
  startedDate: Date // Ngày bắt đầu
  endedDate: Date // Ngày kết thúc
  minOrderValue: number // Giá trị đơn tối thiểu
  maxDiscountValue: number // Giảm tối đa (cho %)
  applyScope: VoucherApplyScope // Phạm vi áp dụng
  status: VoucherStatus // Trạng thái
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}
```

**Sử dụng:**

- Hiển thị voucher
- Áp dụng giảm giá
- Quản lý voucher (admin)

**Ví dụ:**

```typescript
const voucher: Voucher = {
  code: 'SUMMER2026',
  typeDiscount: VoucherDiscountType.PERCENTAGE,
  value: 20, // 20%
  minOrderValue: 1000000,
  maxDiscountValue: 500000
  // ...
}
```

---

### CreateVoucherRequest / UpdateVoucherRequest

**Mục đích:** Tạo/cập nhật voucher

**Sử dụng:** API call quản lý voucher (admin)

---

## Category Types

**File:** `category.types.ts`

### Category

**Mục đích:** Danh mục sản phẩm

**Thành phần:**

```typescript
interface Category {
  _id: string
  name: string // Tên danh mục
  parentCate: string | null // ID danh mục cha (null = root)
  thumbnail: string | null // Ảnh thumbnail
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  deletedBy?: string | null
  createdBy?: string | null
}
```

**Sử dụng:**

- Hiển thị menu danh mục
- Lọc sản phẩm theo danh mục
- Quản lý danh mục (admin)

**Ví dụ cấu trúc tree:**

```
Kính mắt (root)
├── Gọng kính
│   ├── Gọng kim loại
│   └── Gọng nhựa
└── Kính râm
```

---

## Attribute Types

**File:** `attribute.types.ts`

### Attribute

**Mục đích:** Thuộc tính sản phẩm (màu sắc, kích thước, v.v.)

**Thành phần:**

```typescript
interface Attribute {
  _id: string
  name: string // Tên thuộc tính (vd: 'Color', 'Size')
  showType: AttributeShowType // Cách hiển thị
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  createdBy: string
  deletedBy?: string | null
}
```

**Sử dụng:**

- Tạo variant options
- Hiển thị bộ lọc sản phẩm
- Quản lý thuộc tính (admin)

---

## Customer Types

**File:** `customer.types.ts`

### LinkedAccount

**Mục đích:** Tài khoản liên kết (Google, Facebook, v.v.)

**Thành phần:**

```typescript
interface LinkedAccount {
  provider: string // 'google', 'facebook'
  providerId: string // ID từ provider
  email?: string // Email từ provider
}
```

---

### Customer

**Mục đích:** Thông tin khách hàng

**Thành phần:**

```typescript
interface Customer {
  _id: string
  name: string
  email: string
  phone: string
  gender: Gender
  address: Address[] // Danh sách địa chỉ
  hobbies: string[] // Sở thích
  isVerified: boolean // Đã xác minh email?
  linkedAccounts: LinkedAccount[] // Tài khoản liên kết
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  deletedBy?: string | null
}
```

**Sử dụng:**

- Quản lý thông tin khách hàng
- Hiển thị profile
- Quản lý địa chỉ giao hàng

---

## Auth Types

**File:** `auth.types.ts`

### LoginRequest

**Mục đích:** Đăng nhập

**Thành phần:**

```typescript
interface LoginRequest {
  email: string
  password: string
}
```

---

### RegisterRequest

**Mục đích:** Đăng ký tài khoản

**Thành phần:**

```typescript
interface RegisterRequest {
  name: string
  email: string
  password: string
  phone: string
  gender: 'F' | 'M' | 'N'
}
```

---

### AuthResponse

**Mục đích:** Response sau khi đăng nhập/đăng ký

**Thành phần:**

```typescript
interface AuthResponse {
  token: string
  user: {
    _id: string
    name: string
    email: string
    phone: string
    gender: 'F' | 'M' | 'N'
  }
}
```

**Sử dụng:** Lưu token và thông tin user

---

## Address Types

**File:** `address.types.ts`

### Address

**Mục đích:** Địa chỉ giao hàng

**Thành phần:**

```typescript
interface Address {
  street: string // Số nhà, tên đường
  ward: string // Phường/Xã
  city: string // Quận/Huyện/Thành phố
}
```

**Sử dụng:**

- Lưu địa chỉ khách hàng
- Địa chỉ giao hàng trong đơn

---

## User Types

**File:** `user.types.ts`

### User

**Mục đích:** Thông tin user đơn giản (có thể dùng cho admin)

**Thành phần:**

```typescript
interface User {
  _id: string
  name: string
  email: string
  role?: string
}
```

**Sử dụng:** Context/state management

---

## Response Types

**File:** `response.types.ts`

### ApiResponse

**Mục đích:** Generic API response wrapper

**Thành phần:**

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}
```

**Sử dụng:** Wrap tất cả API responses

**Ví dụ:**

```typescript
const response: ApiResponse<Product> = {
  success: true,
  data: product,
  message: 'Product fetched successfully'
}
```

---

## Best Practices

### 1. Import Types

```typescript
// ✅ Đúng
import type { Product, CreateOrderRequest } from '@/shared/types'

// ❌ Sai - không cần import từng file
import { Product } from '@/shared/types/product.types'
```

### 2. Sử dụng Discriminated Unions

```typescript
// Product tự động infer type dựa vào 'type' field
if (product.type === 'frame') {
  // TypeScript biết product.spec là FrameSpec
  console.log(product.spec.material)
}
```

### 3. Type Guards

```typescript
function isFrameProduct(product: Product): product is Product & { type: 'frame' } {
  return product.type === 'frame'
}
```

### 4. Partial Types

```typescript
// Khi cần update một phần
const updateData: Partial<Product> = {
  nameBase: 'New Name'
}
```

---

## Tổng kết

| Type Category | Files                                                    | Mục đích chính            |
| ------------- | -------------------------------------------------------- | ------------------------- |
| **Enums**     | `enums.ts`                                               | Constants cho toàn bộ app |
| **Product**   | `product.types.ts`, `variant.types.ts`                   | Quản lý sản phẩm          |
| **Order**     | `order.types.ts`                                         | Quản lý đơn hàng, hóa đơn |
| **Cart**      | `cart.types.ts`                                          | Giỏ hàng                  |
| **Payment**   | `payment.types.ts`                                       | Thanh toán                |
| **Voucher**   | `voucher.types.ts`                                       | Mã giảm giá               |
| **Category**  | `category.types.ts`                                      | Danh mục                  |
| **Attribute** | `attribute.types.ts`                                     | Thuộc tính sản phẩm       |
| **Customer**  | `customer.types.ts`                                      | Khách hàng                |
| **Auth**      | `auth.types.ts`                                          | Xác thực                  |
| **Common**    | `address.types.ts`, `user.types.ts`, `response.types.ts` | Types dùng chung          |

**Tất cả types đều đồng bộ 100% với backend API!** 🎯
