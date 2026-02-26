import {
  IoShieldCheckmarkOutline,
  IoCloudUploadOutline,
  IoMailOutline,
  IoCallOutline,
  IoAlertCircleOutline,
  IoChatbubblesOutline,
  IoChevronForwardOutline
} from 'react-icons/io5'
import { Card, Button } from '@/shared/components/ui-core'

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 space-y-8">
        <Card className="p-8 border-none shadow-sm shadow-neutral-200/50 bg-white rounded-3xl">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100/50 shadow-sm shadow-rose-100/20">
              <IoShieldCheckmarkOutline size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Risk Guidelines & Best Practices
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Core safety & operational standards
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {guidelines.map((group) => (
              <div key={group.title} className="space-y-5">
                <h3 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                  {group.title}
                </h3>
                <ul className="space-y-4">
                  {group.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3.5 group">
                      <div
                        className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 group-hover:scale-150 transition-all ${accentColor === 'mint' ? 'bg-mint-500 shadow-lg shadow-mint-200' : 'bg-primary-500 shadow-lg shadow-primary-200'}`}
                      />
                      <span className="text-sm text-slate-600 leading-relaxed font-medium group-hover:text-slate-900 transition-colors">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-8 border-none shadow-sm shadow-neutral-200/50 bg-white rounded-3xl">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 border border-indigo-100/50 shadow-sm shadow-indigo-100/20">
              <IoChatbubblesOutline size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Important Contacts
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Direct lines for escalation
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contacts.map((contact) => (
              <div
                key={contact.role}
                className={`p-6 bg-white border border-neutral-100 rounded-2xl shadow-sm transition-all group hover:scale-[1.02] ${hoverBorderClass}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-slate-800 tracking-tight">{contact.role}</h4>
                  {contact.isEmergency && (
                    <span className="px-2 py-0.5 bg-rose-100 text-rose-600 text-[9px] font-bold uppercase tracking-widest rounded-lg border border-rose-200">
                      Emergency
                    </span>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-slate-500 group-hover:text-slate-900 transition-colors">
                    <IoMailOutline className="shrink-0 text-slate-400 group-hover:text-primary-500" />
                    <span className={`font-semibold ${contact.isEmergency ? 'text-rose-600' : ''}`}>
                      {contact.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-500 group-hover:text-slate-900 transition-colors">
                    <IoCallOutline className="shrink-0 text-slate-400 group-hover:text-primary-500" />
                    <span className="font-semibold">{contact.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="lg:col-span-4 space-y-8">
        <Card className="p-8 border-none shadow-sm shadow-neutral-200/50 bg-white rounded-3xl">
          <h2 className="text-xl font-bold text-slate-900 mb-8 tracking-tight">Report a Bug</h2>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 tracking-widest pl-1 uppercase">
                Bug Title *
              </label>
              <input
                type="text"
                placeholder="Brief description of the issue"
                className={`w-full px-5 py-3.5 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 transition-all cursor-pointer ${accentColor === 'mint' ? 'focus:ring-mint-500/10 focus:border-mint-500' : 'focus:ring-primary-500/10 focus:border-primary-500'}`}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 tracking-widest pl-1 uppercase">
                Priority
              </label>
              <select
                className={`w-full px-5 py-3.5 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm font-bold text-slate-700 appearance-none transition-all cursor-pointer ${accentColor === 'mint' ? 'focus:ring-mint-500/10 focus:border-mint-500' : 'focus:ring-primary-500/10 focus:border-primary-500'}`}
              >
                <option>Low - Cosmetic issue</option>
                <option defaultValue="Medium">Medium - Affects workflow</option>
                <option>High - Critical blocker</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 tracking-widest pl-1 uppercase">
                Description *
              </label>
              <textarea
                rows={4}
                placeholder="Describe the bug in detail..."
                className={`w-full px-5 py-3.5 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 transition-all resize-none cursor-pointer ${accentColor === 'mint' ? 'focus:ring-mint-500/10 focus:border-mint-500' : 'focus:ring-primary-500/10 focus:border-primary-500'}`}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 tracking-widest pl-1 uppercase">
                Screenshot
              </label>
              <div
                className={`border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer group ${accentColor === 'mint' ? 'hover:border-mint-300 hover:bg-mint-50/20' : 'hover:border-primary-300 hover:bg-primary-50/20'}`}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center transition-all ${accentColor === 'mint' ? 'group-hover:bg-mint-100 group-hover:text-mint-600' : 'group-hover:bg-primary-100 group-hover:text-primary-600'}`}
                >
                  <IoCloudUploadOutline size={24} className="text-slate-400" />
                </div>
                <div className="text-center">
                  <p
                    className={`text-xs font-bold text-slate-700 ${accentColor === 'mint' ? 'group-hover:text-mint-700' : 'group-hover:text-primary-700'}`}
                  >
                    Click to upload
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 font-bold">PNG, JPG up to 5MB</p>
                </div>
              </div>
            </div>

            <Button
              variant="solid"
              className={`w-full h-12 rounded-2xl font-bold shadow-lg shadow-mint-100 hover:shadow-mint-200 transition-all active:scale-95 text-sm tracking-wider text-white border-none ${buttonBgClass}`}
            >
              Submit Bug Report
            </Button>
          </form>

          <div className="mt-12 space-y-6">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
              Recent Reports
            </h3>
            <div className="space-y-3">
              {recentReports.map((report) => (
                <div
                  key={report.title}
                  className={`flex justify-between items-start p-4 bg-white border border-neutral-100 rounded-2xl shadow-sm transition-all group hover:scale-[1.02] cursor-pointer ${accentColor === 'mint' ? 'hover:border-mint-200 hover:bg-white hover:shadow-md hover:shadow-slate-200/50' : 'hover:border-primary-200'}`}
                >
                  <div className="flex-1 pr-3">
                    <h4 className="text-sm font-bold text-slate-800 group-hover:text-primary-600 transition-colors line-clamp-1">
                      {report.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1 font-bold">{report.date}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-xl text-[9px] font-bold uppercase tracking-widest border shrink-0 ${statusClass(report.status)}`}
                  >
                    {report.status}
                  </span>
                </div>
              ))}
            </div>
            <button className="w-full py-3 text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center justify-center gap-1 transition-colors cursor-pointer">
              View All History <IoChevronForwardOutline />
            </button>
          </div>
        </Card>
      </div>

      <div className="p-6 bg-rose-50 border border-rose-100 rounded-[24px] flex gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500 col-span-full shadow-sm shadow-rose-100/30">
        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-rose-100/50">
          <IoAlertCircleOutline className="text-rose-500" size={26} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-rose-900 tracking-tight">Critical Reminder</h4>
          <p className="text-sm text-rose-800/80 mt-1 leading-relaxed font-semibold">
            {criticalReminder}
          </p>
        </div>
      </div>
    </div>
  )
}
