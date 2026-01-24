interface SubMenuItemProps {
  label: string
  active?: boolean
  onClick?: () => void
}

export function SubMenuItem({ label, active, onClick }: SubMenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={`display-block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
        active
          ? 'text-mint-600 font-medium bg-mint-50/50'
          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  )
}
