import { useState, useMemo, useEffect } from 'react'
import type { Product } from '@/shared/types/product.types'
import type { Variant } from '@/shared/types/variant.types'
import { preOrderImportService } from '@/features/operations/services/preOrderImportService'

/**
 * Cấu trúc attribute được extract từ variants
 */
export interface AttributeValue {
  value: string
  label: string
}

export interface AttributeInfo {
  name: string // attributeName
  showType: 'text' | 'color' | 'image'
  values: AttributeValue[] // unique values with labels
  attributeId: string
}

/**
 * State cho selected options
 */
type SelectedOptions = Record<string, string> // { attributeName: value }

/**
 * Return type của hook
 */
export interface UseProductVariantsReturn {
  // Current state
  currentVariant: Variant | null
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
  isPreOrder: boolean
  isPreOrderExpired: boolean
  isLoadingPreOrder: boolean
  preOrderPlan: any | null

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
  const variants: Variant[] = product.variants || []

  /**
   * STEP 1: Initialize selected options với default variant
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

  /**
   * STEP 3: Find matching variant dựa trên selected options
   */
  const currentVariant = useMemo((): Variant | null => {
    if (Object.keys(selectedOptions).length === 0) {
      return null
    }

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
   */
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

  /**
   * STEP 6: Computed values & Async Pre-order validation
   */
  const defaultVariant = variants.find((v) => v.isDefault) || variants[0]
  const activeVariant = currentVariant || defaultVariant

  const [preOrderPlan, setPreOrderPlan] = useState<any | null>(null)
  const [isLoadingPreOrder, setIsLoadingPreOrder] = useState(false)
  const isPreOrder = activeVariant?.mode === 'PRE_ORDER'

  useEffect(() => {
    if (isPreOrder && activeVariant?.sku) {
      setIsLoadingPreOrder(true)
      preOrderImportService
        .getPreOrderImportBySku(activeVariant.sku)
        .then((res) => {
          if (res.success && res.data) {
            setPreOrderPlan(res.data)
          } else {
            setPreOrderPlan(null)
          }
        })
        .catch(() => setPreOrderPlan(null))
        .finally(() => setIsLoadingPreOrder(false))
    } else {
      setPreOrderPlan(null)
      setIsLoadingPreOrder(false)
    }
  }, [activeVariant?.sku, isPreOrder])

  const isPreOrderExpired = useMemo(() => {
    if (!isPreOrder || isLoadingPreOrder) return false
    // If no plan is found but it's marked as Pre-order, treat it as expired/invalid
    if (!preOrderPlan) return true

    // Check if the pre-order period has ended
    const hasEnded = preOrderPlan.endedDate && new Date() > new Date(preOrderPlan.endedDate)

    // Pre-order is only valid if it's in PENDING status
    const isNotPending = preOrderPlan.status !== 'PENDING'

    return hasEnded || isNotPending
  }, [isPreOrder, preOrderPlan, isLoadingPreOrder])

  const price = activeVariant?.price || 0
  const finalPrice = activeVariant?.finalPrice || price
  const stock = activeVariant?.stock || 0
  const images = activeVariant?.imgs || []

  // A pre-order item is "In Stock" only if a plan exists, it's pending, and hasn't expired.
  // During loading, we temporarily disable actions to be safe.
  const isInStock = isPreOrder
    ? !isLoadingPreOrder && preOrderPlan && !isPreOrderExpired
    : stock > 0

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
    isPreOrderExpired,
    isLoadingPreOrder,
    preOrderPlan,
    isValidCombination,
    availableOptionsForAttribute
  }
}
