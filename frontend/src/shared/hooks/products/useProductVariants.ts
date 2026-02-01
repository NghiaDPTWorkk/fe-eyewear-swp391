import { useState, useMemo } from 'react'
import type { Product } from '@/shared/types/product.types'

/**
 * Interface cho variant option từ API
 */
interface VariantOption {
  attributeId: string
  attributeName: string
  label: string
  showType: 'text' | 'color' | 'image'
  value: string
  colorCode?: string // Optional: for color type
}

/**
 * Interface cho variant từ API
 */
interface ProductVariant {
  sku: string
  name: string
  slug: string
  options: VariantOption[]
  price: number
  finalPrice: number
  stock: number
  imgs: string[]
  isDefault: boolean
}

/**
 * Cấu trúc attribute được extract từ variants
 */
interface AttributeInfo {
  name: string // attributeName
  showType: 'text' | 'color' | 'image'
  values: string[] // unique values
  attributeId: string
}

/**
 * State cho selected options
 */
type SelectedOptions = Record<string, string> // { attributeName: value }

/**
 * Return type của hook
 */
interface UseProductVariantsReturn {
  // Current state
  currentVariant: ProductVariant | null
  selectedOptions: SelectedOptions
  attributes: AttributeInfo[]

  // Actions
  selectOption: (attributeName: string, value: string) => void

  // Computed values
  price: number
  finalPrice: number
  stock: number
  images: string[]
  isInStock: boolean

  // Validation
  isValidCombination: boolean
  availableOptionsForAttribute: (attributeName: string) => string[]
}

/**
 * Custom hook để quản lý product variants và selection logic
 *
 * @param product - Product object từ API
 * @returns Variant state và helper functions
 */
export const useProductVariants = (product: Product): UseProductVariantsReturn => {
  const productAny = product as any
  const variants: ProductVariant[] = productAny.variants || []

  /**
   * STEP 1: Initialize selected options với default variant
   * Sử dụng lazy initialization để tránh setState trong useEffect
   */
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>(() => {
    if (variants.length === 0) return {}

    // Tìm default variant hoặc lấy variant đầu tiên
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

  /**
   * STEP 2: Extract unique attributes từ tất cả variants
   */
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
        if (!attr.values.includes(option.value)) {
          attr.values.push(option.value)
        }
      })
    })

    return Array.from(attributesMap.values())
  }, [variants])

  /**
   * STEP 3: Find matching variant based on selected options
   */
  const currentVariant = useMemo((): ProductVariant | null => {
    // Nếu chưa có options nào được chọn, return null
    if (Object.keys(selectedOptions).length === 0) {
      return null
    }

    // Tìm variant match với tất cả selected options
    const matchedVariant = variants.find((variant) => {
      return variant.options?.every((opt) => selectedOptions[opt.attributeName] === opt.value)
    })

    return matchedVariant || null
  }, [variants, selectedOptions])

  /**
   * STEP 4: Action - Select option
   */
  const selectOption = (attributeName: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [attributeName]: value
    }))
  }

  /**
   * STEP 5: Tính available options cho mỗi attribute
   * Chỉ show options tạo thành valid combination
   */
  const availableOptionsForAttribute = (attributeName: string): string[] => {
    // Lấy tất cả options đã chọn NGOẠI TRỪ attribute hiện tại
    const otherSelectedOptions = { ...selectedOptions }
    delete otherSelectedOptions[attributeName]

    // Tìm tất cả variants match với other selected options
    const matchingVariants = variants.filter((variant) => {
      return Object.entries(otherSelectedOptions).every(([attrName, attrValue]) => {
        return variant.options?.some(
          (opt) => opt.attributeName === attrName && opt.value === attrValue
        )
      })
    })

    // Extract unique values cho attribute này từ matching variants
    const availableValues = new Set<string>()
    matchingVariants.forEach((variant) => {
      const option = variant.options?.find((opt) => opt.attributeName === attributeName)
      if (option) {
        availableValues.add(option.value)
      }
    })

    return Array.from(availableValues)
  }

  /**
   * STEP 6: Computed values từ current variant
   */
  const defaultVariant = variants.find((v) => v.isDefault) || variants[0]
  const activeVariant = currentVariant || defaultVariant

  const price = activeVariant?.price || 0
  const finalPrice = activeVariant?.finalPrice || price
  const stock = activeVariant?.stock || 0
  const images = activeVariant?.imgs || []
  const isInStock = stock > 0

  /**
   * STEP 7: Validation - Check if current combination is valid
   */
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
    isValidCombination,
    availableOptionsForAttribute
  }
}
