interface PrescriptionItem {
  eye: string
  sph: string
  cyl: string
  axis: string
  prism: string
  add: string
}

interface DetailItem {
  label: string
  value: string
}

interface LensSpecificationsProps {
  prescription: PrescriptionItem[]
  details: DetailItem[]
}

const LensSpecifications = ({ prescription, details }: LensSpecificationsProps) => {
  return (
    <div className="space-y-4">
      {/* Prescription Table  */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-neutral-200">
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">Mắt</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-neutral-600">
                Độ Cầu (SPH)
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-neutral-600">
                Độ Trụ (CYL)
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-neutral-600">
                Trục (AXIS)
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-neutral-600">
                Lăng Kính
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-neutral-600">Độ Add</th>
            </tr>
          </thead>
          <tbody>
            {prescription.map((item, idx) => (
              <tr key={idx}>
                <td className="px-4 py-3">
                  <span className="font-medium text-gray-900 text-sm">{item.eye}</span>
                </td>
                <td className="px-4 py-3 text-center font-mono text-sm font-semibold text-gray-900">
                  {item.sph}
                </td>
                <td className="px-4 py-3 text-center font-mono text-sm font-semibold text-gray-900">
                  {item.cyl}
                </td>
                <td className="px-4 py-3 text-center font-mono text-sm font-semibold text-gray-900">
                  {item.axis}
                </td>
                <td className="px-4 py-3 text-center font-mono text-sm text-gray-400">
                  {item.prism}
                </td>
                <td className="px-4 py-3 text-center font-mono text-sm text-gray-400">
                  {item.add}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Additional Info - 2 column grid */}
      <div className="grid grid-cols-2 gap-x-8 pt-2 ps-4">
        {details.map((info, idx) => (
          <div key={idx}>
            <div className="text-xs text-mint-900 mb-0.5">{info.label}</div>
            <div className="text-sm font-semibold text-gray-900">{info.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LensSpecifications
