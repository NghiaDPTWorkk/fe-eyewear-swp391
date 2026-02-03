import { useEffect, useMemo, useState } from 'react'
import { Container, MetricCard, Card, Button } from '@/components'
import { useSalesStaffInvoices } from '@/features/sales/hooks/useSalesStaffInvoices'
import {
  IoClipboardOutline,
  IoWalletOutline,
  IoTicketOutline,
  IoFlagOutline,
  IoAdd
} from 'react-icons/io5'
import type { Invoice } from '@/features/sales/types'
import { Charts } from '@/features/sales/components/dashboard/Charts'
import { Table } from '@/features/sales/components/dashboard/Table'
import { InvoiceOrdersDrawer } from '@/features/sales/components/dashboard/InvoiceOrdersDrawer'
import { PageHeader } from '@/features/sales/components/common'

export default function SaleStaffDashboardPage() {
  const { invoices, loading, fetchInvoices } = useSalesStaffInvoices()
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

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
    const totalOrders = invoices.reduce((sum, inv) => sum + (inv.orders?.length || 0), 0)
    const pendingOrders = invoices.filter((inv) => inv.status === 'DEPOSITED').length
    const totalRevenue = invoices.reduce((sum, inv) => {
      const price = parseFloat(inv.finalPrice?.replace(/[^0-9.-]+/g, '') || '0')
      return sum + price
    }, 0)

    return [
      {
        label: 'Pending Invoices',
        value: String(pendingOrders),
        icon: <IoClipboardOutline className="text-2xl" />,
        trend: { label: 'total orders', value: totalOrders, isPositive: true },
        colorScheme: 'warning' as const
      },
      {
        label: 'Total Revenue',
        value: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        icon: <IoWalletOutline className="text-2xl" />,
        trend: { label: 'from invoices', value: invoices.length, isPositive: true },
        colorScheme: 'success' as const
      },
      {
        label: 'Total Invoices',
        value: String(invoices.length),
        icon: <IoTicketOutline className="text-2xl" />,
        trend: { label: 'pending', value: pendingOrders, isPositive: false },
        colorScheme: 'danger' as const
      },
      {
        label: 'Completion Rate',
        value: totalOrders > 0 ? `${Math.round((pendingOrders / totalOrders) * 100)}%` : '0%',
        subValue: `${totalOrders} total orders`,
        icon: <IoFlagOutline className="text-2xl" />,
        colorScheme: 'primary' as const
      }
    ]
  }, [invoices])

  const handleInvoiceClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsDrawerOpen(true)
  }

  return (
    <Container className="pt-2 pb-8 px-2 max-w-none">
      <PageHeader
        title="Sales Overview"
        subtitle="Overview of store performance and daily sales operations."
        breadcrumbs={[{ label: 'Dashboard' }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((m, i) => (
          <MetricCard
            key={i}
            {...m}
            colorScheme={m.colorScheme === 'primary' ? 'mint' : m.colorScheme}
          />
        ))}
      </div>

      <Charts />

      <Card className="p-8 border-none shadow-xl shadow-slate-200/40 ring-1 ring-neutral-100/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div className="space-y-1">
            <h3 className="text-xl font-medium text-gray-900 font-heading">Recent Transactions</h3>
            <p className="text-sm text-gray-500 font-normal tracking-tight">
              Latest deposited invoices requiring processing.
            </p>
          </div>
          <Button className="flex items-center gap-2.5 px-6 py-3 bg-mint-600 text-white rounded-2xl text-sm font-medium hover:bg-mint-700 hover:shadow-lg hover:shadow-mint-100 transition-all active:scale-95 group">
            <IoAdd size={22} className="group-hover:rotate-90 transition-transform duration-300" />
            New Transaction
          </Button>
        </div>
        <Table
          invoices={invoices}
          loading={loading}
          onInvoiceClick={handleInvoiceClick}
          onActionSuccess={fetchInvoices}
        />
      </Card>

      <InvoiceOrdersDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        invoice={selectedInvoice}
      />
    </Container>
  )
}
