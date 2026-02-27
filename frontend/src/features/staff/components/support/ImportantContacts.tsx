import { IoChatbubblesOutline, IoMailOutline, IoCallOutline } from 'react-icons/io5'
import { Card } from '@/shared/components/ui-core'
import { cn } from '@/lib/utils'

interface SupportContact {
  role: string
  email: string
  phone: string
  isEmergency?: boolean
}

interface ImportantContactsProps {
  contacts: SupportContact[]
  accentColor?: string
}

export function ImportantContacts({ contacts, accentColor = 'mint' }: ImportantContactsProps) {
  const hoverBorderClass =
    accentColor === 'mint'
      ? 'hover:border-mint-200 hover:bg-mint-50/20'
      : 'hover:border-primary-200 hover:bg-primary-50/20'

  return (
    <Card className="p-8 border-none shadow-sm shadow-neutral-200/50 bg-white rounded-3xl">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 border border-indigo-100/50 shadow-sm shadow-indigo-100/20">
          <IoChatbubblesOutline size={24} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
            Important Contacts
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Direct lines for escalation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contacts.map((contact) => (
          <div
            key={contact.role}
            className={cn(
              'p-6 bg-white border border-neutral-100 rounded-2xl shadow-sm transition-all group hover:scale-[1.02]',
              hoverBorderClass
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-slate-800 tracking-tight">{contact.role}</h4>
              {contact.isEmergency && (
                <span className="px-2 py-0.5 bg-rose-100 text-rose-600 text-[9px] font-semibold uppercase tracking-widest rounded-lg border border-rose-200">
                  Emergency
                </span>
              )}
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-500 group-hover:text-slate-900 transition-colors">
                <IoMailOutline
                  className={cn(
                    'shrink-0 text-slate-400',
                    accentColor === 'mint'
                      ? 'group-hover:text-mint-500'
                      : 'group-hover:text-primary-500'
                  )}
                />
                <span className={cn('font-semibold', contact.isEmergency && 'text-rose-600')}>
                  {contact.email}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500 group-hover:text-slate-900 transition-colors">
                <IoCallOutline
                  className={cn(
                    'shrink-0 text-slate-400',
                    accentColor === 'mint'
                      ? 'group-hover:text-mint-500'
                      : 'group-hover:text-primary-500'
                  )}
                />
                <span className="font-semibold">{contact.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
