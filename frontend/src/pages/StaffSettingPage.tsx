import { useState } from 'react'
import { Container, Button, Input } from '@/components'
import { IoCameraOutline } from 'react-icons/io5'

export default function StaffSettingPage() {
  // Hardcoded state for demonstration
  const [firstName, setFirstName] = useState('Sarah')
  const [lastName, setLastName] = useState('Jenkins')
  const [email, setEmail] = useState('sarah.jenkins@opticview.com')

  const [notificationSound, setNotificationSound] = useState(true)
  const [desktopAlerts, setDesktopAlerts] = useState(true)

  return (
    <Container>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Staff System Settings</h1>
        <p className="text-gray-500 mt-1">Manage your profile, preferences, and display options.</p>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Profile Settings Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">Profile Settings</h2>
            <p className="text-sm text-gray-500">Update your photo and personal details here.</p>
          </div>

          <div className="flex items-start gap-6 mb-8 pb-8 border-b border-gray-100">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-emerald-100 border-2 border-white shadow-md flex items-center justify-center overflow-hidden">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
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
                className="bg-white border-gray-200 focus:border-primary-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Last name</label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-white border-gray-200 focus:border-primary-500"
              />
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <label className="text-sm font-semibold text-gray-700">Email address</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftElement={<span className="text-gray-400">@</span>}
              className="bg-white border-gray-200 focus:border-primary-500"
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

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="ghost" className="text-gray-500">
              Cancel
            </Button>
            <Button colorScheme="primary">Save Changes</Button>
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
      </div>
    </Container>
  )
}

// Simple Switch Component defined locally since I didn't find one in the main components
function Switch({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        ${checked ? 'bg-emerald-500' : 'bg-gray-200'}
      `}
    >
      <span
        aria-hidden="true"
        className={`
          pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
          ${checked ? 'translate-x-5' : 'translate-x-0'}
        `}
      />
    </button>
  )
}
