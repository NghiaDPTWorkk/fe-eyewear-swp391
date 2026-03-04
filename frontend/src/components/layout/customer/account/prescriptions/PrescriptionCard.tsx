import { Card } from '@/shared/components/ui/card'
import { FileText, Edit2, Trash2, Check, Star } from 'lucide-react'
import type { Prescription } from '@/shared/types/prescription.types'

interface PrescriptionCardProps {
  prescription: Prescription
  onEdit?: (prescription: Prescription) => void
  onDelete?: (id: string) => void
}

export function PrescriptionCard({ prescription, onEdit, onDelete }: PrescriptionCardProps) {
  const { _id, left, right, PD, isDefault } = prescription

  return (
    <Card
      className={`p-8 mb-6 border-2 transition-all group overflow-hidden relative ${
        isDefault
          ? 'border-primary-200 bg-primary-50/10 shadow-md shadow-primary-50'
          : 'border-mint-100/50 hover:border-primary-200'
      }`}
    >
      {isDefault && (
        <div className="absolute top-0 right-12 bg-primary-500 text-white px-4 py-1.5 rounded-b-2xl flex items-center gap-2 shadow-sm">
          <Star size={12} fill="white" />
          <span className="text-[10px] font-bold uppercase tracking-[0.15em]">Primary</span>
        </div>
      )}

      <div className="flex justify-between items-start mb-8">
        <div className="flex gap-4 items-center">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              isDefault
                ? 'bg-primary-500 text-white'
                : 'bg-primary-100/50 text-primary-600 group-hover:bg-primary-500 group-hover:text-white'
            }`}
          >
            <FileText size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-mint-1200">
              {isDefault ? 'Primary Vision Correction' : 'Saved Prescription'}
            </h3>
            <p className="text-sm font-semibold text-gray-400 italic">
              ID: {_id?.slice(-8).toUpperCase() || 'NEW'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit?.(prescription)}
            className="p-3 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => _id && onDelete?.(_id)}
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
              <td className="py-6 text-sm font-bold text-mint-900">
                {right.SPH > 0 ? `+${right.SPH.toFixed(2)}` : right.SPH.toFixed(2)}
              </td>
              <td className="py-6 text-sm font-semibold text-mint-900">{right.CYL.toFixed(2)}</td>
              <td className="py-6 text-sm font-semibold text-mint-900">{right.AXIS}°</td>
              <td className="py-6 text-sm font-semibold text-mint-900">+{right.ADD.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="py-6 text-left font-bold text-mint-1200">OS (Left)</td>
              <td className="py-6 text-sm font-bold text-mint-900">
                {left.SPH > 0 ? `+${left.SPH.toFixed(2)}` : left.SPH.toFixed(2)}
              </td>
              <td className="py-6 text-sm font-semibold text-mint-900">{left.CYL.toFixed(2)}</td>
              <td className="py-6 text-sm font-semibold text-mint-900">{left.AXIS}°</td>
              <td className="py-6 text-sm font-semibold text-mint-900">+{left.ADD.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8 pt-8 border-t border-dashed border-mint-100 flex items-center justify-between">
        <div className="flex gap-8">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
              Pupillary Distance (PD)
            </span>
            <span className="text-sm font-bold text-mint-1200">{PD} mm</span>
          </div>
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
