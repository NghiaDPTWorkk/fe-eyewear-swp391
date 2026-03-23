import PageHeader from '@/features/staff/components/common/PageHeader'
import { PATHS } from '@/routes/paths'

export default function AdminRequestUpdateProfilePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile Update Requests"
        subtitle="Review and manage staff profile update requests"
        breadcrumbs={[
          { label: 'Dashboard', path: PATHS.ADMIN.DASHBOARD },
          { label: 'Profile Requests' }
        ]}
      />

      <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-sm text-center min-h-[400px] flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-mint-50 rounded-2xl flex items-center justify-center text-mint-500 mb-4">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Coming Soon</h3>
        <p className="text-gray-500 max-w-sm">
          We are working on the interface to help you review profile update requests more
          efficiently.
        </p>
      </div>
    </div>
  )
}
