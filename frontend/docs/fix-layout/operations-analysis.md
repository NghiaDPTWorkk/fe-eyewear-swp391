# Phân tích Chi tiết: Role Operations (Vận hành)

## 1. Vấn đề thực tế (Concrete Problems)

Dựa trên file `src/pages/operations/OperationOrderPackingProcess.tsx`:

- **Business Logic bị "Hardcoded"**: Danh sách `checklistItems` (dòng 35-70) và logic kiểm tra SKU (`startsWith('FRAME')`, `startsWith('LENS')`) nằm trực tiếp trong Page component.
  - _Vấn đề_: Nếu ngày mai quy trình đóng gói cho "Kính áp tròng" khác đi, bạn phải vào Page này sửa code. Đây là vi phạm nguyên tắc "Open/Closed Principle".
- **Sự không nhất quán (Inconsistency)**: Page nằm trong folder `operations` nhưng lại sử dụng hook từ `features/staff/hooks/useOrders` (dòng 14).
  - _Vấn đề_: Tên gọi `staff` quá chung chung, không phản ánh đúng vai trò `operations`.

## 2. Hệ quả

- **Dễ sai sót**: Logic kiểm tra SKU quan trọng bị trộn lẫn với mã hiển thị (UI code).
- **Khó mở rộng**: Muốn thêm một bước kiểm tra mới (VD: Chụp ảnh đơn hàng) sẽ làm Page phình to hơn nữa.

## 3. Giải pháp chi tiết & Hướng làm (Roadmap)

### Bước 1: Chuẩn hóa tên Feature

- Đổi tên `features/staff` thành `features/operations` (hoặc tạo mới) để đúng với domain nghiệp vụ.

### Bước 2: Đẩy logic vào Domain Hook

- Tạo `usePackingProcess(orderId)` hook. Hook này sẽ trả về:
  - `items`: Danh sách checklist đã được tính toán dựa trên sản phẩm.
  - `canFinish`: Trạng thái có thể hoàn thành hay chưa.
  - `handleCheck`: Hàm xử lý check/uncheck.

### Bước 3: Tách UI thành các "Smart Components"

- Di chuyển phần render Checklist (dòng 168-179) vào feature: `features/operations/packing/components/PackingChecklist.tsx`.

## 4. Minh họa So sánh

- **Trước**: Page tự biết SKU nào là FRAME, SKU nào là LENS.
- **Sau**: Page chỉ hỏi Hook: "Tôi cần hiển thị những bước kiểm tra nào cho đơn hàng này?".
