import { useState } from 'react'
import type { PrescriptionData } from './types'
import { Select } from '@/shared/components/ui/select'
import { Info, Check } from 'lucide-react'

interface StepManualPrescriptionProps {
  onSubmit: (rx: PrescriptionData) => void
}

const SPH_OPTIONS = Array.from({ length: 81 }, (_, i) => (-10 + i * 0.25).toFixed(2)).map((v) => ({
  label: v,
  value: v
}))
const CYL_OPTIONS = Array.from({ length: 41 }, (_, i) => (-5 + i * 0.25).toFixed(2)).map((v) => ({
  label: v,
  value: v
}))
const AXIS_OPTIONS = Array.from({ length: 181 }, (_, i) => i.toString()).map((v) => ({
  label: v,
  value: v
}))
const ADD_OPTIONS = Array.from({ length: 13 }, (_, i) => (0.75 + i * 0.25).toFixed(2)).map((v) => ({
  label: v,
  value: v
}))
const PD_OPTIONS = Array.from({ length: 41 }, (_, i) => (40 + i).toString()).map((v) => ({
  label: v,
  value: v
}))

export default function StepManualPrescription({ onSubmit }: StepManualPrescriptionProps) {
  const [rx, setRx] = useState<PrescriptionData>({
    right: { SPH: '0.00', CYL: '0.00', AXIS: '0', ADD: '' },
    left: { SPH: '0.00', CYL: '0.00', AXIS: '0', ADD: '' },
    PD: '63'
  })

  const [sameForBothEyes, setSameForBothEyes] = useState(false)

  const handleOdChange = (field: keyof PrescriptionData['right'], value: string) => {
    setRx((prev: PrescriptionData) => {
      const newRight = { ...prev.right, [field]: value }
      return {
        ...prev,
        right: newRight,
        left: sameForBothEyes ? newRight : prev.left
      }
    })
  }

  const handleOsChange = (field: keyof PrescriptionData['left'], value: string) => {
    setRx((prev: PrescriptionData) => ({ ...prev, left: { ...prev.left, [field]: value } }))
  }

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-3xl font-heading font-bold text-mint-1200 mb-2">
        Enter your prescription
      </h2>
      <p className="text-gray-eyewear mb-6">
        We'll create a lens tailor-made to your vision needs. Don't have a valid prescription?
        <button className="text-primary-500 font-bold ml-1 hover:underline">
          Find Eye Doctors Near You
        </button>
      </p>

      <div className="flex items-center gap-2 text-sm text-primary-600 mb-6 group cursor-pointer">
        <Info className="w-4 h-4" />
        <span className="font-bold border-b border-primary-200">How to read your prescription</span>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <label className="relative flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={sameForBothEyes}
            onChange={() => setSameForBothEyes(!sameForBothEyes)}
          />
          <div className="w-5 h-5 border-2 border-mint-300 rounded peer-checked:bg-primary-500 peer-checked:border-primary-500 transition-all flex items-center justify-center">
            <Check
              className={`w-3.5 h-3.5 text-white ${sameForBothEyes ? 'opacity-100' : 'opacity-0'}`}
            />
          </div>
          <span className="ml-3 text-sm font-bold text-mint-1200">
            Same prescription for both eyes
          </span>
        </label>
      </div>

      <div className="overflow-x-auto mb-8">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
              <th className="pb-4 w-1/5"></th>
              <th className="pb-4 w-1/5">SPH (Sphere)</th>
              <th className="pb-4 w-1/5">CYL (Cylinder)</th>
              <th className="pb-4 w-1/5">Axis</th>
              <th className="pb-4 w-1/5">Add</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mint-50">
            {/* OD Row */}
            <tr>
              <td className="py-4 text-sm font-bold text-mint-1200">OD (Right)</td>
              <td className="p-2">
                <Select
                  value={rx.right.SPH}
                  onChange={(e) => handleOdChange('SPH', e.target.value)}
                >
                  {SPH_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </td>
              <td className="p-2">
                <Select
                  value={rx.right.CYL}
                  onChange={(e) => handleOdChange('CYL', e.target.value)}
                >
                  {CYL_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </td>
              <td className="p-2">
                <Select
                  value={rx.right.AXIS}
                  onChange={(e) => handleOdChange('AXIS', e.target.value)}
                >
                  {AXIS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </td>
              <td className="p-2">
                <Select
                  value={rx.right.ADD || ''}
                  onChange={(e) => handleOdChange('ADD', e.target.value)}
                  placeholder="--"
                >
                  {ADD_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </td>
            </tr>
            {/* OS Row */}
            <tr className={sameForBothEyes ? 'opacity-50 pointer-events-none bg-mint-50/30' : ''}>
              <td className="py-4 text-sm font-bold text-mint-1200">OS (Left)</td>
              <td className="p-2">
                <Select
                  value={rx.left.SPH}
                  onChange={(e) => handleOsChange('SPH', e.target.value)}
                  disabled={sameForBothEyes}
                >
                  {SPH_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </td>
              <td className="p-2">
                <Select
                  value={rx.left.CYL}
                  onChange={(e) => handleOsChange('CYL', e.target.value)}
                  disabled={sameForBothEyes}
                >
                  {CYL_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </td>
              <td className="p-2">
                <Select
                  value={rx.left.AXIS}
                  onChange={(e) => handleOsChange('AXIS', e.target.value)}
                  disabled={sameForBothEyes}
                >
                  {AXIS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </td>
              <td className="p-2">
                <Select
                  value={rx.left.ADD || ''}
                  onChange={(e) => handleOsChange('ADD', e.target.value)}
                  placeholder="--"
                  disabled={sameForBothEyes}
                >
                  {ADD_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-mint-50/50 p-6 rounded-2xl mb-10">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h4 className="text-sm font-bold text-mint-1200 flex items-center gap-2">
              Pupillary distance (PD)
              <Info className="w-4 h-4 text-primary-500 cursor-help" />
            </h4>
          </div>
          <button className="text-xs font-bold text-primary-500 hover:underline uppercase tracking-wider">
            What is PD?
          </button>
        </div>
        <div className="w-32">
          <Select
            value={rx.PD}
            onChange={(e) => setRx((prev: PrescriptionData) => ({ ...prev, PD: e.target.value }))}
          >
            {PD_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <label className="flex items-start cursor-pointer">
          <input type="checkbox" className="sr-only peer" />
          <div className="mt-0.5 w-5 h-5 border-2 border-mint-300 rounded peer-checked:bg-primary-500 peer-checked:border-primary-500 transition-all flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
          </div>
          <span className="ml-3 text-sm text-gray-eyewear leading-relaxed">
            By clicking this box, I confirm that the prescription values entered above are taken
            from a valid (not expired) prescription issued to me, signed by a licensed optometrist
            or ophthalmologist.
          </span>
        </label>

        <button
          onClick={() => onSubmit(rx)}
          className="w-full py-5 bg-primary-500 text-white font-bold rounded-2xl hover:bg-primary-600 transition-all shadow-lg hover:shadow-xl uppercase tracking-widest text-sm"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
