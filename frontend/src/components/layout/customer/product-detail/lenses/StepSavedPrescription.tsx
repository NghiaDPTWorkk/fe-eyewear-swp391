import { useState, useEffect } from 'react'
import type { Prescription } from '@/shared/types/prescription.types'
import { prescriptionService } from '@/features/customer/services/prescription.service'
import { Card } from '@/shared/components/ui/card'
import { Calendar, Eye, Loader2, FileText } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface StepSavedPrescriptionProps {
  onSelect: (rx: Prescription) => void
}

export default function StepSavedPrescription({ onSelect }: StepSavedPrescriptionProps) {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const data = await prescriptionService.getPrescriptions()
        setPrescriptions(data)
      } catch (error) {
        console.error('Failed to fetch prescriptions:', error)
        toast.error('Failed to load saved prescriptions')
      } finally {
        setLoading(false)
      }
    }

    fetchPrescriptions()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
        <p className="text-gray-eyewear font-medium">Fetching your prescriptions...</p>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-3xl font-heading font-bold text-mint-1200 mb-2">Saved Prescriptions</h2>
      <p className="text-gray-eyewear mb-10">Select a prescription to auto-fill the form.</p>

      {prescriptions.length === 0 ? (
        <div className="text-center py-12 bg-mint-50 rounded-3xl border-2 border-dashed border-mint-200">
          <FileText className="w-12 h-12 text-mint-300 mx-auto mb-4" />
          <p className="text-gray-eyewear font-medium">No saved prescriptions found.</p>
          <button className="text-primary-500 font-bold hover:underline mt-2 uppercase text-sm tracking-wider">
            Add New Prescription
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((rx) => (
            <Card
              key={rx._id}
              onClick={() => onSelect(rx)}
              className="p-6 border-2 border-mint-100 hover:border-primary-500 hover:bg-primary-50 transition-all cursor-pointer group rounded-2xl"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-mint-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary-500 transition-colors">
                    <Eye className="w-6 h-6 text-primary-500 group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-mint-1200 text-lg uppercase tracking-tight">
                      {rx.isDefault ? 'Primary Prescription' : 'Saved Prescription'}
                    </h4>
                    <div className="flex items-center gap-2 text-gray-400 mt-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">
                        ID: {rx._id?.slice(-8).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  {rx.isDefault && (
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-[10px] font-bold uppercase tracking-wider">
                      Primary
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/50 p-3 rounded-lg border border-mint-50 group-hover:bg-white transition-colors">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Right (OD)
                  </p>
                  <p className="text-xs font-bold text-mint-1200">
                    SPH: {rx.right.SPH} | CYL: {rx.right.CYL} | AXIS: {rx.right.AXIS}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Left (OS)
                  </p>
                  <p className="text-xs font-bold text-mint-1200">
                    SPH: {rx.left.SPH} | CYL: {rx.left.CYL} | AXIS: {rx.left.AXIS}
                  </p>
                </div>
              </div>
            </Card>
          ))}

          <button
            onClick={() => toast('Please go to Account Settings to manage prescriptions')}
            className="w-full py-6 border-2 border-dashed border-mint-200 rounded-2xl text-gray-400 font-bold hover:border-primary-300 hover:text-primary-500 transition-all flex items-center justify-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center group-hover:scale-110 transition-transform">
              +
            </div>
            MANAGE PRESCRIPTIONS
          </button>
        </div>
      )}
    </div>
  )
}
