import { IoReceipt, IoWallet, IoTicket, IoFlag } from 'react-icons/io5'

export const METRICS = [
  {
    title: 'Pending Orders',
    value: '24',
    icon: <IoReceipt className="w-6 h-6" />,
    trend: { label: 'from yesterday', value: '12%', isPositive: true },
    progress: { value: 40, colorClass: 'bg-orange-500' }
  },
  {
    title: 'Daily Revenue',
    value: '$4,250.00',
    icon: <IoWallet className="w-6 h-6" />,
    trend: { label: 'vs last week', value: '8.2%', isPositive: true },
    progress: { value: 65, colorClass: 'bg-white' },
    variant: 'primary' as const
  },
  {
    title: 'Open Tickets',
    value: '5',
    icon: <IoTicket className="w-6 h-6" />,
    trend: { label: 'new today', value: '2', isPositive: false },
    progress: { value: 20, colorClass: 'bg-rose-500' }
  },
  {
    title: 'Monthly Target',
    value: '85%',
    icon: <IoFlag className="w-6 h-6" />,
    trend: { label: '$102k achieved' },
    progress: { value: 85, colorClass: 'bg-blue-500' }
  }
]

export const ORDER_STATUSES = [
  { label: 'Completed', val: '65%', color: 'bg-emerald-500', hex: '#10B981' },
  { label: 'Processing', val: '25%', color: 'bg-blue-500', hex: '#3B82F6' },
  { label: 'Pending', val: '10%', color: 'bg-orange-500', hex: '#F97316' }
]
