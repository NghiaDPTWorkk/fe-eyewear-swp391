# Phân tích Chi tiết: Role Manager (Quản lý)

## 1. Vấn đề thực tế (Concrete Problems)

Dựa trên file `src/pages/manager/ManagerInvoicesPage.tsx`:

- **Page quá "nặng" (Fat Page)**: File dài 485 dòng. Nó vừa quản lý State lọc (`statusFilter`, `orderTypeFilter`), vừa xử lý Logic tính toán Metric (dòng 72-141), vừa render UI Table.
- **Vi phạm nguyên tắc Feature Layer**: Component `ManagerOrderDrawer` được đặt tại `src/pages/manager/components/invoices`.
  - _Vấn đề_: Theo kiến trúc chuẩn, `pages` không nên chứa thư mục `components` riêng lẻ. Nếu một Page khác (VD: `ManagerDashboardPage`) muốn dùng cái Drawer này, họ sẽ không tìm thấy hoặc phải import cheo le.
- **Logic tính toán nằm sai chỗ**: Hàm `useMemo` tính `metrics` (dòng 72) là logic nghiệp vụ (Business Logic). Nó nên nằm trong một `useManagerMetrics` hook bên trong folder `features`.

## 2. Hệ quả

- **Khó Unit Test**: Không thể test logic tính toán metrics mà không render toàn bộ Page lớn.
- **Khó tái sử dụng**: Khi làm App Mobile hoặc Dashboard mới, bạn phải copy-paste lại 100 dòng code tính toán metrics này.

## 3. Giải pháp chi tiết & Hướng làm (Roadmap)

### Bước 1: Khai tử thư mục components trong Pages

- Di chuyển `src/pages/manager/components/invoices/*` sang `src/features/manager/invoices/components/`.

### Bước 2: Tách biệt Logic nghiệp vụ (Extract Hooks)

- Tạo `src/features/manager/invoices/hooks/useInvoiceMetrics.ts` để chứa logic tính toán từ dòng 72-141.
- Page chỉ việc gọi: `const { metrics } = useInvoiceMetrics(invoiceList);`

### Bước 3: Component hóa Table

- Tách phần render table (dòng 314-427) thành một component riêng `InvoiceTable` trong feature.

## 4. Minh họa Code Sau Refactor (Page)

```tsx
// ManagerInvoicesPage.tsx sẽ chỉ còn khoảng 50 dòng
export default function ManagerInvoicesPage() {
  const { data, metrics } = useManagerInvoices() // Logic ẩn trong feature hook

  return (
    <Container>
      <PageHeader title="Order Management" />
      <InvoiceMetricsCards data={metrics} />
      <InvoiceTable data={data} />
    </Container>
  )
}
```
