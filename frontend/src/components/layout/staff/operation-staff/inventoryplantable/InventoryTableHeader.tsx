export const InventoryTableHeader = () => {
  return (
    <thead>
      <tr className="bg-white border-b border-slate-100">
        <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          SKU
        </th>
        <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          MANAGER
        </th>
        <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">
          TARGET QTY
        </th>
        <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">
          STATUS
        </th>
        <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">
          CREATED AT
        </th>
        <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">
          ACTION
        </th>
      </tr>
    </thead>
  )
}
