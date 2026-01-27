import { ColorSwatch } from '@/components/atoms'
import { cn } from '@/lib/utils'

export interface ColorOption {
  id: string
  name: string
  hex: string
}

export interface ColorFilterProps {
  colors: ColorOption[]
  selectedColors: string[]
  onColorChange: (colorIds: string[]) => void
  className?: string
}

export function ColorFilter({
  colors,
  selectedColors,
  onColorChange,
  className
}: ColorFilterProps) {
  const handleColorClick = (colorId: string) => {
    const newSelected = selectedColors.includes(colorId)
      ? selectedColors.filter((id) => id !== colorId)
      : [...selectedColors, colorId]

    onColorChange(newSelected)
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <h3 className="text-mint-1200 font-semibold text-sm">Color</h3>

      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <ColorSwatch
            key={color.id}
            color={color.hex}
            colorName={color.name}
            isSelected={selectedColors.includes(color.id)}
            onClick={() => handleColorClick(color.id)}
            size="md"
          />
        ))}
      </div>
    </div>
  )
}
