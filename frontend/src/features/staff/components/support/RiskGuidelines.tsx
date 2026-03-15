import { IoShieldCheckmarkOutline } from 'react-icons/io5'
import { Card } from '@/shared/components/ui'

interface SupportGuideline {
  title: string
  items: string[]
}

interface RiskGuidelinesProps {
  guidelines: SupportGuideline[]
  accentColor?: string
}

export function RiskGuidelines({ guidelines, accentColor = 'mint' }: RiskGuidelinesProps) {
  return (
    <Card className="p-8 border-none shadow-sm shadow-neutral-200/50 bg-white rounded-3xl">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100/50 shadow-sm shadow-rose-100/20">
          <IoShieldCheckmarkOutline size={24} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
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
            <h3 className="text-[10px] font-semibold text-slate-400 tracking-widest uppercase">
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
  )
}
