import type { VisionNeed } from './types'
import { Glasses, Info } from 'lucide-react'
import { Card } from '@/shared/components/ui-core/card'

interface StepVisionNeedProps {
  onSelect: (need: VisionNeed) => void
}

const OPTIONS: { id: VisionNeed; title: string; description: string; icon: any }[] = [
  {
    id: 'prescription',
    title: 'Prescription Lenses',
    description:
      'Custom-made lenses specifically for your vision needs (Single Vision, Progressive, etc.)',
    icon: Glasses
  },
  {
    id: 'non-prescription',
    title: 'Non-prescription lenses',
    description: 'Protective and stylish lenses, without vision correction.',
    icon: Glasses
  }
]

export default function StepVisionNeed({ onSelect }: StepVisionNeedProps) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-3xl font-heading font-bold text-mint-1200 mb-2">
        Choose your vision need
      </h2>
      <p className="text-gray-eyewear mb-10">Choose lenses based on your vision need.</p>

      <div className="space-y-4">
        {OPTIONS.map((opt) => (
          <Card
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className="w-full flex items-center p-6 border-2 border-mint-200 rounded-2xl hover:border-primary-500 hover:bg-primary-50 transition-all duration-300 group text-left cursor-pointer"
          >
            <div className="w-16 h-16 bg-mint-50 border border-mint-100 rounded-xl flex items-center justify-center mr-6 group-hover:bg-primary-500 transition-colors shrink-0">
              <opt.icon className="w-8 h-8 text-primary-500 group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-mint-1200 group-hover:text-primary-600 transition-colors uppercase tracking-tight">
                {opt.title}
              </h3>
              <p className="text-sm text-gray-eyewear leading-relaxed">{opt.description}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-4 bg-primary-50 rounded-xl flex items-start gap-3">
        <Info className="w-5 h-5 text-primary-500 mt-0.5 shrink-0" />
        <p className="text-sm text-primary-600 leading-relaxed font-medium">
          Not sure which one to choose?{' '}
          <button className="underline font-bold">Try Lens Advisor</button>
        </p>
      </div>
    </div>
  )
}
