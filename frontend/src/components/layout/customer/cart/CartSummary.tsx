import { useState, useEffect, useCallback, useMemo } from 'react'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
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
import { shippingService } from '@/shared/services/shippingService'

interface CartSummaryProps {
  subtotal: number
  items?: CartItem[] // Optional: if provided, use these items; otherwise use selected items from store
}

export const CartSummary = ({ subtotal, items: propItems }: CartSummaryProps) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { items: storeItems } = useCartStore()

  // Use propItems if provided, otherwise filter selected items from store
  const items = propItems || storeItems.filter((item) => item.selected)

  const hideCOD = !!propItems && items.some((item) => !!item.lens || item.mode === 'PRE_ORDER')

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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>(
    hideCOD ? PaymentMethodType.VNPAY : PaymentMethodType.COD
  )
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const [provinces, setProvinces] = useState<Province[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([])
  const [addressMode, setAddressMode] = useState<'list' | 'manual'>('manual')
  const [selectedAddressId, setSelectedAddressId] = useState<string>('')
  const [isAddressDropdownOpen, setIsAddressDropdownOpen] = useState(false)
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<number | null>(null)
  const [shipping, setShipping] = useState<number>(20000)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Clear specific error when state changes
  useEffect(() => {
    if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }))
  }, [customerInfo.fullName])

  useEffect(() => {
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }))
  }, [customerInfo.phone])

  useEffect(() => {
    if (errors.street) setErrors((prev) => ({ ...prev, street: '' }))
  }, [address.street])

  useEffect(() => {
    if (errors.ward) setErrors((prev) => ({ ...prev, ward: '' }))
  }, [address.ward])

  useEffect(() => {
    if (errors.city) setErrors((prev) => ({ ...prev, city: '' }))
  }, [address.city])

  // Validation Schema
  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        fullName: Yup.string().required('Full name is required').min(2, 'Name is too short'),
        phone: Yup.string()
          .required('Phone number is required')
          .matches(/^[0-9]+$/, 'Phone must contain numbers only')
          .matches(/^(0|84)\d{8,9}$/, 'Invalid phone number format (9-10 digits)'),
        street: Yup.string().required('Street address is required'),
        ward: Yup.string().required('Ward is required'),
        city: Yup.string().required('City/Province is required')
      }),
    []
  )

  const validate = async (data: any) => {
    try {
      await validationSchema.validate(data, { abortEarly: false })
      setErrors({})
      return true
    } catch (err: any) {
      const newErrors: Record<string, string> = {}
      err.inner.forEach((error: any) => {
        if (error.path) {
          newErrors[error.path] = error.message
        }
      })
      setErrors(newErrors)
      return false
    }
  }

  // Sync user info if it loads late
  useEffect(() => {
    if (user) {
      setCustomerInfo((prev) => ({
        ...prev,
        fullName: prev.fullName || (user as any).fullName || user.name || '',
        phone: prev.phone || (user as any).phone || ''
      }))
    }
  }, [user])

  // Fetch requirements
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
          // Provinces will be fetched on-demand if user switches to manual mode
        } else {
          // No saved addresses or not logged in, fetch provinces for manual entry
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

  // Fetch shipping fee when address city changes
  useEffect(() => {
    const fetchShippingFee = async () => {
      try {
        const fee = await shippingService.getShippingFee(address.city)
        setShipping(fee)
      } catch (error) {
        console.error('Failed to fetch shipping fee:', error)
      }
    }
    fetchShippingFee()
  }, [address.city])

  const handleSavedAddressChange = async (id: string) => {
    if (id === 'new') {
      setAddressMode('manual')
      setSelectedAddressId('')
      setAddress({ street: '', ward: '', city: '' })
      setSelectedProvinceCode(null)
      setWards([])

      // Fetch provinces on demand if not already loaded
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

      // If we need to sync manual fields (like ward/province dropdowns) when selecting a saved address
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
    const payloadData = {
      fullName: customerInfo.fullName,
      phone: customerInfo.phone,
      street: address.street,
      ward: address.ward,
      city: address.city
    }

    const isValid = await validate(payloadData)
    if (!isValid) {
      toast.error('Please check your information and fix the errors below')
      return
    }

    const checkoutItems = items
    if (checkoutItems.length === 0) {
      toast.error('No items selected in cart')
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
        const isOnlinePayment =
          paymentMethod === PaymentMethodType.VNPAY || paymentMethod === PaymentMethodType.PAYOS
        const checkoutItemsCopy = checkoutItems.map((item) => ({ ...item }))

        if (!isOnlinePayment) {
          toast.success(response.message || 'Order placed successfully!')
          const { clearCart, removeItems, items: currentItems } = useCartStore.getState()

          // Only clear/remove from cart if we are NOT in direct checkout mode (propItems is undefined)
          if (!propItems) {
            if (checkoutItemsCopy.length === currentItems.length) {
              await clearCart()
            } else {
              await removeItems(checkoutItemsCopy)
            }
          }
        } else {
          // Lưu tạm vào sessionStorage để xóa khi callback thành công ở PaymentResultPage
          sessionStorage.setItem('pendingCheckoutItems', JSON.stringify(checkoutItemsCopy))
          sessionStorage.setItem('pendingCheckoutIsDirect', propItems ? 'true' : 'false')
        }

        if (paymentMethod === PaymentMethodType.VNPAY) {
          try {
            const { invoice, payment } = response.data
            const urlResponse = await paymentService.getVNPayUrl(invoice._id, payment._id)
            if (urlResponse.success && urlResponse.data.url) {
              window.location.href = urlResponse.data.url
              return // Stop further execution
            }
          } catch (error) {
            console.error('Failed to get VNPay URL:', error)
            toast.error('Could not create VNPay payment link. Please try again in Order History.')
          }
        }

        if (paymentMethod === PaymentMethodType.PAYOS) {
          try {
            const { invoice, payment } = response.data
            const urlResponse = await paymentService.getPayOSUrl(invoice._id, payment._id)
            if (urlResponse.success && urlResponse.data.url) {
              window.location.href = urlResponse.data.url
              return // Stop further execution
            }
          } catch (error) {
            console.error('Failed to get PayOS URL:', error)
            toast.error('Could not create PayOS payment link. Please try again in Order History.')
          }
        }

        if (!isOnlinePayment) {
          navigate('/account/orders')
        }
      } else {
        toast.error(response.message || 'Failed to place order')
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'An error occurred while placing the order'
      toast.error(errorMsg)
    } finally {
      setIsProcessing(false)
    }
  }

  let discountAmount = 0
  if (selectedVoucher) {
    if (selectedVoucher.typeDiscount === 'PERCENTAGE') {
      discountAmount = (subtotal * selectedVoucher.value) / 100
      discountAmount = Math.min(discountAmount, selectedVoucher.maxDiscountValue)
    } else {
      discountAmount = selectedVoucher.value
    }
  }

  const total = Math.max(0, subtotal - discountAmount + shipping)

  return (
    <Card className="p-5 xl:p-8 border-mint-300/50 sticky top-8 rounded-[32px]">
      <CustomerInfoSection customerInfo={customerInfo} onUpdate={setCustomerInfo} errors={errors} />

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
        errors={errors}
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
        hideCOD={hideCOD}
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
        hasVoucher={!!selectedVoucher}
      />
    </Card>
  )
}
