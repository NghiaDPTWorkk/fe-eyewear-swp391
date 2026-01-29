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
    <div className="flex gap-6">
      {/* Frame Image */}
      <div className="flex-shrink-0">
        <div className="w-50 h-50 bg-neutral-50 rounded-lg flex items-center justify-center overflow-hidden p-3">
          <img src={imageSrc} alt="Frame" className="w-full h-full object-contain" />
        </div>
      </div>

      {/* Frame Details - 2 column grid */}
      <div className="flex-1 grid grid-cols-2 gap-x-12 gap-y-4 pt-6 ps-6">
        {data.map((item, idx) => (
          <div key={idx}>
            <div className="text-xs text-neutral-500 mb-1">{item.label}</div>
            <div className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              {item.label === 'Màu Sắc' && (
                <span className="w-3 h-3 rounded-full bg-yellow-600 border border-gray-300"></span>
              )}
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FrameSpecifications
