// Invoice Status Enum
export enum InvoiceStatus {
  PENDING = 'PENDING', // Chờ đặt cọc
  DEPOSITED = 'DEPOSITED', // Đã đặt cọc
  APPROVED = 'APPROVED', // Đã duyệt bởi sale
  ONBOARD = 'ONBOARD', // Manager đang quản lý
  COMPLETED = 'COMPLETED', // Hoàn thành (tất cả orders đã COMPLETE)
  READY_TO_SHIP = 'READY_TO_SHIP', // Chờ đơn vị vận chuyển tới lấy hàng
  DELIVERING = 'DELIVERING', // Đang giao hàng
  DELIVERED = 'DELIVERED', // Đã giao hàng
  REJECTED = 'REJECTED', // Bị từ chối
  CANCELED = 'CANCELED' // Đã hủy
}
