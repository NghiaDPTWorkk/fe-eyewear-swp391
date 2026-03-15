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
import { useRevenueStats } from '@/features/manager/hooks/useManagerReports'
import { formatPrice } from '@/shared/utils'

import type { Invoice } from '@/features/sales/types'
import { Card } from '@/shared/components/ui-core'
import { useDashboard, useSalesStaffInvoices } from '@/features/sales/hooks'

export default function SaleStaffDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  // Limit to 8 most recent DEPOSITED invoices for the dashboard to focus on actions
  const {
    invoices: pendingInvoices,
    loading,
    fetchInvoices,
    pagination
  } = useSalesStaffInvoices(1, 8, 'DEPOSITED')

  // Use a different set of invoices for calculating quality (processed ones)
  const { invoices: processedInvoices } = useSalesStaffInvoices(1, 20, 'APPROVED_OR_REJECTED')

  const { selectedOrderId, isDrawerOpen, openDrawer, closeDrawer } = useDashboard()

  useEffect(() => {
    const invoiceId = searchParams.get('invoiceId')
    // Only open if we have an invoiceId in URL AND the drawer is not already open
    // AND we're not currently tracking this ID (to prevent double-opening/lag)
    if (invoiceId && !isDrawerOpen && pendingInvoices.length > 0 && selectedOrderId !== invoiceId) {
      openDrawer(invoiceId)
    }
  }, [searchParams, pendingInvoices, isDrawerOpen, openDrawer, selectedOrderId])

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
    () => pendingInvoices.find((inv: Invoice) => inv.id === selectedOrderId) || null,
    [pendingInvoices, selectedOrderId]
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

  // Show global revenue stats for the "Overview" to avoid constant 0s for new/staff users
  const { data: revenueData } = useRevenueStats({ period: 'month' })

  const metrics = useMemo(() => {
    // Total revenue and invoice count from stats (usually more accurate than local slice)
    const statsRevenue =
      revenueData?.rows?.reduce(
        (acc: number, r: { totalRevenue: number }) => acc + r.totalRevenue,
        0
      ) || 0
    const statsInvoices =
      revenueData?.rows?.reduce(
        (acc: number, r: { invoiceCount: number }) => acc + r.invoiceCount,
        0
      ) || 0

    // Calculate completion rate from processed invoices (Approved vs Rejected)
    // instead of from the "To-Do" list
    const totalProcessedOrders = processedInvoices.reduce(
      (sum: number, inv: Invoice) => sum + (inv.totalOrdersCount || 0),
      0
    )
    const approvedOrders = processedInvoices.reduce(
      (sum: number, inv: Invoice) => sum + (inv.approvedOrdersCount || 0),
      0
    )

    // Pending count from pagination is good for "Deposited" status
    const pendingCount = pagination?.total || pendingInvoices.length

    return [
      {
        label: 'Pending Invoices',
        value: String(pendingCount),
        icon: <IoClipboardOutline className="text-2xl" />,
        trend: { label: 'awaiting action', value: pendingCount, isPositive: true },
        colorScheme: 'warning' as const
      },
      {
        label: 'Total Revenue',
        value: formatPrice(statsRevenue),
        icon: <IoWalletOutline className="text-2xl" />,
        trend: {
          label: 'this month',
          value: statsRevenue ? 1 : 0,
          isPositive: true
        },
        colorScheme: 'success' as const
      },
      {
        label: 'Closed Invoices',
        value: String(statsInvoices),
        icon: <IoTicketOutline className="text-2xl" />,
        trend: { label: 'in month', value: statsInvoices, isPositive: true },
        colorScheme: 'danger' as const
      },
      {
        label: 'Recent Quality',
        value:
          totalProcessedOrders > 0
            ? `${Math.round((approvedOrders / totalProcessedOrders) * 100)}%`
            : '0%',
        subValue: `${approvedOrders}/${totalProcessedOrders} orders passed`,
        icon: <IoFlagOutline className="text-2xl" />,
        colorScheme: 'primary' as const
      }
    ]
  }, [pendingInvoices, pagination?.total, revenueData, processedInvoices])

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
