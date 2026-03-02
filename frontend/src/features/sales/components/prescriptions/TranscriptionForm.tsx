import React from 'react'
import {
  IoCheckmark,
  IoClose,
  IoEyeOutline,
  IoInformationCircleOutline,
  IoPersonOutline
} from 'react-icons/io5'
import { Button, Card, Input } from '@/shared/components/ui-core'

interface TranscriptionFormProps {
  parameters: any
  onParametersChange?: (params: any) => void
  isReadOnly: boolean
  isApproved: boolean
  isRejected: boolean
  processing: boolean
  handleApprove: () => void
  handleReject: () => void
  assignStaff?: string
  staffName?: string
  actionTime?: string
  rejectionNote?: string
}

export const TranscriptionForm: React.FC<TranscriptionFormProps> = ({
  parameters,
  onParametersChange,
  isReadOnly,
  isApproved,
  isRejected,
  processing,
  handleApprove,
  handleReject,
  assignStaff,
  staffName,
  actionTime,
  rejectionNote
}) => {
  const handleChange = (eye: 'left' | 'right' | 'common', field: string, value: string) => {
    if (!onParametersChange) return

    // Allow comma as decimal separator internally
    const normalizedValue = value.replace(',', '.')

    // Allow typing numbers, one decimal point, and a leading minus sign
    if (
      normalizedValue !== '' &&
      normalizedValue !== '-' &&
      normalizedValue !== '.' &&
      normalizedValue !== '-.' &&
      !/^-?\d*\.?\d*$/.test(normalizedValue)
    ) {
      return
    }

    const newParams = { ...parameters }

    if (eye === 'common') {
      newParams[field] = normalizedValue
    } else {
      newParams[eye] = {
        ...newParams[eye],
        [field]: normalizedValue
      }
    }

    onParametersChange(newParams)
  }

  return (
    <Card className="p-0 border border-gray-200 overflow-hidden shadow-sm rounded-xl bg-white text-slate-700">
      <div className="px-5 py-4 bg-white border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100">
            <IoInformationCircleOutline size={20} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-800 tracking-tight">
              Transcription Data
            </h3>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">
              Prescription details from customer
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 bg-white space-y-5">
        {/* Right Eye (OD) */}
        <div className="bg-slate-50/40 p-5 rounded-xl border border-slate-100/60">
          <h4 className="font-semibold text-xs text-mint-600 mb-4 flex items-center gap-2 uppercase tracking-[0.15em]">
            <IoEyeOutline size={16} className="text-mint-500" /> RIGHT EYE (OD)
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block text-center">
                SPH
              </label>
              <Input
                readOnly={isReadOnly}
                value={parameters?.right?.SPH ?? '0.00'}
                onChange={(e) => handleChange('right', 'SPH', e.target.value)}
                className="bg-white border-slate-200 focus:border-mint-500 focus:ring-mint-500/10 font-semibold text-slate-700 text-center h-12 rounded-xl text-sm transition-all shadow-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block text-center">
                CYL
              </label>
              <Input
                readOnly={isReadOnly}
                value={parameters?.right?.CYL ?? '0.00'}
                onChange={(e) => handleChange('right', 'CYL', e.target.value)}
                className="bg-white border-slate-200 focus:border-mint-500 focus:ring-mint-500/10 font-semibold text-slate-700 text-center h-12 rounded-xl text-sm transition-all shadow-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block text-center">
                AXIS
              </label>
              <Input
                readOnly={isReadOnly}
                value={parameters?.right?.AXIS ?? '0'}
                onChange={(e) => handleChange('right', 'AXIS', e.target.value)}
                className="bg-white border-slate-200 focus:border-mint-500 focus:ring-mint-500/10 font-semibold text-slate-700 text-center h-12 rounded-xl text-sm transition-all shadow-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block text-center">
                ADD
              </label>
              <Input
                readOnly={isReadOnly}
                value={parameters?.right?.ADD ?? '0.00'}
                onChange={(e) => handleChange('right', 'ADD', e.target.value)}
                className="bg-white border-slate-200 focus:border-mint-500 focus:ring-mint-500/10 font-semibold text-slate-700 text-center h-12 rounded-xl text-sm transition-all shadow-none"
              />
            </div>
          </div>
        </div>

        {/* Left Eye (OS) */}
        <div className="bg-slate-50/40 p-5 rounded-xl border border-slate-100/60">
          <h4 className="font-semibold text-xs text-mint-600 mb-4 flex items-center gap-2 uppercase tracking-[0.15em]">
            <IoEyeOutline size={16} className="text-mint-500" /> LEFT EYE (OS)
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block text-center">
                SPH
              </label>
              <Input
                readOnly={isReadOnly}
                value={parameters?.left?.SPH ?? '0.00'}
                onChange={(e) => handleChange('left', 'SPH', e.target.value)}
                className="bg-white border-slate-200 focus:border-mint-500 focus:ring-mint-500/10 font-semibold text-slate-700 text-center h-12 rounded-xl text-sm transition-all shadow-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block text-center">
                CYL
              </label>
              <Input
                readOnly={isReadOnly}
                value={parameters?.left?.CYL ?? '0.00'}
                onChange={(e) => handleChange('left', 'CYL', e.target.value)}
                className="bg-white border-slate-200 focus:border-mint-500 focus:ring-mint-500/10 font-semibold text-slate-700 text-center h-12 rounded-xl text-sm transition-all shadow-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block text-center">
                AXIS
              </label>
              <Input
                readOnly={isReadOnly}
                value={parameters?.left?.AXIS ?? '0'}
                onChange={(e) => handleChange('left', 'AXIS', e.target.value)}
                className="bg-white border-slate-200 focus:border-mint-500 focus:ring-mint-500/10 font-semibold text-slate-700 text-center h-12 rounded-xl text-sm transition-all shadow-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block text-center">
                ADD
              </label>
              <Input
                readOnly={isReadOnly}
                value={parameters?.left?.ADD ?? '0.00'}
                onChange={(e) => handleChange('left', 'ADD', e.target.value)}
                className="bg-white border-slate-200 focus:border-mint-500 focus:ring-mint-500/10 font-semibold text-slate-700 text-center h-12 rounded-xl text-sm transition-all shadow-none"
              />
            </div>
          </div>
        </div>

        {/* PD & Notes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start pt-2">
          {/* PD Section */}
          <div className="space-y-3">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] block">
              PUPILLARY DISTANCE (PD)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Input
                  readOnly={isReadOnly}
                  value={parameters?.PD ?? '64'}
                  onChange={(e) => handleChange('common', 'PD', e.target.value)}
                  className="font-semibold text-slate-700 text-center border-slate-200 h-12 pr-10 rounded-xl focus:border-mint-500 focus:ring-mint-500/10 text-sm shadow-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                  R
                </span>
              </div>
              <div className="relative">
                <Input
                  readOnly={isReadOnly}
                  value={parameters?.PD ?? '64'}
                  onChange={(e) => handleChange('common', 'PD', e.target.value)}
                  className="font-semibold text-slate-700 text-center border-slate-200 h-12 pr-10 rounded-xl focus:border-mint-500 focus:ring-mint-500/10 text-sm shadow-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                  L
                </span>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-3">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] block">
              NOTES
            </label>
            <textarea
              readOnly={isReadOnly}
              className="w-full h-12 p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-mint-500/10 focus:border-mint-500 text-sm font-medium text-slate-700 resize-none bg-white transition-all placeholder:font-normal placeholder:text-slate-300 shadow-none overflow-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              placeholder="Lab instructions..."
            ></textarea>
          </div>
        </div>
      </div>

      {!isReadOnly && !isApproved && !isRejected && (
        <div className="p-5 flex gap-4 border-t border-slate-100 bg-slate-50/20">
          <Button
            isFullWidth
            onClick={handleApprove}
            isLoading={processing}
            className="bg-mint-600 hover:bg-mint-700 text-white font-semibold h-12 rounded-xl shadow-md shadow-mint-100/30 text-sm transition-all active:scale-[0.98] border-none"
            leftIcon={<IoCheckmark size={20} />}
          >
            Verify & Submit
          </Button>
          <Button
            isFullWidth
            onClick={handleReject}
            isLoading={processing}
            variant="outline"
            colorScheme="neutral"
            className="bg-white border-slate-200 text-slate-500 hover:text-red-500 hover:bg-red-50 hover:border-red-200 font-semibold h-12 rounded-xl text-sm transition-all active:scale-[0.98] shadow-none"
            leftIcon={<IoClose size={20} />}
          >
            Reject Order
          </Button>
        </div>
      )}

      {isApproved && (
        <div className="p-6 bg-white border-t border-neutral-50/50 text-slate-600">
          <div className="bg-neutral-50 border border-neutral-100 rounded-3xl p-8 transition-all duration-300">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-mint-500 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-mint-100">
                  <IoCheckmark size={32} className="text-white stroke-[3.5]" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-mint-600 tracking-tight">
                    Verified and Approved
                  </h3>
                  {actionTime && (
                    <p className="text-[11px] text-slate-400 font-medium">
                      Processed on {actionTime}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4 ml-[76px]">
                <div className="max-w-fit bg-white border border-neutral-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                    <IoPersonOutline className="text-slate-400" size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest leading-none mb-1.5">
                      APPROVED BY
                    </p>
                    <p className="text-sm font-semibold text-slate-800">
                      {staffName || assignStaff || 'Sales Staff'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isRejected && (
        <div className="p-6 bg-white border-t border-rose-50/50">
          <div className="bg-rose-50/40 border border-rose-100 rounded-3xl p-8 transition-all duration-300">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-rose-500 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-rose-100">
                  <IoClose size={32} className="text-white stroke-[3.5]" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-rose-600 tracking-tight">
                    Disputed and Rejected
                  </h3>
                  {actionTime && (
                    <p className="text-[11px] text-rose-400 font-medium">
                      Rejected on {actionTime}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4 ml-[76px]">
                <div className="max-w-fit bg-white border border-rose-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center border border-rose-100">
                    <IoPersonOutline className="text-rose-400" size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-rose-400 font-semibold uppercase tracking-widest leading-none mb-1.5">
                      REJECTED BY
                    </p>
                    <p className="text-sm font-semibold text-slate-800">
                      {staffName || assignStaff || 'Sales Staff'}
                    </p>
                  </div>
                </div>

                {(rejectionNote || (parameters as any).note) && (
                  <div className="bg-white/90 border border-rose-100/60 rounded-2xl p-5 max-w-xl shadow-sm animate-in fade-in slide-in-from-top-2 duration-500">
                    <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                      REJECTION REASON
                    </p>
                    <div className="relative pl-4 border-l-2 border-rose-200">
                      <p className="text-sm text-slate-700 leading-relaxed font-semibold italic">
                        "{rejectionNote || (parameters as any).note}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
