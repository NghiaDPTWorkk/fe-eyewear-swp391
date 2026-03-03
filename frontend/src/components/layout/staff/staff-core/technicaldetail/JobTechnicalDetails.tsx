 
import FrameSpecifications from './FrameSpecifications'
import LensSpecifications from './LensSpecifications'
import LensNormalOrder from './LensNormalOrder'

// Types for LensSpecifications (Manufacturing orders - có parameters)
interface PrescriptionItem {
  eye: string
  sph: string
  cyl: string
  axis: string
  prism: string
  add: string
}

interface DetailItem {
  label: string
  value: string
}

// Types for LensNormalOrder (Normal orders - không có parameters)
interface LensSpec {
  feature?: string[]
  origin?: string
}

interface VariantOption {
  attributeName: string
  label: string
  value: string
}

interface Variant {
  sku: string
  name: string
  options: VariantOption[]
  price: number
  imgs: string[]
}

interface ProductDetail {
  nameBase: string
  skuBase: string
  brand: string
  categories: string[]
  spec: LensSpec
  variants: Variant[]
}

interface FrameDataItem {
  key: string
  value: string
}

// Union type - check bằng 'parameters' field
type LensData =
  | {
      parameters: any // Có parameters → Manufacturing order
      prescription: PrescriptionItem[]
      additional: DetailItem[]
      productDetail?: never
      variantDetail?: never
      quantity?: never
      pricePerUnit?: never
    }
  | {
      parameters?: never // Không có parameters → Normal order
      productDetail: ProductDetail
      variantDetail: Variant
      quantity: number
      pricePerUnit: number
      prescription?: never
      additional?: never
    }

interface JobTechnicalDetailsProps {
  lensData: LensData
  frameData: FrameDataItem[]
}

const JobTechnicalDetails = ({ lensData, frameData }: JobTechnicalDetailsProps) => {
  const hasParameters = (data: LensData): data is Extract<LensData, { parameters: any }> => {
    return 'parameters' in data && data.parameters !== undefined
  }

  return (
    <div className="space-y-6">
      {/* Lens Specifications Section */}
      <section className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
        <h2 className="text-mint-900 font-semibold text-base mb-4">Lens Specification</h2>

        {/* Kiểm tra sự tồn tại của parameters */}
        {hasParameters(lensData) ? (
          <LensSpecifications prescription={lensData.prescription} details={lensData.additional} />
        ) : (
          <LensNormalOrder
            data={lensData.variantDetail.options.map((opt) => ({
              key: opt.attributeName,
              value: opt.value
            }))}
            imageSrc={lensData.variantDetail.imgs?.[0]}
          />
        )}
      </section>

      {/* Frame Specifications Section */}
      <section className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
        <h2 className="text-mint-900 font-semibold text-base mb-4">Frame Specification</h2>
        <FrameSpecifications
          data={frameData}
          imageSrc="https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800"
        />
      </section>
    </div>
  )
}

export default JobTechnicalDetails
