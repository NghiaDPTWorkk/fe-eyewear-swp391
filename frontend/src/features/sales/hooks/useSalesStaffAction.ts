import { useState, useCallback } from 'react'
import { httpClient } from '@/api/apiClients'
import { toast } from 'react-hot-toast'

export const useSalesStaffAction = () => {
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const approveInvoice = useCallback(async (id: string) => {
    setProcessing(true)
    setError(null)
    try {
      await httpClient.patch(`/admin/invoices/${id}/status/approve`)
      toast.success('Invoice approved successfully')
      return true
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Approval failed'
      setError(msg)
      toast.error(msg)
      return false
    } finally {
      setProcessing(false)
    }
  }, [])

  const rejectInvoice = useCallback(async (id: string) => {
    setProcessing(true)
    setError(null)
    try {
      await httpClient.patch(`/admin/invoices/${id}/status/reject`)
      toast.success('Invoice rejected successfully')
      return true
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Rejection failed'
      setError(msg)
      toast.error(msg)
      return false
    } finally {
      setProcessing(false)
    }
  }, [])

  const approveOrder = useCallback(async (id: string) => {
    setProcessing(true)
    setError(null)
    try {
      await httpClient.patch(`/admin/orders/${id}/status/approve`)
      toast.success('Order verified successfully')
      return true
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Verification failed'
      setError(msg)
      toast.error(msg)
      return false
    } finally {
      setProcessing(false)
    }
  }, [])

  const rejectOrder = useCallback(async (id: string) => {
    setProcessing(true)
    setError(null)
    try {
      await httpClient.patch(`/admin/orders/${id}/status/reject`)
      toast.success('Order rejected successfully')
      return true
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Rejection failed'
      setError(msg)
      toast.error(msg)
      return false
    } finally {
      setProcessing(false)
    }
  }, [])

  const validateInvoiceApproval = useCallback(async (orderIds: string[]) => {
    if (!orderIds || orderIds.length === 0) return false
    try {
      const orderResponses = await Promise.all(
        orderIds.map((id) => httpClient.get(`/admin/orders/${id}`))
      )
      return orderResponses.every((res: any) => {
        const order = res.data?.data?.order || res.data?.data
        return (
          order?.status === 'APPROVED' ||
          order?.status === 'VERIFIED' ||
          order?.status === 'COMPLETED'
        )
      })
    } catch (error) {
      console.error('Error validating orders:', error)
      return false
    }
  }, [])

  return {
    approveInvoice,
    rejectInvoice,
    approveOrder,
    rejectOrder,
    validateInvoiceApproval,
    processing,
    error
  }
}
