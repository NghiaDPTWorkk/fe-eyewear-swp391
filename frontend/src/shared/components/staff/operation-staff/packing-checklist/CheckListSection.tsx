import React from 'react'

export default function CheckListSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-mint-500"></span>
        Final Checklist
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  )
}
