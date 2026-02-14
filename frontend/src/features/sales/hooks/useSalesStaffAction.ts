import { useCallback, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { salesService } from '../services/salesService'
import { showError, showSuccess } from '../utils/errorHandler'

export const useSalesStaffAction = () => {
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const invalidateSalesData = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['sales'] })
  }, [queryClient])

  const approveInvoice = useCallback(
    async (id: string) => {
      setProcessing(true)
      setError(null)
      try {
        await salesService.approveInvoice(id)
        showSuccess('Invoice approved successfully')
        invalidateSalesData()
        return true
      } catch (err: unknown) {
        const msg = 'Failed to approve invoice'
        setError(msg)
        showError(err, msg)
        return false
      } finally {
        setProcessing(false)
      }
    },
    [invalidateSalesData]
  )

  const rejectInvoice = useCallback(
    async (id: string, note?: string) => {
      setProcessing(true)
      setError(null)
      try {
        await salesService.rejectInvoice(id, note)
        showSuccess('Invoice rejected successfully')
        invalidateSalesData()
        return true
      } catch (err: unknown) {
        const msg = 'Failed to reject invoice'
        setError(msg)
        showError(err, msg)
        return false
      } finally {
        setProcessing(false)
      }
    },
    [invalidateSalesData]
  )

  const approveOrder = useCallback(
    async (id: string, data?: { parameters: any }) => {
      setProcessing(true)
      setError(null)
      try {
        let finalData = data

        // If no data provided (e.g. from quick approve in drawer), fetch existing parameters
        if (!finalData) {
          try {
            const response = await salesService.getOrderById(id)
            const order = response.data.order
            const productWithLens = order.products?.find((p) => p.lens?.parameters)
            const existingParams = productWithLens?.lens?.parameters

            finalData = {
              parameters: existingParams || {
                left: { SPH: 0, CYL: 0, AXIS: 0, ADD: 0 },
                right: { SPH: 0, CYL: 0, AXIS: 0, ADD: 0 },
                PD: 64
              }
            }
          } catch (fetchErr) {
            console.error('Failed to fetch order details for quick approve:', fetchErr)
            // Fallback to default parameters if fetch fails
            finalData = {
              parameters: {
                left: { SPH: 0, CYL: 0, AXIS: 0, ADD: 0 },
                right: { SPH: 0, CYL: 0, AXIS: 0, ADD: 0 },
                PD: 64
              }
            }
          }
        }

        await salesService.approveOrder(id, finalData)
        showSuccess('Order verified successfully')
        invalidateSalesData()
        return true
      } catch (err: unknown) {
        const msg = 'Failed to verify order'
        setError(msg)
        showError(err, msg)
        return false
      } finally {
        setProcessing(false)
      }
    },
    [invalidateSalesData]
  )

  const rejectOrder = useCallback(
    async (_id: string, invoiceId?: string, note?: string) => {
      setProcessing(true)
      setError(null)
      try {
        if (!invoiceId) {
          throw new Error('Associated invoice ID not found')
        }

        // Rejecting any order in the invoice triggers rejection of the entire invoice
        await salesService.rejectInvoice(invoiceId, note)

        showSuccess('Invoice and all associated orders rejected')
        invalidateSalesData()
        return true
      } catch (err: unknown) {
        const msg = 'Failed to reject order'
        setError(msg)
        showError(err, msg)
        return false
      } finally {
        setProcessing(false)
      }
    },
    [invalidateSalesData]
  )

  return {
    approveInvoice,
    rejectInvoice,
    approveOrder,
    rejectOrder,
    processing,
    error
  }
}
