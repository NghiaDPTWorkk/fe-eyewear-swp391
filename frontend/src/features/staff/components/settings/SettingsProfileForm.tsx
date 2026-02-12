import { IoSaveOutline } from 'react-icons/io5'

import { Card, Button } from '@/components'

/**
 * ProfileForm Component
 * Profile information form with submit for approval
 */
export default function ProfileForm() {
  return (
    <Card className="p-8 border-none shadow-sm shadow-neutral-200/50">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-semibold text-neutral-900">Profile Information</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest pl-1">
            Full Name
          </label>
          <input
            type="text"
            defaultValue="Staff Name"
            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium text-neutral-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest pl-1">
            Role
          </label>
          <input
            type="text"
            defaultValue="Operations Staff"
            readOnly
            className="w-full px-4 py-3 bg-neutral-100 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-400 cursor-not-allowed"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest pl-1">
            Email
          </label>
          <input
            type="email"
            defaultValue="staff@opspanel.com"
            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium text-neutral-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest pl-1">
            Phone
          </label>
          <input
            type="text"
            defaultValue="+1 (555) 123-4567"
            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium text-neutral-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all"
          />
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <Button
          variant="solid"
          colorScheme="primary"
          leftIcon={<IoSaveOutline size={18} />}
          className="h-11 rounded-xl font-semibold px-6 bg-primary-500 hover:bg-primary-600 shadow-md shadow-primary-100 transition-all active:scale-95 border-none"
        >
          Submit for Approval
        </Button>
      </div>
    </Card>
  )
}
