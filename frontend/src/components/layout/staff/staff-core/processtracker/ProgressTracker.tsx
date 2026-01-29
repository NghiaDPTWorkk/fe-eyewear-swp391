import React from 'react'
import { IoCarOutline, IoConstructOutline, IoCubeOutline, IoTimeOutline } from 'react-icons/io5'
import ProgressTrackerItem from './ProgressTrackerItem'

const STEPS = [
  {
    icon: <IoTimeOutline size={24} className="text-white" />,
    label: 'Chờ xử lý',
    isActive: true, // Example logic based on original hardcoded values
    isCompleted: true
  },
  {
    icon: <IoConstructOutline size={24} className="text-white" />,
    label: 'Đang xử lý',
    isActive: true,
    isCompleted: false
  },
  {
    icon: <IoCubeOutline size={24} className="text-gray-400" />,
    label: 'Đóng gói',
    isActive: false,
    isCompleted: false
  },
  {
    icon: <IoCubeOutline size={24} className="text-gray-400" />,
    label: 'Chờ lấy',
    isActive: false,
    isCompleted: false
  },
  {
    icon: <IoCarOutline size={24} className="text-gray-400" />,
    label: 'Vận chuyển',
    isActive: false,
    isCompleted: false
  }
]

export default function ProgressTracker() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-mint-200">
      <h2 className="text-lg font-semibold text-mint-900 mb-6">Tiến độ đơn hàng</h2>
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => (
          <React.Fragment key={index}>
            <ProgressTrackerItem
              icon={step.icon}
              label={step.label}
              isActive={step.isActive}
              isCompleted={step.isCompleted}
            />
            {index < STEPS.length - 1 && <div className="flex-1 h-0.5 bg-gray-200 -mx-2"></div>}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
