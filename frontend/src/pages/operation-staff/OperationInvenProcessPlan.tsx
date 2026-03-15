import { useNavigate, useParams } from 'react-router-dom'
import { Container } from '@/shared/components/ui'
import {
  IoArrowBack,
  IoCheckmarkCircleOutline,
  IoTimeOutline,
  IoCubeOutline,
  IoPersonOutline,
  IoCalendarOutline,
  IoAlertCircleOutline,
  IoImageOutline
} from 'react-icons/io5'
import {
  usePreOrderImportDetail,
  useImportProduct
} from '@/features/operations/hooks/usePreOrderImports'
import { useQuery } from '@tanstack/react-query'
import { productService } from '@/shared/services/products/productService'
import { BreadcrumbPath, Button } from '@/components'
import { cn } from '@/shared/utils'

function formatDate(iso: string) {
  if (!iso) return 'N/A'
  return new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    color: 'text-amber-600',
    bg: 'bg-amber-50 border-amber-100',
    icon: <IoTimeOutline size={18} />
  },
  DONE: {
    label: 'Done',
    color: 'text-mint-600',
    bg: 'bg-mint-50 border-mint-100',
    icon: <IoCheckmarkCircleOutline size={18} />
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'text-red-600',
    bg: 'bg-red-50 border-red-100',
    icon: <IoAlertCircleOutline size={18} />
  }
}

