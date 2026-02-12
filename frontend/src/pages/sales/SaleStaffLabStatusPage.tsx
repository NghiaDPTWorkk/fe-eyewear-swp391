import { IoFilter, IoRefresh } from 'react-icons/io5'

import { LabStatusMetrics } from '@/features/sales/components/lab/LabStatusMetrics'
import { LensSpecificationsCard } from '@/features/sales/components/lab/LensSpecificationsCard'
import { ActiveLabOrdersTable } from '@/features/sales/components/lab/ActiveLabOrdersTable'
import { PageHeader } from '@/features/staff'
import { Button, Container } from '@/shared/components/ui-core'

export default function SaleStaffLabStatusPage() {
  const labOrders = [
    {
      id: '#ORD-7352',
      type: 'Progressive Digital',
      material: 'HI 1.67 • AR Coating',
      station: 'Coating',
      stationColor: 'bg-blue-100 text-blue-600',
      progress: 75,
      progressColor: 'bg-blue-400',
      time: '00:45:12',
      urgency: 'Normal',
      urgencyColor: 'bg-neutral-100 text-neutral-500'
    },
    {
      id: '#ORD-7351',
      type: 'Single Vision',
      material: 'Polycarb • Scratch Resist',
      station: 'Grinding',
      stationColor: 'bg-purple-100 text-purple-600',
      progress: 30,
      progressColor: 'bg-purple-400',
      time: '00:12:05',
      urgency: 'Urgent',
      urgencyColor: 'bg-orange-100 text-orange-600'
    },
    {
      id: '#ORD-7350',
      type: 'Bifocal Flat Top',
      material: 'CR-39 • Tinted',
      station: 'QC Check',
      stationColor: 'bg-emerald-100 text-emerald-600',
      progress: 90,
      progressColor: 'bg-emerald-400',
      time: '00:05:30',
      urgency: 'Normal',
      urgencyColor: 'bg-neutral-100 text-neutral-500'
    },
    {
      id: '#ORD-7349',
      type: 'Progressive Standard',
      material: 'Trivex • Transitions',
      station: 'Polishing',
      stationColor: 'bg-amber-100 text-amber-600',
      progress: 55,
      progressColor: 'bg-amber-400',
      time: '02:15:00',
      urgency: 'Late',
      urgencyColor: 'bg-red-100 text-red-600'
    }
  ]

  return (
    <Container maxWidth="none" className="pt-6 pb-8 px-6 md:px-8">
      <div className="flex items-center justify-between mb-6">
        <PageHeader
          title="Lab Status Tracking"
          subtitle="Monitor production stages, urgent requests, and lens specifications."
          breadcrumbs={[
            { label: 'Dashboard', path: '/salestaff/dashboard' },
            { label: 'Lab Status' }
          ]}
          noMargin={true}
        />
        <div className="flex gap-2">
          <div className="flex gap-2 bg-white p-1 rounded-xl border border-neutral-100 shadow-sm">
            <Button
              size="sm"
              variant="ghost"
              colorScheme="neutral"
              rightIcon={<IoFilter />}
              className="text-neutral-50 px-3"
            >
              All Urgencies
            </Button>
            <div className="w-px h-6 bg-neutral-100"></div>
            <Button
              size="sm"
              variant="ghost"
              colorScheme="neutral"
              rightIcon={<IoFilter />}
              className="text-neutral-50 px-3"
            >
              All Stations
            </Button>
          </div>
          <Button
            variant="solid"
            colorScheme="primary"
            leftIcon={<IoRefresh />}
            className="rounded-xl font-semibold px-4"
          >
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 mb-8">
        <LabStatusMetrics />
        <LensSpecificationsCard selectedOrderId="#ORD-7352" />
      </div>

      <ActiveLabOrdersTable orders={labOrders} />
    </Container>
  )
}
