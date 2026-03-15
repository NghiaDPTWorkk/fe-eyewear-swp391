# TÀI LIỆU HỆ THỐNG TYPES (TYPESCRIPT) - DỰ ÁN EYEWEAR

**Mô tả chi tiết về cấu trúc dữ liệu và mô hình hóa trong hệ thống Frontend**

_Người thực hiện: NghiaDPTWork_

---

## MỤC LỤC

1. [Tổng Quan](#1-tổng-quan)
2. [Hệ Thống Enums](#2-hệ-thống-enums)
3. [Mô Hình Sản Phẩm (Product Types)](#3-mô-hình-sản-phẩm-product-types)
4. [Mô Hình Đơn Hàng & Hóa Đơn (Order & Invoice Types)](#4-mô-hình-đơn-hàng--hóa-đơn-order--invoice-types)
5. [Quản Lý Giỏ Hàng (Cart Types)](#5-quản-lý-giỏ-hàng-cart-types)
6. [Thanh Toán & Mã Giảm Giá (Payment & Voucher Types)](#6-thanh-toán--mã-giảm-giá-payment--voucher-types)
7. [Quản Lý Phân Loại (Category & Attribute Types)](#7-quản-lý-phân-loại-category--attribute-types)
8. [Người Dùng & Xác Thực (Customer, User & Auth Types)](#8-người-dùng--xác-thực-customer-user--auth-types)
9. [Cấu Trúc Phản Hồi API (Response Types)](#9-cấu-trúc-phản-hồi-api-response-types)

---

## 1. TỔNG QUAN

Tất cả các định nghĩa kiểu dữ liệu (Types/Interfaces) được tập trung tại thư mục `src/shared/types/` và được quản lý tập trung qua tập tin `index.ts`. Hệ thống Types này được thiết kế để đồng bộ hoàn toàn với cấu trúc dữ liệu từ Backend API, đảm bảo tính an toàn (Type Safety) trong toàn bô dự án.

**Phương thức sử dụng chuẩn:**

```typescript
import type { Product, Order, User } from '@/shared/types'
```

---

## 2. HỆ THỐNG ENUMS

Được định nghĩa tại `enums.ts`, dùng để chuẩn hóa các giá trị trạng thái và loại hình trong dự án.

### 2.1 Các Enums Quan Trọng:

- **OrderType**: `NORMAL` (Sản phẩm có sẵn), `PRE_ORDER` (Đặt trước), `MANUFACTURING` (Gia công theo đơn).
- **OrderStatus**: Các trạng thái từ `PENDING`, `APPROVED`, `MAKING` đến `COMPLETED` và `CANCEL`.
- **ProductType**: `FRAME` (Gọng kính), `LENS` (Tròng kính), `SUNGLASS` (Kính râm).
- **PaymentMethodType**: `COD`, `MOMO`, `VNPAY`, `ZALOPAY`.

---

## 3. MÔ HÌNH SẢN PHẨM (PRODUCT TYPES)

Hệ thống sử dụng kỹ thuật **Discriminated Unions** để quản lý các loại sản phẩm khác nhau (Gọng, Tròng, Kính râm) thông qua một interface chung nhưng có đặc tính (spec) riêng biệt.

- **BaseProduct**: Chứa các thông tin cơ bản (ID, SKU, Slug, Brand, Variants).
- **FrameSpec**: Cấu trúc đặc thù cho gọng kính (Material, Shape, Dimensions).
- **LenSpec**: Cấu trúc đặc thù cho tròng kính (Feature, Origin).

---

## 4. MÔ HÌNH ĐƠN HÀNG & HÓA ĐƠN (ORDER & INVOICE TYPES)

Nghiệp vụ đặc thù của dự án yêu cầu quản lý thông số tròng kính chi tiết:

- **LensParameters**: Lưu trữ các thông số thị lực (SPH, CYL, AXIS, PD) cho mắt trái và phải.
- **OrderProduct**: Kết hợp linh hoạt giữa gọng kính và tròng kính trong cùng một đơn vị sản phẩm.
- **Invoice**: Thực thể cấp cao quản lý nhiều đơn hàng (Orders), thông tin thanh toán, mã giảm giá và địa chỉ giao hàng.

---

## 5. QUẢN LÝ GIỎ HÀNG (CART TYPES)

Cấu trúc giỏ hàng đơn giản nhưng hiệu quả để đồng bộ với LocalStorage và Backend:

- **CartItem**: Lưu trữ định danh sản phẩm (SKU) và số lượng.
- **Cart**: Đại diện cho toàn bộ giỏ hàng của một người dùng cụ thể.

---

## 6. QUẢN LÝ NGƯỜI DÙNG & XÁC THỰC

Đảm bảo an toàn thông tin và phân quyền chính xác:

- **Customer**: Thông tin chi tiết khách hàng bao gồm danh sách địa chỉ và tài khoản liên kết (Google/Facebook).
- **User**: Phiên bản thu gọn cho các tác vụ quản lý hoặc phân quyền nhanh (Role-based).
- **AuthResponse**: Cấu trúc dữ liệu nhận về sau khi xác thực thành công (Token và User Info).

---

## 7. CẤU TRÚC PHẢN HỒI API (RESPONSE TYPES)

Mọi phản hồi từ hệ thống Backend đều được bao bọc bởi một wrapper chuẩn:

```typescript
interface ApiResponse<T> {
  success: boolean // Trạng thái xử lý thành công hay thất bại
  data?: T // Dữ liệu chính (Generic)
  message?: string // Thông điệp phản hồi
  error?: string // Mã lỗi hoặc chi tiết lỗi nếu có
}
```

---

## 8. CÁC QUY TẮC SỬ DỤNG TỐT NHẤT (BEST PRACTICES)

1.  **Sử dụng `import type`**: Luôn ưu tiên `import type` thay vì `import` thông thường khi chỉ lấy kiểu dữ liệu để tối ưu hóa quá trình Build.
2.  **Khác thác Discriminated Unions**: Luôn kiểm tra trường `type` trước khi truy cập vào `spec` của sản phẩm để có Type Hint chính xác.
3.  **Hạn chế Partial**: Chỉ sử dụng `Partial<T>` khi thực sự cần xử lý cập nhật một phần dữ liệu (Update Request).

---

_Tài liệu này phản ánh cấu trúc dữ liệu tính đến phiên bản hiện tại và sẽ được bổ sung khi có sự thay đổi từ phía Backend._

**Created by: NghiaDPTWork**
