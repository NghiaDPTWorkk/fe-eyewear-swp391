import { useEffect, useMemo, useState } from 'react'
import { Container } from '@/shared/components/ui/container'
import { MetricCard } from '@/shared/components/ui/metric-card'
import { Card } from '@/shared/components/ui/card'
import { SalesStaffDashboardTable } from '@/features/sales/components/dashboard/SalesStaffDashboardTable'
import { SalesStaffDashboardCharts } from '@/features/sales/components/dashboard/SalesStaffDashboardCharts'
import { InvoiceOrdersDrawer } from '@/features/sales/components/dashboard/InvoiceOrdersDrawer'
import { useSalesStaffInvoices } from '@/features/sales/hooks/useSalesStaffInvoices'
import {
  IoClipboardOutline,
  IoWalletOutline,
  IoTicketOutline,
  IoFlagOutline,
  IoAdd
} from 'react-icons/io5'
import type { Invoice } from '@/features/sales/types'

export default function SaleStaffDashboardPage() {
  const { invoices, loading, fetchInvoices } = useSalesStaffInvoices()
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  const metrics = useMemo(
    () => [
      {
        label: 'Pending Orders',
        value: '24',
        icon: <IoClipboardOutline className="text-2xl" />,
        trend: { label: 'from yesterday', value: 12, isPositive: true },
        colorScheme: 'warning' as const
      },
      {
        label: 'Daily Revenue',
        value: '$4,250.00',
        icon: <IoWalletOutline className="text-2xl" />,
        trend: { label: 'vs last week', value: 8.2, isPositive: true },
        colorScheme: 'success' as const
      },
      {
        label: 'Open Tickets',
        value: '5',
        icon: <IoTicketOutline className="text-2xl" />,
        trend: { label: 'new today', value: -2, isPositive: false },
        colorScheme: 'danger' as const
      },
      {
        label: 'Monthly Target',
        value: '85%',
        subValue: '$102k achieved',
        icon: <IoFlagOutline className="text-2xl" />,
        colorScheme: 'primary' as const
      }
    ],
    []
  )

  const handleInvoiceClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsDrawerOpen(true)
  }

  return (
    <Container>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-heading">
          Sales Overview
        </h1>
        <p className="text-slate-500 mt-1.5 text-[15px] font-medium leading-relaxed">
          Overview of store performance and daily sales operations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((m, i) => (
          <MetricCard
            key={i}
            {...m}
            colorScheme={m.colorScheme === 'primary' ? 'mint' : m.colorScheme}
          />
        ))}
      </div>

      <SalesStaffDashboardCharts />

      <Card className="p-8 border-none shadow-xl shadow-slate-200/40 ring-1 ring-neutral-100/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900 font-heading">Recent Transactions</h3>
            <p className="text-sm text-slate-500 font-medium tracking-tight">
              Latest deposited invoices requiring processing.
            </p>
          </div>
          <button className="flex items-center gap-2.5 px-6 py-3 bg-primary-600 text-white rounded-2xl text-[14px] font-bold hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-100 transition-all active:scale-95 group">
            <IoAdd size={22} className="group-hover:rotate-90 transition-transform duration-300" />
            New Transaction
          </button>
        </div>
        <SalesStaffDashboardTable
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
