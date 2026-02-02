import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container } from '@/shared/components/ui/container'
import { MetricCard } from '@/shared/components/ui/metric-card'
import { Card } from '@/shared/components/ui/card'
import { SalesStaffDashboardTable } from '@/features/sales/components/dashboard/SalesStaffDashboardTable'
import { SalesStaffDashboardCharts } from '@/features/sales/components/dashboard/SalesStaffDashboardCharts'
import { useSalesStaffInvoices } from '@/features/sales/hooks/useSalesStaffInvoices'
import { useSalesStaffAction } from '@/features/sales/hooks/useSalesStaffAction'
import {
  IoClipboardOutline,
  IoWalletOutline,
  IoTicketOutline,
  IoFlagOutline,
  IoAdd
} from 'react-icons/io5'

const METRICS: any[] = [
  {
    label: 'Pending Orders',
    value: '24',
    icon: <IoClipboardOutline className="text-2xl" />,
    trend: { label: 'from yesterday', value: 12, isPositive: true },
    colorScheme: 'warning'
  },
  {
    label: 'Daily Revenue',
    value: '$4,250.00',
    icon: <IoWalletOutline className="text-2xl" />,
    trend: { label: 'vs last week', value: 8.2, isPositive: true },
    colorScheme: 'success'
  },
  {
    label: 'Open Tickets',
    value: '5',
    icon: <IoTicketOutline className="text-2xl" />,
    trend: { label: 'new today', value: -2, isPositive: false },
    colorScheme: 'danger'
  },
  {
    label: 'Monthly Target',
    value: '85%',
    subValue: '$102k achieved',
    icon: <IoFlagOutline className="text-2xl" />,
    colorScheme: 'primary'
  }
]

export default function SaleStaffDashboardPage() {
  const navigate = useNavigate()
  const { invoices, loading, fetchInvoices } = useSalesStaffInvoices()
  const { approveInvoice } = useSalesStaffAction()

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  const handleApproveInvoice = async (id: string) => {
    if (window.confirm('Are you sure you want to approve this invoice?')) {
      await approveInvoice(id)
      fetchInvoices()
    }
  }

  return (
    <Container>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Sales Overview</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Overview of store performance and daily sales operations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {METRICS.map((m, i) => (
          <MetricCard key={i} {...m} />
        ))}
      </div>

      <SalesStaffDashboardCharts />

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <p className="text-sm text-gray-500">Latest deposited invoices requiring processing.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-bold hover:bg-primary-600 transition-all shadow-sm shadow-primary-200">
            <IoAdd size={18} /> New Transaction
          </button>
        </div>
        <SalesStaffDashboardTable
          invoices={invoices}
          loading={loading}
          onInvoiceClick={(inv) => navigate(`/salestaff/orders?invoiceId=${inv.id}`)}
          onApproveInvoice={handleApproveInvoice}
        />
      </Card>
    </Container>
  )
}
