import { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Container } from '@/components'
import { IoArrowBack, IoSettingsOutline, IoCheckmarkCircle, IoReload, IoBarcodeOutline } from 'react-icons/io5'
import { ProcessTracker } from '@/components/layout/staff/staff-core/process-tracker'
import { BreadcrumbPath } from '@/components/layout/staff/operation-staff/breadcrumb-path'
import { Button } from '@/shared/components/ui/button'
import { PATHS } from '@/routes/paths'
import { useUpdateStatusToPackaging } from '@/features/staff/hooks/orders/useOrders'
import toast from 'react-hot-toast'
import { useQueryClient } from '@tanstack/react-query'
import { getOrderProgressStep } from '@/shared/utils/order-status.utils'

export default function OperationManufacturingProcess() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()

  // Fetch data from previous page
  const state = location.state as { status?: string; products?: any[]; orderType?: string } | null
  const products = state?.products || []
  // const orderType = state?.orderType || 'MANUFACTURING'

  const [isCompleted, setIsCompleted] = useState(false)
  const updateStatus = useUpdateStatusToPackaging()

  // Get lens parameters from products
  const lensParameters = products[0]?.lens?.parameters

  const handleCompleteStage = () => {

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-5 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-3 bg-white hover:bg-neutral-50 rounded-xl shadow-sm transition-all border border-neutral-100 shrink-0"
          >
            <IoArrowBack size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2 md:gap-3">

              <span className="truncate">Lens Grinding & Mounting</span>
            </h1>
            <p className="text-[10px] text-neutral-500 mt-1 font-medium tracking-widest uppercase opacity-80 italic">
              MANUFACTURING WORKFLOW
            </p>
          </div>
        </div>
        <div className="sm:ml-auto">
          <span className="inline-block px-6 py-2 bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-full text-xs font-bold uppercase tracking-widest text-center">
            MAKING
          </span>
        </div>
      </div>

      {/* Progress Tracker */}
      <ProcessTracker activeStep={getOrderProgressStep('MAKING')} />

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

          {/* Frame Information Section */}
          <div className="bg-white rounded-lg shadow-sm border border-mint-100 p-6">
            <h2 className="text-lg font-semibold text-mint-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-mint-900 rounded-full"></span>
              Frame Information
            </h2>

            <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl border border-mint-100">
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <IoBarcodeOutline size={32} className="text-mint-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-mint-400 uppercase tracking-widest mb-1">
                  Frame SKU
                </p>
                <p className="text-2xl font-black text-mint-900 tracking-tight">
                  {products[0]?.product?.sku || 'N/A'}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-500 italic">
              * Please ensure that you have the correct frame before beginning the manufacturing
              process.
            </p>
          </div>
        </div>

        {/* Right Column - Process Status */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-neutral-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-mint-500 rounded-full"></span>
              Process Status
            </h2>

            <div className="space-y-4">
              <div
                className={`p-6 rounded-xl border-2 transition-all ${
                  isCompleted ? 'border-mint-500 bg-mint-50/50' : 'border-amber-500 bg-amber-50/30'
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div
                    className={`p-4 rounded-full ${
                      isCompleted ? 'bg-mint-100 text-mint-600' : 'bg-amber-100 text-amber-600'
                    }`}
                  >
                    {isCompleted ? (
                      <IoCheckmarkCircle size={40} />
                    ) : (
                      <IoSettingsOutline className="animate-spin-slow" size={40} />
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      {isCompleted ? 'Grinding Completed' : 'MAKING'}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {isCompleted
                        ? 'Lens grinding and assembly have been completed.'
                        : 'The manufacturing process is active. Please check quality after completion.'}
                    </p>
                  </div>

                  {!isCompleted && (
                    <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-full text-xs font-bold animate-pulse">
                      <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
                      PROCESS ACTIVE
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                <p className="text-xs text-amber-700 leading-relaxed font-medium">
                  <strong>Note:</strong> Ensure lens parameters match requirements before starting
                  grinding. The system will record the start time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end items-center mt-8 pt-4 border-t border-gray-200">
        <Button
          onClick={handleCompleteStage}
          disabled={isCompleted || updateStatus.isPending}
          className={`px-8 py-3 rounded-lg font-medium transition-all shadow-lg flex items-center gap-2 border-2 ${
            isCompleted
              ? 'bg-mint-900 text-white border-mint-900 cursor-default opacity-80'
              : 'bg-mint-900 text-white border-mint-900 hover:bg-mint-700 hover:border-mint-700 transform hover:-translate-y-1 shadow-mint-200'
          }`}
        >
          {updateStatus.isPending || isCompleted ? (
            <>
              <IoReload className="animate-spin text-white" size={20} />
              Processing...
            </>
          ) : (
            'Complete Stage'
          )}
        </Button>
      </div>
    </Container>
  )
}
