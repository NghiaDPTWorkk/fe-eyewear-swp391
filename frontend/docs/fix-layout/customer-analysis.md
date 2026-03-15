# Phân tích Chi tiết: Role Customer (Khách hàng)

## 1. Vấn đề thực tế (Concrete Problems)

Dựa trên file `src/pages/customer/ProductDetailPage.tsx`:

- **Helper logic "lạc trôi"**: Logic xử lý hình ảnh (dòng 39-55) để gộp `imageUrl`, `defaultVariantImage`, và `imgs` thành một mảng duy nhất là logic thuần túy dữ liệu (Data Transformation).
  - _Vấn đề_: Logic này nên nằm ở tầng `Services` hoặc `Utils`. Nếu trang "Quick View" (xem nhanh sản phẩm) cũng cần mảng ảnh này, bạn lại phải copy-paste code.
- **Sự nhầm lẫn giữa Layout và Feature**: File đang import từ `components/layout/customer/product-detail`.
  - _Vấn đề_: Thư mục `layout` thường chỉ nên chứa khung (Header/Footer/Sidebar). Các thành phần như `ImageGallery` hay `ProductInfo` là logic nghiệp vụ của Sản phẩm, chúng nên nằm ở `features/customer/product-detail`.

## 2. Hệ quả

- **Khó đồng bộ**: Nếu API thay đổi cấu trúc mảng ảnh, bạn phải đi tìm tất cả các file có đoạn code transform này để sửa.
- **Cấu trúc hỗn loạn**: Ranh giới giữa cái gì là "Layout" cái gì là "Nghiệp vụ" đang bị mờ nhạt.

## 3. Giải pháp chi tiết & Hướng làm (Roadmap)

### Bước 1: Tập trung hóa Logic xử lý dữ liệu (Data Mapping)

- Tạo một helper function trong `shared/utils` hoặc trong chính `features/customer/services`: `formatProductImages(productData)`.

### Bước 2: Tái cấu trúc thư mục Feature

- Chuyển `src/components/layout/customer/product-detail/*` sang `src/features/customer/product-detail/components/`.
- Giữ `src/components/layout` chỉ dành cho những thứ Global (Header chung, Footer chung).

### Bước 3: Sử dụng Custom Hook cho Chi tiết sản phẩm

- Page chỉ việc lấy `id`, truyền vào hook và nhận về `product` đã được format sẵn dữ liệu (bao gồm cả mảng ảnh đã chuẩn hóa).

## 4. Minh họa Logic sạch

```tsx
// Thay vì 15 dòng xử lý ảnh trong Page
const { product, images } = useProductDetail(id)

return (
  <main>
    <ImageGallery images={images} />
    <ProductInfo product={product} />
  </main>
)
```
