import { useEffect, useState } from 'react'
import { addressService, type Province, type Ward } from '@/shared/services/addressService'
import { FormField, Input, Checkbox, Button } from '@/shared/components/ui'
import { SearchableSelect } from '@/shared/components/ui/searchable-select/SearchableSelect'
import { toast } from 'react-hot-toast'

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

export function AddressForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  submitLabel = 'Save Address'
}: AddressFormProps) {
  const [formData, setFormData] = useState({
    street: initialData?.street || '',
    ward: initialData?.ward || '',
    city: initialData?.city || '',
    isDefault: initialData?.isDefault || false
  })

  // Sync formData when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        street: initialData.street || '',
        ward: initialData.ward || '',
        city: initialData.city || '',
        isDefault: !!initialData.isDefault
      })
    }
  }, [initialData])

  const [provinces, setProvinces] = useState<Province[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [isFetchingProvinces, setIsFetchingProvinces] = useState(false)
  const [isFetchingWards, setIsFetchingWards] = useState(false)
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<number | null>(null)

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
      setFormData({ ...formData, city: province.name, ward: '' })
    } else {
      setSelectedProvinceCode(null)
      setFormData({ ...formData, city: '', ward: '' })
    }
  }

  const handleWardChange = (wardName: string) => {
    setFormData({ ...formData, ward: wardName })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const street = formData.street.trim()
    const city = formData.city.trim()
    const ward = formData.ward.trim()

    if (!street) {
      toast.error('Street address is required')
      return
    }

    if (!city) {
      toast.error('City / Province is required')
      return
    }

    if (!ward) {
      toast.error('Ward is required')
      return
    }

    await onSubmit({
      ...formData,
      street,
      city,
      ward
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField label="Street Address" isRequired>
        <Input
          placeholder="e.g. 165 Linh Trung"
          value={formData.street}
          onChange={(e) => setFormData({ ...formData, street: e.target.value })}
          required
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SearchableSelect
          label="City / Province"
          placeholder="Select City"
          options={provinces.map((p) => ({ label: p.name, value: p.code }))}
          value={selectedProvinceCode || ''}
          onChange={handleProvinceChange}
          isLoading={isFetchingProvinces}
          isDisabled={isFetchingProvinces}
        />

        <SearchableSelect
          label="Ward"
          placeholder="Select Ward"
          options={wards.map((w) => ({ label: w.name, value: w.name }))}
          value={formData.ward}
          onChange={handleWardChange}
          isLoading={isFetchingWards}
          isDisabled={!selectedProvinceCode || isFetchingWards}
        />
      </div>

      <Checkbox
        id="isDefault"
        label="Set as default address"
        isChecked={formData.isDefault}
        onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked })}
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
          isDisabled={isFetchingProvinces || isFetchingWards}
          isFullWidth
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
