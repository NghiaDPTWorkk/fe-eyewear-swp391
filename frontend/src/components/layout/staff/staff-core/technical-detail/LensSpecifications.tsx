interface PrescriptionItem {
  eye: string
  sph: string
  cyl: string
  axis: string
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
              <th className="px-3 py-3 text-left text-xs font-medium text-neutral-600">Eye</th>
              <th className="px-3 py-3 text-center text-xs font-medium text-neutral-600">
                Sphere (SPH)
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium text-neutral-600">
                Cylinder (CYL)
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium text-neutral-600">AXIS</th>
              <th className="px-3 py-3 text-center text-xs font-medium text-neutral-600">
                Addition
              </th>
            </tr>
          </thead>
          <tbody>
            {prescription.map((item, idx) => (
              <tr key={idx}>
                <td className="px-3 py-3">
                  <span className="font-medium text-gray-900 text-sm">{item.eye}</span>
                </td>
                <td className="px-3 py-3 text-center font-mono text-sm font-semibold text-gray-900">
                  {item.sph}
                </td>
                <td className="px-3 py-3 text-center font-mono text-sm font-semibold text-gray-900">
                  {item.cyl}
                </td>
                <td className="px-3 py-3 text-center font-mono text-sm font-semibold text-gray-900">
                  {item.axis}
                </td>
                <td className="px-3 py-3 text-center font-mono text-sm text-gray-400">
                  {item.add}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Additional Info - 2 column grid */}
      <div className="grid grid-cols-2 gap-x-2 pt-2 ps-4">
        {details.map((info, idx) => (
          <div key={idx}>
            <div className="text-xs text-mint-800 mb-0.5">{info.label}</div>
            <div className="text-sm font-semibold text-gray-900 mb-5">{info.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LensSpecifications
