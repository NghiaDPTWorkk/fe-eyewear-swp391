import { PageHeader, SupportContent } from '@/features/staff'

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support & Risk Guidelines"
        subtitle="Important guidelines and bug reporting"
        breadcrumbs={[{ label: 'Dashboard', path: '/salestaff/dashboard' }, { label: 'Support' }]}
      />

      <SupportContent
        guidelines={guidelines}
        contacts={contacts}
        criticalReminder="Violation of data security policies or financial transaction guidelines may result in immediate suspension and legal action. When in doubt, always escalate to your supervisor."
        accentColor="mint"
      />
    </div>
  )
}
