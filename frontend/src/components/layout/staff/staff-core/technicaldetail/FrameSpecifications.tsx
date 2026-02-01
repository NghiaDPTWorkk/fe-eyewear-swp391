interface FrameItem {
  label: string
  value: string
}

interface FrameProps {
  data: FrameItem[]
  imageSrc: string
}
const FrameSpecifications = ({ data, imageSrc }: FrameProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-55 h-55 md:w-1/3 bg-gray-50 rounded-lg p-4 flex justify-center">
        <img src={imageSrc} alt="Frame" className="max-w-full h-auto" />
      </div>

      <div className="w-55 h-55 md:w-fit grid grid-cols-2 gap-x-12 gap-y-4">
        {data.map((item, idx) => (
          <div key={idx} className="min-w-[120px] py-7 px-8">
            <p className="text-xs text-gray-500">{item.label}</p>
            {item.label === 'Color' ? (
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full pt-2 border border-gray-300"
                  style={{ backgroundColor: item.value.toLowerCase() }}
                />
                <p className="text-sm font-semibold text-gray-900">{item.value}</p>
              </div>
            ) : (
              <p className="text-sm font-semibold text-gray-900">{item.value}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default FrameSpecifications
