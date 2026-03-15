import { IoFlashOutline, IoCubeOutline, IoReceiptOutline, IoRepeatOutline } from 'react-icons/io5'
import { OrderMetrics } from '@/features/sale-staff/components/orders/OrderMetrics'
import { OrderType } from '@/shared/utils/enums/order.enum'
import { type Invoice } from '@/features/sale-staff/types'
import { useMemo } from 'react'

interface OrderMetricsSectionProps {
  invoiceList: Invoice[]
  orderTypeFilter: string
  onOrderTypeChange: (type: string) => void
}

export function OrderMetricsSection({
  invoiceList,
  orderTypeFilter,
  onOrderTypeChange
}: OrderMetricsSectionProps) {
  const metrics = useMemo(() => {
    const counts: Record<string, number> = {
      [OrderType.NORMAL]: 0,
      [OrderType.MANUFACTURING]: 0,
      [OrderType.RETURN]: 0,
      [OrderType.PRE_ORDER]: 0
    }
    invoiceList.forEach((inv) => {
      if (inv.orders && inv.orders.length > 0) {
        inv.orders.forEach((o) => {
          const types = Array.isArray(o.type) ? o.type : [o.type]
          if (types.some((t) => String(t).includes(OrderType.NORMAL))) counts[OrderType.NORMAL]++
          if (types.some((t) => String(t).includes(OrderType.MANUFACTURING)))
            counts[OrderType.MANUFACTURING]++
          if (types.some((t) => String(t).includes(OrderType.RETURN))) counts[OrderType.RETURN]++
          if (types.some((t) => String(t).includes(OrderType.PRE_ORDER)))
            counts[OrderType.PRE_ORDER]++
        })
      } else counts[OrderType.NORMAL]++
    })
    const totalOrders = Object.values(counts).reduce((a, b) => a + b, 0) || 1
    const pct = (key: string) => Math.round((counts[key] / totalOrders) * 100)
    return [
      {
        type: OrderType.NORMAL,
        label: 'Regular Orders',
        value: counts[OrderType.NORMAL],
        icon: <IoReceiptOutline className="text-2xl" />,
        colorScheme: 'mint' as const,
        trend: { label: 'of total', value: pct(OrderType.NORMAL), isPositive: true }
      },
      {
        type: OrderType.MANUFACTURING,
        label: 'Consultations',
        value: counts[OrderType.MANUFACTURING],
        icon: <IoFlashOutline className="text-2xl" />,
        colorScheme: 'secondary' as const,
        trend: { label: 'of total', value: pct(OrderType.MANUFACTURING), isPositive: true }
      },
      {
        type: OrderType.RETURN,
        label: 'Returns',
        value: counts[OrderType.RETURN],
        icon: <IoRepeatOutline className="text-2xl" />,
        colorScheme: 'danger' as const,
        trend: { label: 'of total', value: pct(OrderType.RETURN), isPositive: false }
      },
      {
        type: OrderType.PRE_ORDER,
        label: 'Pre-Orders',
        value: counts[OrderType.PRE_ORDER],
        icon: <IoCubeOutline className="text-2xl" />,
        colorScheme: 'info' as const,
        trend: { label: 'of total', value: pct(OrderType.PRE_ORDER), isPositive: true }
      }
    ]
  }, [invoiceList])

  return (
    <OrderMetrics
      metrics={metrics}
      orderTypeFilter={orderTypeFilter}
      onOrderTypeChange={onOrderTypeChange}
    />
  )
}
