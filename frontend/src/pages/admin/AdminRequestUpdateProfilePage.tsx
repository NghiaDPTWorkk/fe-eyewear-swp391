import { useNavigate } from 'react-router-dom'
import PageHeader from '@/features/staff/components/common/PageHeader'
import { Container, Button } from '@/shared/components/ui'
import { IoChevronForwardOutline, IoTimeOutline, IoCheckmarkCircleOutline } from 'react-icons/io5'
import { PATHS } from '@/routes/paths'

interface ProfileRequest {
  id: string
  userName: string
  userEmail: string
  role: string
  requestedAt: string
  status: 'Pending' | 'Approved' | 'Rejected'
  avatar?: string
}

const MOCK_REQUESTS: ProfileRequest[] = [
  {
    id: 'REQ-2024-001',
    userName: 'Nguyen Van A',
    userEmail: 'vana.nguyen@example.com',
    role: 'Sale Staff',
    requestedAt: '2024-03-23 10:30',
    status: 'Pending',
    avatar: 'https://i.pravatar.cc/150?u=vana'
  },
  {
    id: 'REQ-2024-002',
    userName: 'Tran Thi B',
    userEmail: 'thib.tran@example.com',
    role: 'Operation Staff',
    requestedAt: '2024-03-22 15:45',
    status: 'Pending',
    avatar: 'https://i.pravatar.cc/150?u=thib'
  },
  {
    id: 'REQ-2024-003',
    userName: 'Le Van C',
    userEmail: 'vanc.le@example.com',
    role: 'Customer',
    requestedAt: '2024-03-21 08:20',
    status: 'Pending'
  }
]

export default function AdminRequestUpdateProfilePage() {
  const navigate = useNavigate()

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

      <div className="rounded-[32px] border border-neutral-100 shadow-xl shadow-slate-200/40 p-0 overflow-hidden bg-white">
        <div className="p-6 border-b border-neutral-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-mint-50 flex items-center justify-center text-mint-600">
              <IoTimeOutline size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 font-heading">Pending Requests</h3>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                {MOCK_REQUESTS.length} Requests waiting for review
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="rounded-xl font-bold text-xs px-4">
            View All History
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest border-b border-neutral-100">
                  Request ID
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest border-b border-neutral-100">
                  User Info
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest border-b border-neutral-100">
                  Role
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest border-b border-neutral-100">
                  Request Date
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest border-b border-neutral-100 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {MOCK_REQUESTS.map((req) => (
                <tr
                  key={req.id}
                  onClick={() => navigate(`/admin/request-update-profile/${req.id}`)}
                  className="group hover:bg-mint-50/30 transition-all cursor-pointer"
                >
                  <td className="px-6 py-5">
                    <span className="text-xs font-bold text-neutral-400 font-mono tracking-tighter bg-neutral-100 px-2 py-1 rounded-lg group-hover:bg-white transition-colors">
                      #{req.id}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-neutral-100 overflow-hidden ring-2 ring-white ring-offset-2 ring-offset-transparent group-hover:ring-mint-100 group-hover:ring-offset-white transition-all">
                        {req.avatar ? (
                          <img src={req.avatar} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-neutral-400">
                            {req.userName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 group-hover:text-mint-700 transition-colors">
                          {req.userName}
                        </p>
                        <p className="text-[11px] font-medium text-neutral-400 group-hover:text-neutral-500 transition-colors">
                          {req.userEmail}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        req.role === 'Customer'
                          ? 'bg-sky-50 text-sky-600'
                          : 'bg-indigo-50 text-indigo-600'
                      }`}
                    >
                      {req.role}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-neutral-500">
                      <IoTimeOutline size={14} />
                      <span className="text-xs font-medium">{req.requestedAt}</span>
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
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 bg-neutral-50/30 flex items-center justify-between">
          <p className="text-xs font-medium text-neutral-400">
            Showing {MOCK_REQUESTS.length} results
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-lg h-9" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" className="rounded-lg h-9 bg-white shadow-sm">
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
