import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  IoAdd,
  IoClipboardOutline,
  IoFlagOutline,
  IoTicketOutline,
  IoWalletOutline
} from 'react-icons/io5'

import { PageHeader, SalesMetricCard } from '@/features/sales/components/common'
import { Charts } from '@/features/sales/components/dashboard/Charts'
import { InvoiceOrdersDrawer } from '@/features/sales/components/dashboard/InvoiceOrdersDrawer'
import { Table } from '@/features/sales/components/dashboard/Table'
import { useDashboard, useSalesStaffInvoices, useOrderTypeStats } from '@/features/sales/hooks'

import { Card } from '@/shared/components/ui-core'

import type { Invoice } from '@/features/sales/types'

export default function SaleStaffDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const { invoices: pendingInvoices, loading, fetchInvoices } = useSalesStaffInvoices(1, 8, 'all')

  const { stats: orderStats } = useOrderTypeStats()

  const { selectedOrderId, isDrawerOpen, openDrawer, closeDrawer } = useDashboard()

  useEffect(() => {
    const invoiceId = searchParams.get('invoiceId')

    if (invoiceId && !isDrawerOpen && pendingInvoices.length > 0 && selectedOrderId !== invoiceId) {
      openDrawer(invoiceId)
    }
  }, [searchParams, pendingInvoices, isDrawerOpen, openDrawer, selectedOrderId])

  const handleCloseDrawer = () => {
    closeDrawer()

    if (searchParams.has('invoiceId')) {
      const newParams = new URLSearchParams(searchParams)
      newParams.delete('invoiceId')
      setSearchParams(newParams)
    }
  }
  const selectedInvoice = useMemo(
    () => pendingInvoices.find((inv: Invoice) => inv.id === selectedOrderId) || null,
    [pendingInvoices, selectedOrderId]
  )

  useEffect(() => {
    fetchInvoices()

    const handleOrderUpdate = () => {
      fetchInvoices()
    }

    window.addEventListener('orderUpdated', handleOrderUpdate)
    return () => {
      window.removeEventListener('orderUpdated', handleOrderUpdate)
    }
  }, [fetchInvoices])

  const metrics = useMemo(() => {
    return [
      {
        label: 'Total Invoice',
        value: String(orderStats?.total || 0),
        icon: <IoClipboardOutline className="text-2xl" />,
        trend: { label: 'all invoices', value: orderStats?.total || 0, isPositive: true },
        colorScheme: 'warning' as const
      },
      {
        label: 'Regular Orders',
        value: String(orderStats?.totalNormal || 0),
        icon: <IoWalletOutline className="text-2xl" />,
        trend: {
          label: 'global count',
          value: orderStats?.totalNormal || 0,
          isPositive: true
        },
        colorScheme: 'success' as const
      },
      {
        label: 'Manufacturing',
        value: String(orderStats?.totalManu || 0),
        icon: <IoFlagOutline className="text-2xl" />,
        trend: { label: 'total', value: orderStats?.totalManu || 0, isPositive: true },
        colorScheme: 'primary' as const
      },
      {
        label: 'Pre-order',
        value: String(orderStats?.totalPreOrder || 0),
        icon: <IoTicketOutline className="text-2xl" />,
        trend: {
          label: 'pre-order count',
          value: orderStats?.totalPreOrder || 0,
          isPositive: true
        },
        colorScheme: 'info' as const
      }
    ]
  }, [orderStats])

  const handleInvoiceClick = (invoice: Invoice) => {
    openDrawer(invoice.id)
  }

  const filteredInvoicesForTable = useMemo(() => {
    return pendingInvoices
  }, [pendingInvoices])

  return (
    <div className="space-y-8">
      <PageHeader
        title="Sales Overview"
        subtitle="Overview of store performance and daily sales operations."
        breadcrumbs={[{ label: 'Dashboard' }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <SalesMetricCard
            key={i}
            {...m}
            colorScheme={m.colorScheme === 'primary' ? 'mint' : m.colorScheme}
          />
        ))}
      </div>

      <div className="space-y-8">
        <Charts />

        <Card className="p-8 border-none shadow-xl shadow-slate-200/40 ring-1 ring-neutral-100/50 bg-white rounded-3xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
            <div className="space-y-1">
              <h3 className="text-xl font-medium text-gray-900 font-heading">
                Recent Transactions
              </h3>
              <p className="text-sm text-gray-500 font-normal tracking-tight">
                Latest invoices awaiting verification and approval.
              </p>
            </div>
            <button className="flex items-center gap-2.5 px-6 py-3 bg-mint-600 text-white rounded-2xl text-sm font-medium hover:bg-mint-700 hover:shadow-lg hover:shadow-mint-100 transition-all active:scale-95 group">
              <IoAdd
                size={22}
                className="group-hover:rotate-90 transition-transform duration-300"
              />
              New Transaction
            </button>
          </div>
          <Table
            invoices={filteredInvoicesForTable}
            loading={loading}
            onInvoiceClick={handleInvoiceClick}
            onActionSuccess={fetchInvoices}
          />
        </Card>
      </div>

      <InvoiceOrdersDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        invoice={selectedInvoice}
      />
    </div>
  )
}
