import { useEffect, useState } from 'react'
import { addressService, type Province, type Ward } from '@/shared/services/addressService'
import { FormField, Input, Checkbox, Button } from '@/shared/components/ui'
import { SearchableSelect } from '@/shared/components/ui/searchable-select/SearchableSelect'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import type { Address } from '@/shared/types/address.types'

interface AddressFormProps {
  initialData?: Address
  onSubmit: (data: {
    street: string
    ward: string
    city: string
    isDefault: boolean
  }) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  submitLabel?: string
}

const addressSchema = Yup.object().shape({
  street: Yup.string().required('Street address is required').trim(),
  city: Yup.string().required('City / Province is required').trim(),
  ward: Yup.string().required('Ward is required').trim(),
  isDefault: Yup.boolean()
})

export function AddressForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  submitLabel = 'Save Address'
}: AddressFormProps) {
  const [provinces, setProvinces] = useState<Province[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [isFetchingProvinces, setIsFetchingProvinces] = useState(false)
  const [isFetchingWards, setIsFetchingWards] = useState(false)
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<number | null>(null)

  const formik = useFormik({
    initialValues: {
      street: initialData?.street || '',
      ward: initialData?.ward || '',
      city: initialData?.city || '',
      isDefault: initialData?.isDefault || false
    },
    validationSchema: addressSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      await onSubmit(values)
    }
  })

  // Fetch provinces on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      setIsFetchingProvinces(true)
      try {
        const data = await addressService.getProvinces()
        setProvinces(data)

        // Robust matching for province/city
        if (initialData?.city) {
          const targetCity = initialData.city.toLowerCase().trim()
          const match = data.find((p) => {
            const provinceName = p.name.toLowerCase().trim()
            return (
              provinceName === targetCity ||
              provinceName === `tỉnh ${targetCity}` ||
              provinceName === `thành phố ${targetCity}` ||
              targetCity === provinceName.replace(/^(tỉnh|thành phố)\s+/i, '').trim()
            )
          })
          if (match) setSelectedProvinceCode(match.code)
        }
      } catch (error) {
        console.error('Failed to fetch provinces:', error)
      } finally {
        setIsFetchingProvinces(false)
      }
    }
    fetchProvinces()
  }, [initialData?.city])

  // Fetch wards when province changes
  useEffect(() => {
    const fetchWards = async () => {
      if (!selectedProvinceCode) {
        setWards([])
        return
      }
      setIsFetchingWards(true)
      try {
        const data = await addressService.getWards(selectedProvinceCode)
        setWards(data)
      } catch (error) {
        console.error('Failed to fetch wards:', error)
      } finally {
        setIsFetchingWards(false)
      }
    }
    fetchWards()
  }, [selectedProvinceCode])

  const handleProvinceChange = (code: number) => {
    const province = provinces.find((p) => p.code === code)
    if (province) {
      setSelectedProvinceCode(code)
      formik.setFieldValue('city', province.name)
      formik.setFieldValue('ward', '')
    } else {
      setSelectedProvinceCode(null)
      formik.setFieldValue('city', '')
      formik.setFieldValue('ward', '')
    }
  }

  const handleWardChange = (wardName: string) => {
    formik.setFieldValue('ward', wardName)
  }

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <FormField
        label="Street Address"
        isRequired
        error={formik.touched.street && formik.errors.street ? formik.errors.street : undefined}
      >
        <Input
          placeholder="e.g. 165 Linh Trung"
          {...formik.getFieldProps('street')}
          className={formik.touched.street && formik.errors.street ? 'border-red-500' : ''}
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <SearchableSelect
            label="City / Province"
            isRequired
            placeholder="Select City"
            options={provinces.map((p) => ({ label: p.name, value: p.code }))}
            value={selectedProvinceCode || ''}
            onChange={handleProvinceChange}
            isLoading={isFetchingProvinces}
            isDisabled={isFetchingProvinces}
          />
          {formik.touched.city && formik.errors.city && (
            <p className="text-xs text-red-500 font-medium ml-1">{formik.errors.city}</p>
          )}
        </div>

        <div className="space-y-1">
          <SearchableSelect
            label="Ward"
            isRequired
            placeholder="Select Ward"
            options={wards.map((w) => ({ label: w.name, value: w.name }))}
            value={formik.values.ward}
            onChange={handleWardChange}
            isLoading={isFetchingWards}
            isDisabled={!selectedProvinceCode || isFetchingWards}
          />
          {formik.touched.ward && formik.errors.ward && (
            <p className="text-xs text-red-500 font-medium ml-1">{formik.errors.ward}</p>
          )}
        </div>
      </div>

      <Checkbox
        id="isDefault"
        label="Set as default address"
        isChecked={formik.values.isDefault}
        onCheckedChange={(checked) => formik.setFieldValue('isDefault', checked)}
      />

      <div className="pt-4 flex gap-3">
        <Button
          type="button"
          variant="outline"
          colorScheme="neutral"
          onClick={onCancel}
          isFullWidth
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          isDisabled={isFetchingProvinces || isFetchingWards || !formik.isValid}
          isFullWidth
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
