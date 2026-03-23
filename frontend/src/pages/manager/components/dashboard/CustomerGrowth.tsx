import React from 'react'
import { IoArrowUp, IoArrowDown, IoRemove } from 'react-icons/io5'
import type { ReturnMonthlyReportData } from '@/shared/types/return-report.types'

interface CustomerGrowthProps {
  reportData?: ReturnMonthlyReportData
  isLoading?: boolean
}

export const CustomerGrowth: React.FC<CustomerGrowthProps> = ({ reportData, isLoading }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-400'
      case 'IN_PROGRESS':
        return 'bg-blue-400'
      case 'RETURNED':
        return 'bg-mint-500'
      case 'REJECTED':
        return 'bg-rose-500'
      case 'CANCELED':
        return 'bg-slate-400'
      default:
        return 'bg-neutral-300'
    }
  }

  const formatStatus = (status: string) => {
    return status
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase())
  }

  return (
    <div className="p-8 bg-white rounded-3xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-base font-semibold text-gray-900 font-heading tracking-tight">
            Return Tickets Growth
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-800">
              {reportData?.reportByTotal.curCount || 0}
            </span>
            <span className="text-xs text-gray-400 font-medium">Total Returns This Month</span>
            {reportData && (
              <div
                className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  reportData.reportByTotal.difRate > 0
                    ? 'text-rose-600 bg-rose-50'
                    : reportData.reportByTotal.difRate < 0
                      ? 'text-mint-600 bg-mint-50'
                      : 'text-gray-500 bg-gray-50'
                }`}
              >
                {reportData.reportByTotal.difRate > 0 ? (
                  <IoArrowUp />
                ) : reportData.reportByTotal.difRate < 0 ? (
                  <IoArrowDown />
                ) : (
                  <IoRemove />
                )}
                {Math.abs(reportData.reportByTotal.difRate)}%
              </div>
            )}
          </div>
        </div>
        <button className="text-[12px] font-semibold text-gray-400 hover:text-mint-600 transition-colors flex items-center gap-1 uppercase tracking-widest">
          View Detailed Report <span className="text-xs">↗</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[300px]">
          <div className="w-8 h-8 border-4 border-mint-200 border-t-mint-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              Status Breakdown
            </p>
            <div className="space-y-3">
              {reportData?.reportByStatus.map((item) => (
                <div key={item.status} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(item.status)}`} />
                    <span className="text-[13px] font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">
                      {formatStatus(item.status)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-slate-800">{item.curCount}</span>
                    <span
                      className={`text-[10px] font-bold min-w-[35px] text-right ${
                        item.difRate > 0
                          ? 'text-rose-500'
                          : item.difRate < 0
                            ? 'text-mint-500'
                            : 'text-slate-300'
                      }`}
                    >
                      {item.difRate !== 0 && (item.difRate > 0 ? '+' : '')}
                      {item.difRate}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden bg-slate-50/50 flex flex-col items-center justify-center p-6 border border-slate-100/50">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-sm mb-4 border border-slate-100">
                <span className="text-3xl font-black text-slate-800">
                  {reportData?.reportByTotal.curCount}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-700 mb-1">Total Returns</h4>
              <p className="text-[11px] text-slate-400 font-medium">
                compared to {reportData?.reportByTotal.preCount} last month
              </p>
            </div>

            <div className="absolute bottom-6 left-0 right-0 px-6">
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-mint-500 rounded-full transition-all duration-1000"
                  style={{
                    width: `${Math.min(((reportData?.reportByTotal.curCount || 0) / (reportData?.reportByTotal.preCount || 1)) * 50, 100)}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
