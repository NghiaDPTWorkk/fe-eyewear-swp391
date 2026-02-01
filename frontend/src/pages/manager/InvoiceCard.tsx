import { InvoiceStatus } from '@/shared/utils/enums/invoice.enum'
import type { AdminInvoiceListItem } from '@/shared/types'

function getInvoiceStatusBadgeClass(status: string) {
  switch (status) {
    case InvoiceStatus.PENDING:
      return 'bg-secondary-100 text-secondary-800'
    case InvoiceStatus.DEPOSITED:
      return 'bg-secondary-100 text-secondary-800'
    case InvoiceStatus.APPROVED:
      return 'bg-primary-100 text-primary-800'
    case InvoiceStatus.ONBOARD:
      return 'bg-primary-100 text-primary-800'
    case InvoiceStatus.DELIVERING:
      return 'bg-secondary-100 text-secondary-800'
    case InvoiceStatus.DELIVERED:
      return 'bg-primary-100 text-primary-800'
    case InvoiceStatus.COMPLETED:
      return 'bg-primary-100 text-primary-800'
    case InvoiceStatus.REJECTED:
      return 'bg-danger-100 text-danger-800'
    case InvoiceStatus.CANCELED:
      return 'bg-danger-100 text-danger-800'
    default:
      return 'bg-neutral-100 text-neutral-700'
  }
}

export type InvoiceCardProps = {
  invoice: AdminInvoiceListItem
  isExpanded: boolean
  isOnboarding: boolean
  onToggleExpanded: () => void
  onOnboard: (invoiceId: string) => Promise<unknown>
  showOnboardButton?: boolean
}

export default function InvoiceCard({
  invoice,
  isExpanded,
  isOnboarding,
  onToggleExpanded,
  onOnboard,
  showOnboardButton
}: InvoiceCardProps) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <button type="button" className="w-full text-left p-4" onClick={onToggleExpanded}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="font-semibold text-neutral-900 truncate">{invoice.invoiceCode}</div>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getInvoiceStatusBadgeClass(
                  invoice.status
                )}`}
              >
                {invoice.status}
              </span>
            </div>

            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2 text-sm">
              <div className="text-neutral-700">
                <span className="text-neutral-500">Customer:</span> {invoice.fullName}
              </div>
              <div className="text-neutral-700">
                <span className="text-neutral-500">Phone:</span> {invoice.phone}
              </div>
              <div className="text-neutral-700">
                <span className="text-neutral-500">Orders:</span> {invoice.orders?.length ?? 0}
              </div>
              <div className="text-neutral-700">
                <span className="text-neutral-500">Final price:</span> {invoice.finalPrice}
              </div>
              <div className="text-neutral-700 sm:col-span-2 lg:col-span-4">
                <span className="text-neutral-500">Address:</span> {invoice.address}
              </div>
              <div className="text-neutral-700 sm:col-span-2 lg:col-span-2">
                <span className="text-neutral-500">Created at:</span> {invoice.createdAt}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            {showOnboardButton && (
              <button
                type="button"
                className="px-3 py-2 rounded-lg bg-primary-500 text-white text-sm font-medium disabled:opacity-50"
                disabled={isOnboarding}
                onClick={async (e) => {
                  e.stopPropagation()
                  await onOnboard(invoice.id)
                }}
              >
                Change to ONBOARD
              </button>
            )}

            <div className="text-xs text-neutral-400">
              {isExpanded ? 'Hide orders' : 'View orders'}
            </div>
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
            <div className="text-xs font-semibold text-neutral-500 mb-2">Orders</div>

            {invoice.orders && invoice.orders.length > 0 ? (
              <div className="space-y-2">
                {invoice.orders.map((o) => (
                  <div
                    key={o.id}
                    className="flex items-center justify-between gap-3 text-sm rounded-lg bg-white border border-neutral-200 px-3 py-2"
                  >
                    <div className="font-medium text-neutral-800 truncate">{o.id}</div>
                    <div className="text-neutral-600">{(o.type ?? []).join(', ')}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-neutral-500">Invoice này chưa có order.</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
