import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { MESSAGES } from '@/shared/constants/messages'
import { Card } from '@/shared/components/ui'
import { addressService, type Province, type Ward } from '@/shared/services/addressService'
import { customerAddressService } from '@/features/customer/services/customerAddress.service'
import { invoiceService } from '@/features/customer/invoice/services/invoice.service'
import { paymentService } from '@/features/customer/services/payment.service'
import { useCartStore } from '@/store'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { PaymentMethodType } from '@/shared/utils/enums/payment.enum'
import type { Address } from '@/shared/types/address.types'
import type { CreateInvoiceRequest } from '@/shared/types/invoice.types'
import type { Voucher } from '@/shared/types/voucher.types'
import type { CartItem } from '@/shared/types/cart.types'

import { CustomerInfoSection } from './sections/CustomerInfoSection'
import { ShippingAddressSection } from './sections/ShippingAddressSection'
import { PaymentMethodSection } from './sections/PaymentMethodSection'
import { OrderSummarySection } from './sections/OrderSummarySection'
import { VoucherSection } from './sections/VoucherSection'

interface CartSummaryProps {
  subtotal: number
  items?: CartItem[]
}

export const CartSummary = ({ subtotal, items: propItems }: CartSummaryProps) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { items: storeItems } = useCartStore()

  const items = propItems || storeItems.filter((item) => item.selected)

  const [customerInfo, setCustomerInfo] = useState({
    fullName: (user as any)?.fullName || user?.name || '',
    phone: (user as any)?.phone || ''
  })

  const [address, setAddress] = useState({
    street: '',
    ward: '',
    city: ''
  })
  const [note, setNote] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>(PaymentMethodType.COD)
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const [provinces, setProvinces] = useState<Province[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([])
  const [addressMode, setAddressMode] = useState<'list' | 'manual'>('manual')
  const [selectedAddressId, setSelectedAddressId] = useState<string>('')
  const [isAddressDropdownOpen, setIsAddressDropdownOpen] = useState(false)
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<number | null>(null)

  useEffect(() => {
    if (user) {
      setCustomerInfo((prev) => ({
        ...prev,
        fullName: prev.fullName || (user as any).fullName || user.name || '',
        phone: prev.phone || (user as any).phone || ''
      }))
    }
  }, [user])

  useEffect(() => {
    const initData = async () => {
      try {
        let addresses: Address[] = []
        if (user) {
          addresses = await customerAddressService.getAddresses()
          setSavedAddresses(addresses)
        }

        if (addresses.length > 0) {
          const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0]
          setAddressMode('list')
          setSelectedAddressId(defaultAddr._id || '')
          setAddress({
            street: defaultAddr.street,
            ward: defaultAddr.ward,
            city: defaultAddr.city
          })
        } else {
          const provinceData = await addressService.getProvinces()
          setProvinces(Array.isArray(provinceData) ? provinceData : [])
          setAddressMode('manual')
        }
      } catch (error) {
        console.error('Failed to initialize cart summary data:', error)
      }
    }
    initData()
  }, [user])

  const handleSavedAddressChange = async (id: string) => {
    if (id === 'new') {
      setAddressMode('manual')
      setSelectedAddressId('')
      setAddress({ street: '', ward: '', city: '' })
      setSelectedProvinceCode(null)
      setWards([])

      if (provinces.length === 0) {
        try {
          const provinceData = await addressService.getProvinces()
          setProvinces(Array.isArray(provinceData) ? provinceData : [])
        } catch (error) {
          console.error('Failed to fetch provinces on-demand:', error)
        }
      }
      return
    }

    const addr = savedAddresses.find((a) => a._id === id)
    if (addr) {
      setSelectedAddressId(id)
      setAddress({
        street: addr.street,
        ward: addr.ward,
        city: addr.city
      })

      if (provinces.length > 0) {
        const province = provinces.find((p) => p.name.toLowerCase() === addr.city.toLowerCase())
        if (province) {
          setSelectedProvinceCode(province.code)
          try {
            const data = await addressService.getWards(province.code)
            setWards(Array.isArray(data) ? data : [])
          } catch (error) {
            console.error('Failed to fetch wards:', error)
          }
        }
      }
    }
  }

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
    if (!customerInfo.fullName || !customerInfo.phone) {
      toast.error(MESSAGES.CUSTOMER.AUTH.INFO_REQUIRED)
      return
    }

    if (!address.city || !address.ward || !address.street) {
      toast.error(MESSAGES.CUSTOMER.ORDER.ADDRESS_REQUIRED)
      return
    }

    const checkoutItems = items
    if (checkoutItems.length === 0) {
      toast.error(MESSAGES.CUSTOMER.ORDER.EMPTY_CART)
      return
    }

    setIsProcessing(true)
    try {
      const productsPayload = checkoutItems.map((item) => ({
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
        voucher: selectedVoucher ? [selectedVoucher.code] : [],
        paymentMethod,
        note
      }

      const response = await invoiceService.createInvoice(payload)
      if (response.success) {
        toast.success(response.message || MESSAGES.CUSTOMER.ORDER.PLACE_SUCCESS)
        const checkoutItemsCopy = checkoutItems.map((item) => ({ ...item }))
        const { clearCart, removeItems, items: currentItems } = useCartStore.getState()

        if (!propItems) {
          if (checkoutItemsCopy.length === currentItems.length) {
            await clearCart()
          } else {
            await removeItems(checkoutItemsCopy)
          }
        }

        if (paymentMethod === PaymentMethodType.VNPAY) {
          try {
            const { invoice, payment } = response.data
            const urlResponse = await paymentService.getVNPayUrl(invoice._id, payment._id)
            if (urlResponse.success && urlResponse.data.url) {
              window.location.href = urlResponse.data.url
              return
            }
          } catch (error) {
            console.error('Failed to get VNPay URL:', error)
            toast.error(MESSAGES.CUSTOMER.ORDER.PAYMENT_LINK_FAILED)
          }
        }

        if (paymentMethod === PaymentMethodType.PAYOS) {
          try {
            const { invoice, payment } = response.data
            const urlResponse = await paymentService.getPayOSUrl(invoice._id, payment._id)
            if (urlResponse.success && urlResponse.data.url) {
              window.location.href = urlResponse.data.url
              return
            }
          } catch (error) {
            console.error('Failed to get PayOS URL:', error)
            toast.error(MESSAGES.CUSTOMER.ORDER.PAYMENT_LINK_FAILED)
          }
        }

        navigate('/account/orders')
      } else {
        toast.error(response.message || MESSAGES.COMMON.ERROR)
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || MESSAGES.COMMON.ERROR
      toast.error(errorMsg)
    } finally {
      setIsProcessing(false)
    }
  }

  const shipping: number = 10000

  let discountAmount = 0
  if (selectedVoucher) {
    if (selectedVoucher.typeDiscount === 'PERCENTAGE') {
      discountAmount = (subtotal * selectedVoucher.value) / 100
      if (selectedVoucher.maxDiscountValue > 0) {
        discountAmount = Math.min(discountAmount, selectedVoucher.maxDiscountValue)
      }
    } else {
      discountAmount = selectedVoucher.value
    }
  }

  const total = Math.max(0, subtotal - discountAmount + shipping)

  return (
    <Card className="p-8 border-mint-300/50 sticky top-8 rounded-3xl">
      <CustomerInfoSection customerInfo={customerInfo} onUpdate={setCustomerInfo} />

      <ShippingAddressSection
        address={address}
        addressMode={addressMode}
        savedAddresses={savedAddresses}
        selectedAddressId={selectedAddressId}
        isAddressDropdownOpen={isAddressDropdownOpen}
        provinces={provinces}
        wards={wards}
        selectedProvinceCode={selectedProvinceCode}
        onModeChange={setAddressMode}
        onDropdownToggle={setIsAddressDropdownOpen}
        onSavedAddressChange={handleSavedAddressChange}
        onProvinceChange={handleProvinceChange}
        onAddressUpdate={(updates) => setAddress((prev) => ({ ...prev, ...updates }))}
      />

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

      <PaymentMethodSection
        paymentMethod={paymentMethod}
        onPaymentMethodChange={setPaymentMethod}
      />

      <VoucherSection
        selectedVoucherId={selectedVoucher?._id || null}
        onVoucherSelect={setSelectedVoucher}
        subtotal={subtotal}
      />

      <OrderSummarySection
        subtotal={subtotal}
        discount={discountAmount}
        shipping={shipping}
        total={total}
        isProcessing={isProcessing}
        onCheckout={handleCheckout}
      />
    </Card>
  )
}
