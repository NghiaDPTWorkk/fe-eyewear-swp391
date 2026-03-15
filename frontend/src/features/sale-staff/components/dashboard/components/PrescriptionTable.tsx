import { IoEyeOutline, IoBodyOutline } from 'react-icons/io5'
import { cn } from '@/lib/utils'

interface PrescriptionTableProps {
  parameters: any
}

export function PrescriptionTable({ parameters }: PrescriptionTableProps) {
  if (!parameters) return null
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 border border-indigo-100">
          <IoEyeOutline size={14} />
        </div>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Prescription Parameters (RX)
        </span>
      </div>
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm text-[11px]">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-400">
              <th className="py-2.5 px-3 text-left font-bold w-12">EYE</th>
              <th className="py-2.5 text-center font-bold">SPH</th>
              <th className="py-2.5 text-center font-bold">CYL</th>
              <th className="py-2.5 text-center font-bold">AXIS</th>
              <th className="py-2.5 text-center font-bold">ADD</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {['right', 'left'].map((side) => {
              const p = parameters[side]
              const isRight = side === 'right'
              return (
                <tr key={side}>
                  <td
                    className={cn(
                      'py-3 px-3 font-bold',
                      isRight
                        ? 'text-indigo-600 bg-indigo-50/30'
                        : 'text-emerald-600 bg-emerald-50/30'
                    )}
                  >
                    {isRight ? 'OD' : 'OS'}
                  </td>
                  <td className="py-3 text-center font-semibold text-slate-700">
                    {p?.SPH ? (p.SPH > 0 ? '+' : '') + p.SPH.toFixed(2) : '0.00'}
                  </td>
                  <td className="py-3 text-center font-semibold text-slate-700">
                    {p?.CYL ? (p.CYL > 0 ? '+' : '') + p.CYL.toFixed(2) : '0.00'}
                  </td>
                  <td
                    className={cn(
                      'py-3 text-center font-semibold',
                      isRight ? 'text-indigo-500' : 'text-emerald-500'
                    )}
                  >
                    {p?.AXIS || 0}°
                  </td>
                  <td className="py-3 text-center font-semibold text-slate-500">
                    {p?.ADD ? (p.ADD > 0 ? '+' : '') + p.ADD.toFixed(2) : '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="bg-blue-50/50 p-3 flex justify-between items-center border-t border-blue-100/50">
          <div className="flex items-center gap-2 font-bold text-blue-600 uppercase tracking-widest text-[10px]">
            <IoBodyOutline size={12} />
            <span>Pupillary Distance</span>
          </div>
          <span className="text-sm font-bold text-blue-700">{parameters.PD || 64}mm</span>
        </div>
      </div>
    </div>
  )
}
