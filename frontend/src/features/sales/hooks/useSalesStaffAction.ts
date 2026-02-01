import { useState } from 'react'
import type { LensParameter } from '../types'
import { salesStaffService } from '../services/sales-staff.service'

export const useSalesStaffAction = () => {
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const verifyOrder = async (orderId: string | number, lensParameter: LensParameter) => {
    setProcessing(true)
    setError(null)
    try {
      await salesStaffService.verifyOrder(orderId, lensParameter)
      return true
    } catch (err: any) {
      setError(err.message || 'Verification failed')
      return false
    } finally {
      setProcessing(false)
    }
  }

  const rejectOrder = async (invoiceId: string | number) => {
    setProcessing(true)
    setError(null)
    try {
      await salesStaffService.rejectInvoice(invoiceId)
      return true
    } catch (err: any) {
      setError(err.message || 'Rejection failed')
      return false
    } finally {
      setProcessing(false)
    }
  }

  return {
    verifyOrder,
    rejectOrder,
    processing,
    error
  }
}
