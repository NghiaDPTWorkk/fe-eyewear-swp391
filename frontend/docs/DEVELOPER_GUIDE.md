# HƯỚNG DẪN PHÁT TRIỂN DỰ ÁN EYEWEAR

**Tài liệu hướng dẫn chi tiết dành cho đội ngũ Phát triển Frontend**

_Người thực hiện: NghiaDPTWork_

---

## 1. CẤU TRÚC THƯ MỤC DỰ ÁN

Cấu trúc thư mục được thiết kế theo hướng module hóa nhằm đảm bảo tính mở rộng và dễ bảo trì:

```
src/
├── api/                      # Lớp API (Clients, Endpoints)
├── lib/                      # Cấu hình cốt lõi (Axios, React Query)
├── store/                    # Quản lý trạng thái toàn cục (Zustand)
├── context/                  # Context API toàn cục
├── shared/                   # Tài nguyên dùng chung
│   ├── components/ui/        # UI Components cơ bản
│   ├── constants/            # Hằng số hệ thống
│   ├── types/                # Kiểu dữ liệu dùng chung
│   ├── hooks/                # Custom hooks toàn cục
│   └── utils/                # Các hàm tiện ích
├── features/                 # Các module tính năng (Domain-driven)
│   └── [feature]/            # Cấu trúc nội bộ của từng tính năng
├── routes/                   # Cấu hình định tuyến và Bảo mật
├── pages/                    # Các trang của ứng dụng
└── components/               # Các component Layout hoặc dùng chung quy mô lớn
```

---

## 2. QUY TRÌNH XỬ LÝ DỮ LIỆU

Luồng xử lý dữ liệu chuẩn trong ứng dụng tuân thủ mô hình phân lớp như sau:

**Action người dùng → Router → Page → Feature Component → Hook → Service → API Client → Backend**

Dữ liệu phản hồi sẽ được quản lý qua **React Query Cache** trước khi cập nhật lên giao diện người dùng (UI).

---

## 3. QUẢN LÝ API

Hệ thống sử dụng hai client chính cho các mục đích khác nhau:

| Tên Client   | Base URL | Mục đích sử dụng                                    |
| :----------- | :------- | :-------------------------------------------------- |
| `authClient` | `/auth`  | Xử lý các nghiệp vụ liên quan đến xác thực          |
| `mainClient` | `/api`   | Truy xuất dữ liệu nghiệp vụ (sản phẩm, đơn hàng...) |

Ví dụ sử dụng:

```typescript
import { mainClient, ENDPOINTS } from '@/api'

const fetchData = async () => {
  const response = await mainClient.get(ENDPOINTS.PRODUCTS.LIST)
  return response.data
}
```

---

## 4. QUẢN LÝ ĐỊNH TUYẾN (ROUTE GUARDS)

Sử dụng các lớp bảo mật để kiểm soát quyền truy cập:

| Guard        | Mô tả                                  | Chuyển hướng khi không thỏa mãn |
| :----------- | :------------------------------------- | :------------------------------ |
| `AuthGuard`  | Yêu cầu phải đăng nhập                 | → `/login`                      |
| `GuestGuard` | Chỉ dành cho người dùng chưa đăng nhập | → `/`                           |

---

## 5. HỆ THỐNG THƯ VIỆN UI

Các thành phần giao diện cơ bản được tập trung tại `@/shared/components/ui`. Việc sử dụng thống nhất các component này giúp đảm bảo tính đồng bộ về thiết kế.

### Các thành phần chính:

- **Cơ bản**: Button, Input, Card, Modal, Checkbox...
- **Trạng thái**: LoadingOverlay, Spinner, Skeleton, Badge...
- **Thông báo**: ConfirmationModal, Toast...

---

## 6. QUY TRÌNH TRIỂN KHAI TÍNH NĂNG MỚI (CHECKLIST)

Để triển khai một tính năng mới một cách chuẩn xác, lập trình viên cần thực hiện theo các bước:

1.  **Định nghĩa Types**: Thiết lập cấu trúc dữ liệu tại `features/[name]/types/`.
2.  **Cấu hình Endpoints**: Đăng ký URL API mới tại `api/endpoints.ts`.
3.  **Xây dựng Service**: Cài đặt các hàm gọi API tại `features/[name]/services/`.
4.  **Thiết lập Hook**: Sử dụng React Query để quản lý state và cache tại `features/[name]/hooks/`.
5.  **Xây dựng Component**: Phát triển UI cụ thể cho tính năng tại `features/[name]/components/`.
6.  **Tạo Trang (Page)**: Lắp ghép các component tại thư mục `pages/`.
7.  **Đăng ký Route**: Thiết lập đường dẫn tại `routes/index.tsx`.
8.  **Cấu hình Barrel Export**: Export các thành phần cần thiết tại `features/[name]/index.ts`.

---

## 7. CÁC QUY TẮC PHÁT TRIỂN (CODING CONVENTIONS)

Nhằm đảm bảo chất lượng mã nguồn, tuyệt đối tuân thủ các quy tắc sau:

- **Tuyệt đối không hardcode**: Mọi URL phải thông qua `ENDPOINTS`, mọi thông báo phải sử dụng `CONSTANTS`.
- **Tách biệt logic**: Không gọi API trực tiếp trong component; phải sử dụng thông qua Service và Hook.
- **Tối ưu hóa Import**: Chỉ import những thành phần thực sự cần thiết, sử dụng Path Aliases (`@/`) để đường dẫn ngắn gọn.
- **Quản lý Console**: Không sử dụng `console.log` trong môi trường sản xuất; chỉ sử dụng `warn` hoặc `error` khi thực sự cần thiết.

---

## 8. QUY TRÌNH COMMIT MÃ NGUỒN (GIT CONVENTIONS)

Yêu cầu sử dụng chuẩn Conventional Commits kết hợp với mã ticket JIRA:

**Cấu trúc: <JIRA-ID> <loại>: <nội dung>**

**Các loại commit phổ biến:**

- `feat`: Tính năng mới.
- `fix`: Sửa lỗi.
- `docs`: Cập nhật tài liệu.
- `refactor`: Tái cấu trúc mã nguồn.
- `style`: Định dạng mã nguồn (không thay đổi logic).
- `chore`: Bảo trì định kỳ.

Ví dụ: `git commit -m "KAN-123 feat: tích hợp trang danh sách sản phẩm"`

---

## 9. TÀI LIỆU THAM CHIẾU

- [Hồ sơ bàn giao kỹ thuật](./DEVELOPER_HANDOVER.md)
- [Tài liệu hệ thống Types](./TYPES_DOCUMENTATION.md)
- [Hệ thống bảng màu chuẩn](./COLOR_TEMPLET.md)

---

_Created by: NghiaDPTWork_
