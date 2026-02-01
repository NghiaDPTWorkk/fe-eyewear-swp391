import { useState, useCallback } from 'react'
import type { Invoice } from '../types'
import { salesStaffService } from '../services/sales-staff.service'

/**
 * Hook for managing Sales Staff invoices
 */
export const useSalesStaffInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchInvoices = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await salesStaffService.getInvoices()
      const deposited = data.filter((inv: Invoice) => inv.status === 'DEPOSITED')
      setInvoices(deposited)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch invoices')
    } finally {
      setLoading(false)
    }
  }, [])

  return { invoices, loading, error, fetchInvoices }
}
