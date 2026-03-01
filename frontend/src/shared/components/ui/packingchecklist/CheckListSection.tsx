import React from 'react'

interface CheckListSectionProps {
  children: React.ReactNode
  onCheckAll?: () => void
}

export default function CheckListSection({ children, onCheckAll }: CheckListSectionProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-mint-500"></span>
          Final Checklist
        </h3>
        {onCheckAll && (
          <button
            onClick={onCheckAll}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-mint-700 bg-mint-50 border border-mint-200 rounded-lg hover:bg-mint-100 transition-colors"
          >
            Check All
          </button>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
}
