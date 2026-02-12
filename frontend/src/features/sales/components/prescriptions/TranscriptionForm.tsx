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
  isReadOnly: boolean
  isApproved: boolean
  processing: boolean
  handleApprove: () => void
  handleReject: () => void
  assignStaff?: string
}

export const TranscriptionForm: React.FC<TranscriptionFormProps> = ({
  parameters,
  isReadOnly,
  isApproved,
  processing,
  handleApprove,
  handleReject,
  assignStaff
}) => {
  return (
    <Card className="p-0 border border-gray-200 overflow-hidden shadow-sm rounded-xl bg-white">
      <div className="px-4 py-3 bg-white border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white text-slate-300 flex items-center justify-center border border-slate-100 shadow-sm">
            <IoInformationCircleOutline size={20} />
          </div>
          <div>
            <h3 className="text-base font-medium text-slate-800 tracking-tight">
              Transcription Data
            </h3>
            <p className="text-[10px] font-normal text-slate-400 mt-0.5 uppercase tracking-wide">
              Prescription details from customer
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white space-y-4">
        {/* Right Eye (OD) */}
        <div className="bg-white p-4 rounded-xl border border-slate-100">
          <h4 className="font-medium text-[10px] text-mint-500 mb-5 flex items-center gap-2 uppercase tracking-[0.3em]">
            <IoEyeOutline size={16} className="text-mint-400" /> RIGHT EYE (OD)
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.15em] pl-1 block text-center">
                SPH
              </label>
              <Input
                readOnly={isReadOnly}
                defaultValue={parameters?.right?.SPH || '0.00'}
                className="bg-white border-slate-200 focus:border-mint-500 focus:ring-mint-500/10 font-normal text-slate-700 text-center h-12 rounded-2xl shadow-sm transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.15em] pl-1 block text-center">
                CYL
              </label>
              <Input
                readOnly={isReadOnly}
                defaultValue={parameters?.right?.CYL || '0.00'}
                className="bg-white border-slate-200 focus:border-mint-500 focus:ring-mint-500/10 font-normal text-slate-700 text-center h-12 rounded-2xl shadow-sm transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.15em] pl-1 block text-center">
                AXIS
              </label>
              <Input
                readOnly={isReadOnly}
                defaultValue={parameters?.right?.AXIS || '0'}
                className="bg-white border-slate-200 focus:border-mint-500 focus:ring-mint-500/10 font-normal text-slate-700 text-center h-12 rounded-2xl shadow-sm transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.15em] pl-1 block text-center">
                ADD
              </label>
              <Input
                readOnly={isReadOnly}
                defaultValue="-"
                className="bg-white border-slate-200 focus:border-mint-500 focus:ring-mint-500/10 font-normal text-slate-700 text-center h-12 rounded-2xl shadow-sm transition-all"
              />
            </div>
          </div>
        </div>

        {/* Left Eye (OS) */}
        <div className="bg-white p-4 rounded-xl border border-slate-100">
          <h4 className="font-medium text-[10px] text-mint-400 mb-5 flex items-center gap-2 uppercase tracking-[0.3em] opacity-80">
            <IoEyeOutline size={16} className="text-mint-400" /> LEFT EYE (OS)
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.15em] pl-1 block text-center">
                SPH
              </label>
              <Input
                readOnly={isReadOnly}
                defaultValue={parameters?.left?.SPH || '0.00'}
                className="bg-white border-neutral-200 font-normal text-slate-700 text-center h-12 rounded-2xl shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.15em] pl-1 block text-center">
                CYL
              </label>
              <Input
                readOnly={isReadOnly}
                defaultValue={parameters?.left?.CYL || '0.00'}
                className="bg-white border-neutral-200 font-normal text-slate-700 text-center h-12 rounded-2xl shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.15em] pl-1 block text-center">
                AXIS
              </label>
              <Input
                readOnly={isReadOnly}
                defaultValue={parameters?.left?.AXIS || '0'}
                className="bg-white border-neutral-200 font-normal text-slate-700 text-center h-12 rounded-2xl shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.15em] pl-1 block text-center">
                ADD
              </label>
              <Input
                readOnly={isReadOnly}
                defaultValue="-"
                className="bg-white border-neutral-200 font-normal text-slate-700 text-center h-12 rounded-2xl shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* PD & Notes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start pt-2">
          {/* PD Section */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] pl-1 block">
              PUPILLARY DISTANCE (PD)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Input
                  readOnly={isReadOnly}
                  defaultValue={parameters?.PD || '31.5'}
                  className="font-semibold text-slate-700 text-center border-slate-200 h-14 pr-8 rounded-2xl focus:border-mint-500 focus:ring-mint-500/10 shadow-sm"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                  R
                </span>
              </div>
              <div className="relative">
                <Input
                  readOnly={isReadOnly}
                  defaultValue={parameters?.PD || '31.5'}
                  className="font-semibold text-slate-700 text-center border-slate-200 h-14 pr-8 rounded-2xl focus:border-mint-500 focus:ring-mint-500/10 shadow-sm"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                  L
                </span>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-4">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.15em] pl-1 block">
              NOTES
            </label>
            <textarea
              readOnly={isReadOnly}
              className="w-full h-14 p-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 text-sm font-medium text-slate-700 resize-none bg-white transition-all placeholder:text-slate-300 shadow-sm"
              placeholder="Enter special instructions for lab technician..."
            ></textarea>
          </div>
        </div>
      </div>

      {!isReadOnly && !isApproved && (
        <div className="bg-white p-6 flex gap-4 border-t border-slate-100">
          <Button
            isFullWidth
            onClick={handleApprove}
            isLoading={processing}
            className="bg-mint-600 hover:bg-mint-700 text-white font-medium h-12 rounded-xl shadow-md shadow-mint-100 transition-all active:scale-95 border-none"
            leftIcon={<IoCheckmark size={20} />}
          >
            Verify & Submit to Lab
          </Button>
          <Button
            isFullWidth
            onClick={handleReject}
            isLoading={processing}
            variant="outline"
            colorScheme="neutral"
            className="bg-white border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 font-medium h-12 rounded-xl transition-all active:scale-95 shadow-none"
            leftIcon={<IoClose size={20} />}
          >
            Reject Order
          </Button>
        </div>
      )}
      {isApproved && (
        <div className="p-6 bg-white border-t border-neutral-50/50">
          <div className="bg-neutral-50/50 border border-neutral-100/50 rounded-[3.5rem] p-10 transition-all hover:bg-neutral-50 duration-500">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-[1.75rem] bg-mint-200/60 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-mint-100/50 transition-transform hover:scale-105">
                  <IoCheckmark size={36} className="text-white stroke-[4]" />
                </div>
                <h3 className="text-2xl font-semibold text-mint-600 tracking-tight">
                  Verified and Approved
                </h3>
              </div>

              <div className="max-w-[18rem] bg-white border border-neutral-100 rounded-[2rem] p-4 flex items-center gap-4 shadow-sm transition-all hover:shadow-md ml-[88px]">
                <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center border border-neutral-100">
                  <IoPersonOutline className="text-slate-300" size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-[0.2em] mb-1">
                    Verified by
                  </p>
                  <p className="text-sm font-semibold text-slate-800 tracking-tight">
                    {assignStaff || 'Sales Staff'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
