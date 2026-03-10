import { IoCheckmarkCircle, IoEllipseOutline } from 'react-icons/io5'

interface CheckItemProps {
  label: string
  checked: boolean
  onToggle: () => void
  required?: boolean
}

export default function CheckItem({ label, checked, onToggle, required = true }: CheckItemProps) {
  return (
    <div
      onClick={onToggle}
      className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200 group ${
        checked
          ? 'bg-mint-50 border-mint-200 shadow-sm'
          : 'bg-white border-neutral-100 hover:border-mint-200 hover:shadow-sm'
      }`}
    >
      <div
        className={`flex-shrink-0 mr-4 transition-colors ${checked ? 'text-mint-500' : 'text-neutral-300 group-hover:text-mint-300'}`}
      >
        {checked ? <IoCheckmarkCircle size={24} /> : <IoEllipseOutline size={24} />}
      </div>
      <div className="flex-grow">
        <span
          className={`text-sm font-medium transition-colors ${checked ? 'text-mint-900' : 'text-neutral-600'}`}
        >
          {label}
        </span>
        {required && <span className="text-red-400 ml-1 text-xs">*</span>}
      </div>
    </div>
  )
}
