import FrameSpecifications from './FrameSpecifications'
import LensSpecifications from './LenSpecifications'

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

interface FrameDataItem {
  label: string
  value: string
}

interface LensData {
  prescription: PrescriptionItem[]
  additional: DetailItem[]
}

interface JobTechnicalDetailsProps {
  lensData: LensData
  frameData: FrameDataItem[]
}

const JobTechnicalDetails = ({ lensData, frameData }: JobTechnicalDetailsProps) => {
  return (
    <div className="space-y-6">
      {/* Lens Specifications Section */}
      <section className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
        <h2 className="text-mint-900 font-semibold text-base mb-4">Thông Số Tròng Kính</h2>
        <LensSpecifications prescription={lensData.prescription} details={lensData.additional} />
      </section>

      {/* Frame Specifications Section */}
      <section className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
        <h2 className="text-mint-900 font-semibold text-base mb-4">Thông Tin Gọng Kính</h2>
        <FrameSpecifications
          data={frameData}
          imageSrc="https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800"
        />
      </section>
    </div>
  )
}

export default JobTechnicalDetails
