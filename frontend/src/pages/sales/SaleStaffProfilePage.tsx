import { useProfile } from '@/features/staff/hooks/useProfile'
import { Card, Button, Container } from '@/shared/components'
import { Link, useNavigate } from 'react-router-dom'
import { IoChevronForward, IoPencil } from 'react-icons/io5'

export default function SaleStaffProfilePage() {
  const { data: profileData, isLoading, isError } = useProfile()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-mint-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-500 font-medium">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (isError || !profileData?.data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-red-600 font-semibold mb-2">Failed to load profile</p>
          <p className="text-neutral-500 text-sm">Please try again later</p>
        </div>
      </div>
    )
  }

  const profile = profileData.data

  return (
    <Container maxWidth="none" className="pt-6 pb-8 px-6 md:px-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <Link
          to="/salestaff/dashboard"
          className="text-neutral-500 hover:text-neutral-700 transition-colors font-medium"
        >
          Dashboard
        </Link>
        <IoChevronForward className="text-neutral-400" />
        <span className="text-mint-600 font-semibold">My Profile</span>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="overflow-hidden">
          {/* Header with Avatar & Edit Button */}
          <div className="bg-gradient-to-r from-mint-500 to-mint-600 p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  {/* Always show fallback initials */}
                  <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-white flex items-center justify-center">
                    <span className="text-3xl font-bold text-mint-600">
                      {profile.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-1">{profile.name}</h2>
                  <p className="text-mint-100 text-sm font-medium">{profile.email}</p>
                  <div className="mt-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm">
                      {profile.role.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => navigate('/salestaff/settings')}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-2.5 rounded-xl font-medium transition-all backdrop-blur-sm"
              >
                <IoPencil className="text-lg" />
                Edit Profile
              </Button>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8">
            <h3 className="text-lg font-semibold text-neutral-900 mb-6 select-none">
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-500 mb-2 select-none">
                  Full Name
                </label>
                <div className="px-4 py-3 bg-neutral-50 rounded-lg border border-neutral-200 cursor-default">
                  <p className="text-neutral-900 font-medium select-none">{profile.name}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-500 mb-2 select-none">
                  Email Address
                </label>
                <div className="px-4 py-3 bg-neutral-50 rounded-lg border border-neutral-200 cursor-default">
                  <p className="text-neutral-900 font-medium select-none">{profile.email}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-500 mb-2 select-none">
                  Phone Number
                </label>
                <div className="px-4 py-3 bg-neutral-50 rounded-lg border border-neutral-200 cursor-default">
                  <p className="text-neutral-900 font-medium select-none">{profile.phone}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-500 mb-2 select-none">
                  Citizen ID
                </label>
                <div className="px-4 py-3 bg-neutral-50 rounded-lg border border-neutral-200 cursor-default">
                  <p className="text-neutral-900 font-medium select-none">{profile.citizenId}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-500 mb-2 select-none">
                  Role
                </label>
                <div className="px-4 py-3 bg-neutral-50 rounded-lg border border-neutral-200 cursor-default">
                  <p className="text-neutral-900 font-medium select-none">
                    {profile.role.replace('_', ' ')}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-500 mb-2 select-none">
                  Account Created
                </label>
                <div className="px-4 py-3 bg-neutral-50 rounded-lg border border-neutral-200 cursor-default">
                  <p className="text-neutral-900 font-medium select-none">{profile.createdAt}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Container>
  )
}
