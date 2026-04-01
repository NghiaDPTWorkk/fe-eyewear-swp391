export const InventoryTableHeader = () => {
  return (
    <thead>
      <tr className="bg-white border-b border-slate-100">
        <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
          SKU
        </th>
        <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider text-center">
          TARGET QTY
        </th>
        <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider text-center">
          STATUS
        </th>
        <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider text-center">
          CREATED AT
        </th>
        <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider text-center">
          ACTION
        </th>
      </tr>
    </thead>
  )
}
