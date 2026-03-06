import { useEffect, useMemo } from 'react'
import {
  IoAdd,
  IoClipboardOutline,
  IoFlagOutline,
  IoTicketOutline,
  IoWalletOutline
} from 'react-icons/io5'
import { useSearchParams } from 'react-router-dom'

import { PageHeader, SalesMetricCard } from '@/features/sales/components/common'
import { Charts } from '@/features/sales/components/dashboard/Charts'
import { InvoiceOrdersDrawer } from '@/features/sales/components/dashboard/InvoiceOrdersDrawer'
import { Table } from '@/features/sales/components/dashboard/Table'

import type { Invoice } from '@/features/sales/types'
import { Card } from '@/shared/components/ui-core'
import { useDashboard, useSalesStaffInvoices } from '@/features/sales/hooks'

export default function SaleStaffDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  // Limit to 8 most recent DEPOSITED invoices for the dashboard to focus on actions
  const { invoices, loading, fetchInvoices, pagination } = useSalesStaffInvoices(1, 8, 'DEPOSITED')
  const { selectedOrderId, isDrawerOpen, openDrawer, closeDrawer } = useDashboard()

  // Track if we've already handled the URL invoiceId
  useEffect(() => {
    const invoiceId = searchParams.get('invoiceId')
    // Only open if we have an invoiceId in URL AND the drawer is not already open
    // AND we're not currently tracking this ID (to prevent double-opening/lag)
    if (invoiceId && !isDrawerOpen && invoices.length > 0 && selectedOrderId !== invoiceId) {
      openDrawer(invoiceId)
    }
  }, [searchParams, invoices, isDrawerOpen, openDrawer, selectedOrderId])

  const handleCloseDrawer = () => {
    closeDrawer()
    // Clear search params when closing
    if (searchParams.has('invoiceId')) {
      const newParams = new URLSearchParams(searchParams)
      newParams.delete('invoiceId')
      setSearchParams(newParams)
    }
  }
  const selectedInvoice = useMemo(
    () => invoices.find((inv: Invoice) => inv.id === selectedOrderId) || null,
    [invoices, selectedOrderId]
  )

  useEffect(() => {
    fetchInvoices()

    // Listen for order updates from other pages
    const handleOrderUpdate = () => {
      fetchInvoices()
    }

    window.addEventListener('orderUpdated', handleOrderUpdate)
    return () => {
      window.removeEventListener('orderUpdated', handleOrderUpdate)
    }
  }, [fetchInvoices])

  const metrics = useMemo(() => {
    // Calculate total orders and approved orders across all loaded invoices
    const totalOrders = invoices.reduce(
      (sum: number, inv: Invoice) => sum + (inv.totalOrdersCount || 0),
      0
    )
    const approvedOrders = invoices.reduce(
      (sum: number, inv: Invoice) => sum + (inv.approvedOrdersCount || 0),
      0
    )

    // Use the actual total count from pagination or the current invoices length
    const pendingCount = pagination?.total || invoices.length
    const totalRevenue = invoices.reduce((sum: number, inv: Invoice) => {
      const price = parseFloat(inv.finalPrice?.replace(/[^0-9.-]+/g, '') || '0')
      return sum + price
    }, 0)

    return [
      {
        label: 'Pending Invoices',
        value: String(pendingCount),
        icon: <IoClipboardOutline className="text-2xl" />,
        trend: { label: 'total orders', value: totalOrders, isPositive: true },
        colorScheme: 'warning' as const
      },
      {
        label: 'Total Revenue',
        value: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        icon: <IoWalletOutline className="text-2xl" />,
        trend: {
          label: 'from invoices',
          value: pagination?.total || invoices.length,
          isPositive: true
        },
        colorScheme: 'success' as const
      },
      {
        label: 'Total Invoices',
        value: String(pagination?.total || invoices.length),
        icon: <IoTicketOutline className="text-2xl" />,
        trend: { label: 'pending', value: pendingCount, isPositive: false },
        colorScheme: 'danger' as const
      },
      {
        label: 'Completion Rate',
        value: totalOrders > 0 ? `${Math.round((approvedOrders / totalOrders) * 100)}%` : '0%',
        subValue: `${approvedOrders}/${totalOrders} orders passed`,
        icon: <IoFlagOutline className="text-2xl" />,
        colorScheme: 'primary' as const
      }
    ]
  }, [invoices, pagination?.total])

  const handleInvoiceClick = (invoice: Invoice) => {
    openDrawer(invoice.id)
  }

  const filteredInvoicesForTable = useMemo(() => {
    return invoices
  }, [invoices])

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
