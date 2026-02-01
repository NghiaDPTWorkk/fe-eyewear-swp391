import { Container, Card, Button } from '@/components'
import { Link } from 'react-router-dom'
import {
  IoShieldCheckmarkOutline,
  IoAlertCircleOutline,
  IoCloudUploadOutline,
  IoMailOutline,
  IoCallOutline
} from 'react-icons/io5'

export default function SaleStaffSupportPage() {
  const guidelines = [
    {
      title: 'Data Security',
      items: [
        'Never share customer PII externally',
        'Always verify customer identity before processing returns',
        'Use secure channels for prescription data transmission',
        'Report any data breach immediately'
      ]
    },
    {
      title: 'Financial Transactions',
      items: [
        'Verify payment status before shipping',
        'Follow refund approval workflow strictly',
        'Document all financial adjustments',
        'Report suspicious transactions to supervisor'
      ]
    },
    {
      title: 'Customer Communication',
      items: [
        'Maintain professional tone in all communications',
        'Do not make promises outside policy scope',
        'Escalate complaints to supervisor when needed',
        'Document all customer interactions'
      ]
    },
    {
      title: 'Lab Operations',
      items: [
        'Only request priority when truly justified',
        'Do not alter lab inspection reports',
        'Follow prescription verification procedures',
        'Report quality issues immediately'
      ]
    }
  ]

  const contacts = [
    {
      role: 'Operations Manager',
      email: 'ops.manager@opspanel.com',
      phone: '+1 (555) 100-0001'
    },
    {
      role: 'Lab Supervisor',
      email: 'lab.supervisor@opspanel.com',
      phone: '+1 (555) 100-0002'
    },
    {
      role: 'IT Support',
      email: 'it.support@opspanel.com',
      phone: '+1 (555) 100-0003'
    },
    {
      role: 'Emergency Hotline',
      email: '+1 (555) 911-0000',
      phone: '24/7 Available',
      isEmergency: true
    }
  ]

  const recentReports = [
    { title: 'Order search not working', date: 'Submitted 2 days ago', status: 'Pending' },
    { title: 'Print function error', date: 'Submitted 5 days ago', status: 'Resolved' }
  ]

  return (
    <Container className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-sm mb-2 font-medium">
          <Link
            to="/salestaff/dashboard"
            className="text-neutral-400 hover:text-primary-500 transition-colors"
          >
            Dashboard
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="text-primary-500 font-semibold">Support</span>
        </div>
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
          Support & Risk Guidelines
        </h1>
        <p className="text-neutral-500 mt-1 font-medium">Important guidelines and bug reporting</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
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
                  <h3 className="text-[11px] font-semibold text-neutral-900 uppercase tracking-widest">
                    {group.title}
                  </h3>
                  <ul className="space-y-3">
                    {group.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 group">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0 group-hover:scale-150 transition-transform" />
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
                  className="p-5 bg-neutral-50/50 border border-neutral-100 rounded-2xl hover:border-primary-200 hover:bg-primary-50/20 transition-all group"
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
                <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest pl-1">
                  Bug Title *
                </label>
                <input
                  type="text"
                  placeholder="Brief description of the issue"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest pl-1">
                  Priority
                </label>
                <select className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-semibold text-neutral-700 appearance-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all cursor-pointer">
                  <option>Low - Cosmetic issue</option>
                  <option selected>Medium - Affects workflow</option>
                  <option>High - Critical blocker</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest pl-1">
                  Description *
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe the bug in detail. Include steps to reproduce, expected behavior, and actual behavior..."
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest pl-1">
                  Screenshot (Optional)
                </label>
                <div className="border-2 border-dashed border-neutral-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-primary-300 hover:bg-primary-50/20 transition-all cursor-pointer group">
                  <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center group-hover:bg-primary-100 group-hover:text-primary-600 transition-all">
                    <IoCloudUploadOutline
                      size={20}
                      className="text-neutral-400 group-hover:text-primary-600"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-neutral-700 group-hover:text-primary-700">
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
                colorScheme="primary"
                className="w-full h-11 rounded-xl font-semibold bg-primary-500 hover:bg-primary-600 shadow-md shadow-primary-100 transition-all active:scale-95 text-sm"
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
                    className="flex justify-between items-start p-4 bg-neutral-50/50 border border-neutral-100 rounded-xl hover:border-primary-200 transition-all group"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-800 group-hover:text-neutral-900">
                        {report.title}
                      </h4>
                      <p className="text-[10px] text-neutral-400 mt-1 font-medium">{report.date}</p>
                    </div>
                    <span
                      className={`px-3 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                        report.status === 'Pending'
                          ? 'bg-amber-50 text-amber-600 border-amber-100'
                          : 'bg-primary-50 text-primary-600 border-primary-100'
                      }`}
                    >
                      {report.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="p-5 bg-red-50/50 border border-red-100 rounded-2xl flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
          <IoAlertCircleOutline className="text-red-600" size={24} />
        </div>
        <div>
          <h4 className="text-xs font-semibold text-red-900 uppercase tracking-wider">
            Critical Reminder
          </h4>
          <p className="text-sm text-red-800/70 mt-1 leading-relaxed font-medium">
            Violation of data security policies or financial transaction guidelines may result in
            immediate suspension and legal action. When in doubt, always escalate to your
            supervisor.
          </p>
        </div>
      </div>
    </Container>
  )
}
