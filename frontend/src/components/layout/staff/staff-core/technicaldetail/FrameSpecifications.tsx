interface FrameItem {
  label: string
  value: string
}

interface FrameProps {
  data: FrameItem[]
  imageSrc?: string // Thêm dấu ? để báo hiệu prop này có thể có hoặc không
}

// Thiết lập giá trị mặc định cho imageSrc ngay tại tham số của function
const FrameSpecifications = ({
  data,
  imageSrc = 'https://kinhmats.com/wp-content/uploads/2024/05/gentle-monster-jennie-donut-bun-01.webp'
}: FrameProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-55 h-55 md:w-1/3 bg-gray-50 rounded-lg p-4 flex justify-center">
        <img src={imageSrc} alt="Frame" className="max-w-full h-auto object-contain" />
      </div>

      <div className="w- md:w-fit grid grid-cols-2 gap-x-12 gap-y-4">
        {data.map((item, idx) => (
          <div key={idx} className="min-w-[120px] py-3 px-8">
            <p className="text-xs text-gray-500">{item.label}</p>
            <p className="text-sm font-semibold text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FrameSpecifications
