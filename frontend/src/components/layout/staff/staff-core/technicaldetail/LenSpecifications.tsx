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
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-mint-50">
              <th className="border border-mint-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Mắt
              </th>
              <th className="border border-mint-200 px-4 py-3 text-center text-sm font-semibold text-gray-700">
                Độ Cầu (SPH)
              </th>
              <th className="border border-mint-200 px-4 py-3 text-center text-sm font-semibold text-gray-700">
                Độ Trụ (CYL)
              </th>
              <th className="border border-mint-200 px-4 py-3 text-center text-sm font-semibold text-gray-700">
                Trục (AXIS)
              </th>
              <th className="border border-mint-200 px-4 py-3 text-center text-sm font-semibold text-gray-700">
                Lăng Kính
              </th>
              <th className="border border-mint-200 px-4 py-3 text-center text-sm font-semibold text-gray-700">
                Độ Add
              </th>
            </tr>
          </thead>
          <tbody>
            {prescription.map((item, idx) => (
              <tr key={idx} className="hover:bg-mint-25">
                <td className="border border-mint-200 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{item.eye}</span>
                  </div>
                </td>
                <td
                  className={`border border-mint-200 px-4 py-3 text-center font-mono ${item.sph === '-' ? 'text-gray-500' : 'font-semibold text-gray-900'}`}
                >
                  {item.sph}
                </td>
                <td
                  className={`border border-mint-200 px-4 py-3 text-center font-mono ${item.cyl === '-' ? 'text-gray-500' : 'font-semibold text-gray-900'}`}
                >
                  {item.cyl}
                </td>
                <td
                  className={`border border-mint-200 px-4 py-3 text-center font-mono ${item.axis === '-' ? 'text-gray-500' : 'font-semibold text-gray-900'}`}
                >
                  {item.axis}
                </td>
                <td
                  className={`border border-mint-200 px-4 py-3 text-center font-mono ${item.prism === '-' ? 'text-gray-500' : 'font-semibold text-gray-900'}`}
                >
                  {item.prism}
                </td>
                <td
                  className={`border border-mint-200 px-4 py-3 text-center font-mono ${item.add === '-' ? 'text-gray-500' : 'font-semibold text-gray-900'}`}
                >
                  {item.add}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {details.map((info, idx) => (
          <div key={idx} className="bg-mint-50 rounded-lg p-3 border border-mint-200">
            <div className="text-xs text-gray-500 mb-1">{info.label}</div>
            <div className="font-semibold text-gray-900">{info.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LensSpecifications
