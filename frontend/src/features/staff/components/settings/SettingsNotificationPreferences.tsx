import { Card } from '@/shared/components'
import { IoNotificationsOutline, IoMailOpenOutline, IoAppsOutline } from 'react-icons/io5'

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
    <Card className="p-8 border-none shadow-sm shadow-neutral-200/50 bg-white">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100/50">
          <IoNotificationsOutline size={20} />
        </div>
        <h3 className="text-xl font-semibold text-neutral-900">Notification Preferences</h3>
      </div>

      <div className="space-y-2">
        {preferences.map((pref) => (
          <div
            key={pref.title}
            className="flex items-center justify-between p-5 rounded-2xl hover:bg-neutral-50/50 transition-all border border-transparent hover:border-neutral-100 group"
          >
            <div className="flex-1 pr-8">
              <h4 className="text-sm font-semibold text-neutral-800 mb-1 group-hover:text-primary-600 transition-colors">
                {pref.title}
              </h4>
              <p className="text-[12px] text-neutral-400 font-medium leading-relaxed">
                {pref.desc}
              </p>
            </div>
            <div className="flex items-center gap-10">
              <label className="flex items-center gap-3 cursor-pointer group/label">
                <div className="flex items-center gap-2 text-neutral-500 group-hover/label:text-primary-600 transition-colors">
                  <IoAppsOutline size={16} />
                  <span className="text-[11px] font-bold uppercase tracking-wider">App</span>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={pref.app}
                    className="w-5 h-5 rounded-lg border-neutral-200 text-primary-500 focus:ring-primary-500/20 transition-all cursor-pointer"
                  />
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group/label">
                <div className="flex items-center gap-2 text-neutral-500 group-hover/label:text-primary-600 transition-colors">
                  <IoMailOpenOutline size={16} />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Email</span>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={pref.email}
                    className="w-5 h-5 rounded-lg border-neutral-200 text-primary-500 focus:ring-primary-500/20 transition-all cursor-pointer"
                  />
                </div>
              </label>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
