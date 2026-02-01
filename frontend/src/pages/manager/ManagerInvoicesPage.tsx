import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '@/components'
import { useAdminInvoices } from '@/features/manager/hooks/useAdminInvoices'

export default function ManagerInvoicesPage() {
  const [page, setPage] = useState(1)
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<string | null>(null)
  const limit = 10

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
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-neutral-50 text-neutral-600">
                <tr>
                  <th className="text-left font-semibold px-4 py-3">Invoice Code</th>
                  <th className="text-left font-semibold px-4 py-3">Customer</th>
                  <th className="text-left font-semibold px-4 py-3">Phone</th>
                  <th className="text-left font-semibold px-4 py-3">Orders</th>
                  <th className="text-left font-semibold px-4 py-3">Final Price</th>
                  <th className="text-left font-semibold px-4 py-3">Status</th>
                  <th className="text-left font-semibold px-4 py-3">Created At</th>
                  <th className="text-left font-semibold px-4 py-3">Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {invoiceList.map((inv) => {
                  const isExpanded = expandedInvoiceId === inv.id

                  return (
                    <>
                      <tr
                        key={inv.id}
                        className="hover:bg-neutral-50 cursor-pointer"
                        onClick={() =>
                          setExpandedInvoiceId((cur) => (cur === inv.id ? null : inv.id))
                        }
                      >
                        <td className="px-4 py-3 font-semibold text-neutral-900">
                          {inv.invoiceCode}
                        </td>
                        <td className="px-4 py-3 text-neutral-700">{inv.fullName}</td>
                        <td className="px-4 py-3 text-neutral-700">{inv.phone}</td>
                        <td className="px-4 py-3 text-neutral-700">{inv.orders?.length ?? 0}</td>
                        <td className="px-4 py-3 text-neutral-700">{inv.finalPrice}</td>
                        <td className="px-4 py-3 text-neutral-700">{inv.status}</td>
                        <td className="px-4 py-3 text-neutral-700">{inv.createdAt}</td>
                        <td className="px-4 py-3 text-neutral-700">{inv.address}</td>
                      </tr>

                      {isExpanded && (
                        <tr className="bg-neutral-50">
                          <td className="px-4 py-3" colSpan={8}>
                            <div className="rounded-xl border border-neutral-200 bg-white p-3">
                              <div className="text-xs font-semibold text-neutral-500 mb-2">
                                Orders
                              </div>

                              {inv.orders && inv.orders.length > 0 ? (
                                <div className="space-y-2">
                                  {inv.orders.map((o) => (
                                    <div
                                      key={o.id}
                                      className="flex items-center justify-between gap-3 text-sm"
                                    >
                                      <div className="font-medium text-neutral-800">{o.id}</div>
                                      <div className="text-neutral-600">
                                        {(o.type ?? []).join(', ')}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-sm text-neutral-500">
                                  Invoice này chưa có order.
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )
                })}

                {invoiceList.length === 0 && (
                  <tr>
                    <td className="px-4 py-6 text-neutral-500" colSpan={8}>
                      Không có invoice.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Container>
  )
}
