import { httpClient } from '@/api/apiClients'
import { ENDPOINTS } from '@/api/endpoints'
import type { OrdersResponse } from '@/shared/types/operationOrder.types'
import type { AdminInvoiceDetailResponse } from '@/shared/types/admin-invoice.types'

export const orderService = {
  /**
   * Lấy danh sách orders với pagination và filter
   * @param page - Số trang (default: 1)
   * @param limit - Số lượng items mỗi trang (default: 10)
   * @param status - Filter theo status (optional)
   * @param type - Filter theo type (optional)
   */
  getOrders: async (page: number, limit: number, status?: string, type?: string) => {
    return httpClient.get<OrdersResponse>(
      ENDPOINTS.ORDERS.LIST_WITH_PARAMS(page, limit, status, type)
    )
  },

  /**
   * Lấy chi tiết một order
   * @param id - Order ID
   */
  getOrderById: async (id: string) => {
    return httpClient.get(ENDPOINTS.ORDERS.DETAIL(id))
  },

  /**
   * Tìm kiếm orders theo orderCode
   * @param orderCode - Mã đơn hàng cần tìm (e.g. "OD_55")
   */
  searchByOrderCode: async (orderCode: string) => {
    return httpClient.get<OrdersResponse>(ENDPOINTS.ORDERS.SEARCH_BY_CODE(orderCode))
  },

  /**
   * Lấy chi tiết invoice theo invoiceId
   * @param invoiceId - Invoice ID lấy từ order.invoiceId
   */
  getInvoiceById: async (invoiceId: string) => {
    return httpClient.get<AdminInvoiceDetailResponse>(ENDPOINTS.ADMIN.INVOICE_DETAIL(invoiceId))
  },

  /**
   * Cập nhật thông tin order (status, ...)
   * @param id - Order ID
   * @param data - Dữ liệu cần update
   */
  updateOrder: async (id: string, data: any) => {
    return httpClient.put(ENDPOINTS.ORDERS.UPDATE(id), data)
  },

  /**
   * Cập nhật trạng thái order sang MAKING
   * @param id - Order ID
   */
  updateStatusToMaking: async (id: string) => {
    return httpClient.patch(ENDPOINTS.ORDERS.UPDATE_STATUS_MAKING(id), {})
  },

  /**
   * Cập nhật trạng thái order sang PACKAGING
   * @param id - Order ID
   */
  updateStatusToPackaging: async (id: string) => {
    return httpClient.patch(ENDPOINTS.ORDERS.UPDATE_STATUS_PACKAGING(id), {})
  },

  /**
   * Cập nhật trạng thái order sang COMPLETED
   * @param id - Order ID
   */
  updateStatusToCompleted: async (id: string) => {
    return httpClient.patch(ENDPOINTS.ORDERS.UPDATE_STATUS_COMPLETED(id), {})
  },

  /**
   * Approve order với các thông số prescription
   * @param id - Order ID
   * @param data - Dữ liệu parameters (left, right, PD)
   */
  approveOrder: async (id: string, data: { parameters: any }) => {
    return httpClient.patch(ENDPOINTS.ADMIN.ORDER_APPROVE(id), data)
  }
}
