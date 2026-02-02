import { Card } from '@/shared/components/ui/card'
import { FileText, Edit2, Trash2, Check } from 'lucide-react'
import type { PrescriptionData } from '@/shared/types/prescription.types'

interface PrescriptionCardProps {
  id: string
  name: string
  date: string
  data: PrescriptionData
  onEdit?: () => void
  onDelete?: () => void
}

export function PrescriptionCard({ name, date, data, onEdit, onDelete }: PrescriptionCardProps) {
  return (
    <Card className="p-8 mb-6 border-mint-100/50 hover:border-primary-200 transition-all group overflow-hidden relative">
      <div className="flex justify-between items-start mb-8">
        <div className="flex gap-4 items-center">
          <div className="w-12 h-12 bg-primary-100/50 rounded-2xl flex items-center justify-center text-primary-600 group-hover:bg-primary-500 group-hover:text-white transition-all">
            <FileText size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-mint-1200">{name}</h3>
            <p className="text-sm font-semibold text-gray-400 italic">Saved on {date}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-3 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={onDelete}
            className="p-3 text-gray-400 hover:text-danger-500 hover:bg-danger-50 rounded-xl transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 border-b border-mint-50">
              <th className="py-4 text-left">Eye</th>
              <th className="py-4">SPH</th>
              <th className="py-4">CYL</th>
              <th className="py-4">Axis</th>
              <th className="py-4">Add</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mint-50/50">
            <tr>
              <td className="py-6 text-left font-bold text-mint-1200">OD (Right)</td>
              <td className="py-6 text-sm font-semibold text-mint-900">{data.right.SPH}</td>
              <td className="py-6 text-sm font-semibold text-mint-900">{data.right.CYL}</td>
              <td className="py-6 text-sm font-semibold text-mint-900">{data.right.AXIS}</td>
              <td className="py-6 text-sm font-semibold text-mint-900">{data.right.ADD || '--'}</td>
            </tr>
            <tr>
              <td className="py-6 text-left font-bold text-mint-1200">OS (Left)</td>
              <td className="py-6 text-sm font-semibold text-mint-900">{data.left.SPH}</td>
              <td className="py-6 text-sm font-semibold text-mint-900">{data.left.CYL}</td>
              <td className="py-6 text-sm font-semibold text-mint-900">{data.left.AXIS}</td>
              <td className="py-6 text-sm font-semibold text-mint-900">{data.left.ADD || '--'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8 pt-8 border-t border-dashed border-mint-100 flex items-center justify-between">
        <div className="flex gap-8">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
              PD
            </span>
            <span className="text-sm font-bold text-mint-1200">{data.PD} mm</span>
          </div>
          {data.PD2 && (
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                PD2
              </span>
              <span className="text-sm font-bold text-mint-1200">{data.PD2} mm</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-primary-600">
          <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
            <Check size={12} strokeWidth={3} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest">Verified</span>
        </div>
      </div>
    </Card>
  )
}
