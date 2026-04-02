import React from 'react'
import { cn } from '@/lib/utils'
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
  { icon: <IoTimeOutline className="text-white w-4 h-4 sm:w-6 sm:h-6" />, label: 'Pending' },
  {
    icon: <IoConstructOutline className="text-white w-4 h-4 sm:w-6 sm:h-6" />,
    label: 'Processing'
  },
  { icon: <IoCubeOutline className="text-white w-4 h-4 sm:w-6 sm:h-6" />, label: 'Packaging' },
  {
    icon: <IoCubeOutline className="text-white w-4 h-4 sm:w-6 sm:h-6" />,
    label: 'Ready for Pickup'
  },
  { icon: <IoCarOutline className="text-white w-4 h-4 sm:w-6 sm:h-6" />, label: 'Shipping' }
]

export default function ProgressTracker({
  steps = DEFAULT_STEPS,
  activeStep = 0,
  title = 'Process Progress'
}: ProcessTrackerProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 border border-mint-200">
      <h2 className="text-md sm:text-lg font-semibold text-mint-900 mb-4 sm:mb-6">{title}</h2>
      <div className="overflow-x-auto custom-scrollbar pb-2">
        <div className="flex items-center justify-between min-w-[300px] sm:min-w-full">
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
                    className={cn(
                      'flex-1 h-0.5 -mx-1 sm:-mx-2 min-w-[10px] sm:min-w-[20px] transition-all duration-500',
                      isCompleted ? 'bg-mint-500' : 'bg-gray-200',
                      // On mobile we don't have labels, so the line should be more centered relative to the icons
                      'mb-0 sm:mb-4'
                    )}
                  ></div>
                )}
              </React.Fragment>
            )
          })}
        </div>
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
