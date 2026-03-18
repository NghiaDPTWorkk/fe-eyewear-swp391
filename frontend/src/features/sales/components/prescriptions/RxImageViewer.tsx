/**
 * RxImageViewer Component
 * Left panel of Rx comparison - displays uploaded prescription image.
 * Includes zoom and rotate controls.
 */
import { useState } from 'react'
import { Card } from '@/components'
import { IoAdd, IoRemove, IoRefresh, IoEyeOutline } from 'react-icons/io5'

interface RxImageViewerProps {
  imageUrl: string
}

export default function RxImageViewer({ imageUrl }: RxImageViewerProps) {
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)

  return (
    <Card className="p-0 overflow-hidden h-[500px] flex flex-col border border-neutral-200 shadow-sm">
      {/* Toolbar */}
      <div className="flex justify-between items-center p-4 border-b border-neutral-100 bg-gray-50/50">
        <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider flex items-center gap-2">
          <IoEyeOutline /> Uploaded Prescription
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setZoom((p) => Math.min(p + 10, 200))}
            className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg text-gray-500 transition-all border border-transparent hover:border-gray-200"
          >
            <IoAdd size={18} />
          </button>
          <span className="text-xs font-mono font-medium text-gray-500 self-center w-12 text-center bg-white px-2 py-0.5 rounded border border-gray-100">
            {zoom}%
          </span>
          <button
            onClick={() => setZoom((p) => Math.max(p - 10, 50))}
            className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg text-gray-500 transition-all border border-transparent hover:border-gray-200"
          >
            <IoRemove size={18} />
          </button>
          <div className="w-px h-5 bg-gray-300 mx-1 self-center" />
          <button
            onClick={() => setRotation((p) => p + 90)}
            className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg text-gray-500 transition-all border border-transparent hover:border-gray-200"
          >
            <IoRefresh size={18} />
          </button>
        </div>
      </div>

      {/* Image Display */}
      <div className="flex-1 bg-neutral-100/50 flex items-center justify-center relative overflow-hidden p-8">
        <img
          src={imageUrl}
          alt="Prescription"
          className="max-w-full max-h-full object-contain shadow-2xl rounded-sm transition-transform duration-200"
          style={{ transform: `rotate(${rotation}deg) scale(${zoom / 100})` }}
        />
      </div>
    </Card>
  )
}
