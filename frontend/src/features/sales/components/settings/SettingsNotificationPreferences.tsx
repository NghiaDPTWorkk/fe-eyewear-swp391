import { Card, Button, Input } from '@/components'
import { IoSaveOutline } from 'react-icons/io5'

const NOTIFICATION_PREFS = [
  'New Order Received',
  'Return Request Submitted',
  'Priority Order Alert'
]

export default function NotificationPreferences() {
  return (
    <Card className="p-8 border-none shadow-sm shadow-neutral-200/50">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-semibold text-neutral-900">Notification Preferences</h3>
      </div>

      <div className="space-y-8">
        <div>
          <h4 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest mb-4 pl-1">
            Email Notifications
          </h4>
          <div className="space-y-3">
            {NOTIFICATION_PREFS.map((pref) => (
              <label
                key={pref}
                className="flex justify-between items-center p-4 bg-neutral-50/50 rounded-xl border border-neutral-100 hover:border-primary-200 hover:bg-primary-50/20 transition-all cursor-pointer group"
              >
                <span className="text-sm font-semibold text-neutral-700 group-hover:text-neutral-900">
                  {pref}
                </span>
                <Input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded-lg border-neutral-300 text-primary-600 focus:ring-primary-500 transition-all cursor-pointer"
                />
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest mb-4 pl-1">
            Push Notifications
          </h4>
          <div className="space-y-3">
            {NOTIFICATION_PREFS.map((pref, i) => (
              <label
                key={pref}
                className="flex justify-between items-center p-4 bg-neutral-50/50 rounded-xl border border-neutral-100 hover:border-primary-200 hover:bg-primary-50/20 transition-all cursor-pointer group"
              >
                <span className="text-sm font-semibold text-neutral-700 group-hover:text-neutral-900">
                  {pref}
                </span>
                <Input
                  type="checkbox"
                  defaultChecked={i !== 0}
                  className="w-5 h-5 rounded-lg border-neutral-300 text-primary-600 focus:ring-primary-500 transition-all cursor-pointer"
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          variant="solid"
          colorScheme="primary"
          leftIcon={<IoSaveOutline size={18} />}
          className="h-11 rounded-xl font-semibold px-8 bg-primary-500 hover:bg-primary-600 shadow-md shadow-primary-100 transition-all active:scale-95 border-none"
        >
          Save Preferences
        </Button>
      </div>
    </Card>
  )
}
