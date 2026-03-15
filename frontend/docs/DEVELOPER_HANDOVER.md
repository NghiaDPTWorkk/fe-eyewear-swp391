# HỒ SƠ BÀN GIAO KỸ THUẬT - DỰ ÁN EYEWEAR E-COMMERCE

---

## MỤC LỤC

1. [Tổng Quan Dự Án](#1-tổng-quan-dự-án)
2. [Kiến Trúc Hệ Thống](#2-kiến-trúc-hệ-thống)
3. [Cấu Trúc Thư Mục Chi Tiết](#3-cấu-trúc-thư-mục-chi-tiết)
4. [Công Nghệ & Thư Viện Sử Dụng](#4-công-nghệ--thư-viện-sử-dụng)
5. [Hướng Dẫn Phát Triển Dành Cho Lập Trình Viên](#5-hướng-dẫn-phát-triển-dành-cho-lập-trình-viên)
6. [Hướng Dẫn Tích Hợp API](#6-hướng-dẫn-tích-hợp-api)
7. [Quản Lý Trạng Thái Ứng Dụng](#7-quản-lý-trạng-thái-ứng-dụng)
8. [Hệ Thống Thành Phần Giao Diện (Component Library)](#8-hệ-thống-thành-phần-giao-diện-component-library)
9. [Tiêu Chuẩn Mã Nguồn (Coding Standards)](#9-tiêu-chuẩn-mã-nguồn-coding-standards)
10. [Hướng Dẫn Kiểm Thử (Testing)](#10-hướng-dẫn-kiểm-thử-testing)
11. [Hướng Dẫn Triển Khai (Deployment)](#11-hướng-dẫn-triển-khai-deployment)
12. [Hợp Tác Với Đội Ngũ Backend](#12-hợp-tác-với-đội-ngũ-backend)

---

## 1. TỔNG QUAN DỰ ÁN

### 1.1 Mô Tả Nghiệp Vụ

Dự án **Eyewear E-commerce** là một nền tảng thương mại điện tử chuyên biệt cho ngành kính mắt, bao gồm các nghiệp vụ cốt lõi sau:

- **E-commerce**: Giao dịch mua bán sản phẩm gọng kính và phụ kiện.
- **Pre-order**: Đặt hàng trước các sản phẩm sắp ra mắt hoặc đang nhập kho.
- **Gia công kính (Lab)**: Tùy chỉnh tròng kính theo đơn thuốc của khách hàng.
- **Thanh toán**: Tích hợp các cổng thanh toán điện tử (MoMo, VNPay).
- **Quản trị**: Hệ thống Dashboard phân quyền cho nhiều vai trò (Staff, Operations, Manager, Admin).

### 1.2 Các Vai Trò Người Dùng (User Roles)

- **Customer**: Mua hàng, cung cấp đơn thuốc, theo dõi tiến độ đơn hàng.
- **Staff**: Tiếp nhận và xác nhận đơn hàng, hỗ trợ trực tuyến.
- **Operation**: Xử lý gia công tại Lab, kiểm định chất lượng (QC), đóng gói.
- **Manager**: Điều hướng chính sách bán hàng, quản lý đơn giá, theo dõi báo cáo.
- **Admin**: Quản trị hệ thống, danh mục và phân quyền (RBAC).

---

## 2. KIẾN TRÚC HỆ THỐNG

### 2.1 Mô Hình Kiến Trúc

Ứng dụng được xây dựng trên nền tảng React 19, tuân thủ mô hình phân lớp để tách biệt trách nhiệm:

- **UI Layer**: Các trang (Pages) và Module tính năng (Features).
- **Core Layer**: Cấu hình hệ thống, quản lý state (Zustand).
- **Service Layer**: Xử lý logic API thông qua Axios và React Query.
- **Environment**: Giao tiếp trực tiếp với Backend API qua giao thức HTTP.

### 2.2 Quản Lý Trạng Thái (State Management Strategy)

| Loại Trạng Thái  | Công Cụ Sử Dụng | Ví Dụ Điển Hình                              |
| :--------------- | :-------------- | :------------------------------------------- |
| **Server State** | TanStack Query  | Danh sách sản phẩm, đơn hàng, thông tin user |
| **Client State** | Zustand         | Trạng thái đăng nhập, giỏ hàng, tùy chỉnh UI |
| **Form State**   | Formik / Yup    | Form đăng ký, thông tin thanh toán           |
| **URL State**    | React Router    | Bộ lọc tìm kiếm, phân trang                  |

---

## 3. CẤU TRÚC THƯ MỤC CHI TIẾT

```
src/
├── api/          # Cấu hình API Client và quản lý Endpoints
├── lib/          # Cấu hình thư viện bên thứ ba (Axios, React Query)
├── store/        # Quản lý trạng thái toàn cục bằng Zustand
├── shared/       # Tài nguyên dùng chung cấp độ cao
│   ├── components/ui/  # Thư viện component giao diện chuẩn
│   ├── constants/      # Hằng số, mã lỗi, thông báo thành công
│   ├── types/          # Định nghĩa kiểu dữ liệu TypeScript toàn cục
│   └── utils/          # Các hàm xử lý logic tiện ích
├── features/     # Module hóa ứng dụng theo từng tính năng nghiệp vụ
├── routes/       # Hệ thống định tuyến và phân quyền Route Guards
├── pages/        # Các thành phần trang đầu cuối
└── components/   # Thành phần Layout (Header, Footer, Sidebar)
```

---

## 4. CÔNG NGHỆ & THƯ VIỆN SỬ DỤNG

Hệ thống yêu cầu các phiên bản thư viện tối thiểu như sau để đảm bảo tính tương thích:

- **React / React DOM**: v19.2.0
- **React Router**: v7.12.0
- **TanStack Query**: v5.90.16
- **Zustand**: v5.0.10
- **Tailwind CSS**: v4.1.18
- **TypeScript**: v5.9.3

---

## 5. HƯỚNG DẪN PHÁT TRIỂN DÀNH CHO LẬP TRÌNH VIÊN

### 5.1 Thiết Lập Môi Trường (Setup)

1.  Cài đặt dependencies: `npm install`
2.  Thiết lập môi trường: Sao chép `.env.example` thành `.env.local`
3.  Khởi chạy dev server: `npm run dev`

### 5.2 Quy Trình Làm Việc Tiêu Chuẩn

Mỗi task công việc cần tuân thủ quy trình:
**Tạo Branch → Code & Testing nội bộ → Validate (Lint/Type-check) → Commit (Conventional) → Pull Request.**

Lưu ý: Luôn chạy `npm run validate` trước khi thực hiện đẩy code lên hệ thống.

---

## 6. HƯỚNG DẪN TÍCH HỢP API

Hệ thống quản lý endpoint tập trung tại `src/api/endpoints.ts`. Việc tích hợp API mới phải tuân thủ việc tạo **Service** và cung cấp **Hook** tương ứng để đảm bảo tính tái sử dụng và quản lý cache hiệu quả.

---

## 7. TIÊU CHUẨN MÃ NGUỒN (CODING STANDARDS)

### 7.1 Quy Tắc Đặt Tên (Naming Conventions)

- **Thành phần UI (Component)**: PascalCase (ví dụ: `ProductDetails.tsx`)
- **Hooks**: camelCase bắt đầu bằng `use` (ví dụ: `useOrderTracking.ts`)
- **Services/Types/Stores**: camelCase kèm hậu tố định danh (ví dụ: `auth.service.ts`, `user.types.ts`)
- **Hằng số**: SCREAMING_SNAKE_CASE (ví dụ: `MAX_RETRY_ATTEMPTS`)

### 7.2 Thứ Tự Import

1. React và các core hooks.
2. Thư viện bên thứ ba (External libraries).
3. Các module nội bộ sử dụng Alias `@/`.
4. Các tập tin local (Relative imports).

---

## 8. HƯỚNG DẪN KIỂM THỬ (TESTING)

Dự án sử dụng **Vitest** kết hợp với **React Testing Library**. Các tập tin kiểm thử cần đặt cùng thư mục với component/hook tương ứng để dễ dàng theo dõi.

Các lệnh kiểm thử chính:

- `npm run test`: Chạy toàn bộ kiểm thử một lần.
- `npm run test:watch`: Chế độ tự động chạy lại khi code thay đổi.

---

## 9. HƯỚNG DẪN TRIỂN KHAI (DEPLOYMENT)

Quy trình đóng gói sản phẩm cho môi trường Production:

1. Thực hiện lệnh `npm run build`.
2. Kiểm tra thư mục đầu ra `dist/`.
3. Đảm bảo các biến môi trường tại server đã được cấu hình chính xác (API URL, App Name).

---

## 10. HỢP TÁC VỚI ĐỘI NGŨ BACKEND

Mọi giao tiếp dữ liệu cần thống nhất qua hợp đồng dữ liệu (API Contract):

- **Response Format**: Bao gồm `data`, `message`, `success`.
- **Error Format**: Bao gồm `code`, `message` và chi tiết lỗi kiểm soát `details`.

---

_Tài liệu này được biên soạn cho mục đích nội bộ và có thể được cập nhật theo tiến độ dự án._

**Created by: NghiaDPTWork**
