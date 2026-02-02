import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { IoClose, IoSave } from 'react-icons/io5'
import { Button, Input } from '@/components'
import type { LensParameter } from '../types'

interface OrderVerifyModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (params: LensParameter) => void
  isProcessing?: boolean
}

export const OrderVerifyModal: React.FC<OrderVerifyModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isProcessing
}) => {
  const [params, setParams] = useState<LensParameter>({ SPH: -2.0, CYL: -0.5, AXIS: 180, PD: 64 }) // Defaults

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Verify Prescription</h3>
          <Button onClick={onClose}>
            <IoClose size={24} className="text-gray-400 hover:text-gray-600" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {['SPH', 'CYL', 'AXIS', 'PD'].map((field) => (
            <div key={field} className="space-y-1">
              <label className="text-xs font-bold text-gray-500">{field}</label>
              <Input
                type="number"
                step="0.01"
                value={params[field as keyof LensParameter]}
                onChange={(e) => setParams({ ...params, [field]: parseFloat(e.target.value) })}
                className="text-center font-semibold"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button isFullWidth variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            isFullWidth
            onClick={() => onSubmit(params)}
            disabled={isProcessing}
            leftIcon={<IoSave />}
            className="bg-primary-500 hover:bg-primary-600 text-white"
          >
            {isProcessing ? 'Saving...' : 'Verify Order'}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}
