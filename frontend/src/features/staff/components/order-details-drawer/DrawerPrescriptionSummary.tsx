interface PrescriptionData {
  od: { sph: string; cyl: string; axis: string; add: string }
  os: { sph: string; cyl: string; axis: string; add: string }
  pd: string
}

interface DrawerPrescriptionSummaryProps {
  prescription: PrescriptionData
}

export function DrawerPrescriptionSummary({ prescription }: DrawerPrescriptionSummaryProps) {
  return (
    <div className="space-y-3 pt-2">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
        Prescription Summary
      </h3>
      <div className="bg-emerald-50/30 border border-emerald-100/50 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-[11px] border-collapse">
          <thead>
            <tr className="bg-emerald-100/30 text-emerald-700 font-bold uppercase tracking-tight">
              <th className="py-2 px-3 text-left">Eye</th>
              <th className="py-2 px-1 text-center font-bold">SPH</th>
              <th className="py-2 px-1 text-center font-bold">CYL</th>
              <th className="py-2 px-1 text-center font-bold">AXIS</th>
              <th className="py-2 px-1 text-center font-bold">ADD</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-100/30">
            <tr>
              <td className="py-2 px-3 font-bold text-gray-700">OD (Right)</td>
              <td className="py-2 px-1 text-center text-gray-600 font-medium">
                {prescription.od.sph}
              </td>
              <td className="py-2 px-1 text-center text-gray-600">{prescription.od.cyl}</td>
              <td className="py-2 px-1 text-center text-gray-600">{prescription.od.axis}</td>
              <td className="py-2 px-1 text-center text-gray-600">{prescription.od.add}</td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-bold text-gray-700">OS (Left)</td>
              <td className="py-2 px-1 text-center text-gray-600 font-medium">
                {prescription.os.sph}
              </td>
              <td className="py-2 px-1 text-center text-gray-600">{prescription.os.cyl}</td>
              <td className="py-2 px-1 text-center text-gray-600">{prescription.os.axis}</td>
              <td className="py-2 px-1 text-center text-gray-600">{prescription.os.add}</td>
            </tr>
          </tbody>
        </table>
        <div className="p-3 bg-white/50 border-t border-emerald-100/30 flex justify-between items-center text-[11px]">
          <span className="text-gray-500 font-medium uppercase tracking-wider">PD (Dist)</span>
          <span className="text-emerald-700 font-bold">{prescription.pd}</span>
        </div>
      </div>
    </div>
  )
}
