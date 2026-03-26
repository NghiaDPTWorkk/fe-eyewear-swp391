import { useNavigate } from 'react-router-dom'
import PageHeader from '@/features/staff/components/common/PageHeader'
import { Container, Button } from '@/shared/components/ui'
import { IoChevronForwardOutline, IoTimeOutline, IoCheckmarkCircleOutline } from 'react-icons/io5'
import { PATHS } from '@/routes/paths'
import { useEffect, useState } from 'react'
import { profileRequestService } from '@/shared/services/admin/profileRequestService'
import type { ProfileRequest, ProfileRequestPagination } from '@/shared/types'
import { formatDate } from '@/shared/utils/format.utils'

export default function AdminRequestUpdateProfilePage() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState<ProfileRequest[]>([])
  const [pagination, setPagination] = useState<ProfileRequestPagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const limit = 10

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true)
      try {
        const response = await profileRequestService.getProfileRequests(currentPage, limit)
        if (response.success) {
          setRequests(response.data.profileRequestList)
          setPagination(response.data.pagination)
        }
      } catch (error) {
        console.error('Failed to fetch profile requests:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [currentPage])

  const handleRowClick = (staffId: string) => {
    navigate(`/admin/request-update-profile/${staffId}`)
  }

  return (
    <Container className="pt-2 pb-8 px-4 max-w-none space-y-8">
      <PageHeader
        title="Profile Update Requests"
        subtitle="Review and manage staff or customer profile update requests."
        breadcrumbs={[
          { label: 'Dashboard', path: PATHS.ADMIN.DASHBOARD },
          { label: 'Profile Requests' }
        ]}
      />

      <div className="rounded-[25px] border mt-10 border-neutral-100 shadow-xl shadow-slate-200/40 p-0 overflow-hidden bg-white m-3">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-mint-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-medium text-neutral-400">Loading requests...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50/50">
                  <th className="px-6 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest border-b border-neutral-100">
                    Staff ID
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest border-b border-neutral-100">
                    User Info
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest border-b border-neutral-100">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest border-b border-neutral-100">
                    Processed At
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest border-b border-neutral-100 text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {Array.isArray(requests) && requests.length > 0 ? (
                  requests.map((req, idx) => (
                    <tr
                      key={req.staffId + req.createdAt + idx}
                      onClick={() => handleRowClick(req.staffId)}
                      className="group hover:bg-mint-50/30 transition-all cursor-pointer"
                    >
                      <td className="px-6 py-5">
                        <span className="text-[11px] font-bold text-neutral-500 font-mono tracking-tighter bg-neutral-100 px-3 py-1.5 rounded-lg group-hover:bg-white transition-colors">
                          {String(req.staffId)}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <p className="text-sm font-bold text-gray-900 group-hover:text-mint-700 transition-colors">
                            {String(req.name)}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] font-medium text-neutral-400 group-hover:text-neutral-500 transition-colors">
                              {String(req.email)}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-neutral-200" />
                            <span className="text-[11px] font-medium text-neutral-400 group-hover:text-neutral-500 transition-colors">
                              {String(req.phone)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            req.status === 'PENDING'
                              ? 'bg-amber-50 text-amber-600'
                              : req.status === 'APPROVED'
                                ? 'bg-mint-50 text-mint-600'
                                : 'bg-red-50 text-red-600'
                          }`}
                        >
                          {String(req.status)}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-neutral-500">
                          <IoTimeOutline size={14} />
                          <span className="text-xs font-medium">
                            {req.processedAt && typeof req.processedAt === 'string'
                              ? formatDate(req.processedAt)
                              : 'Not processed yet'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-mint-500 group-hover:text-white transition-all shadow-sm">
                            <IoChevronForwardOutline size={16} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-neutral-400 text-sm">
                      No profile requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-6 bg-neutral-50/30 flex items-center justify-between">
          <p className="text-xs font-medium text-neutral-400">
            Showing {requests.length} results
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg h-9"
              disabled={currentPage === 1 || loading}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg h-9 bg-white shadow-sm"
              disabled={!pagination || currentPage === pagination.totalPages || loading}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-2">
        <div className="bg-white p-6 rounded-[24px] border border-neutral-100 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-mint-50 text-mint-600 flex items-center justify-center shrink-0">
            <IoCheckmarkCircleOutline size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest">
              Review Carefully
            </h4>
            <p className="text-[11px] text-neutral-400 font-medium leading-relaxed">
              Manually verify sensitive info before accepting changes.
            </p>
          </div>
        </div>
      </div>
    </Container>
  )
}
