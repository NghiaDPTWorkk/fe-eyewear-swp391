import { useState } from 'react'

interface FrameItem {
  key: string
  value: string
}

interface FrameProps {
  data: FrameItem[]
  imageSrc?: string
  imageSrcHover?: string
  quantity?: number
  sku?: string
}

const FrameSpecifications = ({
  data,
  imageSrc = 'https://kinhmats.com/wp-content/uploads/2024/05/gentle-monster-jennie-donut-bun-01.webp',
  imageSrcHover,
  quantity = 1,
  sku
}: FrameProps) => {
  const [isHovered, setIsHovered] = useState(false)

  // Nếu có imageSrcHover và đang hover thì hiện ảnh hover, ngược lại hiện imageSrc
  const currentImage = isHovered && imageSrcHover ? imageSrcHover : imageSrc

  return (
    <div>
      <div className="flex items-center gap-7 mb-7 ps-2">
        <div className="flex items-baseline gap-2">
          <span className="text-[10px] uppercase tracking-[0.1em] font-bold text-neutral-500">
            Quantity
          </span>
          <span className="text-base font-bold text-neutral-800 leading-none">{quantity}</span>
        </div>

        {sku && (
          <>
            <div className="w-px h-3 bg-neutral-200 self-center"></div>
            <div className="flex items-baseline gap-2">
              <span className="text-[10px] uppercase tracking-[0.1em] font-bold text-neutral-500">
                Frame SKU
              </span>
              <span className="text-base font-bold text-neutral-800 leading-none">{sku}</span>
            </div>
          </>
        )}
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div
          className="w-50 h-50 md:w-1/3 bg-gray-50 rounded-lg py-3 flex justify-center cursor-pointer transition-all duration-300 overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img
            src={currentImage}
            alt="Frame"
            className="max-w-full h-auto object-contain transition-all duration-500 scale-100 group-hover:scale-110"
          />
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