export default function OperationInvenProcessPlan() {
  const { receiptId } = useParams<{ receiptId: string }>()
  const navigate = useNavigate()

  const { data, isLoading, isError } = usePreOrderImportDetail(receiptId || '')
  const importProduct = useImportProduct()

  const detail = data?.data

  const { data: productSearchData, isLoading: isProductLoading } = useQuery({
    queryKey: ['product-search-sku', detail?.sku],
    queryFn: () => productService.searchProductBySKU(detail?.sku || ''),
    enabled: !!detail?.sku
  })

  const variantInfo = productSearchData?.data?.variant

  const handleConfirmDone = async () => {
    if (!receiptId || !detail) return
    if (
      window.confirm(
        'Are you sure you want to mark this batch as DONE? This action will update the inventory status.'
      )
    ) {
      await importProduct.mutateAsync({
        sku: detail.sku,
        quantity: detail.targetQuantity,
        preOrderImportId: receiptId
      })
    }
  }

  if (isError) {
    return (
      <Container className="pt-10">
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
          <IoAlertCircleOutline className="text-red-400 mb-4" size={48} />
          <h3 className="text-lg font-bold text-slate-800">Batch Not Found</h3>
          <p className="text-sm text-slate-400 mt-1">
            The batch ID you provided does not exist or has been deleted.
          </p>
          <button
            onClick={() => navigate('/operation-staff/inventory-receiving')}
            className="mt-6 px-6 py-2 bg-slate-800 text-white rounded-xl font-bold text-sm hover:bg-slate-900 transition-all focus:outline-none"
          >
            Go Back to List
          </button>
        </div>
      </Container>
    )
  }

  return (
    <Container className="animate-fade-in pb-10">
      <BreadcrumbPath paths={['Dashboard', 'Inventory Receiving', 'Process Plan']} />

      {}
      {(isLoading || importProduct.isPending) && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-[9999] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-mint-100 border-t-mint-500 rounded-full animate-spin" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Processing</p>
          </div>
        </div>
      )}

      {}
      <div className="flex items-center justify-between mb-8 gap-4 mt-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/operation-staff/inventory-receiving')}
            className="p-3 bg-white hover:bg-slate-50 rounded-xl shadow-sm transition-all border border-slate-100 text-slate-400 hover:text-mint-600"
          >
            <IoArrowBack size={20} />
          </button>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-black text-slate-900">Process Inventory Plan</h1>
            {detail && (
              <div
                className={cn(
                  'px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border flex items-center gap-2 shadow-sm',
                  STATUS_CONFIG[detail.status as keyof typeof STATUS_CONFIG]?.bg,
                  STATUS_CONFIG[detail.status as keyof typeof STATUS_CONFIG]?.color
                )}
              >
                {detail.status}
              </div>
            )}
          </div>
        </div>

        {detail && (
          <Button
            variant="solid"
            colorScheme={detail.status === 'DONE' ? 'secondary' : 'primary'}
            className={cn(
              'px-6 py-3 rounded-xl font-bold text-sm shadow-lg',
              detail.status === 'DONE'
                ? 'shadow-slate-100 opacity-70 cursor-not-allowed'
                : 'shadow-mint-100'
            )}
            onClick={handleConfirmDone}
            disabled={detail.status === 'DONE' || importProduct.isPending}
          >
            {detail.status === 'DONE' ? 'Completed' : 'Confirm All Received'}
          </Button>
        )}
      </div>

      {detail && (
        <div className="grid grid-cols-12 gap-6">
          {}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
              <div className="flex flex-col md:flex-row gap-8">
                {}
                <div className="w-full md:w-40 h-40 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                  {isProductLoading ? (
                    <div className="w-8 h-8 border-3 border-mint-100 border-t-mint-500 rounded-full animate-spin" />
                  ) : variantInfo?.imgs?.[0] ? (
                    <img
                      src={variantInfo.imgs[0]}
                      alt={detail.sku}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-slate-300 flex flex-col items-center gap-2">
                      <IoImageOutline size={32} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        No Image
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <IoCubeOutline size={18} />
                    <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
                      Product Detail
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 font-mono leading-tight">
                      {detail.sku}
                    </h2>
                    {variantInfo?.name && (
                      <p className="text-xs font-bold text-mint-600 uppercase tracking-widest mt-1">
                        {variantInfo.name}
                      </p>
                    )}
                    <p className="text-sm text-slate-400 mt-2 font-medium italic">
                      {detail.description || 'No description available for this batch.'}
                    </p>
                  </div>
                  <div className="pt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Plan ID:
                    </span>
                    <span className="ml-2 text-xs font-mono font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                      {detail._id}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Target Quantity
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-800">
                    {detail.targetQuantity}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase">Units</span>
                </div>
              </div>
              <div className="bg-white rounded-3xl border border-mint-100 shadow-sm p-8">
                <p className="text-[10px] font-bold text-mint-600 uppercase tracking-widest mb-1">
                  Pre-Ordered
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-mint-600">
                    {detail.preOrderedQuantity}
                  </span>
                  <span className="text-xs font-bold text-mint-400 uppercase">Units</span>
                </div>
              </div>
            </div>

            <div className="bg-mint-50/50 rounded-2xl p-6 border border-mint-100">
              <h4 className="text-sm font-black text-mint-900 mb-3 flex items-center gap-2">
                <IoAlertCircleOutline size={18} />
                Inventory Guidelines
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-mint-400 mt-1.5 shrink-0" />
                  <span>Verify physical stock quantity against the record above.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-mint-400 mt-1.5 shrink-0" />
                  <span>
                    Current batch fulfillment rate:{' '}
                    <b>{Math.round((detail.preOrderedQuantity / detail.targetQuantity) * 100)}%</b>.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-mint-400 mt-1.5 shrink-0" />
                  <span>Marking as DONE will update the system inventory.</span>
                </li>
              </ul>
            </div>
          </div>

          {}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-2 text-slate-400 mb-4">
                <IoPersonOutline size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Management</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-mint-500 rounded-xl flex items-center justify-center text-white font-black text-xs">
                  ID
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-black text-slate-800 uppercase tracking-tight truncate">
                    {detail.managerResponsibility || 'Unassigned'}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Responsible ID
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
              <div className="flex items-center gap-2 text-slate-400">
                <IoCalendarOutline size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Schedule</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold uppercase">Started</span>
                  <span className="text-slate-800 font-bold">{formatDate(detail.startedDate)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold uppercase">Estimated</span>
                  <span className="text-slate-800 font-bold">{formatDate(detail.endedDate)}</span>
                </div>
                <div className="pt-4 border-t border-slate-50 flex justify-between items-center text-xs">
                  <span className="text-mint-600 font-black uppercase">Target Date</span>
                  <span className="text-mint-700 font-black">{formatDate(detail.targetDate)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  )
}
