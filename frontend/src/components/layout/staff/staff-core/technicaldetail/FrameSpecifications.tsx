interface FrameItem {
  key: string
  value: string
}

interface FrameProps {
  data: FrameItem[]
  imageSrc?: string // Thêm dấu ? để báo hiệu prop này có thể có hoặc không
  quantity?: number
}

// Thiết lập giá trị mặc định cho imageSrc ngay tại tham số của function
const FrameSpecifications = ({
  data,
  imageSrc = 'https://kinhmats.com/wp-content/uploads/2024/05/gentle-monster-jennie-donut-bun-01.webp',
  quantity = 1
}: FrameProps) => {
  return (
    <div>
      <div className="text-sm text-mint-800 mb-4 font-semibold ps-2">
        Quantity: <span className="text-gray-900">{quantity}</span>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-50 h-50 md:w-1/3 bg-gray-50 rounded-lg py-3 flex justify-center">
          <img src={imageSrc} alt="Frame" className="max-w-full h-auto object-contain" />
        </div>

        <div className="w- md:w-fit grid grid-cols-2 gap-x-12 gap-y-4">
          {data.map((item, idx) => (
            <div key={idx} className="min-w-[120px] py-3 px-8">
              <p className="text-sm text-gray-500">{item.key}</p>
              <p className="text-md font-semibold text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FrameSpecifications
