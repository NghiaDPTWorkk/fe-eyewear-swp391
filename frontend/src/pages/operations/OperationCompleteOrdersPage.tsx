import { Container } from '@/components'
import { BreadcrumbPath } from '@/components/layout/staff/operationstaff/breadcrumbpath'
import OrderTable from '@/components/staff/ordertable/OrderTable'
import React from 'react'

export default function OperationCompleteOrdersPage() {
  return (
    <Container>
      <div className="mb-8">
        <BreadcrumbPath paths={['Dashboard', 'Complete Orders']} />
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Complete Order Tracking</h1>
      </div>

      <OrderTable filterType="All" />
    </Container>
  )
}
