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
    <div className="p-6 bg-white space-y-10">
      <section>
        <h2 className="text-emerald-700 font-bold text-lg mb-4">Thông Số Tròng Kính</h2>
        {/* Truyền data xuống cho con Lens */}
        <LensSpecifications prescription={lensData.prescription} details={lensData.additional} />
      </section>

      <div className="border-t border-gray-100" />

      <section>
        <h2 className="text-emerald-700 font-bold text-lg mb-4">Thông Tin Gọng Kính</h2>
        {/* Truyền data xuống cho con Frame */}
        <FrameSpecifications data={frameData} imageSrc="https://v-eyewear.com/path-to-frame.png" />
      </section>
    </div>
  )
}

export default JobTechnicalDetails
