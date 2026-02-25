interface LensItem {
  key: string
  value: string
}

interface LensProps {
  data: LensItem[]
  imageSrc?: string
  quantity?: number
}
const LensNormalOrder = ({
  data,
  imageSrc = 'https://via.placeholder.com/400x300?text=Lens',
  quantity
}: LensProps) => {
  return (
    <>
      <div className="text-sm text-mint-800 mb-4 font-semibold ps-2">
        Quantity: <span className="text-gray-900">{quantity ?? '-'}</span>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Lens Image */}
        <div className="w-55 h-55 md:w-1/3 bg-gray-50 rounded-lg p-4 flex justify-center">
          <img src={imageSrc} alt="Lens" className="max-w-full h-auto object-contain" />
        </div>

        <div className="w-full md:w-fit grid grid-cols-2 gap-x-12 gap-y-4">
          {data.map((item, idx) => (
            <div key={idx} className="min-w-[120px] py-3 px-8">
              <p className="text-xs text-gray-500">{item.key}</p>
              <p className="text-sm font-semibold text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default LensNormalOrder
