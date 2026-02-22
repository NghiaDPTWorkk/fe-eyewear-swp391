import React from 'react'
import { IoConstructOutline, IoMailOutline } from 'react-icons/io5'
import { Button, Card } from '@/shared/components/ui-core'

export const LabOperationsTimeline: React.FC = () => {
  return (
    <Card className="p-0 border border-gray-200 shadow-sm overflow-hidden rounded-xl bg-white">
      <div className="p-4 bg-white border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
          <IoConstructOutline className="text-slate-400" /> Lab Operations
        </h3>
        <span className="w-2 h-2 bg-mint-500 rounded-full animate-pulse"></span>
      </div>

      <div className="p-4 space-y-4">
        {/* Status Timeline */}
        <div className="relative border-l border-gray-200 ml-1.5 space-y-5 py-2">
          <div className="pl-4 relative">
            <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-gray-200 border-2 border-white"></div>
            <p className="text-xs text-gray-500">Technician Review</p>
            <p className="text-[10px] text-gray-400">Pending assignment</p>
          </div>
          <div className="pl-4 relative">
            <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-mint-500 border-2 border-white shadow-sm ring-2 ring-mint-50"></div>
            <p className="text-xs font-medium text-gray-800">Data Transcription</p>
            <p className="text-[10px] text-gray-500">Started 5m ago by You</p>
          </div>
        </div>
      </div>

      <div className="p-3 bg-white border-t border-slate-50 text-center">
        <Button
          variant="outline"
          colorScheme="neutral"
          className="text-xs font-medium text-slate-400 flex items-center justify-center gap-2 hover:text-mint-600 hover:border-mint-200 transition-all uppercase tracking-widest w-full py-2 bg-white"
        >
          <IoMailOutline size={16} /> Contact Lab Manager
        </Button>
      </div>
    </Card>
  )
}
