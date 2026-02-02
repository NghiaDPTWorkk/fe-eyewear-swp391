import React from 'react'

export default function CheckListSection({
  PACKING_ITEMS,
  checkedItems,
  handleCheck
}: {
  PACKING_ITEMS: string[]
  checkedItems: boolean[]
  handleCheck: (index: number) => void
}) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-mint-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Packing Checklist</h3>
      <div className="space-y-3">
        {PACKING_ITEMS.map((item, index) => (
          <div
            key={index}
            className={`flex items-center p-3 border rounded-lg cursor-pointer group transition-colors ${
              checkedItems[index]
                ? 'bg-mint-50 border-mint-200'
                : 'border-gray-100 hover:bg-gray-50'
            }`}
            onClick={() => handleCheck(index)}
          >
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                checked={checkedItems[index]}
                onChange={() => handleCheck(index)}
                className="w-5 h-5 text-mint-600 border-gray-300 rounded focus:ring-mint-500 cursor-pointer"
              />
            </div>
            <div className="ml-3 text-sm select-none">
              <label
                className={`font-medium cursor-pointer ${checkedItems[index] ? 'text-gray-900' : 'text-gray-700'}`}
              >
                {item} <span className="text-red-500">*</span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
