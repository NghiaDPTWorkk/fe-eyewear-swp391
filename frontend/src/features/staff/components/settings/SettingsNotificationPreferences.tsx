/**
 * NotificationPreferences Component
 * User preferences for app and email notifications
 */
import { Card } from '@/components'

export default function NotificationPreferences() {
  const preferences = [
    {
      title: 'Order Updates',
      desc: 'Notifications about new orders and status changes',
      email: true,
      app: true
    },
    {
      title: 'System Alerts',
      desc: 'Critical updates about system maintenance and security',
      email: true,
      app: true
    },
    {
      title: 'Customer Messages',
      desc: 'Alerts when customers send direct messages',
      email: false,
      app: true
    },
    {
      title: 'Reports & Analytics',
      desc: 'Daily summaries of sales and performance',
      email: true,
      app: false
    }
  ]

  return (
    <Card className="p-8 border-none shadow-sm shadow-neutral-200/50">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-semibold text-neutral-900">Notification Preferences</h3>
      </div>
      <div className="space-y-6">
        {preferences.map((pref) => (
          <div
            key={pref.title}
            className="flex items-center justify-between py-4 border-b border-neutral-50 last:border-0"
          >
            <div className="flex-1 pr-8">
              <h4 className="text-sm font-semibold text-neutral-800 mb-1">{pref.title}</h4>
              <p className="text-xs text-neutral-500 font-normal leading-relaxed">{pref.desc}</p>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={pref.app}
                  className="w-4 h-4 rounded border-neutral-200 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-xs font-medium text-neutral-600">App</span>
              </div>
              <div className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={pref.email}
                  className="w-4 h-4 rounded border-neutral-200 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-xs font-medium text-neutral-600">Email</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
