/**
 * AccountInfoSidebar Component
 * Account info with status and session security
 */
import { Card, Button } from '@/components'
import {
  IoStorefrontOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoGlobeOutline,
  IoTrashOutline
} from 'react-icons/io5'

export default function AccountInfoSidebar() {
  return (
    <div className="space-y-8">
      {/* Account Info */}
      <Card className="p-8 border-none shadow-sm shadow-neutral-200/50 bg-white">
        <h3 className="text-[11px] font-medium text-neutral-500 uppercase tracking-widest mb-8">
          Account Info
        </h3>

        <div className="flex items-center gap-4 mb-8 p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
          <div className="w-12 h-12 rounded-xl bg-primary-100/50 text-primary-600 flex items-center justify-center font-semibold text-lg border border-primary-200/50">
            SN
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Staff Name</h3>
            <p className="text-[10px] font-medium text-primary-600 uppercase tracking-wider mt-0.5">
              ID: #STF-2024-001
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest mb-2.5 px-1">
              Account Status
            </p>
            <span className="px-4 py-1.5 bg-primary-50 text-primary-600 text-[11px] font-medium rounded-full uppercase tracking-wider border border-primary-100 shadow-sm shadow-primary-50">
              Active
            </span>
          </div>

          <div className="pt-4 border-t border-neutral-50 space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-neutral-50 flex items-center justify-center shrink-0 border border-neutral-100">
                <IoStorefrontOutline className="text-neutral-500" size={16} />
              </div>
              <div>
                <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest mb-0.5">
                  Store Location
                </p>
                <p className="text-sm font-semibold text-neutral-700">Downtown Branch #4</p>
              </div>
            </div>
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-neutral-50 flex items-center justify-center shrink-0 border border-neutral-100">
                <IoCalendarOutline className="text-neutral-500" size={16} />
              </div>
              <div>
                <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest mb-0.5">
                  Member Since
                </p>
                <p className="text-sm font-semibold text-neutral-700">January 1, 2024</p>
              </div>
            </div>
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-neutral-50 flex items-center justify-center shrink-0 border border-neutral-100">
                <IoTimeOutline className="text-neutral-500" size={16} />
              </div>
              <div>
                <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest mb-0.5">
                  Last Login
                </p>
                <p className="text-sm font-semibold text-neutral-700 leading-tight">
                  Jan 15, 2026
                  <br />
                  <span className="text-[11px] text-neutral-400 font-normal">09:00 AM</span>
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-primary-50/30 rounded-2xl border border-primary-100/50">
            <p className="text-[10px] font-medium text-primary-600 uppercase tracking-widest mb-2 px-1">
              Session Security
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-neutral-600">Timeout</span>
              <span className="text-xs font-medium text-primary-600 bg-white px-2 py-0.5 rounded-lg border border-primary-100">
                30m
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* System Settings */}
      <Card className="p-8 border-none shadow-sm shadow-neutral-200/50">
        <h3 className="text-[11px] font-medium text-neutral-500 uppercase tracking-widest mb-8">
          System
        </h3>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-widest pl-1">
              Language
            </label>
            <div className="relative">
              <select className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium text-neutral-700 appearance-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all cursor-pointer">
                <option>English</option>
                <option>Vietnamese</option>
              </select>
              <IoGlobeOutline
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
                size={18}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-widest pl-1">
              Timezone
            </label>
            <div className="relative">
              <select className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium text-neutral-700 appearance-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all cursor-pointer">
                <option>UTC-5 (EST)</option>
                <option>UTC+7 (ICT)</option>
              </select>
              <IoTimeOutline
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
                size={18}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-widest pl-1">
              Date Format
            </label>
            <div className="relative">
              <select className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium text-neutral-700 appearance-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all cursor-pointer">
                <option>MM/DD/YYYY</option>
                <option>DD/MM/YYYY</option>
              </select>
              <IoCalendarOutline
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
                size={18}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-8 border border-red-100 shadow-sm shadow-red-50 bg-red-50/10 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
            <IoTrashOutline className="text-red-600" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-red-700">Danger Zone</h3>
        </div>
        <p className="text-sm text-red-600/70 mb-8 font-normal leading-relaxed">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <Button
          variant="solid"
          colorScheme="danger"
          className="w-full h-11 rounded-xl font-normal shadow-md shadow-red-200 hover:shadow-red-300 transition-all active:scale-95 bg-red-600 hover:bg-red-700 border-none px-6"
        >
          Delete Account
        </Button>
      </Card>
    </div>
  )
}
