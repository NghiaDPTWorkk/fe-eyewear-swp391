export const COLORS = {
  primary: {
    50: 'bg-emerald-50',
    100: 'bg-emerald-100',
    500: 'bg-emerald-500',
    600: 'bg-emerald-600',
    text: 'text-emerald-600',
    textDark: 'text-emerald-700',
    border: 'border-emerald-200'
  },

  status: {
    pending: 'bg-amber-50 text-amber-600 border-amber-100',
    processing: 'bg-blue-50 text-blue-600 border-blue-100',
    completed: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    rejected: 'bg-red-50 text-red-600 border-red-100',
    delayed: 'bg-amber-50 text-amber-600 border-amber-100',
    arrived: 'bg-emerald-50 text-emerald-600 border-emerald-100'
  },

  neutral: {
    background: 'bg-white',
    backgroundAlt: 'bg-gray-50',
    border: 'border-gray-200',
    borderLight: 'border-gray-100',
    textPrimary: 'text-gray-900',
    textSecondary: 'text-gray-600',
    textMuted: 'text-gray-400'
  }
} as const

export const TYPOGRAPHY = {
  pageTitle: 'text-2xl font-bold text-gray-900 tracking-tight',
  pageSubtitle: 'text-gray-500 text-sm font-normal leading-relaxed',
  sectionTitle: 'text-lg font-semibold text-gray-900',
  cardTitle: 'text-sm font-semibold text-gray-900',

  body: 'text-sm text-gray-600',
  bodySmall: 'text-xs text-gray-500',

  label: 'text-xs font-semibold text-gray-400 tracking-wider',
  labelSmall: 'text-[10px] font-semibold text-gray-400 tracking-widest',

  tableHeader: 'text-[10px] font-semibold text-gray-400 uppercase tracking-widest'
} as const

export const STYLES = {
  breadcrumbLink:
    'text-neutral-400 hover:text-neutral-600 transition-colors font-normal cursor-pointer',
  breadcrumbActive: 'text-mint-600 font-medium cursor-default',
  breadcrumbSeparator: 'text-neutral-300 mx-1 cursor-default',

  card: 'p-5 border border-neutral-200 shadow-sm rounded-xl',
  cardHover: 'hover:shadow-md transition-shadow cursor-pointer',

  tableRow: 'hover:bg-emerald-50/30 transition-colors cursor-pointer',
  tableCell: 'px-6 py-4 align-middle',

  primaryButton: 'bg-emerald-500 hover:bg-emerald-600 text-white font-semibold cursor-pointer',
  secondaryButton: 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer',

  statusBadge:
    'px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide border cursor-default',

  metricCard: 'p-5 border border-neutral-100 flex flex-col justify-between shadow-sm',
  metricValue: 'text-3xl font-semibold text-gray-900 mt-2',
  metricLabel: 'text-xs font-semibold text-gray-400 uppercase tracking-wider'
} as const

export const ORDER_FILTERS = [
  { label: 'All Orders', value: 'all', count: 128 },
  { label: 'Processing', value: 'processing', count: 42 },
  { label: 'Ready for Packaging', value: 'packaging', count: 24 },
  { label: 'Completed', value: 'completed', count: 62 }
] as const

export const PREORDER_FILTERS = [
  { label: 'All Pre-Orders', value: 'all', count: 142 },
  { label: 'Pending', value: 'pending', count: 98 },
  { label: 'Arrived', value: 'arrived', count: 24 },
  { label: 'Overdue', value: 'overdue', count: 8 }
] as const

export const RX_FILTERS = [
  { label: 'All Rx Orders', value: 'all', count: 48 },
  { label: 'Pending Verification', value: 'pending', count: 24 },
  { label: 'Approved', value: 'approved', count: 18 },
  { label: 'Rejected', value: 'rejected', count: 6 }
] as const
