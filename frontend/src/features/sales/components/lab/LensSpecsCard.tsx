/**
 * LensSpecsCard Component
 * Displays lens specification details (read-only)
 */
import { Card } from '@/components'
import { IoCheckmarkCircleOutline } from 'react-icons/io5'

export default function LensSpecsCard() {
  return (
    <Card className="p-6 border border-neutral-100">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-emerald-100 text-emerald-600 rounded">
            <IoCheckmarkCircleOutline size={16} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Lens Specifications
            <span className="ml-2 px-2 py-0.5 bg-neutral-100 text-neutral-500 text-[10px] rounded uppercase tracking-wider">
              Selected: #ORD-7352
            </span>
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider italic">
          Read-Only View
        </span>
      </div>

      <div className="grid grid-cols-4 gap-8">
        <div className="col-span-2 space-y-4">
          <div>
            <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Lens Type
            </p>
            <div className="px-3 py-2 bg-neutral-50 rounded-lg text-sm font-medium text-neutral-800">
              Progressive Digital Freeform
            </div>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Material
            </p>
            <div className="px-3 py-2 bg-neutral-50 rounded-lg text-sm font-medium text-neutral-800">
              High Index 1.67
            </div>
          </div>
        </div>

        <div className="col-span-1 border-x border-neutral-100 px-6 space-y-4">
          <div>
            <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2 text-center">
              Sphere (SPH)
            </p>
            <div className="flex gap-2 justify-center">
              <div className="text-center">
                <span className="text-[10px] text-neutral-400 uppercase font-semibold tracking-wider">
                  OD
                </span>
                <div className="text-sm font-semibold text-neutral-900">-2.50</div>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-neutral-400 uppercase font-semibold tracking-wider">
                  OS
                </span>
                <div className="text-sm font-semibold text-neutral-900">-2.75</div>
              </div>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2 text-center">
              Cylinder (CYL)
            </p>
            <div className="flex gap-2 justify-center">
              <div className="text-center">
                <span className="text-[10px] text-neutral-400 uppercase font-semibold tracking-wider">
                  OD
                </span>
                <div className="text-sm font-semibold text-neutral-900">-0.50</div>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-neutral-400 uppercase font-semibold tracking-wider">
                  OS
                </span>
                <div className="text-sm font-semibold text-neutral-900">-0.75</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-1 space-y-4">
          <div>
            <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Lab Notes
            </p>
            <div className="p-3 bg-amber-50 rounded-lg text-[11px] font-medium text-amber-800 leading-relaxed border border-amber-100">
              Customer requested rush delivery if possible. Careful with frame alignment, known
              sensitive fit.
            </div>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Coating
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-semibold rounded uppercase tracking-wider">
                Anti-Reflective
              </span>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-semibold rounded uppercase tracking-wider">
                Blue Light Filter
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
