import { Shield, Home } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { Button, Card, Input, Select } from '@/shared/components/ui'
import { addressService, type Province, type Ward } from '@/shared/services/addressService'

interface CartSummaryProps {
  subtotal: number
}

export const CartSummary = ({ subtotal }: CartSummaryProps) => {
  const [address, setAddress] = useState({
    street: '',
    ward: '',
    district: '',
    city: ''
  })
  const [note, setNote] = useState('')

  const [provinces, setProvinces] = useState<Province[]>([])
  const [wards, setWards] = useState<Ward[]>([])

  const [selectedProvinceCode, setSelectedProvinceCode] = useState<number | null>(null)

  // Fetch all provinces on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data = await addressService.getProvinces()
        // Ensure data is an array
        setProvinces(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to fetch provinces:', error)
        setProvinces([])
      }
    }
    fetchProvinces()
  }, [])

  // Fetch wards when province changes (as requested: only province and ward API)
  const handleProvinceChange = useCallback(async (code: number, name: string) => {
    setSelectedProvinceCode(code)
    setWards([])
    setAddress((prev) => ({ ...prev, city: name, district: '', ward: '' }))

    try {
      const data = await addressService.getWards(code)
      setWards(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch wards:', error)
      setWards([])
    }
  }, [])

  const shipping: number = 0 // Fixed as per request to focus on payment methods
  const total = subtotal + shipping

  return (
    <Card className="p-8 border-mint-300/50 sticky top-8 rounded-3xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-mint-1200 mb-4 flex items-center gap-2">
          <Home className="w-5 h-5 text-primary-500" />
          Shipping Address
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-eyewear uppercase mb-1 block">
              City / Province
            </label>
            <Select
              value={selectedProvinceCode || ''}
              onChange={(e) => {
                const code = Number(e.target.value)
                const province = provinces.find((p) => p.code === code)
                if (province) handleProvinceChange(code, province.name)
              }}
              placeholder="Select Province"
              className="rounded-xl border-mint-200 focus-within:border-primary-500"
            >
              {provinces.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-eyewear uppercase mb-1 block">Ward</label>
            <Select
              value={address.ward}
              onChange={(e) => setAddress({ ...address, ward: e.target.value })}
              placeholder="Select Ward"
              isDisabled={!selectedProvinceCode}
              className="rounded-xl border-mint-200 focus-within:border-primary-500"
            >
              {(wards || []).map((w) => (
                <option key={w.code} value={w.name}>
                  {w.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-eyewear uppercase mb-1 block">
              Street
            </label>
            <Input
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              placeholder="e.g. Le van viet"
              className="rounded-xl border-mint-200 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-mint-100 py-6 mb-6">
        <h2 className="text-xl font-bold text-mint-1200 mb-4">Order Note</h2>
        <div>
          <label className="text-xs font-bold text-gray-eyewear uppercase mb-1 block">
            Add a note to your order (Optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Special delivery instructions, gift message, etc."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border-2 border-mint-200 focus:border-primary-500 focus:outline-none transition-colors resize-none text-mint-1200 placeholder:text-gray-300"
          />
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex justify-between text-mint-1200">
          <span className="font-medium">Subtotal</span>
          <span className="font-bold">
            ${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex justify-between text-mint-1200">
          <span className="font-medium">Shipping</span>
          <span className="font-bold">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between items-baseline pt-4 border-t border-mint-100">
          <span className="text-xl font-bold text-mint-1200 uppercase">
            Total{' '}
            <span className="text-xs font-medium text-gray-eyewear normal-case">(Excl. Tax)</span>
          </span>
          <span className="text-3xl font-extrabold text-mint-1200">
            ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div className="space-y-4 mb-4">
        <Button
          isFullWidth
          size="lg"
          className="py-6 rounded-lg shadow-sm hover:shadow-md uppercase tracking-wider font-bold bg-[#4AD7B0] hover:bg-[#3CBFA0] text-white border-0"
        >
          SECURE CHECKOUT
        </Button>

        <div className="relative flex items-center justify-center py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <span className="relative px-4 bg-white text-[10px] font-bold text-gray-300 uppercase tracking-widest">
            or express checkout with
          </span>
        </div>

        <button className="w-full py-4 border-2 border-[#0068FF] bg-white rounded-lg flex items-center justify-center gap-2 hover:bg-[#0068FF]/5 transition-colors group">
          <img
            src="https://vcdn.zalopay.com.vn/zlp-website/assets/images/logo-zalopay.png"
            alt="ZaloPay"
            className="h-6"
          />
          <span className="font-bold text-[#0068FF]">ZaloPay</span>
        </button>
      </div>

      <div className="text-center mt-6">
        <p className="text-xs text-gray-eyewear mb-6">
          By clicking on one of the buttons above you agree to Glasses.com <br />
          <a href="#" className="underline hover:text-primary-500">
            Terms and Conditions
          </a>{' '}
          and{' '}
          <a href="#" className="underline hover:text-primary-500">
            Privacy Policy
          </a>
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-mint-1200 font-bold">
          <Shield className="w-4 h-4 text-primary-500" />
          We accept FSA/HSA cards for payments
        </div>
      </div>
    </Card>
  )
}
