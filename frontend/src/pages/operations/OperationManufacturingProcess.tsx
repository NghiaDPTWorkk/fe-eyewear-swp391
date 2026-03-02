import { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Container } from '@/components'
import { IoArrowBack, IoSettingsOutline, IoCheckmarkCircle, IoReload } from 'react-icons/io5'
import { ProcessTracker } from '@/components/layout/staff/staff-core/processtracker'
import { BreadcrumbPath } from '@/components/layout/staff/operationstaff/breadcrumbpath'
import { Button } from '@/shared/components/ui/button'
import { PATHS } from '@/routes/paths'
import { useUpdateStatusToPackaging } from '@/features/staff/hooks/orders/useOrders'
import toast from 'react-hot-toast'
import { useQueryClient } from '@tanstack/react-query'

export default function OperationManufacturingProcess() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()

  // Lấy data từ trang trước
  const state = location.state as { status?: string; products?: any[]; orderType?: string } | null
  const products = state?.products || []
  // const orderType = state?.orderType || 'MANUFACTURING'

  const [selectedMachine, setSelectedMachine] = useState('')
  const [isCompleted, setIsCompleted] = useState(false)
  const updateStatus = useUpdateStatusToPackaging()

  // Extract lens parameters from products
  const lensParameters = products[0]?.lens?.parameters

  // Machine options
  const machines = [
    { id: 'essilor', name: 'Essilor Kappa CTD', status: 'Available' },
    { id: 'nidek', name: 'Nidek LE-9000', status: 'Available' },
    { id: 'huvitz', name: 'Huvitz HLM-7000', status: 'In Use' }
  ]

  const handleCompleteStage = () => {
    if (!selectedMachine) {
      toast.error('Please select a grinding machine')
      return
    }

    if (orderId) {
      updateStatus.mutate(orderId, {
        onSuccess: () => {
          setIsCompleted(true)
          toast.success('Manufacturing completed! Moving to packing stage...')
          queryClient.invalidateQueries({ queryKey: ['orders'] })
          queryClient.invalidateQueries({ queryKey: ['order', orderId] })

          // Navigate to Packing Process
          setTimeout(() => {
            navigate(PATHS.OPERATIONSTAFF.PACKING_PROCESS(orderId), {
              state: {
                status: 'PACKAGING',
                products: products
              }
            })
          }, 1000)
        },
        onError: () => {
          toast.error('Failed to update order status')
        }
      })
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <Container className="animate-fade-in-up">
      {/* Breadcrumb Path */}
      <BreadcrumbPath paths={['Dashboard', 'Manufacturing Process']} />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-5">
          <button
            onClick={handleBack}
            className="p-3 bg-white hover:bg-neutral-50 rounded-xl shadow-sm transition-all border border-neutral-100"
          >
            <IoArrowBack size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
              <IoSettingsOutline className="text-indigo-500" /> Lens Grinding & Mounting
            </h1>
            <p className="text-sm text-neutral-500 mt-1 font-medium italic opacity-80 uppercase tracking-widest text-[10px]">
              MANUFACTURING WORKFLOW
            </p>
          </div>
        </div>
        <span className="px-6 py-2 bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-full text-xs font-bold uppercase tracking-widest">
          {isCompleted ? 'COMPLETED' : 'MAKING'}
        </span>
      </div>

      {/* Progress Tracker */}
      <ProcessTracker />

      <div className="grid grid-cols-12 gap-6 mt-6">
        {/* Left Column - Lens Prescription */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          {/* Lens Prescription Section */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
              Lens Prescription
            </h2>

            {lensParameters ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Eye</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">SPH</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">CYL</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">AXIS</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">ADD</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">PD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Right Eye */}
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">Right Eye (OD)</td>
                      <td className="py-3 px-4 text-center text-gray-700">
                        {lensParameters.right.SPH}
                      </td>
                      <td className="py-3 px-4 text-center text-gray-700">
                        {lensParameters.right.CYL}
                      </td>
                      <td className="py-3 px-4 text-center text-gray-700">
                        {lensParameters.right.AXIS}°
                      </td>
                      <td className="py-3 px-4 text-center text-gray-700">
                        {lensParameters.right.ADD || '-'}
                      </td>
                      <td className="py-3 px-4 text-center text-gray-700" rowSpan={2}>
                        {lensParameters.PD} mm
                      </td>
                    </tr>
                    {/* Left Eye */}
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">Left Eye (OS)</td>
                      <td className="py-3 px-4 text-center text-gray-700">
                        {lensParameters.left.SPH}
                      </td>
                      <td className="py-3 px-4 text-center text-gray-700">
                        {lensParameters.left.CYL}
                      </td>
                      <td className="py-3 px-4 text-center text-gray-700">
                        {lensParameters.left.AXIS}°
                      </td>
                      <td className="py-3 px-4 text-center text-gray-700">
                        {lensParameters.left.ADD || '-'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No lens prescription data available</p>
            )}
          </div>
        </div>

        {/* Right Column - Machine Selection */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          {/* Machine Selection */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-mint-500 rounded-full"></span>
              Select Grinding Machine
            </h2>

            <div className="space-y-3">
              {machines.map((machine) => (
                <button
                  key={machine.id}
                  onClick={() => setSelectedMachine(machine.id)}
                  disabled={machine.status === 'In Use' || isCompleted}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedMachine === machine.id
                      ? 'border-mint-500 bg-mint-50'
                      : machine.status === 'In Use'
                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                        : 'border-gray-200 hover:border-mint-300 hover:bg-mint-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{machine.name}</p>
                      <p
                        className={`text-xs mt-1 ${machine.status === 'Available' ? 'text-mint-600' : 'text-gray-500'}`}
                      >
                        {machine.status}
                      </p>
                    </div>
                    {selectedMachine === machine.id && (
                      <IoCheckmarkCircle className="text-mint-500" size={24} />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end items-center mt-8 pt-4 border-t border-gray-200">
        <Button
          onClick={handleCompleteStage}
          disabled={!selectedMachine || isCompleted || updateStatus.isPending}
          className={`px-8 py-3 rounded-lg font-medium transition-all shadow-lg flex items-center gap-2 border-2 ${
            isCompleted
              ? 'bg-white text-mint-600 border-mint-200 cursor-default'
              : selectedMachine
                ? 'bg-mint-900 text-white border-mint-900 hover:bg-mint-700 hover:border-mint-700 transform hover:-translate-y-1 shadow-mint-200'
                : 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed'
          }`}
        >
          {updateStatus.isPending ? (
            <>
              <IoReload className="animate-spin text-white" size={20} />
              Processing...
            </>
          ) : isCompleted ? (
            <>
              <IoCheckmarkCircle size={22} />
              STAGE COMPLETED
            </>
          ) : (
            'Complete Stage'
          )}
        </Button>
      </div>
    </Container>
  )
}
