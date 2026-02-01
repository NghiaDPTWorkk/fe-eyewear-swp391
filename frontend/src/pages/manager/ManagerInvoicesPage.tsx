import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '@/components'
import { useAdminInvoices } from '@/features/manager/hooks/useAdminInvoices'
import { useOnboard } from '@/features/manager/hooks/useOnboard'
import { InvoiceStatus } from '@/shared/utils/enums/invoice.enum'
import InvoiceCard from './InvoiceCard'

export default function ManagerInvoicesPage() {
  const [page, setPage] = useState(1)
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<string | null>(null)
  const limit = 10

  const { onboard, isLoading: isOnboarding } = useOnboard()

  const { data, isLoading, isError, error, refetch } = useAdminInvoices(page, limit)

  const invoiceList = data?.data.invoiceList ?? []
  const pagination = data?.data.pagination

  const canPrev = page > 1
  const canNext = pagination ? page < pagination.totalPages : false

  const errorMessage = useMemo(() => {
    if (!isError) return null
    return (error as any)?.message || 'Không lấy được danh sách invoice'
  }, [isError, error])

  return (
    <Container>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm mb-2 font-medium">
          <Link to="/manager" className="text-neutral-400 hover:text-primary-500 transition-colors">
            Dashboard
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="text-primary-500 font-bold">Invoices</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Invoice List</h1>
        <p className="text-gray-500 mt-1">View and open invoices to see their orders.</p>
      </div>

      <div className="rounded-2xl border border-neutral-100 bg-white overflow-hidden">
        <div className="p-4 flex items-center justify-between gap-3">
          <div className="text-sm text-neutral-500">
            {pagination
              ? `Page ${pagination.page}/${pagination.totalPages} • Total ${pagination.total}`
              : `Page ${page}`}
          </div>

          <div className="flex items-center gap-2">
            <button
              className="px-3 py-2 rounded-lg border border-neutral-200 text-sm font-medium disabled:opacity-50"
              disabled={!canPrev || isLoading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <button
              className="px-3 py-2 rounded-lg border border-neutral-200 text-sm font-medium disabled:opacity-50"
              disabled={!canNext || isLoading}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
            <button
              className="px-3 py-2 rounded-lg bg-primary-500 text-white text-sm font-medium disabled:opacity-50"
              disabled={isLoading}
              onClick={() => refetch()}
            >
              Refresh
            </button>
          </div>
        </div>

        {isLoading && <div className="p-6 text-sm text-neutral-500">Đang tải invoice...</div>}

        {errorMessage && (
          <div className="p-6">
            <div className="text-sm text-red-600">{errorMessage}</div>
          </div>
        )}

        {!isLoading && !errorMessage && (
          <div className="p-4">
            <div className="space-y-4">
              {invoiceList.map((inv) => {
                const isExpanded = expandedInvoiceId === inv.id

                const showOnboardButton =
                  inv.status === InvoiceStatus.APPROVED || inv.status === InvoiceStatus.DEPOSITED

                return (
                  <InvoiceCard
                    key={inv.id}
                    invoice={inv}
                    isExpanded={isExpanded}
                    isOnboarding={isOnboarding}
                    showOnboardButton={showOnboardButton}
                    onToggleExpanded={() =>
                      setExpandedInvoiceId((cur) => (cur === inv.id ? null : inv.id))
                    }
                    onOnboard={async (invoiceId) => {
                      await onboard(invoiceId)
                      await refetch()
                    }}
                  />
                )
              })}

              {invoiceList.length === 0 && (
                <div className="px-4 py-6 text-neutral-500">Không có invoice.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </Container>
  )
}
