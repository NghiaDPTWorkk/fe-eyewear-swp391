import type { ReactNode } from 'react'

export interface Order {
  id: string
  customer: string
  item: string
  waitingFor?: string
  currentStatus: string
  timeElapsed: string
  statusColor: string
  isNextActive: boolean
}

export interface Column<T> {
  header: string | ReactNode
  render: (item: T) => ReactNode
  className?: string
  headerClassName?: string
}
