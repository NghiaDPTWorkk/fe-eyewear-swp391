export const InventoryTableHeader = () => {
  return (
    <thead>
      <tr className="bg-white border-b border-slate-100">
        <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
          SKU
        </th>
        <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
          MANAGER
        </th>
        <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
          TARGET QTY
        </th>
        <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
          STATUS
        </th>
        <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
          CREATED AT
        </th>
        <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
          ACTION
        </th>
      </tr>
    </thead>
  )
}
