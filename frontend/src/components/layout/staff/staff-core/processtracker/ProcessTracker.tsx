import React from 'react'
import { IoCarOutline, IoConstructOutline, IoCubeOutline, IoTimeOutline } from 'react-icons/io5'
import ProgressTrackerItem from './ProcessTrackerItem'

interface ProcessStep {
  icon: React.ReactNode
  label: string
}

interface ProcessTrackerProps {
  steps?: ProcessStep[]
  activeStep?: number // 0-indexed index of the current step
  title?: string
}

const DEFAULT_STEPS = [
  { icon: <IoTimeOutline size={24} className="text-white" />, label: 'Pending' },
  { icon: <IoConstructOutline size={24} className="text-white" />, label: 'Processing' },
  { icon: <IoCubeOutline size={24} className="text-white" />, label: 'Packaging' },
  { icon: <IoCubeOutline size={24} className="text-white" />, label: 'Ready for Pickup' },
  { icon: <IoCarOutline size={24} className="text-white" />, label: 'Shipping' }
]

export default function ProgressTracker({
  steps = DEFAULT_STEPS,
  activeStep = 0,
  title = 'Process Progress'
}: ProcessTrackerProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-mint-200">
      <h2 className="text-lg font-semibold text-mint-900 mb-6">{title}</h2>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < activeStep
          const isActive = index === activeStep

          return (
            <React.Fragment key={index}>
              <ProgressTrackerItem
                icon={React.cloneElement(step.icon as any, {
                  className: isCompleted || isActive ? 'text-white' : 'text-gray-400'
                })}
                label={step.label}
                isActive={isActive}
                isCompleted={isCompleted}
              />
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 -mx-2 ${isCompleted ? 'bg-mint-500' : 'bg-gray-200'}`}
                ></div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
// Pending	-> PENDING, VERIFIED, APPROVED, ASSIGNED
// Processing ->	MAKING (Order)
// Packaging -> 	PACKAGING, PACKAGED, PACKING (Order)
// Ready for Pickup	-> READY_TO_SHIP, COMPLETED (Invoice)
// Shipping ->	DELIVERING (Invoice)
// Completed	DELIVERED (Invoice) or COMPLETED (Order)
