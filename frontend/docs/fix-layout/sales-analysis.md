# Phân tích Chi tiết: Role Sales (Nhân viên bán hàng)

## 1. Vấn đề thực tế (Concrete Problems)

- **Cấu trúc "Phẳng hóa" (Flat Structure Confusion)**: Dù đã có một số thư mục con trong `src/features/sales/components`, nhưng tổng số lượng component con lên tới **88** (theo thống kê hệ thống). Điều này gây ra "Cognitive Overload" (quá tải nhận thức) cho lập trình viên mới.
- **Sự chồng chéo với Shared**: Một số component như `PageHeader` (dòng 10 trong `ManagerInvoicesPage.tsx`) lại được import từ `features/sales/components/common`.
  - _Vấn đề_: Manager (vai trò khác) đang phụ thuộc vào component của Sales. Nếu Sales thay đổi, Manager sẽ bị lỗi (Tight Coupling).

## 2. Hệ quả

- **Khó bảo trì**: Khi muốn sửa giao diện Order chung cho toàn hệ thống, dev không biết nên tìm ở `shared` hay ở `sales/common`.
- **Rủi ro hồi quy (Regression)**: Sửa code cho Sales làm hỏng giao diện của Manager mà không biết.

## 3. Giải pháp chi tiết & Hướng làm (Roadmap)

### Bước 1: Hợp nhất "Common" về "Shared"

- Di chuyển `src/features/sales/components/common` sang `src/shared/components`.
- Tất cả các role (Manager, Sales, Admin) sẽ dùng chung header, button, table skeleton từ `shared`.

### Bước 2: Phân rã Sales thành Domain-Feature

Thay vì dồn tất cả vào `features/sales`, hãy chia thành:

- `features/sales-dashboard`: Chỉ chứa các biểu đồ và thống kê.
- `features/sales-order-management`: Chỉ chứa logic xử lý đơn hàng.
- `features/sales-customer-service`: Quản lý supporter/khách hàng.

### Bước 3: Áp dụng quy tắc "Public API" (index.ts)

- Mỗi thư mục con phải có file `index.ts` chỉ export những gì cần thiết. Tránh việc các role khác import trực tiếp vào sâu trong folder components của Sales.

## 4. Minh họa Cấu trúc Sau Refactor

```text
src/
  /shared
    /components
      PageHeader.tsx  <-- Manager & Sales dùng chung ở đây
  /features
    /sales-orders
      /components
        OrderList.tsx
        OrderDetail.tsx
      index.ts        <-- Chỉ export { OrderList }
```
