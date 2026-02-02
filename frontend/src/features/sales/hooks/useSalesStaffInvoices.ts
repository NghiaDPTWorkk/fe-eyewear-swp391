import { useState, useCallback } from 'react'
import { httpClient } from '@/api/apiClients'
import type { Invoice } from '../types'

export const useSalesStaffInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchInvoices = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await httpClient.get<any>('/admin/invoices/deposited')
      const rawData = response.data?.data || response.data || []

      const mappedInvoices = (Array.isArray(rawData) ? rawData : []).map((inv: any) => {
        const total = inv.orders?.length || 0
        const approved =
          inv.orders?.filter((o: any) => o.status === 'APPROVED' || o.status === 'COMPLETED')
            .length || 0
        return {
          ...inv,
          totalOrdersCount: total,
          approvedOrdersCount: approved
        }
      })

      setInvoices(mappedInvoices)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch invoices')
    } finally {
      setLoading(false)
    }
  }, [])

  return { invoices, loading, error, fetchInvoices }
}
