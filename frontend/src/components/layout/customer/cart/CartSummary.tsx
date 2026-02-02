import { Shield, Home, User, CreditCard } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Button, Card, Input, Select } from '@/shared/components/ui'
import { addressService, type Province, type Ward } from '@/shared/services/addressService'
import { invoiceService } from '@/features/customer/invoice/services/invoice.service'
import { useCartStore } from '@/store'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { PaymentMethodType } from '@/shared/types'
import type { CreateInvoiceRequest } from '@/shared/types/invoice.types'

interface CartSummaryProps {
  subtotal: number
}

export const CartSummary = ({ subtotal }: CartSummaryProps) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { items } = useCartStore()

  const [customerInfo, setCustomerInfo] = useState({
    fullName: user?.fullName || user?.name || '',
    phone: user?.phone || ''
  })

  const [address, setAddress] = useState({
    street: '',
    ward: '',
    city: ''
  })
  const [note, setNote] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>(PaymentMethodType.COD)
  const [isProcessing, setIsProcessing] = useState(false)

  const [provinces, setProvinces] = useState<Province[]>([])
  const [wards, setWards] = useState<Ward[]>([])

  const [selectedProvinceCode, setSelectedProvinceCode] = useState<number | null>(null)

  // Sync user info if it loads late
  useEffect(() => {
    if (user) {
      setCustomerInfo((prev) => ({
        ...prev,
        fullName: prev.fullName || user.fullName || user.name || '',
        phone: prev.phone || user.phone || ''
      }))
    }
  }, [user])

  // Fetch all provinces on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data = await addressService.getProvinces()
        setProvinces(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to fetch provinces:', error)
        setProvinces([])
      }
    }
    fetchProvinces()
  }, [])

  // Fetch wards when province changes
  const handleProvinceChange = useCallback(async (code: number, name: string) => {
    setSelectedProvinceCode(code)
    setWards([])
    setAddress((prev) => ({ ...prev, city: name, ward: '' }))

    try {
      const data = await addressService.getWards(code)
      setWards(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch wards:', error)
      setWards([])
    }
  }, [])

  const handleCheckout = async () => {
    // 1. Validation
    if (!customerInfo.fullName || !customerInfo.phone) {
      toast.error('Vui lòng nhập đầy đủ thông tin khách hàng')
      return
    }

    if (!address.city || !address.ward || !address.street) {
      toast.error('Vui lòng nhập đầy đủ địa chỉ giao hàng')
      return
    }

    const selectedItems = items.filter((item) => item.selected)
    if (selectedItems.length === 0) {
      toast.error('Giỏ hàng chưa chọn sản phẩm nào')
      return
    }

    setIsProcessing(true)
    try {
      // 2. Prepare payload
      const productsPayload = selectedItems.map((item) => ({
        product: {
          product_id: item.product_id,
          sku: item.sku || ''
        },
        lens: item.lens
          ? {
              lens_id: item.lens.lensId || '',
              sku: item.lens.sku || '',
              parameters: item.lens.prescription
                ? {
                    left: {
                      SPH: Number(item.lens.prescription.left.SPH),
                      CYL: Number(item.lens.prescription.left.CYL),
                      AXIS: Number(item.lens.prescription.left.AXIS),
                      ADD: item.lens.prescription.left.ADD
                        ? Number(item.lens.prescription.left.ADD)
                        : undefined
                    },
                    right: {
                      SPH: Number(item.lens.prescription.right.SPH),
                      CYL: Number(item.lens.prescription.right.CYL),
                      AXIS: Number(item.lens.prescription.right.AXIS),
                      ADD: item.lens.prescription.right.ADD
                        ? Number(item.lens.prescription.right.ADD)
                        : undefined
                    },
                    PD: Number(item.lens.prescription.PD)
                  }
                : {
                    left: { SPH: 0, CYL: 0, AXIS: 0, ADD: 0 },
                    right: { SPH: 0, CYL: 0, AXIS: 0, ADD: 0 },
                    PD: 0
                  }
            }
          : undefined,
        quantity: item.quantity
      }))

      const payload: CreateInvoiceRequest = {
        products: productsPayload,
        address: {
          street: address.street,
          ward: address.ward,
          city: address.city
        },
        fullName: customerInfo.fullName,
        phone: customerInfo.phone,
        voucher: [],
        paymentMethod,
        note
      }

      // 3. Call API
      const response = await invoiceService.createInvoice(payload)

      if (response.success) {
        toast.success(response.message || 'Đặt hàng thành công!')

        // Selective removal: Only remove the items that were checked out
        // We do this manually because the backend might not clear the cart on invoice creation
        const itemsToRemove = selectedItems.map((item) => ({ ...item }))
        const { clearCart, removeItems, items: currentItems } = useCartStore.getState()

        if (itemsToRemove.length === currentItems.length) {
          await clearCart()
        } else {
          await removeItems(itemsToRemove)
        }

        navigate('/account/orders')
      } else {
        toast.error(response.message || 'Tạo đơn hàng thất bại')
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng'
      toast.error(errorMsg)
    } finally {
      setIsProcessing(false)
    }
  }

  const shipping: number = 0
  const total = subtotal + shipping

  return (
    <Card className="p-8 border-mint-300/50 sticky top-8 rounded-3xl">
      {/* Customer Info */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-mint-1200 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-primary-500" />
          Customer Information
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-eyewear uppercase mb-1 block">
              Full Name
            </label>
            <Input
              value={customerInfo.fullName}
              onChange={(e) => setCustomerInfo({ ...customerInfo, fullName: e.target.value })}
              placeholder="Minh Lâm"
              className="rounded-xl border-mint-200 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-eyewear uppercase mb-1 block">
              Phone Number
            </label>
            <Input
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
              placeholder="0812345678"
              className="rounded-xl border-mint-200 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Address */}
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

      {/* Note */}
      <div className="border-t border-mint-100 py-6 mb-6">
        <h2 className="text-xl font-bold text-mint-1200 mb-4">Order Note</h2>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Special delivery instructions, gift message, etc."
          rows={3}
          className="w-full px-4 py-3 rounded-xl border-2 border-mint-200 focus:border-primary-500 focus:outline-none transition-colors resize-none text-mint-1200 placeholder:text-gray-300"
        />
      </div>

      {/* Payment Method */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-mint-1200 mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary-500" />
          Payment Method
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setPaymentMethod(PaymentMethodType.COD)}
            className={`py-3 px-4 rounded-xl border-2 transition-all font-bold text-sm ${
              paymentMethod === PaymentMethodType.COD
                ? 'border-primary-500 bg-primary-50 text-primary-600'
                : 'border-mint-200 text-gray-eyewear hover:border-mint-300'
            }`}
          >
            COD
          </button>
          <button
            onClick={() => setPaymentMethod(PaymentMethodType.ZALAPAY)}
            className={`py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
              paymentMethod === PaymentMethodType.ZALAPAY
                ? 'border-[#0068FF] bg-[#0068FF]/5 text-[#0068FF]'
                : 'border-mint-200 text-gray-eyewear hover:border-mint-300'
            }`}
          >
            <img
              src="https://vcdn.zalopay.com.vn/zlp-website/assets/images/logo-zalopay.png"
              alt="ZaloPay"
              className="h-4"
            />
            <span className="font-bold text-sm">ZaloPay</span>
          </button>
        </div>
      </div>

      {/* Summary */}
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

      <div className="space-y-4">
        <Button
          isFullWidth
          size="lg"
          onClick={handleCheckout}
          isLoading={isProcessing}
          className="py-6 rounded-xl shadow-sm hover:shadow-md uppercase tracking-wider font-bold bg-[#4AD7B0] hover:bg-[#3CBFA0] text-white border-0"
        >
          {isProcessing ? 'Processing...' : 'SECURE CHECKOUT'}
        </Button>
      </div>

      <div className="text-center mt-6">
        <p className="text-[10px] text-gray-eyewear mb-4 leading-relaxed">
          By clicking on the button above you agree to Glasses.com <br />
          <a href="#" className="underline">
            Terms and Conditions
          </a>{' '}
          and{' '}
          <a href="#" className="underline">
            Privacy Policy
          </a>
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-mint-1200 font-bold">
          <Shield className="w-4 h-4 text-primary-500" />
          Secure checkout guaranteed
        </div>
      </div>
    </Card>
  )
}
