import { Card } from '@/shared/components/ui-core'
import {
  IoNotificationsOutline,
  IoMailOpenOutline,
  IoAppsOutline,
  IoCheckmark
} from 'react-icons/io5'
import { cn } from '@/lib/utils'

const NOTIFICATION_PREFS = [
  { label: 'New Order Received', email: true, app: true },
  { label: 'Return Request Submitted', email: true, app: true },
  { label: 'Priority Order Alert', email: true, app: false }
]

export default function NotificationPreferences() {
  return (
    <Card className="p-8 border-none shadow-sm shadow-neutral-200/50 bg-white">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100/50">
          <IoNotificationsOutline size={20} />
        </div>
        <h3 className="text-xl font-semibold text-neutral-900">Notification Preferences</h3>
      </div>

      <div className="space-y-3">
        {NOTIFICATION_PREFS.map((pref) => (
          <div
            key={pref.label}
            className="flex items-center justify-between p-5 rounded-2xl hover:bg-neutral-50/50 transition-all border border-transparent hover:border-neutral-100 group"
          >
            <div className="flex-1 pr-8">
              <h4 className="text-sm font-semibold text-neutral-800 mb-1 group-hover:text-primary-600 transition-colors">
                {pref.label}
              </h4>
              <p className="text-[12px] text-neutral-400 font-medium leading-relaxed">
                Receive alerts for this activity
              </p>
            </div>
            <div className="flex items-center gap-10">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-neutral-500">
                  <IoAppsOutline size={16} />
                  <span className="text-[11px] font-bold uppercase tracking-wider">App</span>
                </div>
                <div
                  className={cn(
                    'w-5 h-5 rounded-lg flex items-center justify-center transition-all',
                    pref.app
                      ? 'bg-primary-500 text-white shadow-sm shadow-primary-200'
                      : 'bg-neutral-100 border border-neutral-200 text-transparent'
                  )}
                >
                  <IoCheckmark size={14} className="stroke-[3]" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-neutral-500">
                  <IoMailOpenOutline size={16} />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Email</span>
                </div>
                <div
                  className={cn(
                    'w-5 h-5 rounded-lg flex items-center justify-center transition-all',
                    pref.email
                      ? 'bg-primary-500 text-white shadow-sm shadow-primary-200'
                      : 'bg-neutral-100 border border-neutral-200 text-transparent'
                  )}
                >
                  <IoCheckmark size={14} className="stroke-[3]" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
