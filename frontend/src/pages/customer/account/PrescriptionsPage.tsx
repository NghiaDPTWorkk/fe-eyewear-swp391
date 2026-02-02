import { useState } from 'react'
import { Plus, ClipboardList } from 'lucide-react'
import { PrescriptionCard } from '@/components/layout/customer/account/prescriptions/PrescriptionCard'
import { Card } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'

export function PrescriptionsPage() {
  const [prescriptions] = useState([
    {
      id: 'rx1',
      name: 'Primary Vision Correction',
      date: 'May 12, 2023',
      data: {
        right: { SPH: '-2.50', CYL: '-0.75', AXIS: '165', ADD: '+1.75' },
        left: { SPH: '-2.25', CYL: '-0.50', AXIS: '15', ADD: '+1.75' },
        PD: '63'
      }
    }
  ])

  // Toggle this to test empty state
  const isEmpty = prescriptions.length === 0

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-[32px] font-bold text-mint-1200 mb-2">My Prescriptions</h2>
          <p className="text-gray-eyewear font-medium">
            Keep your vision details up to date for effortless shopping.
          </p>
        </div>
        {!isEmpty && (
          <button className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl uppercase tracking-widest text-xs">
            <Plus size={18} strokeWidth={3} />
            Add Prescription
          </button>
        )}
      </div>

      {isEmpty ? (
        <Card className="p-16 flex flex-col items-center justify-center border-dashed border-2 border-mint-100 bg-white shadow-sm rounded-[32px]">
          <div className="w-24 h-24 bg-mint-50 rounded-[32px] flex items-center justify-center text-mint-300 mb-8">
            <ClipboardList size={48} />
          </div>
          <p className="text-gray-eyewear font-medium text-lg mb-8 text-center max-w-sm">
            Looks like you have no prescriptions saved. Click "Add new prescription" below for
            speedier shopping.
          </p>
          <Button className="rounded-2xl px-10 py-7 bg-primary-600 text-white font-bold uppercase tracking-[0.2em] shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all">
            Add New Prescription
          </Button>
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {prescriptions.map((rx) => (
            <PrescriptionCard key={rx.id} {...rx} />
          ))}

          <button className="flex items-center justify-center gap-3 p-8 border-2 border-dashed border-mint-200 rounded-[32px] hover:border-primary-400 hover:bg-primary-50/5 transition-all group mt-2">
            <div className="w-10 h-10 bg-mint-50 rounded-xl flex items-center justify-center text-mint-300 group-hover:bg-primary-100 group-hover:text-primary-500 transition-colors">
              <Plus size={20} strokeWidth={3} />
            </div>
            <span className="text-sm font-bold text-gray-400 group-hover:text-primary-600 transition-colors uppercase tracking-widest">
              Save another prescription
            </span>
          </button>
        </div>
      )}

      {/* Info Tip */}
      <div className="mt-12 flex items-start gap-4 p-8 bg-mint-50/50 rounded-3xl border border-mint-100/50">
        <div className="mt-1 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-[10px]">
          !
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-mint-1200 mb-1">Your privacy matters</h4>
          <p className="text-sm text-gray-500 leading-relaxed font-medium">
            Your prescription data is encrypted and only used to fulfill your orders. We never share
            your health information with third parties.
          </p>
        </div>
      </div>
    </div>
  )
}
