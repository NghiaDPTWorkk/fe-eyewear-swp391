import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container } from '@/shared/components/ui/container'
import { MetricCard, type MetricCardProps } from '@/shared/components/ui/metric-card/MetricCard'
import { Card } from '@/shared/components/ui/card'
import { DashboardInvoiceTable } from '@/features/sales/components/dashboard/DashboardInvoiceTable'
import { DashboardCharts } from '@/features/sales/components/dashboard/DashboardCharts'
import { useSalesStaffInvoices } from '@/features/sales/hooks/useSalesStaffInvoices'
import { useSalesStaffOrders } from '@/features/sales/hooks/useSalesStaffOrders'
import {
  IoClipboardOutline,
  IoWalletOutline,
  IoTicketOutline,
  IoFlagOutline,
  IoAdd
} from 'react-icons/io5'
import type { Order } from '@/features/sales/types'
import { Button } from '@/components'

export default function SaleStaffDashboardPage() {
  const navigate = useNavigate()
  const { invoices, loading: invLoading, fetchInvoices } = useSalesStaffInvoices()
  const { orders, loading: ordLoading, fetchOrders } = useSalesStaffOrders()

  useEffect(() => {
    fetchInvoices()
    fetchOrders()
  }, [fetchInvoices, fetchOrders])

  const metrics: MetricCardProps[] = [
    {
      label: 'Pending Orders',
      value: String(orders.filter((o: Order) => o.status === 'WAITING_ASSIGN').length),
      icon: <IoClipboardOutline className="text-2xl" />,
      colorScheme: 'warning'
    },
    {
      label: 'Recent Deposits',
      value: String(invoices.length),
      icon: <IoWalletOutline className="text-2xl" />,
      colorScheme: 'success'
    },
    {
      label: 'Total Orders',
      value: String(orders.length),
      icon: <IoTicketOutline className="text-2xl" />,
      colorScheme: 'primary'
    },
    {
      label: 'Lab Orders',
      value: String(orders.filter((o: Order) => o.status === 'PROCESSING').length),
      icon: <IoFlagOutline className="text-2xl" />,
      colorScheme: 'danger'
    }
  ]

  return (
    <Container>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Sales Overview</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Overview of store performance and daily sales operations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((m, i) => (
          <MetricCard key={i} {...m} />
        ))}
      </div>

      <DashboardCharts />

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <p className="text-sm text-gray-500">Latest deposited invoices requiring processing.</p>
          </div>
          <Button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-bold hover:bg-primary-600 transition-all shadow-sm shadow-primary-200">
            <IoAdd size={18} /> New Transaction
          </Button>
        </div>
        <DashboardInvoiceTable
          invoices={invoices}
          loading={invLoading || ordLoading}
          onInvoiceClick={(inv) => navigate(`/salestaff/orders?invoiceId=${inv.id}`)}
        />
      </Card>
    </Container>
  )
}
