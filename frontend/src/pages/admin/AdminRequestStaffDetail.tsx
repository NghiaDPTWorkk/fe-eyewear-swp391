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

  // Mock data for display
  const requestInfo = {
    id: id || 'REQ-2024-001',
    userName: 'Nguyen Van A',
    userEmail: 'vana.nguyen@example.com',
    role: 'Sale Staff',
    avatar: 'https://i.pravatar.cc/150?u=vana',
    requestedAt: '2024-03-23 10:30'
  }

  const changes: ChangeItem[] = [
    {
      field: 'Full Name',
      oldValue: 'Nguyen Van A',
      newValue: 'Nguyen Van An',
      isChanged: true,
      icon: <IoPersonOutline />
    },
    {
      field: 'Phone Number',
      oldValue: '0912345678',
      newValue: '0988776655',
      isChanged: true,
      icon: <IoCallOutline />
    },
    {
      field: 'Citizen ID',
      oldValue: '123456789012',
      newValue: '123456789012',
      isChanged: false,
      icon: <IoShieldCheckmarkOutline />
    },
    {
      field: 'Email',
      oldValue: 'vana.nguyen@example.com',
      newValue: 'vana.nguyen@example.com',
      isChanged: false,
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
          subtitle={`Reviewing profile update for #${requestInfo.id}`}
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
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 rounded-3xl bg-neutral-100 overflow-hidden ring-4 ring-mint-50 mx-auto">
                <img src={requestInfo.avatar} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-mint-500 text-white flex items-center justify-center border-4 border-white">
                <IoPersonOutline size={14} />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900">{requestInfo.userName}</h3>
            <p className="text-sm font-medium text-neutral-400 mb-6">{requestInfo.userEmail}</p>

            <div className="pt-6 border-t border-neutral-50 flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-neutral-400 uppercase tracking-widest">Role</span>
                <span className="font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-tighter">
                  {requestInfo.role}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-neutral-400 uppercase tracking-widest">
                  Requested
                </span>
                <span className="font-medium text-neutral-500">{requestInfo.requestedAt}</span>
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
                        <span className="text-sm font-medium text-neutral-400 line-through decoration-neutral-300">
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

            <div className="p-8 border-t border-neutral-100 bg-white flex gap-4 sticky bottom-0">
              <Button
                variant="solid"
                className="flex-1 h-14 rounded-2xl bg-mint-900 hover:bg-mint-700 text-white font-bold transition-all shadow-xl shadow-mint-100/50 flex items-center justify-center gap-2"
              >
                <IoCheckmarkCircleOutline size={20} />
                Accept All Changes
              </Button>
              <Button
                variant="outline"
                className="px-8 h-14 rounded-2xl border-red-100 text-red-500 hover:bg-red-50 font-bold transition-all flex items-center justify-center gap-2"
              >
                <IoCloseCircleOutline size={20} />
                Reject
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Container>
  )
}
