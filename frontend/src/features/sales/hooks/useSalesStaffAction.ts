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
        setError('Failed to approve invoice')
        showError(err)
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
        setError('Failed to reject invoice')
        showError(err)
        return false
      } finally {
        setProcessing(false)
      }
    },
    [invalidateSalesData]
  )

  const approveOrder = useCallback(
    async (id: string, data?: { parameters: Record<string, any>; note?: string }) => {
      setProcessing(true)
      setError(null)
      try {
        let finalData = data

        // Use standard default parameters for approval if none provided or parameters is null
        if (!finalData || !finalData.parameters) {
          finalData = {
            parameters: {
              left: { SPH: 0, CYL: 0, AXIS: 0, ADD: 0 },
              right: { SPH: 0, CYL: 0, AXIS: 0, ADD: 0 },
              PD: 64
            }
          }
        }

        await salesService.approveOrder(id, finalData)
        showSuccess('Order verified successfully')
        invalidateSalesData()
        return true
      } catch (err: unknown) {
        setError('Failed to verify order')
        showError(err)
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

        await salesService.rejectInvoice(invoiceId, note)
        showSuccess('Invoice and all associated orders rejected')
        invalidateSalesData()
        return true
      } catch (err: unknown) {
        setError('Failed to reject order')
        showError(err)
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
