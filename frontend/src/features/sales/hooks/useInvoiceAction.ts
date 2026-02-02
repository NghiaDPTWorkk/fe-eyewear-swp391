import { useState, useCallback } from 'react'
import { httpClient } from '@/api/apiClients'
import { toast } from 'react-hot-toast'

export const useInvoiceAction = () => {
  const [isProcessing, setIsProcessing] = useState(false)

  const approveInvoice = useCallback(async (invoiceId: string) => {
    setIsProcessing(true)
    try {
      await httpClient.patch(`/admin/invoices/${invoiceId}/status/approve`)
      toast.success('Invoice approved successfully')
      return true
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to approve invoice')
      return false
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const rejectInvoice = useCallback(async (invoiceId: string) => {
    setIsProcessing(true)
    try {
      await httpClient.patch(`/admin/invoices/${invoiceId}/status/reject`)
      toast.success('Invoice rejected successfully')
      return true
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reject invoice')
      return false
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const validateInvoiceApproval = useCallback(async (orderIds: string[]) => {
    if (!orderIds || orderIds.length === 0) return false

    try {
      const orderResponses = await Promise.all(
        orderIds.map((id) => httpClient.get(`/admin/orders/${id}`))
      )

      const allOrdersApproved = orderResponses.every((res: any) => {
        const order = res.data?.data?.order || res.data?.data
        return order?.status === 'APPROVED' || order?.status === 'VERIFIED'
      })

      return allOrdersApproved
    } catch (error) {
      console.error('Error validating orders:', error)
      return false
    }
  }, [])

  return {
    approveInvoice,
    rejectInvoice,
    validateInvoiceApproval,
    isProcessing
  }
}
