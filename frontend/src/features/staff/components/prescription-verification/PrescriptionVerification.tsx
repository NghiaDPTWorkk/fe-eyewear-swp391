import { useState } from 'react'
import {
  IoArrowBackOutline,
  IoInformationCircleOutline,
  IoCheckmark,
  IoClose,
  IoAdd,
  IoRemove,
  IoRefresh,
  IoEyeOutline,
  IoCalendarOutline,
  IoPersonOutline,
  IoGlassesOutline,
  IoConstructOutline,
  IoWalletOutline,
  IoCubeOutline
} from 'react-icons/io5'
import { Card, Button, Input } from '@/components'
import { useSalesStaffOrderDetail } from '@/features/sales/hooks'
import { OrderType } from '@/shared/utils/enums/order.enum'

interface PrescriptionVerificationProps {
  orderId: string
  onBack: () => void
}

export default function PrescriptionVerification({
  orderId,
  onBack
}: PrescriptionVerificationProps) {
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(100)

  const { data: order, isLoading } = useSalesStaffOrderDetail(orderId || '')

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="w-12 h-12 border-4 border-mint-500/20 border-t-mint-500 rounded-full animate-spin" />
      </div>
    )
  }

  // Formatting helpers
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (amount: number) => {
    return amount.toLocaleString() + ' ₫'
  }

  // Determine priority label for display
  const getPriorityLabel = () => {
    const isManufacturing = order?.type?.includes(OrderType.MANUFACTURING) || order?.isPrescription
    if (isManufacturing) return 'Prescription'
    if (order?.type?.includes(OrderType.PRE_ORDER)) return 'Pre-order'
    return 'Regular'
  }

  // Find first prescription image
  const prescriptionScan =
    order?.products?.find((p) => p.prescriptionImageUrl)?.prescriptionImageUrl ||
    'https://placehold.co/600x800/png?text=Prescription+Scan'

  // Prescription Parameters (from first product)
  const firstLensParams = order?.products?.find((p) => p.lens)?.lens?.parameters

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="group p-2.5 bg-white border border-gray-200/60 hover:border-mint-200 hover:bg-mint-50/30 rounded-xl shadow-sm hover:shadow hover:scale-105 transition-all duration-200 mr-2 flex items-center justify-center"
          >
            <IoArrowBackOutline
              size={22}
              className="text-gray-400 group-hover:text-mint-600 transition-colors duration-200"
            />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Rx Verification</h1>
            <p className="text-gray-500 text-sm font-normal">
              Verify prescription details before sending to lab
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-mint-50 text-mint-600 font-semibold rounded-full text-xs border border-mint-100 uppercase tracking-wide">
            {getPriorityLabel()}
          </span>
          <div className="h-6 w-px bg-gray-200"></div>
          <div className="px-4 py-1.5 bg-orange-50 text-orange-600 font-semibold rounded-full text-sm border border-orange-100">
            {order?.status || 'Pending'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column (Main Content): Image & Data Entry */}
        <div className="xl:col-span-8 space-y-6">
          {/* Image Viewer */}
          <Card className="p-0 overflow-hidden h-[600px] flex flex-col border border-neutral-200 shadow-sm relative group rounded-[32px]">
            <div className="flex justify-between items-center p-4 border-b border-neutral-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider flex items-center gap-2">
                <IoEyeOutline /> Prescription Scan
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setZoom((prev) => Math.min(prev + 10, 200))}
                  className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg text-gray-500 transition-all border border-transparent hover:border-gray-200"
                >
                  <IoAdd size={18} />
                </button>
                <span className="text-xs font-mono font-medium text-gray-500 self-center w-12 text-center bg-white px-2 py-0.5 rounded border border-gray-100">
                  {zoom}%
                </span>
                <button
                  onClick={() => setZoom((prev) => Math.max(prev - 10, 50))}
                  className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg text-gray-500 transition-all border border-transparent hover:border-gray-200"
                >
                  <IoRemove size={18} />
                </button>
                <div className="w-px h-5 bg-gray-300 mx-1 self-center" />
                <button
                  onClick={() => setRotation((prev) => prev + 90)}
                  className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg text-gray-500 transition-all border border-transparent hover:border-gray-200"
                >
                  <IoRefresh size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-neutral-100/50 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <img
                  src={prescriptionScan}
                  alt="Prescription"
                  className="max-w-full max-h-full object-contain shadow-2xl rounded-sm transition-transform duration-200 ease-out"
                  style={{ transform: `rotate(${rotation}deg) scale(${zoom / 100})` }}
                />
              </div>
            </div>
          </Card>

          {/* Data Entry Form */}
          <Card className="p-0 border border-neutral-200 overflow-hidden shadow-sm rounded-[32px]">
            <div className="p-5 bg-white border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-mint-50 text-mint-600 flex items-center justify-center border border-mint-100/50 shadow-sm">
                  <IoInformationCircleOutline size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                    Transcription Data
                  </h3>
                  <p className="text-xs font-medium text-gray-400 mt-0.5">
                    Accurately transcribe prescription details
                  </p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button size="sm" variant="outline" className="h-10 rounded-xl">
                  Copy Previous
                </Button>
                <Button size="sm" variant="outline" className="h-10 rounded-xl">
                  Clear Form
                </Button>
              </div>
            </div>

            <div className="p-6 bg-white space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-mint-50/20 p-6 rounded-2xl border border-mint-100/50">
                  <h4 className="font-semibold text-sm text-mint-800 mb-4 flex items-center gap-2">
                    <IoEyeOutline /> Right Eye (OD)
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-mint-700 uppercase tracking-widest pl-1">
                        SPH
                      </label>
                      <Input
                        defaultValue={firstLensParams?.right?.SPH?.toString() || '-2.00'}
                        className="font-medium h-11 border-mint-100 bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-mint-700 uppercase tracking-widest pl-1">
                        CYL
                      </label>
                      <Input
                        defaultValue={firstLensParams?.right?.CYL?.toString() || '-0.50'}
                        className="font-medium h-11 border-mint-100 bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-mint-700 uppercase tracking-widest pl-1">
                        AXIS
                      </label>
                      <Input
                        defaultValue={firstLensParams?.right?.AXIS?.toString() || '180'}
                        className="font-medium h-11 border-mint-100 bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-mint-700 uppercase tracking-widest pl-1">
                        ADD
                      </label>
                      <Input
                        defaultValue={firstLensParams?.right?.ADD?.toString() || '+1.50'}
                        className="font-medium h-11 border-mint-100 bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-50/50 p-6 rounded-2xl border border-neutral-100">
                  <h4 className="font-semibold text-sm text-neutral-700 mb-4 flex items-center gap-2">
                    <IoEyeOutline /> Left Eye (OS)
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest pl-1">
                        SPH
                      </label>
                      <Input
                        defaultValue={firstLensParams?.left?.SPH?.toString() || '-2.25'}
                        className="font-medium h-11 bg-white border-neutral-100"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest pl-1">
                        CYL
                      </label>
                      <Input
                        defaultValue={firstLensParams?.left?.CYL?.toString() || '-0.75'}
                        className="font-medium h-11 bg-white border-neutral-100"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest pl-1">
                        AXIS
                      </label>
                      <Input
                        defaultValue={firstLensParams?.left?.AXIS?.toString() || '170'}
                        className="font-medium h-11 bg-white border-neutral-100"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest pl-1">
                        ADD
                      </label>
                      <Input
                        defaultValue={firstLensParams?.left?.ADD?.toString() || '+1.50'}
                        className="font-medium h-11 bg-white border-neutral-100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div>
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-widest pl-1">
                    Pupillary Distance (PD)
                  </label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="relative">
                      <Input
                        defaultValue={firstLensParams?.PD?.toString() || '32.0'}
                        className="text-center font-bold h-11 border-neutral-100"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-mint-600 bg-mint-50 px-1 rounded border border-mint-100">
                        R
                      </span>
                    </div>
                    <div className="relative">
                      <Input
                        defaultValue={firstLensParams?.PD?.toString() || '32.0'}
                        className="text-center font-bold h-11 border-neutral-100"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-mint-600 bg-mint-50 px-1 rounded border border-mint-100">
                        L
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-widest pl-1">
                    Notes
                  </label>
                  <textarea
                    className="w-full mt-2 p-3 border border-neutral-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 transition-all bg-neutral-50/20"
                    rows={2}
                    placeholder="Enter special instructions for lab technician..."
                  />
                </div>
              </div>
            </div>

            <div className="bg-neutral-50/80 p-6 flex gap-4 border-t border-neutral-100">
              <Button
                isFullWidth
                className="bg-mint-700 text-white h-12 rounded-xl"
                leftIcon={<IoCheckmark size={20} />}
              >
                Verify & Submit to Lab
              </Button>
              <Button
                isFullWidth
                variant="outline"
                className="h-12 rounded-xl border-neutral-200 text-neutral-600 hover:text-rose-600"
                leftIcon={<IoClose size={20} />}
              >
                Reject Order
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column: Information & Operations (Sidebar) */}
        <div className="xl:col-span-4 space-y-6">
          {/* Order Details Card */}
          <Card className="p-6 border border-neutral-200 shadow-sm space-y-6 rounded-[32px]">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">
                Order Content
              </h3>
              <span className="text-xs font-bold text-mint-600 bg-mint-50 px-2 py-0.5 rounded-full border border-mint-100">
                #{order?.orderCode || order?._id?.slice(-8)}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                  <IoPersonOutline className="text-gray-400" size={20} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    Customer
                  </p>
                  <p className="text-sm font-semibold text-gray-900 leading-tight">
                    {order?.customerName || 'N/A'}
                  </p>
                  <div className="flex flex-col gap-0.5 mt-1">
                    <p className="text-xs text-gray-500 font-medium truncate">
                      {order?.customerEmail}
                    </p>
                    {order?.customerPhone && (
                      <p className="text-xs text-mint-600 font-bold tracking-tight">
                        {order.customerPhone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-50">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                  <IoCalendarOutline className="text-gray-400" size={20} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    Submitted At
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatDate(order?.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Products & Prices Section */}
            <div className="pt-6 border-t border-gray-100 space-y-4">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <IoCubeOutline /> Items ({order?.products?.length || 0})
              </h4>
              <div className="space-y-3">
                {order?.products?.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-gray-50/50 p-3 rounded-xl border border-gray-100 group hover:border-mint-200 transition-all"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="w-12 h-12 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm">
                        <IoGlassesOutline className="text-mint-500" size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">
                          {item.product?.product_name || item.product?.sku}
                        </p>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                          {item.product?.sku}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-gray-900">
                          {formatPrice(item.product?.pricePerUnit || 0)}
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                          x{item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-3 pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-mono">{formatPrice(order?.price || 0)}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">
                  <span>Shipping Fee</span>
                  <span className="text-gray-900 font-mono">
                    + {formatPrice(order?.invoice?.feeShip || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-bold text-rose-400 uppercase tracking-widest pl-1">
                  <span>Discount</span>
                  <span className="text-rose-500 font-mono">
                    - {formatPrice(order?.invoice?.totalDiscount || 0)}
                  </span>
                </div>

                <div className="mt-4 p-4 bg-gray-900 rounded-3xl text-white shadow-xl shadow-slate-200 ring-4 ring-gray-900/5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <IoWalletOutline size={14} className="text-mint-400" /> Final Total
                    </span>
                    <span className="text-xl font-bold text-mint-400 tracking-tight font-heading">
                      {formatPrice(
                        (order?.price || 0) +
                          (order?.invoice?.feeShip || 0) -
                          (order?.invoice?.totalDiscount || 0)
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Laboratory Operations Channel */}
          <Card className="p-0 border border-neutral-200 shadow-sm overflow-hidden rounded-[32px]">
            <div className="p-4 bg-mint-50/50 border-b border-mint-100 flex justify-between items-center">
              <h3 className="font-semibold text-mint-900 text-sm flex items-center gap-2">
                <IoConstructOutline /> Lab Operations
              </h3>
              <span className="w-2 h-2 bg-mint-500 rounded-full animate-pulse"></span>
            </div>
            <div className="p-4 space-y-4">
              <div className="relative border-l border-gray-200 ml-1.5 space-y-5 py-2">
                <div className="pl-4 relative">
                  <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-gray-200 border-2 border-white"></div>
                  <p className="text-xs text-gray-500">Technician Review</p>
                  <p className="text-[10px] text-gray-400">Waiting for assignment</p>
                </div>
                <div className="pl-4 relative">
                  <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-mint-500 border-2 border-white"></div>
                  <p className="text-xs font-semibold text-gray-800">Transcription</p>
                  <p className="text-[10px] text-gray-500">In Progress</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
