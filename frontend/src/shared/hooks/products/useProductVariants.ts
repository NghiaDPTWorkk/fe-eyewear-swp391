import { useState, useMemo } from 'react'
import type { Product } from '@/shared/types/product.types'
import type { Variant } from '@/shared/types/variant.types'

export interface AttributeValue {
  value: string
  label: string
}

export interface AttributeInfo {
  name: string
  showType: 'text' | 'color' | 'image'
  values: AttributeValue[]
  attributeId: string
}

type SelectedOptions = Record<string, string>

export interface UseProductVariantsReturn {
  currentVariant: Variant | null
  selectedOptions: SelectedOptions
  attributes: AttributeInfo[]

  selectOption: (attributeName: string, value: string) => void

  price: number
  finalPrice: number
  stock: number
  images: string[]
  isInStock: boolean
  isPreOrder: boolean

  isValidCombination: boolean
  availableOptionsForAttribute: (attributeName: string) => string[]
}

export const useProductVariants = (product: Product): UseProductVariantsReturn => {
  const variants: Variant[] = product.variants || []

  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>(() => {
    if (variants.length === 0) return {}

    const defaultVariant = variants.find((v) => v.isDefault) || variants[0]

    if (defaultVariant?.options) {
      const initialOptions: SelectedOptions = {}
      defaultVariant.options.forEach((opt) => {
        initialOptions[opt.attributeName] = opt.value
      })
      return initialOptions
    }

    return {}
  })

  const attributes = useMemo((): AttributeInfo[] => {
    const attributesMap = new Map<string, AttributeInfo>()

    variants.forEach((variant) => {
      variant.options?.forEach((option) => {
        if (!attributesMap.has(option.attributeName)) {
          attributesMap.set(option.attributeName, {
            name: option.attributeName,
            showType: option.showType,
            values: [],
            attributeId: option.attributeId
          })
        }

        const attr = attributesMap.get(option.attributeName)!
        if (!attr.values.some((v) => v.value === option.value)) {
          attr.values.push({
            value: option.value,
            label: option.label
          })
        }
      })
    })

    return Array.from(attributesMap.values())
  }, [variants])

  const currentVariant = useMemo((): Variant | null => {
    if (Object.keys(selectedOptions).length === 0) {
      return null
    }

    const matchedVariant = variants.find((variant) => {
      return variant.options?.every((opt) => selectedOptions[opt.attributeName] === opt.value)
    })

    return matchedVariant || null
  }, [variants, selectedOptions])

  const selectOption = (attributeName: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [attributeName]: value
    }))
  }

  const availableOptionsForAttribute = (attributeName: string): string[] => {
    const otherSelectedOptions = { ...selectedOptions }
    delete otherSelectedOptions[attributeName]

    const matchingVariants = variants.filter((variant) => {
      return Object.entries(otherSelectedOptions).every(([attrName, attrValue]) => {
        return variant.options?.some(
          (opt) => opt.attributeName === attrName && opt.value === attrValue
        )
      })
    })

    const availableValues = new Set<string>()
    matchingVariants.forEach((variant) => {
      const option = variant.options?.find((opt) => opt.attributeName === attributeName)
      if (option) {
        availableValues.add(option.value)
      }
    })

    return Array.from(availableValues)
  }

  const defaultVariant = variants.find((v) => v.isDefault) || variants[0]
  const activeVariant = currentVariant || defaultVariant

  const price = activeVariant?.price || 0
  const finalPrice = activeVariant?.finalPrice || price
  const stock = activeVariant?.stock || 0
  const images = activeVariant?.imgs || []
  const isPreOrder = activeVariant?.mode === 'PRE_ORDER'
  const isInStock = isPreOrder || stock > 0

  const isValidCombination = currentVariant !== null

  return {
    currentVariant,
    selectedOptions,
    attributes,
    selectOption,
    price,
    finalPrice,
    stock,
    images,
    isInStock,
    isPreOrder,
    isValidCombination,
    availableOptionsForAttribute
  }
}
