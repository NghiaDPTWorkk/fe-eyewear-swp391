import {
  IoShieldCheckmarkOutline,
  IoCloudUploadOutline,
  IoMailOutline,
  IoCallOutline,
  IoAlertCircleOutline
} from 'react-icons/io5'
import { Card, Button } from '@/components'

interface SupportGuideline {
  title: string
  items: string[]
}

interface SupportContact {
  role: string
  email: string
  phone: string
  isEmergency?: boolean
}

interface RecentReport {
  title: string
  date: string
  status: string
}

interface SupportContentProps {
  guidelines: SupportGuideline[]
  contacts: SupportContact[]
  recentReports: RecentReport[]
  criticalReminder: string
  accentColor?: string
}

export default function SupportContent({
  guidelines,
  contacts,
  recentReports,
  criticalReminder,
  accentColor = 'mint'
}: SupportContentProps) {
  const hoverBorderClass =
    accentColor === 'mint'
      ? 'hover:border-mint-200 hover:bg-mint-50/20'
      : 'hover:border-primary-200 hover:bg-primary-50/20'
  const buttonBgClass =
    accentColor === 'mint' ? 'bg-mint-600 hover:bg-mint-700' : 'bg-primary-600 hover:bg-primary-700'
  const statusClass = (status: string) => {
    if (status === 'Pending') return 'bg-amber-50 text-amber-600 border-amber-100'
    return accentColor === 'mint'
      ? 'bg-mint-50 text-mint-600 border-mint-100'
      : 'bg-primary-50 text-primary-600 border-primary-100'
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4">
      <div className="lg:col-span-8 space-y-8">
        <Card className="p-8 border-none shadow-sm shadow-neutral-200/50">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
              <IoShieldCheckmarkOutline size={22} />
            </div>
            <h2 className="text-xl font-semibold text-neutral-900">
              Risk Guidelines & Best Practices
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {guidelines.map((group) => (
              <div key={group.title} className="space-y-4">
                <h3 className="text-[11px] font-semibold text-neutral-900 tracking-widest uppercase">
                  {group.title}
                </h3>
                <ul className="space-y-3">
                  {group.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 group">
                      <div
                        className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 group-hover:scale-150 transition-transform ${accentColor === 'mint' ? 'bg-mint-500' : 'bg-primary-500'}`}
                      />
                      <span className="text-sm text-neutral-600 leading-relaxed font-medium">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-8 border-none shadow-sm shadow-neutral-200/50">
          <h2 className="text-xl font-semibold text-neutral-900 mb-8">Important Contacts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contacts.map((contact) => (
              <div
                key={contact.role}
                className={`p-5 bg-neutral-50/50 border border-neutral-100 rounded-2xl transition-all group ${hoverBorderClass}`}
              >
                <h4 className="font-semibold text-neutral-900 mb-4">{contact.role}</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-neutral-500 group-hover:text-neutral-700 transition-colors">
                    <IoMailOutline className="shrink-0" />
                    <span
                      className={`font-medium ${contact.isEmergency ? 'text-red-500 font-semibold' : ''}`}
                    >
                      {contact.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-500 group-hover:text-neutral-700 transition-colors">
                    <IoCallOutline className="shrink-0" />
                    <span className="font-medium">{contact.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="lg:col-span-4 space-y-8">
        <Card className="p-8 border-none shadow-sm shadow-neutral-200/50">
          <h2 className="text-xl font-semibold text-neutral-900 mb-8">Report a Bug</h2>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-neutral-400 tracking-widest pl-1 uppercase">
                Bug Title *
              </label>
              <input
                type="text"
                placeholder="Brief description of the issue"
                className={`w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 transition-all ${accentColor === 'mint' ? 'focus:ring-mint-500/10 focus:border-mint-500' : 'focus:ring-primary-500/10 focus:border-primary-500'}`}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-neutral-400 tracking-widest pl-1 uppercase">
                Priority
              </label>
              <select
                className={`w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-semibold text-neutral-700 appearance-none transition-all cursor-pointer ${accentColor === 'mint' ? 'focus:ring-mint-500/10 focus:border-mint-500' : 'focus:ring-primary-500/10 focus:border-primary-500'}`}
              >
                <option>Low - Cosmetic issue</option>
                <option defaultValue="Medium">Medium - Affects workflow</option>
                <option>High - Critical blocker</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-neutral-400 tracking-widest pl-1 uppercase">
                Description *
              </label>
              <textarea
                rows={4}
                placeholder="Describe the bug in detail. Include steps to reproduce, expected behavior, and actual behavior..."
                className={`w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 transition-all resize-none ${accentColor === 'mint' ? 'focus:ring-mint-500/10 focus:border-mint-500' : 'focus:ring-primary-500/10 focus:border-primary-500'}`}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-neutral-400 tracking-widest pl-1 uppercase">
                Screenshot (Optional)
              </label>
              <div
                className={`border-2 border-dashed border-neutral-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer group ${accentColor === 'mint' ? 'hover:border-mint-300 hover:bg-mint-50/20' : 'hover:border-primary-300 hover:bg-primary-50/20'}`}
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center transition-all ${accentColor === 'mint' ? 'group-hover:bg-mint-100 group-hover:text-mint-600' : 'group-hover:bg-primary-100 group-hover:text-primary-600'}`}
                >
                  <IoCloudUploadOutline size={20} className="text-neutral-400" />
                </div>
                <div className="text-center">
                  <p
                    className={`text-xs font-semibold text-neutral-700 ${accentColor === 'mint' ? 'group-hover:text-mint-700' : 'group-hover:text-primary-700'}`}
                  >
                    Click to upload screenshot
                  </p>
                  <p className="text-[10px] text-neutral-400 mt-1 font-medium">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="solid"
              className={`w-full h-11 rounded-xl font-semibold shadow-md transition-all active:scale-95 text-sm tracking-wider text-white border-none ${buttonBgClass}`}
            >
              Submit Bug Report
            </Button>
          </form>

          <div className="mt-12 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest pl-1">
                Recent Reports
              </h3>
            </div>
            <div className="space-y-3">
              {recentReports.map((report) => (
                <div
                  key={report.title}
                  className={`flex justify-between items-start p-4 bg-neutral-50/50 border border-neutral-100 rounded-xl transition-all group ${accentColor === 'mint' ? 'hover:border-mint-200' : 'hover:border-primary-200'}`}
                >
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-800 group-hover:text-neutral-900">
                      {report.title}
                    </h4>
                    <p className="text-[10px] text-neutral-400 mt-1 font-medium">{report.date}</p>
                  </div>
                  <span
                    className={`px-3 py-0.5 rounded-full text-[10px] font-semibold tracking-wider border ${statusClass(report.status)}`}
                  >
                    {report.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="p-5 bg-red-50/50 border border-red-100 rounded-2xl flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 col-span-full">
        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
          <IoAlertCircleOutline className="text-red-600" size={24} />
        </div>
        <div>
          <h4 className="text-xs font-semibold text-red-900 tracking-wider">Critical Reminder</h4>
          <p className="text-sm text-red-800/70 mt-1 leading-relaxed font-medium">
            {criticalReminder}
          </p>
        </div>
      </div>
    </div>
  )
}
