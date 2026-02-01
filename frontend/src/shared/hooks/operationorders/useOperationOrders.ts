import { useState, useCallback } from 'react'
import { orderService } from '@/shared/services/orders/orderService'
import type { OrdersResponse } from '@/shared/types/operationOrder.types'

export const useOrder = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const getAllOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await orderService.getAllOrdersByUserId()

      return (response as OrdersResponse).data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Có lỗi xảy ra'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const createOrder = useCallback(async (orderData: any) => {
    setLoading(true)
    setError(null)
    try {
      const response = await orderService.createOrder(orderData)
      return (response as OrdersResponse).data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Có lỗi xảy ra'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    getAllOrders,
    createOrder
  }
}
