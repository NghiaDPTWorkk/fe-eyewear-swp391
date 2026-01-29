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
      <div className="w-full md:w-1/3 bg-gray-50 rounded-lg p-4 flex justify-center">
        <img src={imageSrc} alt="Frame" className="max-w-full h-auto" />
      </div>
      <div className="w-full md:w-2/3 grid grid-cols-2 gap-6">
        {data.map((item, idx) => (
          <div key={idx}>
            <p className="text-xs text-gray-500">{item.label}</p>
            <p className="text-sm font-semibold text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FrameSpecifications
