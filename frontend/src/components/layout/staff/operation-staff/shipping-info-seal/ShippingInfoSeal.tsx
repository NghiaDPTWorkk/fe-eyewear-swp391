import LogoEyewearIcon from '@/shared/components/ui/logoeyewear/LogoEyewearIcon'

interface ShippingInfoSealProps {
  invoiceCode: string
  fullName: string
  phone: string
  address: string
  shipCode?: string
  totalPrice: number
}

export default function ShippingInfoSeal({
  invoiceCode,
  fullName,
  phone,
  address,
  shipCode,
  totalPrice
}: ShippingInfoSealProps) {
  return (
    <div className="bg-white p-4 sm:p-8 font-sans max-w-2xl mx-auto w-full border border-gray-300 overflow-hidden">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
        {/* Left Section */}
        <div className="w-full sm:w-[45%] flex flex-col sm:pr-6 sm:border-r-2 sm:border-dashed border-gray-400 pb-6 sm:pb-0 border-b-2 sm:border-b-0 border-dashed">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <LogoEyewearIcon className="w-6 h-6 text-white bg-black" />
            </div>
            <div className="text-xl font-black tracking-tight text-gray-900 uppercase">
              OpticView
            </div>
          </div>

          <div className="text-sm text-gray-800 space-y-1.5 leading-relaxed">
            <p>
              FB: <strong>OpticView Eyewear</strong>
            </p>
            <p>
              Hotline: <strong>0868 56 54 58</strong>
            </p>
            <p>Address: Lot E2a-7, D1 Street, Saigon Hi-Tech Park,</p>
            <p>Long Thanh My Ward, Thu Duc City, HCMC</p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs italic text-gray-500 leading-relaxed text-center">
              Please contact the shop if the first delivery attempt is unsuccessful or when
              returning. <br />
              Thank you!
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full sm:w-[55%] flex flex-col justify-between pl-0 sm:pl-2 pt-6 sm:pt-0">
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Order ID:
              </span>
              <div className="text-lg font-bold text-gray-900 border-b-2 border-dotted border-gray-300 pb-1 break-all">
                {invoiceCode}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Recipient:
              </span>
              <div className="text-base font-bold text-gray-900 border-b-2 border-dotted border-gray-300 pb-1">
                {fullName}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Phone:
              </span>
              <div className="text-base font-bold border-b-2 border-dotted border-gray-300 pb-1">
                {phone}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Address:
              </span>
              <div className="text-sm leading-tight border-b-2 border-dotted border-gray-300 pb-1 min-h-[30px]">
                {address}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Ship Code:
              </span>
              <div className="text-sm font-mono border-b-2 border-dotted border-gray-300 pb-1 break-all">
                {shipCode || 'N/A'}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t-2 border-black">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-700">
              Total Amount:
            </span>
            <div className="text-xl ps-4 font-black text-gray-900 text-right">
              {totalPrice.toLocaleString('vi-VN')} VND
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
