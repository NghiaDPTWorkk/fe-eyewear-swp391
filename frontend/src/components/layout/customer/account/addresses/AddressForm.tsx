import { useEffect, useState } from 'react'
import { addressService, type Province, type Ward } from '@/shared/services/addressService'
import { FormField, Input, Select, Checkbox, Button } from '@/shared/components/ui'
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

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = Number(e.target.value)
    const province = provinces.find((p) => p.code === code)
    if (province) {
      setSelectedProvinceCode(code)
      setFormData({ ...formData, city: province.name, ward: '' }) // Reset ward when city changes
    } else {
      setSelectedProvinceCode(null)
      setFormData({ ...formData, city: '', ward: '' })
    }
  }

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, ward: e.target.value })
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

      <div className="grid grid-cols-2 gap-4">
        <FormField label="City / Province" isRequired>
          <Select
            value={selectedProvinceCode || ''}
            onChange={handleProvinceChange}
            isDisabled={isFetchingProvinces}
            placeholder="Select City"
            required
          >
            {provinces.map((p) => (
              <option key={p.code} value={p.code}>
                {p.name}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Ward" isRequired>
          <Select
            value={formData.ward}
            onChange={handleWardChange}
            isDisabled={!selectedProvinceCode || isFetchingWards}
            placeholder="Select Ward"
            required
          >
            {wards.map((w) => (
              <option key={w.code} value={w.name}>
                {w.name}
              </option>
            ))}
          </Select>
        </FormField>
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
