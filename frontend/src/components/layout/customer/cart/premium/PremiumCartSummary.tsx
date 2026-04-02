import { useState, useEffect, useCallback, useMemo } from 'react'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
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
import { shippingService } from '@/shared/services/shippingService'

import { CustomerInfoSection } from '../sections/CustomerInfoSection'
import { ShippingAddressSection } from '../sections/ShippingAddressSection'
import { PaymentMethodSection } from '../sections/PaymentMethodSection'
import { OrderSummarySection } from '../sections/OrderSummarySection'
import { PremiumVoucherSection } from './PremiumVoucherSection'
import { CreditCard, Truck, ShieldCheck, Mail, MessageSquare } from 'lucide-react'

interface PremiumCartSummaryProps {
  subtotal: number
  items?: CartItem[]
}

export const PremiumCartSummary = ({ subtotal, items: propItems }: PremiumCartSummaryProps) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { items: storeItems } = useCartStore()

  const items = propItems || storeItems.filter((item) => item.selected)
  const hideCOD = !!propItems && items.some((item) => !!item.lens || item.mode === 'PRE_ORDER')

  const [customerInfo, setCustomerInfo] = useState({
    fullName: (user as any)?.fullName || user?.name || '',
    phone: (user as any)?.phone || ''
  })
  const [address, setAddress] = useState({ street: '', ward: '', city: '' })
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
        if (error.path) newErrors[error.path] = error.message
      })
      setErrors(newErrors)
      return false
    }
  }

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
          setAddress({ street: defaultAddr.street, ward: defaultAddr.ward, city: defaultAddr.city })
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
      if (provinces.length === 0) {
        try {
          const provinceData = await addressService.getProvinces()
          setProvinces(Array.isArray(provinceData) ? provinceData : [])
        } catch (error) {
          console.error('Failed to fetch provinces:', error)
        }
      }
      return
    }
    const addr = savedAddresses.find((a) => a._id === id)
    if (addr) {
      setSelectedAddressId(id)
      setAddress({ street: addr.street, ward: addr.ward, city: addr.city })
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
    if (items.length === 0) {
      toast.error('No items selected in cart')
      return
    }

    setIsProcessing(true)
    try {
      const productsPayload = items.map((item) => ({
        product: { product_id: item.product_id, sku: item.sku || '' },
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
        address: { street: address.street, ward: address.ward, city: address.city },
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
        const checkoutItemsCopy = items.map((item) => ({ ...item }))
        if (!isOnlinePayment) {
          toast.success(response.message || 'Order placed successfully!')
          const { clearCart, removeItems, items: currentItems } = useCartStore.getState()
          if (!propItems) {
            if (checkoutItemsCopy.length === currentItems.length) await clearCart()
            else await removeItems(checkoutItemsCopy)
          }
        } else {
          sessionStorage.setItem('pendingCheckoutItems', JSON.stringify(checkoutItemsCopy))
          sessionStorage.setItem('pendingCheckoutIsDirect', propItems ? 'true' : 'false')
        }

        if (paymentMethod === PaymentMethodType.VNPAY) {
          const { invoice, payment } = response.data
          const urlResponse = await paymentService.getVNPayUrl(invoice._id, payment._id)
          if (urlResponse.success && urlResponse.data.url) {
            window.location.href = urlResponse.data.url
            return
          }
        }

        if (paymentMethod === PaymentMethodType.PAYOS) {
          const { invoice, payment } = response.data
          const urlResponse = await paymentService.getPayOSUrl(invoice._id, payment._id)
          if (urlResponse.success && urlResponse.data.url) {
            window.location.href = urlResponse.data.url
            return
          }
        }

        if (!isOnlinePayment) navigate('/account/orders')
      } else toast.error(response.message || 'Failed to place order')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'An error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  let discountAmount = 0
  if (selectedVoucher) {
    if (selectedVoucher.typeDiscount === 'PERCENTAGE') {
      discountAmount = (subtotal * selectedVoucher.value) / 100
      discountAmount = Math.min(discountAmount, selectedVoucher.maxDiscountValue)
    } else discountAmount = selectedVoucher.value
  }
  const total = Math.max(0, subtotal - discountAmount + shipping)

  return (
    <div className="relative">
      {/* Decorative Blobs */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-400/10 rounded-full blur-[80px]" />
      <div className="absolute top-1/2 -left-10 w-40 h-40 bg-mint-400/10 rounded-full blur-[80px]" />

      <div className="relative bg-white/70 backdrop-blur-3xl p-6 xl:p-10 border border-white/50 sticky top-8 rounded-[3.5rem] shadow-[0_32px_128px_rgba(4,48,38,0.06)] group transition-all duration-700 hover:shadow-primary-500/10 hover:border-primary-500/10">
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-mint-50">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-mint-100 flex items-center justify-center text-primary-500 group-hover:scale-110 group-hover:bg-primary-500 group-hover:text-white transition-all duration-500">
            <CreditCard size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-mint-1200 font-heading tracking-tight leading-none uppercase italic">
              Checkout
            </h2>
            <p className="text-[10px] font-black text-mint-400 mt-1 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck size={10} className="text-primary-500" /> Secure Encryption Active
            </p>
          </div>
        </div>

        <div className="space-y-10">
          <CustomerInfoSection
            customerInfo={customerInfo}
            onUpdate={setCustomerInfo}
            errors={errors}
          />

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

          <div className="relative group/note">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare
                size={18}
                className="text-mint-400 group-hover/note:text-primary-500 transition-colors"
              />
              <h2 className="text-xl font-black text-mint-1200 font-heading">Order Note</h2>
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Leave by the front door, please ring twice..."
              rows={3}
              className="w-full px-6 py-5 rounded-[2rem] border-2 border-mint-50 bg-white/80 focus:border-primary-500 focus:bg-white focus:outline-none transition-all duration-300 resize-none text-mint-1200 placeholder:text-neutral-300 shadow-inner group-hover/note:shadow-md"
            />
          </div>

          <PaymentMethodSection
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
            hideCOD={hideCOD}
          />

          <PremiumVoucherSection
            selectedVoucherId={selectedVoucher?._id || null}
            onVoucherSelect={setSelectedVoucher}
            subtotal={subtotal}
          />

          <div className="bg-gradient-to-br from-mint-50 to-white/50 rounded-[3rem] p-8 border border-mint-100/50 shadow-inner">
            <OrderSummarySection
              subtotal={subtotal}
              discount={discountAmount}
              shipping={shipping}
              total={total}
              isProcessing={isProcessing}
              onCheckout={handleCheckout}
              hasVoucher={!!selectedVoucher}
            />

            <div className="mt-8 pt-6 border-t border-mint-100 flex items-center justify-center gap-6">
              <div className="flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
                <Truck size={16} className="text-mint-400" />
                <span className="text-[8px] font-black uppercase tracking-widest">
                  Fast Delivery
                </span>
              </div>
              <div className="w-[1px] h-4 bg-mint-100" />
              <div className="flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
                <ShieldCheck size={16} className="text-mint-400" />
                <span className="text-[8px] font-black uppercase tracking-widest">Warranted</span>
              </div>
              <div className="w-[1px] h-4 bg-mint-100" />
              <div className="flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
                <Mail size={16} className="text-mint-400" />
                <span className="text-[8px] font-black uppercase tracking-widest">Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
