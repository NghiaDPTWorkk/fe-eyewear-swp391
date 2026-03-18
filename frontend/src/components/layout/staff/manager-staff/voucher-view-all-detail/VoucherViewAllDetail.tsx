import type { Voucher } from '@/shared/types'
import { VoucherApplyScope } from '@/shared/utils/enums/voucher.enum'
import VoucherTicket from '@/components/layout/staff/manager-staff/voucher-ticket/VoucherTicket'
import VoucherTicketSpecification from '@/components/layout/staff/manager-staff/voucher-ticket/VoucherTicketSpecification'
import MainDetailVoucher from '@/components/layout/staff/manager-staff/main-detail-voucher/MainDetailVoucher'
import UsageMestrictVoucher from '@/components/layout/staff/manager-staff/usage-metrics/UsageMestrictVoucher'
import SystemMetaVoucher from '@/components/layout/staff/manager-staff/system-meta/SystemMetaVoucher'

interface VoucherViewAllDetailProps {
  voucher: Voucher
  statusConfig: { pill: string; dot: string; label: string }
}

export default function VoucherViewAllDetail({
  voucher: v,
  statusConfig: st
}: VoucherViewAllDetailProps) {
  return (
    <div className="space-y-6">
      {/* ── Hero Ticket Area ───────────────────────────────────── */}
      <div className="flex justify-center py-6 perspective-1000">
        <div className="animate-voucher-pop">
          {v.applyScope === VoucherApplyScope.ALL ? (
            <VoucherTicket voucher={v} />
          ) : (
            <VoucherTicketSpecification voucher={v} />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Main Content Area ─────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          <MainDetailVoucher voucher={v} statusConfig={st} />
        </div>

        {/* ── Sidebar Info Area ─────────────────────────────────── */}
        <div className="space-y-6">
          <UsageMestrictVoucher usageCount={v.usageCount} usageLimit={v.usageLimit} />

          <SystemMetaVoucher id={v._id} createdAt={v.createdAt} updatedAt={v.updatedAt} />
        </div>
      </div>
    </div>
  )
}
