import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '@/features/staff/components/common/PageHeader'
import { Container, Button, Card } from '@/shared/components/ui'
import {
  IoArrowBackOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoAlertCircleOutline,
  IoPersonOutline,
  IoMailOutline,
  IoCallOutline,
  IoShieldCheckmarkOutline
} from 'react-icons/io5'
import { PATHS } from '@/routes/paths'
import { useEffect, useState } from 'react'
import { profileRequestService } from '@/shared/services/admin/profileRequestService'
import { adminAccountService } from '@/shared/services/admin/adminAccountService'
import type { ProfileRequestDetail, AdminAccount } from '@/shared/types'
import { formatDate } from '@/shared/utils/format.utils'
import { toast } from 'react-hot-toast'
import ConfirmationModal from '@/shared/components/ui/ConfirmationModal'

interface ChangeItem {
  field: string
  oldValue: string
  newValue: string
  isChanged: boolean
  icon: React.ReactNode
}

export default function AdminRequestStaffDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [request, setRequest] = useState<ProfileRequestDetail | null>(null)
  const [currentStaff, setCurrentStaff] = useState<AdminAccount | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return
      setLoading(true)
      try {
        const reqResponse = await profileRequestService.getProfileRequestDetail(id)
        if (reqResponse.success && reqResponse.data.profileRequestDetail) {
          const detail = reqResponse.data.profileRequestDetail
          setRequest(detail)

          // Fetch current staff info to compare
          const staffResponse = await adminAccountService.getAdminAccountDetail(detail.staffId)
          if (staffResponse.success) {
            setCurrentStaff(staffResponse.data)
          }
        }
      } catch (error) {
        console.error('Failed to fetch request detail:', error)
        toast.error('Failed to load request details')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleApprove = async () => {
    if (!id) return
    setProcessing(true)
    try {
      const res = await profileRequestService.approveRequest(id)
      if (res.success) {
        toast.success('Profile updated successfully')
        navigate('/admin/request-update-profile')
      } else {
        toast.error(res.message || 'Failed to approve request')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error approving request')
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!id) return
    setIsRejectModalOpen(true)
  }

  const confirmReject = async () => {
    if (!id) return
    setProcessing(true)
    try {
      const res = await profileRequestService.rejectRequest(id)
      if (res.success) {
        toast.success('Request rejected')
        setIsRejectModalOpen(false)
        navigate('/admin/request-update-profile')
      } else {
        toast.error(res.message || 'Failed to reject request')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error rejecting request')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <Container className="pt-20 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-mint-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-neutral-400">Loading details...</p>
      </Container>
    )
  }

  if (!request) {
    return (
      <Container className="pt-20 text-center">
        <p className="text-lg font-bold text-gray-900">Request not found</p>
        <Button onClick={() => navigate('/admin/request-update-profile')} className="mt-4">
          Back to List
        </Button>
      </Container>
    )
  }

  const changes: ChangeItem[] = [
    {
      field: 'Full Name',
      oldValue: currentStaff?.name ? String(currentStaff.name) : '—',
      newValue: request?.name ? String(request.name) : '—',
      isChanged: currentStaff?.name !== request?.name,
      icon: <IoPersonOutline />
    },
    {
      field: 'Phone Number',
      oldValue: currentStaff?.phone ? String(currentStaff.phone) : '—',
      newValue: request?.phone ? String(request.phone) : '—',
      isChanged: currentStaff?.phone !== request?.phone,
      icon: <IoCallOutline />
    },
    {
      field: 'Email',
      oldValue: currentStaff?.email ? String(currentStaff.email) : '—',
      newValue: request?.email ? String(request.email) : '—',
      isChanged: currentStaff?.email !== request?.email,
      icon: <IoMailOutline />
    }
  ]

  return (
    <Container className="pt-2 pb-8 px-4 max-w-5xl space-y-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/request-update-profile')}
          className="w-10 h-10 rounded-xl bg-white border border-neutral-100 flex items-center justify-center text-neutral-400 hover:text-gray-900 hover:border-neutral-200 transition-all shadow-sm"
        >
          <IoArrowBackOutline size={20} />
        </button>
        <PageHeader
          title="Request Update Profile Details"
          subtitle={`Reviewing profile update for #${request.staffId.slice(-8).toUpperCase()}`}
          breadcrumbs={[
            { label: 'Dashboard', path: PATHS.ADMIN.DASHBOARD },
            { label: 'Profile Requests', path: '/admin/request-update-profile' },
            { label: 'Details' }
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: User Summary */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="rounded-[32px] border border-neutral-100 shadow-xl shadow-slate-200/40 p-8 text-center bg-white">
            <div className="relative inline-block mb-10 group/avatar">
              <div className="w-32 h-32 rounded-[38px] bg-white overflow-hidden ring-1 ring-neutral-100 p-1.5 mx-auto transition-all duration-1000 ease-out group-hover/avatar:shadow-[0_20px_50px_-15px_rgba(74,215,176,0.25)] group-hover/avatar:scale-[1.02]">
                <div className="w-full h-full rounded-[32px] overflow-hidden bg-neutral-50 flex items-center justify-center">
                  {currentStaff?.avatar ? (
                    <img
                      src={currentStaff.avatar}
                      alt={request.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover/avatar:scale-105"
                    />
                  ) : (
                    <span className="text-4xl font-light text-neutral-300 font-heading">
                      {(request.name || 'U').charAt(0)}
                    </span>
                  )}
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-2xl bg-white text-mint-500 flex items-center justify-center shadow-lg border border-neutral-50">
                <IoShieldCheckmarkOutline size={18} />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900">{request.name}</h3>
            <p className="text-sm font-medium text-neutral-400 mb-6">{request.email}</p>

            <div className="pt-6 border-t border-neutral-50 flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-neutral-400 uppercase tracking-widest">Status</span>
                <span
                  className={`font-bold px-3 py-1 rounded-full uppercase tracking-tighter ${
                    request.status === 'PENDING'
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-mint-50 text-mint-600'
                  }`}
                >
                  {request.status}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-neutral-400 uppercase tracking-widest">
                  Requested
                </span>
                <span className="font-medium text-neutral-500">
                  {formatDate(request.createdAt)}
                </span>
              </div>
            </div>
          </Card>

          <Card className="rounded-[24px] border border-neutral-100 p-6 bg-amber-50/30 border-dashed">
            <div className="flex gap-3">
              <div className="shrink-0 text-amber-500">
                <IoAlertCircleOutline size={20} />
              </div>
              <p className="text-[11px] font-medium text-amber-700 leading-relaxed">
                Accepting this request will immediately overwrite the current information in the
                database. Please verify the contact details.
              </p>
            </div>
          </Card>
        </div>

        {/* Right: Comparison Table */}
        <div className="lg:col-span-2">
          <Card className="rounded-[32px] border border-neutral-100 shadow-xl shadow-slate-200/40 overflow-hidden bg-white h-full flex flex-col">
            <div className="p-6 border-b border-neutral-50 bg-neutral-50/30">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                Information Comparison
              </h4>
            </div>

            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50/20">
                    <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-100 w-1/4">
                      Field
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-100 w-3/8">
                      Current Value
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-100 w-3/8">
                      Proposed Value
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {changes.map((change, idx) => (
                    <tr
                      key={idx}
                      className={`group transition-colors ${change.isChanged ? 'bg-mint-50/20' : ''}`}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${change.isChanged ? 'bg-mint-100 text-mint-600' : 'bg-neutral-100 text-neutral-400'}`}
                          >
                            {change.icon}
                          </div>
                          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-tight">
                            {change.field}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`text-sm font-medium ${change.isChanged ? 'text-neutral-400 line-through decoration-neutral-300' : 'text-gray-900'}`}
                        >
                          {change.oldValue}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-bold ${change.isChanged ? 'text-mint-700' : 'text-gray-900'}`}
                          >
                            {change.newValue}
                          </span>
                          {change.isChanged && (
                            <span className="px-2 py-0.5 rounded-md bg-mint-500 text-[9px] font-bold text-white uppercase tracking-tighter">
                              New
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {request.status === 'PENDING' ? (
              <div className="p-8 border-t border-neutral-100 bg-white flex gap-4 sticky bottom-0">
                <Button
                  onClick={handleApprove}
                  disabled={processing}
                  variant="solid"
                  className="flex-1 h-14 rounded-2xl bg-mint-900 hover:bg-mint-700 text-white font-bold transition-all shadow-xl shadow-mint-100/50 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <IoCheckmarkCircleOutline size={20} />
                      Accept All Changes
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={processing}
                  variant="outline"
                  className="px-8 h-14 rounded-2xl border-red-100 text-red-500 hover:bg-red-50 font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <IoCloseCircleOutline size={20} />
                  Reject
                </Button>
              </div>
            ) : (
              <div className="p-8 border-t border-neutral-100 bg-neutral-50/50 text-center sticky bottom-0">
                <p className="text-sm font-semibold text-neutral-400 italic flex items-center justify-center gap-2">
                  <IoAlertCircleOutline size={16} />
                  This request has been {request.status.toLowerCase()} and can no longer be
                  modified.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={confirmReject}
        title="Confirm Rejection"
        message={`Are you sure you want to reject the profile update request for ${request.name}? This action cannot be undone.`}
        confirmText="Yes, Reject Request"
        cancelText="No, Keep Pending"
        type="danger"
        isLoading={processing}
      />
    </Container>
  )
}
