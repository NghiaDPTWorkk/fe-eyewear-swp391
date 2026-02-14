interface LensOption {
  attributeName: string
  label?: string
  value?: string
}

interface LensProps {
  lensOptions: LensOption[]
  imageSrc?: string
}

const LensNormalOrder = ({
  lensOptions,
  imageSrc = 'https://via.placeholder.com/400x300?text=Lens'
}: LensProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-55 h-55 md:w-1/3 bg-gray-50 rounded-lg p-4 flex justify-center">
        <img src={imageSrc} alt="Lens" className="max-w-full h-auto object-contain" />
      </div>

      <div className="w- md:w-fit grid grid-cols-2 gap-x-12 gap-y-4">
        {lensOptions.map((item, idx) => (
          <div key={idx} className="min-w-[120px] py-3 px-8">
            <p className="text-xs text-gray-500">{item.attributeName}</p>
            <p className="text-sm font-semibold text-gray-900">{item.label || item.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LensNormalOrder
