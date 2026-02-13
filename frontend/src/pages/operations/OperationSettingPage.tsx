import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Container, Button, Input } from '@/components'
import { IoCameraOutline } from 'react-icons/io5'
import { useProfile } from '@/features/staff/hooks/useProfile'
import { BreadcrumbPath } from '@/components/layout/staff/operationstaff/breadcrumbpath'

export default function OperationSettingPage() {
  const { data: profileData, isLoading } = useProfile()
  const profile = profileData?.data

  // Dùng useMemo để xử lý dữ liệu profile, tránh tính toán lại vô ích
  const initialValues = useMemo(() => {
    const nameParts = profile?.name?.split(' ') || []
    return {
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      email: profile?.email || ''
    }
  }, [profile])

  // GIẢI PHÁP TRIỆT ĐỂ:
  // Truyền initialValues vào một component con xử lý Form.
  // Hoặc dùng chính dữ liệu này để khởi tạo State mà KHÔNG cần useEffect.
  return (
    <SettingForm
      key={profile?.id || 'loading'} // Khi profile.id có, component sẽ reset sạch state theo data mới
      initialData={initialValues}
      profile={profile}
      isLoading={isLoading}
    />
  )
}

// Tách Form ra để quản lý State độc lập và sạch sẽ
function SettingForm({ initialData, profile, isLoading }: any) {
  const [firstName, setFirstName] = useState(initialData.firstName)
  const [lastName, setLastName] = useState(initialData.lastName)
  const [email, setEmail] = useState(initialData.email)

  const [notificationSound, setNotificationSound] = useState(true)
  const [desktopAlerts, setDesktopAlerts] = useState(true)

  return (
    <Container>
      <div className="mb-8">
        <BreadcrumbPath paths={['Dashboard', 'Settings']} />
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Staff System Settings</h1>
        <p className="text-gray-500 mt-1">Manage your profile, preferences, and display options.</p>
      </div>

      <div className="max-w-4xl space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">Profile Settings</h2>
            <p className="text-sm text-gray-500">Update your photo and personal details here.</p>
          </div>

          <div className="flex items-start gap-6 mb-8 pb-8 border-b border-gray-100">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-emerald-100 border-2 border-white shadow-md flex items-center justify-center overflow-hidden">
                {isLoading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                ) : (
                  <img
                    src={profile?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow border border-gray-200 text-gray-600 hover:text-primary-500">
                <IoCameraOutline size={14} />
              </button>
            </div>

            <div className="flex-1">
              <div className="flex gap-4">
                <Button variant="outline" size="sm" className="text-xs font-medium border-gray-300">
                  Change avatar
                </Button>
                <span className="text-xs text-gray-400 self-center">JPG, GIF or PNG. 1MB max.</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">First name</label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={isLoading}
                className="bg-white border-gray-200 focus:border-primary-500"
                placeholder="Enter first name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Last name</label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={isLoading}
                className="bg-white border-gray-200 focus:border-primary-500"
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700 font-medium">
              ℹ️ Name must contain only letters and spaces. Special characters are not allowed.
            </p>
          </div>

          <div className="space-y-2 mb-6">
            <label className="text-sm font-semibold text-gray-700">Email address</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              leftElement={<span className="text-gray-400 pl-3">@</span>}
              className="bg-white border-gray-200 focus:border-primary-500"
              placeholder="Enter email"
            />
          </div>
        </div>


        {/* Change Password Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">Change Password</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Current Password</label>
              <Input
                type="password"
                placeholder="Enter current password"
                className="bg-white border-gray-200 focus:border-primary-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">New Password</label>
              <Input
                type="password"
                placeholder="Enter new password"
                className="bg-white border-gray-200 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Password Requirements Notice */}
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-800 font-medium">
              ⚠️ Password must be at least 8 characters and include uppercase, lowercase, number, and special character.
            </p>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">Notification Preferences</h2>
            <p className="text-sm text-gray-500">Manage how you receive notifications.</p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Notification Sounds</h3>
                <p className="text-sm text-gray-500">
                  Play a sound when you receive a new notification.
                </p>
              </div>
              <Switch checked={notificationSound} onChange={setNotificationSound} />
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Desktop Alerts for New Orders
                </h3>
                <p className="text-sm text-gray-500">
                  Receive a desktop notification when a new order comes in.
                </p>
              </div>
              <Switch checked={desktopAlerts} onChange={setDesktopAlerts} />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="ghost" className="text-gray-500">
            Cancel
          </Button>
          <Button colorScheme="primary" size="lg" className="font-semibold">
            Save All Changes
          </Button>
        </div>
      </div>
    </Container>
  )
}

function Switch({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${checked ? 'bg-emerald-500' : 'bg-gray-200'}`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${checked ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  )
}
