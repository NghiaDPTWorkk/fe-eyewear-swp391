import { useState } from 'react'
import { invoiceService } from '../services/invoiceService'

export const useInvoiceActions = () => {
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const approveInvoice = async (id: string) => {
    setProcessing(true)
    setError(null)
    try {
      await invoiceService.approveInvoice(id)
      return true
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Approval failed')
      return false
    } finally {
      setProcessing(false)
    }
  }

  const rejectInvoice = async (id: string) => {
    setProcessing(true)
    setError(null)
    try {
      await invoiceService.rejectInvoice(id)
      return true
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Rejection failed')
      return false
    } finally {
      setProcessing(false)
    }
  }

  return { approveInvoice, rejectInvoice, processing, error }
}
